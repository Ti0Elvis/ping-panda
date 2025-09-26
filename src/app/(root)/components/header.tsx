import Link from "next/link";
import { Fragment } from "react";
import { ArrowRightIcon } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export async function Header() {
  const user = await currentUser();

  return (
    <header className="w-full h-16 sticky z-[100] inset-x-0 top-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            Ping<span className="text-primary">Panda</span>
          </Link>
          <div className="h-full flex items-center gap-2">
            {user ? (
              <Fragment>
                <SignOutButton>
                  <Button variant="ghost">Sign out</Button>
                </SignOutButton>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    className: "flex items-center gap-1",
                  })}>
                  Dashboard <ArrowRightIcon className="size-4" />
                </Link>
              </Fragment>
            ) : (
              <Fragment>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "ghost",
                  })}>
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                  })}>
                  Sign in
                </Link>
                <div className="h-8 w-px bg-gray-200" />
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className: "flex items-center",
                  })}>
                  Sign up
                </Link>
              </Fragment>
            )}
          </div>
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
