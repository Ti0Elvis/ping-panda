import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UpgradeContent } from "./components/upgrade-content";
import { DashboardHeader } from "../components/dashboard-header";

export default async function Page() {
  const auth = await currentUser();

  if (auth === null) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { external_id: auth.id },
  });

  if (user === null) {
    redirect("/welcome");
  }

  return (
    <section className="w-full h-screen flex flex-col">
      <DashboardHeader title="Pro Membership" />
      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
        <UpgradeContent plan={user?.plan} />
      </div>
    </section>
  );
}
