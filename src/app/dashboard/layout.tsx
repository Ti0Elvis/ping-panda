import { db } from "@/lib/db";
import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default async function Layout({
  children,
}: Readonly<PropsWithChildren>) {
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
    <SidebarProvider>
      <DashboardSidebar />
      {children}
    </SidebarProvider>
  );
}
