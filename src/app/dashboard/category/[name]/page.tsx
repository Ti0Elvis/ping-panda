"use client";
import { Tab } from "./hooks/use-category";
import { BarChartIcon } from "lucide-react";
import { CategoryTable } from "./components/category-table";
import { useCategoryContext } from "./context/category-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyCategoryState } from "./components/empty-category-state";
import { NumericFieldSumCards } from "./components/numeric-fields-sum-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const { pollingQuery, tab, setTab, eventsQuery } = useCategoryContext();

  if (pollingQuery.data.hasEvents === false) {
    return <EmptyCategoryState />;
  }

  return (
    <section className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Events</p>
                  <BarChartIcon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-bold">
                  {eventsQuery.data?.eventsCount ?? 0}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Events{" "}
                  {tab === "today"
                    ? "today"
                    : tab === "week"
                    ? "this week"
                    : "this month"}
                </p>
              </CardContent>
            </Card>
            <NumericFieldSumCards />
          </div>
        </TabsContent>
      </Tabs>
      <CategoryTable />
    </section>
  );
}
