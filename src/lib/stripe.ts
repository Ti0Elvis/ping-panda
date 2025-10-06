import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-09-30.clover",
  typescript: true,
});

interface Props {
  email: string;
  user_id: string;
}

export async function createCheckoutSession({ email, user_id }: Props) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1SFHWSJXThuAUtqB9iqY4aHR",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    customer_email: email,
    metadata: {
      user_id,
    },
  });

  return session;
}
