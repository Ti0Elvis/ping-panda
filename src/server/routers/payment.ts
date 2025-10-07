import { j, private_procedure } from "../jstack";
import { createCheckoutSession } from "@/lib/stripe";

export const payment_router = j.router({
  createCheckoutSession: private_procedure.mutation(async ({ c, ctx }) => {
    const { user } = ctx;

    const session = await createCheckoutSession({
      email: user.email,
      user_id: user.id,
    });

    return c.json({ url: session.url });
  }),

  getUserPlan: private_procedure.query(async ({ c, ctx }) => {
    const { user } = ctx;
    return c.json({ plan: user.plan });
  }),
});
