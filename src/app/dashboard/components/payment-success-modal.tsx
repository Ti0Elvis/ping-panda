"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function PaymentSuccessModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const query = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      const response = await client.payment.getUserPlan.$get();
      return await response.json();
    },
    refetchInterval: (query) => {
      return query.state.data?.plan === "PRO" ? false : 1000;
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    router.push("/dashboard");
  };

  const isPaymentSuccessful = query.data?.plan === "PRO";

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogTitle>
          {isPaymentSuccessful ? "Success" : "Processing"}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {isPaymentSuccessful
            ? "Your payment was successful."
            : "We are confirming your payment."}
        </AlertDialogDescription>
        {isPaymentSuccessful ? (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="mb-4">Thank you for upgrading to the PRO plan.</p>
            <Button onClick={handleClose}>Go to Dashboard</Button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
            <p className="mb-4">Please wait while we confirm your payment.</p>
            <div className="loader mx-auto"></div>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
