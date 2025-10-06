import { j, privateProcedure } from "../jstack";
import { createCheckoutSession } from "@/lib/stripe";

export const paymentRouter = j.router({
  createCheckoutSession: privateProcedure.mutation(async ({ c, ctx }) => {
    const { user } = ctx;

    const session = await createCheckoutSession({
      email: user.email,
      user_id: user.id,
    });

    return c.json({ url: session.url });
  }),

  getUserPlan: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;
    return c.json({ plan: user.plan });
  }),
});
