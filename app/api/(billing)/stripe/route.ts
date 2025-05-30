import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

//Stripe webhook
export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;
    
    //The stripe event will be saved here
    let event: Stripe.Event;
    
    try {
        //Stripe event
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_SIGNING_SECRET as string
        );
    } catch (err: any) {
        console.error(err);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid"){        
        //If checkout has been completed and paid
        const metadata = event.data.object.metadata;
        if (metadata) {
            //Get user id from the metadata to updata profile table
            const userId = metadata.userId;
            const {error} = await supabase.from("profiles").update({
                isPro: true,
                subscriptionId: event.data.object.subscription,
                customerId: event.data.object.customer,
            }).eq("id", userId);
            if (error) {
                console.error(error);
            }
        }
    }

    if (
        event.type === "customer.subscription.deleted" ||
        event.type === "customer.subscription.updated"
    ) {
        const subscription = event.data.object as Stripe.Subscription;

        const isCanceled = subscription.status === "canceled" || subscription.status === "unpaid";
        if (isCanceled) {
            //If subscription was canceled
            const subscriptionId = subscription.id;

            //Get user id
            const { data: user, error: fetchError } = await supabase
                .from("profiles")
                .select("id")
                .eq("subscriptionId", subscriptionId)
                .single();

            if (fetchError) {
                console.error("User not found for subscription:", fetchError.message);
            } else {
                //Updata pro status to false
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({ isPro: false })
                    .eq("id", user.id);

                if (updateError) console.error(updateError.message);
            }
        }
    }

    revalidatePath("/", "layout");
    return new NextResponse(null, { status: 200 });
}