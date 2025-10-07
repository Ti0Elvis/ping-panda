import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ApiKeySettings } from "./components/api-key-settings";
import { DashboardHeader } from "../components/dashboard-header";

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
    return redirect("/callback");
  }

  return (
    <section className="w-full h-screen flex flex-col">
      <DashboardHeader title="Api Key" />
      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
        <ApiKeySettings api_key={user.api_key} />
      </div>
    </section>
  );
}
