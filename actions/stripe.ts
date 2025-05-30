import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation";
import Stripe from "stripe";

type Props = {
    userId: string,
    customerId: string | null,
}

export const subscribeAction = async ({ userId, customerId }: Props) => {
    if (customerId) {
        //User has already subscribed previously (has an existing stripe client)
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
          });
          
          if (subscriptions.data.length > 0) {
            // Customer already has an active subscription
            redirect("/dashboard")
        }
    }

    //User has never subscribed previously (doesn't have an existing stripe client) or has not an active subscription
    const data: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscription`,
        line_items: [
            {
                price: "price_1RQDSsPLB7E2IKbkJ1AxuzW2",
                quantity: 1,
            }
        ],
        metadata: {
            userId,
        },
        ...(customerId && { customer: customerId }),
    }

    const {url} = await stripe.checkout.sessions.create(data);

    return url;
}