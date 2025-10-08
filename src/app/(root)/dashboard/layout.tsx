import { SignedIn } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <SignedIn>
      <SidebarProvider>
        <DashboardSidebar />
        {children}
      </SidebarProvider>
    </SignedIn>
  );
}
