"use client";
import { useMemo } from "react";
import { BarChartIcon } from "lucide-react";
import { useCategoryContext } from "../context/category-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";

export function NumericFieldSumCards() {
  const { tab, eventsQuery } = useCategoryContext();

  const numericFieldSums = useMemo(() => {
    if (
      eventsQuery.data?.events === undefined ||
      eventsQuery.data.events.length === 0
    ) {
      return {};
    }

    const sums: Record<
      string,
      {
        total: number;
        thisWeek: number;
        thisMonth: number;
        today: number;
      }
    > = {};

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    eventsQuery.data.events.forEach((e) => {
      const eventDate = e.createdAt;

      Object.entries(e.fields as object).forEach(([field, value]) => {
        if (typeof value === "number") {
          if (sums[field] === undefined) {
            sums[field] = { total: 0, thisWeek: 0, thisMonth: 0, today: 0 };
          }

          sums[field].total += value;

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[field].thisWeek += value;
          }

          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value;
          }

          if (isToday(eventDate)) {
            sums[field].today += value;
          }
        }
      });
    });

    return sums;
  }, [eventsQuery.data?.events]);

  if (Object.keys(numericFieldSums).length === 0) {
    return null;
  }

  return Object.entries(numericFieldSums).map(([field, sums]) => {
    const relevant_sum =
      tab === "today"
        ? sums.today
        : tab === "week"
        ? sums.thisWeek
        : sums.thisMonth;

    return (
      <Card key={field}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2>{field.charAt(0).toUpperCase() + field.slice(1)}</h2>
            <BarChartIcon className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{relevant_sum.toFixed(2)}</h2>
          <p className="text-xs text-muted-foreground">
            {tab === "today"
              ? "today"
              : tab === "week"
              ? "this week"
              : "this month"}
          </p>
        </CardContent>
      </Card>
    );
  });
}
