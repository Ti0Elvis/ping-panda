"use client";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");

  return (
    <MaxWidthWrapper className="w-full h-screen flex items-center justify-center">
      <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
      />
    </MaxWidthWrapper>
  );
}
