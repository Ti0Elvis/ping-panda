import { cn } from "@/lib/utils";
import { EB_Garamond } from "next/font/google";
import { ComponentProps, PropsWithChildren } from "react";

const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
});

type Props = PropsWithChildren<ComponentProps<"h1">>;

export function Heading({ children, className, ...props }: Readonly<Props>) {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl text-pretty font-semibold tracking-tight text-zinc-800",
        eb_garamond.className,
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
