"use client";
import { useEffect } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { BackgroundPattern } from "./components/background-pattern";

export default function Page() {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["get-database-sync-status"],
    queryFn: async () => {
      const response = await client.auth.getDatabaseSyncStatus.$get();
      return await response.json();
    },
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 5000;
    },
  });

  useEffect(() => {
    if (query.data?.isSynced === true) {
      router.push("/dashboard");
    }
  }, [query.data, router]);

  return (
    <MaxWidthWrapper className="w-full h-screen flex items-center justify-center">
      <BackgroundPattern className="absolute inset-0 left-1/2 z-0 -translate-x-1/2 opacity-75" />
      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center gap-6 text-center">
        <LoadingSpinner size="md" />
        <Heading>Creating your account...</Heading>
        <p className="text-base/7 text-gray-600 max-w-prose">
          Just a moment while we set things up for you.
        </p>
      </div>
    </MaxWidthWrapper>
  );
}
