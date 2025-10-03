"use client";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { client } from "@/lib/client";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { COLOR_OPTIONS, EMOJI_OPTIONS } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = z.object({
  name: z
    .string()
    .min(1, "Category name is required.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Category name can only contain letters, numbers or hypens."
    ),
  color: z.string("Color is required"),
  emoji: z.string().optional(),
});

export function CreateCategoryDialog() {
  const [dialog, setDialog] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      await client.category.createEventCategory.$post({ ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] });
      setDialog(false);
    },
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (dialog === false) {
      form.reset();
    }
  }, [dialog, form]);

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-fit items-center">
          <PlusIcon className="size-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogDescription>
          Create a new category to organize your events.
        </DialogDescription>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Enter category name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Color</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-2 flex-wrap">
                      {COLOR_OPTIONS.map((color) => (
                        <FormItem key={color}>
                          <FormControl>
                            <RadioGroupItem
                              value={color}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <div
                            className={cn(
                              `bg-[${color}]`,
                              "h-8 w-8 rounded-full cursor-pointer",
                              field.value === color &&
                                `ring-2 ring-offset-2 ring-[${color}]`
                            )}
                            onClick={() => field.onChange(color)}
                          />
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Emoji</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-2 flex-wrap">
                      {EMOJI_OPTIONS.map(({ emoji }) => (
                        <FormItem key={emoji}>
                          <FormControl>
                            <RadioGroupItem
                              value={emoji}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <div
                            className={cn(
                              "size-10 bg-secondary flex items-center justify-center text-xl rounded-md transition-all cursor-pointer",
                              form.watch("emoji") === emoji
                                ? "ring-2 ring-primary scale-110"
                                : "hover:bg-primary/10"
                            )}
                            onClick={() => field.onChange(emoji)}>
                            {emoji}
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
                onClick={() => setDialog(false)}>
                Cancel
              </Button>
              <Button disabled={mutation.isPending} type="submit">
                {mutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
