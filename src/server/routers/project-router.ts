import { db } from "@/lib/db";
import { j, privateProcedure } from "../jstack";
import { addMonths, startOfMonth } from "date-fns";
import { FREE_QUOTA, PRO_QUOTA } from "@/lib/constants";

export const projectRouter = j.router({
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    const currentDate = startOfMonth(new Date());

    const quota = await db.quota.findFirst({
      where: {
        user_id: user.id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
    });

    const eventCount = quota?.count ?? 0;

    const categoryCount = await db.eventCategory.count({
      where: { user_id: user.id },
    });

    const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA;

    const resetDate = addMonths(currentDate, 1);

    return c.superjson({
      categoriesUsed: categoryCount,
      categoriesLimit: limits.maxEventCategories,
      eventsUsed: eventCount,
      eventsLimit: limits.maxEventsPerMonth,
      resetDate,
    });
  }),
});
