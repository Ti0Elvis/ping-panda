import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { GemIcon, HomeIcon, KeyIcon, SettingsIcon } from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    category: "Overview",
    items: [{ href: "/dashboard", Icon: HomeIcon, text: "Dashboard" }],
  },
  {
    category: "Account",
    items: [{ href: "/dashboard/upgrade", Icon: GemIcon, text: "Upgrade" }],
  },
  {
    category: "Settings",
    items: [
      { href: "/dashboard/api-key", Icon: KeyIcon, text: "API Key" },
      {
        href: "/dashboard/account-settings",
        Icon: SettingsIcon,
        text: "Account Settings",
      },
    ],
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <p className="text-lg font-semibold">
          Ping<span className="text-primary">Panda</span>
        </p>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_ITEMS.map((group) => (
          <SidebarGroup key={group.category}>
            <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full flex justify-start text-muted-foreground items-center text-xs"
                        )}>
                        <item.Icon className="size-4" />
                        {item.text}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>{/* In progress */}</SidebarFooter>
    </Sidebar>
  );
}
