import {
  type DefinedUseQueryResult,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { client } from "@/lib/client";
import type { Event, EventCategory } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export enum Tab {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
}

export type Pagination = { pageIndex: number; pageSize: number };

export interface UseCategoryReturn {
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
  pollingQuery: DefinedUseQueryResult<
    {
      hasEvents: boolean | undefined;
    },
    Error
  >;
  eventsQuery: UseQueryResult<
    {
      events: Array<Event>;
      eventsCount: number;
      uniqueFieldCount: number;
    },
    Error
  >;
  hasEvents?: boolean;
  category: EventCategory;
}

export function useCategory(category: EventCategory, hasEvents?: boolean) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(Tab.TODAY);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const pollingQuery = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    queryFn: async () => {
      const response = await client.category.pollCategory.$get({
        name: category.name,
      });
      return response.json();
    },
    initialData: { hasEvents },
    refetchInterval(query) {
      return query.state.data?.hasEvents ? false : 1000;
    },
  });

  const eventsQuery = useQuery({
    queryKey: ["events", category.name, pagination, tab],
    queryFn: async () => {
      const res = await client.category.getEventsByCategoryName.$get({
        name: category.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        time_range: tab,
      });
      return res.json();
    },
    enabled: pollingQuery.data.hasEvents,
    refetchOnWindowFocus: false,
  });

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set("page", (pagination.pageIndex + 1).toString());
    searchParams.set("limit", pagination.pageSize.toString());

    router.replace(`?${searchParams.toString()}`, { scroll: false });
  }, [pagination, router]);

  return {
    tab,
    setTab,
    pagination,
    setPagination,
    pollingQuery,
    eventsQuery,
    hasEvents: pollingQuery.data.hasEvents,
    category,
  };
}
