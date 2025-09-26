import { cn } from "@/lib/utils";
import { ComponentProps, PropsWithChildren } from "react";

type Props = PropsWithChildren<ComponentProps<"div">>;

export function MaxWidthWrapper({
  children,
  className,
  ...props
}: Readonly<Props>) {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
      {...props}>
      {children}
    </div>
  );
}
