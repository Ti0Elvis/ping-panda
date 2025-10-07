"use client";
import {
  ArrowRightIcon,
  BarChart2Icon,
  ClockIcon,
  DatabaseIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { client } from "@/lib/client";
import { format, formatDistanceToNow } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
  name: string;
  emoji: string | null;
  color: number;
  updatedAt: Date;
  createdAt: Date;
  last_ping: null;
  events_count: number;
  unique_field_count: number;
}

export function EventCategoryCard(category: Readonly<Props>) {
  const [alertDialog, setAlertDialog] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      await client.event_category.deleteEventCategory.$post({ name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] });
      setAlertDialog(false);
    },
  });

  return (
    <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
      <Card className="relative group z-10 transition-all duration-200 hover:-translate-y-0.75">
        <CardHeader className="flex items-center gap-4">
          <div
            className="size-12 rounded-full"
            style={{
              backgroundColor: category.color
                ? `#${category.color.toString(16).padStart(6, "0")}`
                : "#f3f4f6",
            }}
          />
          <div>
            <h3 className="text-lg font-medium tracking-tight">
              {category.emoji || "📂"} {category.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {format(category.createdAt, "MMM d, yyyy")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ClockIcon className="size-4 text-primary/80" />
            <span>
              Last ping:{" "}
              {category.last_ping
                ? formatDistanceToNow(category.last_ping) + " ago"
                : "Never"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DatabaseIcon className="size-4 text-primary/80" />
            <span>Unique fields: {category.unique_field_count || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart2Icon className="size-4 text-primary/80" />
            <span>Events this month: {category.events_count || 0}</span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href={`/dashboard/category/${category.name}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex items-center gap-2 text-xs",
            })}>
            View all <ArrowRightIcon className="size-3" />
          </Link>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${category.name} category`}>
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
        </CardFooter>
      </Card>
      <AlertDialogContent>
        <AlertDialogTitle>
          Are you sure you want to delete the "{category.name}" category?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. Deleting this category will permanently
          remove all associated data, including events and unique fields. Please
          make sure you want to proceed before confirming this action.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(category.name)}>
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
