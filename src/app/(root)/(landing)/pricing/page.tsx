"use client";
import { client } from "@/lib/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

const INCLUDED_FEATURES = [
  "10.000 real-time events per month",
  "10 event categories",
  "Advanced analytics and insights",
  "Priority support",
];

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.payment.createCheckoutSession.$post();
      return await response.json();
    },
    onSuccess: ({ url }) => {
      if (url !== null) {
        router.push(url);
      }
    },
  });

  const handleGetAccess = () => {
    if (user !== undefined && user !== null) {
      mutation.mutate();
    } else {
      router.push("/sign-in?intent=upgrade");
    }
  };

  return (
    <MaxWidthWrapper className="my-16">
      <div className="mx-auto max-w-2xl sm:text-center">
        <Heading className="text-center">Simple no-tricks pricing</Heading>
        <p className="mt-6 text-base text-muted-foreground max-w-prose text-center">
          We hate subscriptions. And chances are, you do too. That's why we
          offer lifetime access to PingPanda for a one-time payment.
        </p>
      </div>
      <div className="bg-white mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-3xl font-heading font-semibold tracking-tight">
            Lifetime access
          </h3>
          <p className="mt-6 text-base/7 text-muted-foreground">
            Invest once in PingPanda and transform how you monitor your SaaS
            forever. Get instant alerts, track critical metrics and never miss a
            beat in your business growth.
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-brand-600">
              What's included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-6">
            {INCLUDED_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-3">
                <CheckIcon className="h-6 w-5 flex-none text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-primary lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs py-8 space-y-2">
              <p className="text-base font-semibold text-muted-foreground">
                Pay once, own forever
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight">49€</span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                  EUR
                </span>
              </p>
              <Button
                onClick={handleGetAccess}
                className="group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-primary px-8 text-base/7 font-medium text-white hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 z-10 h-14 w-full shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <span className="relative z-10 flex items-center gap-2">
                  Get PingPanda
                  <ArrowRightIcon className="size-4 shrink-0 text-white transition-transform duration-300 ease-in-out group-hover:translate-x-[2px]" />
                </span>
                <div className="ease-[cubic-bezier(0.19,1,0.22,1)] absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]" />
              </Button>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                Secure payment. Start monitoring in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
