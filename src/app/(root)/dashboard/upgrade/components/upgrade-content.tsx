"use client";
import { format } from "date-fns";
import { client } from "@/lib/client";
import type { Plan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { BarChartIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  plan: Plan;
}

export function UpgradeContent({ plan }: Readonly<Props>) {
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

  const query = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const response = await client.project.getUsage.$get();
      return await response.json();
    },
  });

  return (
    <div className="max-w-3xl flex flex-col gap-4">
      <div>
        <h1 className="mt-2 text-xl font-medium tracking-tight">
          {plan === "PRO" ? "Plan: Pro" : "Plan: Free"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-prose">
          {plan === "PRO"
            ? "Thank you for supporting PingPanda. Find your increased usage limits below."
            : "Get access to more events, categories and premium support."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2>Total Events</h2>
              <BarChartIcon className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {query.data?.events_used || 0} of{" "}
              {query.data?.events_limit.toLocaleString() || 100}
            </h2>
            <p className="text-xs/5 text-muted-foreground">
              Events this period
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2>Event Categories</h2>
              <BarChartIcon className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {query.data?.categories_used || 0} of{" "}
              {query.data?.categories_limit.toLocaleString() || 10}
            </h2>
            <p className="text-xs/5 text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground space-x-[-20px]">
        Usage will reset{" "}
        {query.data?.reset_date && format(query.data.reset_date, "MMM d, yyyy")}{" "}
        {plan !== "PRO" ? (
          <span
            onClick={() => mutation.mutate()}
            className="text-primary hover:underline cursor-pointer">
            or upgrade now to increase your limit
          </span>
        ) : null}
      </p>
    </div>
  );
}
