import { db } from "@/lib/db";
import { Fragment } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardContent } from "./components/dashboard-content";
import { CreateEventCategoryDialog } from "./components/create-event-category-dialog";

export default async function Page() {
  const auth = await currentUser();

  if (auth === null) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { external_id: auth.id },
  });

  if (user === null) {
    return redirect("/callback");
  }

  return (
    <Fragment>
      <section className="w-full h-screen flex flex-col">
        <DashboardHeader title="Dashboard" />
        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
          <CreateEventCategoryDialog />
          <DashboardContent />
        </div>
      </section>
    </Fragment>
  );
}
