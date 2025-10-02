"use client";
import { client } from "@/lib/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateCategoryDialog } from "./create-category-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DashboardEmptyState() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await client.eventCategory.insertQuickstartCategories.$post();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] });
    },
  });

  return (
    <Card className="flex flex-col items-center justify-center rounded-2xl flex-1 text-center p-6">
      <div className="flex justify-center w-full">
        <img
          src="/brand-asset-wave.png"
          alt="No categories"
          className="size-48 -mt-24"
        />
      </div>
      <h1 className="text-xl/8 font-medium tracking-tight text-muted-foreground">
        No Event Categories Yet
      </h1>
      <p className="text-sm/6 text-foreground max-w-prose">
        Start tracking events by creating your first category.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}>
          <span className="size-5">🚀</span>
          <span>{mutation.isPending ? "Creating..." : "Quickstart"}</span>
        </Button>
        <CreateCategoryDialog />
      </div>
    </Card>
  );
}
