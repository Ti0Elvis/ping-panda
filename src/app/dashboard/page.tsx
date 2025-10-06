import { db } from "@/lib/db";
import { Fragment } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/stripe";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardContent } from "./components/dashboard-content";
import { PaymentSuccessModal } from "./components/payment-success-modal";
import { CreateCategoryDialog } from "./components/create-category-dialog";

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page({ searchParams }: Readonly<Props>) {
  const auth = await currentUser();

  if (auth === null) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { external_id: auth.id },
  });

  if (!user) {
    return redirect("/welcome");
  }

  const intent = (await searchParams).intent;
  const success = (await searchParams).success;

  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      email: user.email,
      user_id: user.id,
    });

    if (session.url !== null) {
      redirect(session.url);
    }
  }
  return (
    <Fragment>
      {success === "true" ? <PaymentSuccessModal /> : null}
      <section className="w-full h-screen flex flex-col">
        <DashboardHeader title="Dashboard" />
        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
          <CreateCategoryDialog />
          <DashboardContent />
        </div>
      </section>
    </Fragment>
  );
}
