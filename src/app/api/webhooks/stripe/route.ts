import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  const event = stripe.webhooks.constructEvent(
    body,
    signature ?? "",
    process.env.STRIPE_WEBHOOK_SECRET ?? ""
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { user_id } = session.metadata || { user_id: null };

    if (user_id === null) {
      return new Response("Invalid metadata", { status: 400 });
    }

    await db.user.update({
      where: { id: user_id },
      data: { plan: "PRO" },
    });
  }

  return new Response("OK");
}
