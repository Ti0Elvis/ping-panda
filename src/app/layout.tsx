import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query.provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PingPanda",
  description: "A simple uptime monitoring tool.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(roboto.className)}>
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
