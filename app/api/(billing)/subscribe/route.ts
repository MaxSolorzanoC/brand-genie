import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { userId, customerId } = await req.json();
    
    if (customerId) {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
        });
    
        if (subscriptions.data.length > 0) {
            return NextResponse.json({ url: "/dashboard" });
        }
    }
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscription`,
        line_items: [
            {
                price: "price_1RVKZTPLB7E2IKbk2pjXAQDB",
                quantity: 1,
            },
        ],
        metadata: {
            userId,
        },
        ...(customerId && { customer: customerId }),
    });
    
    return NextResponse.json({ url: session.url });

}
