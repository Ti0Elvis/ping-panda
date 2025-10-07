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
  polling_query: DefinedUseQueryResult<
    {
      has_events: boolean | undefined;
    },
    Error
  >;
  events_query: UseQueryResult<
    {
      events: Array<Event>;
      events_count: number;
      unique_field_count: number;
    },
    Error
  >;
  has_events?: boolean;
  category: EventCategory;
}

export function useCategory(category: EventCategory, has_events?: boolean) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(Tab.TODAY);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const polling_query = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    queryFn: async () => {
      const response = await client.event_category.pollCategory.$get({
        name: category.name,
      });
      return response.json();
    },
    initialData: { has_events },
    refetchInterval(query) {
      return query.state.data?.has_events ? false : 5000;
    },
  });

  const events_query = useQuery({
    queryKey: ["events", category.name, pagination, tab],
    queryFn: async () => {
      const res = await client.event_category.getEventsByCategoryName.$get({
        name: category.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        time_range: tab,
      });
      return res.json();
    },
    enabled: polling_query.data.has_events,
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
    polling_query,
    events_query,
    has_events: polling_query.data.has_events,
    category,
  };
}
