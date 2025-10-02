"use client";
import { Fragment } from "react";
import { client } from "@/lib/client";
import { CategoryCard } from "./category-card";
import { useQuery } from "@tanstack/react-query";
import DashboardEmptyState from "./dashboard-empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";

export function DashboardContent() {
  const query = useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const response = await client.eventCategory.getEventCategories.$get();
      const { categories } = await response.json();
      return categories;
    },
  });

  if (query.isLoading === true) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (query.data === undefined || query.data.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <Fragment>
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {query.data.map((category) => {
          return <CategoryCard key={category.id} {...category} />;
        })}
      </ul>
    </Fragment>
  );
}
