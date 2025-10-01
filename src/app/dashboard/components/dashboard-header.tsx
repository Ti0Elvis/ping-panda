"use client";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  children?: React.ReactNode;
  hide_back_button?: boolean;
}

export function DashboardHeader({
  children,
  title,
  hide_back_button,
}: Readonly<Props>) {
  const router = useRouter();

  return (
    <header className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-8">
          {hide_back_button ? null : (
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-fit bg-white"
              variant="outline">
              <ArrowLeftIcon className="size-4" />
            </Button>
          )}
          <Heading>{title}</Heading>
        </div>
        {children ? <div className="w-full">{children}</div> : null}
      </div>
    </header>
  );
}
