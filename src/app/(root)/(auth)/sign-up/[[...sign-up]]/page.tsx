import { SignUp } from "@clerk/nextjs";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  return (
    <MaxWidthWrapper className="w-full h-screen flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/callback" forceRedirectUrl="/callback" />
    </MaxWidthWrapper>
  );
}
