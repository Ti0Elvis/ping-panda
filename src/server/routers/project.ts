import z from "zod";
import { db } from "@/lib/db";
import { j, private_procedure } from "../jstack";
import { addMonths, startOfMonth } from "date-fns";
import { FREE_QUOTA, PRO_QUOTA } from "@/lib/constants";

export const project_router = j.router({
  getUsage: private_procedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    const current_date = startOfMonth(new Date());

    const quota = await db.quota.findFirst({
      where: {
        user_id: user.id,
        year: current_date.getFullYear(),
        month: current_date.getMonth() + 1,
      },
    });

    const event_count = quota?.count ?? 0;

    const category_count = await db.eventCategory.count({
      where: { user_id: user.id },
    });

    const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA;

    const reset_date = addMonths(current_date, 1);

    return c.superjson({
      categories_used: category_count,
      categories_limit: limits.max_event_categories,
      events_used: event_count,
      events_limit: limits.max_events_per_month,
      reset_date,
    });
  }),

  setDiscordID: private_procedure
    .input(z.object({ discord_id: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const { discord_id } = input;

      await db.user.update({
        where: { id: user.id },
        data: { discord_id },
      });

      return c.json({ success: true });
    }),
});
