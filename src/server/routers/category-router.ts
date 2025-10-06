import { z } from "zod";
import { db } from "@/lib/db";
import { parseColor } from "@/lib/utils";
import { j, privateProcedure } from "../jstack";
import { HTTPException } from "hono/http-exception";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";

export const categoryRouter = j.router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);

    const categories = await db.eventCategory.findMany({
      where: { user_id: ctx.user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
        events: {
          where: { createdAt: { gte: firstDayOfMonth } },
          select: {
            fields: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            events: {
              where: { createdAt: { gte: firstDayOfMonth } },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const categories_with_counts = categories.map((category) => {
      const unique_field_names = new Set<string>();
      let last_ping: Date | null = null;

      category.events.forEach((event) => {
        Object.keys(event.fields as object).forEach((field_name) => {
          unique_field_names.add(field_name);
        });

        if (!last_ping || event.createdAt > last_ping) {
          last_ping = event.createdAt;
        }
      });

      return {
        id: category.id,
        name: category.name,
        emoji: category.emoji,
        color: category.color,
        updatedAt: category.updatedAt,
        createdAt: category.createdAt,
        last_ping: last_ping,
        events_count: category._count.events,
        unique_field_count: unique_field_names.size,
      };
    });

    return c.superjson({ categories: categories_with_counts });
  }),

  deleteEventCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { name } = input;

      await db.eventCategory.delete({
        where: { name_user_id: { name, user_id: ctx.user.id } },
      });

      return c.json({ success: true });
    }),

  createEventCategory: privateProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Category name is required.")
          .regex(
            /^[a-zA-Z0-9-]+$/,
            "Category name can only contain letters, numbers or hypens."
          ),
        color: z.string("Color is required"),
        emoji: z.string().optional(),
      })
    )
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      const { color, name, emoji } = input;

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          user_id: user.id,
        },
      });

      return c.json({ eventCategory });
    }),

  insertQuickstartCategories: privateProcedure.mutation(async ({ ctx, c }) => {
    const categories = await db.eventCategory.createMany({
      data: [
        { name: "bug", emoji: "🐛", color: 0xff6b6b },
        { name: "sale", emoji: "💰", color: 0xffeb3b },
        { name: "question", emoji: "🤔", color: 0x6c5ce7 },
      ].map((category) => ({
        ...category,
        user_id: ctx.user.id,
      })),
    });

    return c.json({ success: true, count: categories.count });
  }),

  pollCategory: privateProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Category name is required.")
          .regex(
            /^[a-zA-Z0-9-]+$/,
            "Category name can only contain letters, numbers or hypens."
          ),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name } = input;

      const category = await db.eventCategory.findUnique({
        where: { name_user_id: { name, user_id: ctx.user.id } },
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
      });

      if (category === null) {
        throw new HTTPException(404, {
          message: `Category "${name}" not found`,
        });
      }

      const hasEvents = category._count.events > 0;

      return c.json({ hasEvents });
    }),

  getEventsByCategoryName: privateProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Category name is required.")
          .regex(
            /^[a-zA-Z0-9-]+$/,
            "Category name can only contain letters, numbers or hypens."
          ),
        page: z.number(),
        limit: z.number().max(50),
        time_range: z.enum(["today", "week", "month"]),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, page, limit, time_range } = input;

      const now = new Date();
      let startDate: Date;

      switch (time_range) {
        case "today":
          startDate = startOfDay(now);
          break;
        case "week":
          startDate = startOfWeek(now, { weekStartsOn: 0 });
          break;
        case "month":
          startDate = startOfMonth(now);
          break;
      }

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        db.event.findMany({
          where: {
            event_category: { name, user_id: ctx.user.id },
            createdAt: { gte: startDate },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.event.count({
          where: {
            event_category: { name, user_id: ctx.user.id },
            createdAt: { gte: startDate },
          },
        }),
        db.event
          .findMany({
            where: {
              event_category: { name, user_id: ctx.user.id },
              createdAt: { gte: startDate },
            },
            select: {
              fields: true,
            },
            distinct: ["fields"],
          })
          .then((events) => {
            const fieldNames = new Set<string>();
            events.forEach((event) => {
              Object.keys(event.fields as object).forEach((fieldName) => {
                fieldNames.add(fieldName);
              });
            });
            return fieldNames.size;
          }),
      ]);

      return c.superjson({
        events,
        eventsCount,
        uniqueFieldCount,
      });
    }),
});
