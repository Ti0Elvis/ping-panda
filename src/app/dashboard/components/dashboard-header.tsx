"use client";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { AlignJustifyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface Props {
  title: string;
}

export function DashboardHeader({ title }: Readonly<Props>) {
  const { isMobile, open, toggleSidebar } = useSidebar();

  return (
    <header className="w-full p-6 flex justify-between border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Button className="w-fit" variant="outline" onClick={toggleSidebar}>
          {isMobile === true ? (
            <AlignJustifyIcon />
          ) : open === true ? (
            <ArrowLeftIcon className="h-4 w-4" />
          ) : (
            <ArrowRightIcon className="h-4 w-4" />
          )}
        </Button>
        <Heading>{title}</Heading>
      </div>
    </header>
  );
}
