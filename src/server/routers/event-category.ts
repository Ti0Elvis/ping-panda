import { z } from "zod";
import { db } from "@/lib/db";
import { parseColor } from "@/lib/utils";
import { j, private_procedure } from "../jstack";
import { HTTPException } from "hono/http-exception";
import { FREE_QUOTA, PRO_QUOTA } from "@/lib/constants";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { EVENT_CATEGORY_NAME_VALIDATOR } from "@/lib/validators";

export const event_category_router = j.router({
  getEventCategories: private_procedure.query(async ({ c, ctx }) => {
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
      let last_ping: Date | null = null;
      const unique_field = new Set<string>();

      category.events.forEach((event) => {
        Object.keys(event.fields as object).forEach((field) => {
          unique_field.add(field);
        });

        if (last_ping === null || event.createdAt > last_ping) {
          last_ping = event.createdAt;
        }
      });

      return {
        ...category,
        last_ping: last_ping,
        events_count: category._count.events,
        unique_field_count: unique_field.size,
      };
    });

    return c.superjson({ categories: categories_with_counts });
  }),

  deleteEventCategory: private_procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      const { name } = input;

      const event_category = await db.eventCategory.findUnique({
        where: { name_user_id: { name, user_id: user.id } },
      });

      if (event_category === null) {
        throw new HTTPException(404, {
          message: "Don't exist a category with this name",
        });
      }

      await db.eventCategory.delete({
        where: { name_user_id: { name, user_id: user.id } },
      });

      return c.json({ success: true });
    }),

  createEventCategory: private_procedure
    .input(
      z.object({
        name: EVENT_CATEGORY_NAME_VALIDATOR,
        color: z.string("Color is required"),
        emoji: z.string().optional(),
      })
    )
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      const { color, name, emoji } = input;

      const event_category = await db.eventCategory.findUnique({
        where: { name_user_id: { name, user_id: user.id } },
      });

      if (event_category !== null) {
        throw new HTTPException(400, {
          message: "There is a category with this name",
        });
      }

      const categories = await db.eventCategory.findMany({
        where: { user_id: user.id },
      });

      const max_categories =
        user.plan === "PRO"
          ? PRO_QUOTA.max_event_categories
          : FREE_QUOTA.max_event_categories;

      if (categories.length >= max_categories - 1) {
        throw new HTTPException(429, {
          message: "You have reached the maximum number of event categories",
        });
      }

      const new_event_category = await db.eventCategory.create({
        data: {
          name,
          color: parseColor(color),
          emoji,
          user_id: user.id,
        },
      });

      return c.json({ eventCategory: new_event_category });
    }),

  insertQuickstartEventCategories: private_procedure.mutation(
    async ({ ctx, c }) => {
      const categories = await db.eventCategory.createMany({
        data: [
          { name: "Bug", emoji: "🐛", color: 0xff6b6b },
          { name: "Sale", emoji: "💰", color: 0xffeb3b },
          { name: "Question", emoji: "🤔", color: 0x6c5ce7 },
        ].map((category) => ({
          ...category,
          user_id: ctx.user.id,
        })),
      });

      return c.json({ success: true, count: categories.count });
    }
  ),

  pollCategory: private_procedure
    .input(
      z.object({
        name: EVENT_CATEGORY_NAME_VALIDATOR,
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

      const has_events = category._count.events > 0;

      return c.json({ has_events });
    }),

  getEventsByCategoryName: private_procedure
    .input(
      z.object({
        name: EVENT_CATEGORY_NAME_VALIDATOR,
        page: z.number(),
        limit: z.number().max(50),
        time_range: z.enum(["today", "week", "month"]),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, page, limit, time_range } = input;

      let startDate: Date;
      const now = new Date();

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

      const [events, events_count, unique_field_count] = await Promise.all([
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
            const unique_field = new Set<string>();

            events.forEach((event) => {
              Object.keys(event.fields as object).forEach((field) => {
                unique_field.add(field);
              });
            });

            return unique_field.size;
          }),
      ]);

      return c.superjson({
        events,
        events_count,
        unique_field_count,
      });
    }),
});
