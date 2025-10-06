"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import type { Event } from "@prisma/client";
import { Heading } from "@/components/heading";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment, useMemo, useState } from "react";
import { useCategoryContext } from "../context/category-context";

export function CategoryTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { category, eventsQuery, ...context } = useCategoryContext();

  const columns: Array<ColumnDef<Event>> = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Category",
        cell: () => <span>{category.name || "Uncategorized"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Date
              <ArrowUpDownIcon className="ml-2 size-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return new Date(row.getValue("createdAt")).toLocaleString();
        },
      },
      ...(eventsQuery.data?.events[0]
        ? Object.keys(eventsQuery.data.events[0].fields as object).map(
            (field) => ({
              accessorFn: (row: Event) =>
                (row.fields as Record<string, any>)[field],
              header: field,
              cell: ({ row }: { row: Row<Event> }) =>
                (row.original.fields as Record<string, any>)[field] || "-",
            })
          )
        : []),
      {
        accessorKey: "delivery_status",
        header: "Delivery Status",
        cell: ({ row }) => (
          <span
            className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
              "bg-green-100 text-green-800":
                row.getValue("delivery_status") === "DELIVERED",
              "bg-red-100 text-red-800":
                row.getValue("delivery_status") === "FAILED",
              "bg-yellow-100 text-yellow-800":
                row.getValue("delivery_status") === "PENDING",
            })}>
            {row.getValue("delivery_status")}
          </span>
        ),
      },
    ],
    [category.name, eventsQuery.data?.events]
  );

  const table = useReactTable({
    data: eventsQuery.data?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(
      (eventsQuery.data?.eventsCount || 0) / context.pagination.pageSize
    ),
    onPaginationChange: context.setPagination,
    state: {
      sorting,
      columnFilters,
      pagination: context.pagination,
    },
  });

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-full flex flex-col gap-4">
            <Heading className="text-3xl">Event overview</Heading>
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {eventsQuery.isFetching ? (
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || eventsQuery.isFetching}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || eventsQuery.isFetching}>
          Next
        </Button>
      </div>
    </Fragment>
  );
}
