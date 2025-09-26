import { SignIn } from "@clerk/nextjs";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  return (
    <MaxWidthWrapper className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <SignIn />
    </MaxWidthWrapper>
  );
}
