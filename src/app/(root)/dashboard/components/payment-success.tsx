"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { client } from "@/lib/client";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";

export function PaymentSuccessModal() {
  const [alert, setAlert] = useState(true);

  const router = useRouter();

  const query = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      const response = await client.payment.getUserPlan.$get();
      return await response.json();
    },
    refetchInterval: (query) => {
      return query.state.data?.plan === "PRO" ? false : 5000;
    },
  });

  const isPaymentSuccessful = query.data?.plan === "PRO";

  const handleClose = () => {
    setAlert(false);

    if (isPaymentSuccessful === true) {
      router.replace("/dashboard");
    }
  };

  return (
    <AlertDialog open={alert} onOpenChange={setAlert}>
      <AlertDialogContent>
        <AlertDialogTitle hidden />
        <AlertDialogDescription hidden />
        <div className="flex flex-col items-center">
          {query.isPending || !isPaymentSuccessful ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner className="mb-4" />
              <p className="text-lg/7 font-medium text-gray-900">
                Upgrading your account...
              </p>
              <p className="text-gray-600 text-sm/6 mt-2 text-center text-pretty">
                Please wait while we process your upgrade. This may take a
                moment.
              </p>
            </div>
          ) : (
            <>
              <div className="relative aspect-video border border-gray-200 w-full overflow-hidden rounded-lg bg-gray-50">
                <img
                  src="/brand-asset-heart.png"
                  className="h-full w-full object-cover"
                  alt="Payment success"
                />
              </div>
              <div className="mt-6 flex flex-col items-center gap-1 text-center">
                <p className="text-lg/7 tracking-tight font-medium text-pretty">
                  Upgrade successful! 🎉
                </p>
                <p className="text-gray-600 text-sm/6 text-pretty">
                  Thank you for upgrading to Pro and supporting PingPanda. Your
                  account has been upgraded.
                </p>
              </div>

              <div className="mt-8 w-full">
                <Button onClick={handleClose} className="h-12 w-full">
                  <CheckIcon className="mr-2 size-5" />
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
