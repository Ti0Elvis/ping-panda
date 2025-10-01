import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardContent } from "./components/dashboard-content";
import { CreateCategoryDialog } from "./components/create-category-dialog";

export default async function Page() {
  const auth = await currentUser();

  if (auth === null) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      external_id: auth.id,
    },
  });

  if (user === null) {
    return redirect("/welcome");
  }

  return (
    <section className="w-full h-screen flex flex-col">
      <DashboardHeader title="Dashboard" hide_back_button>
        <CreateCategoryDialog />
      </DashboardHeader>
      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        <DashboardContent />
      </div>
    </section>
  );
}
