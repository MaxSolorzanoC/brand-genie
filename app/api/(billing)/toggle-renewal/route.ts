import { NextRequest, NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';

//Toggle automatic monthly billing
export async function POST(req: NextRequest) {
  const { subscriptionId, cancelAtPeriodEnd } = await req.json();

  if (!subscriptionId) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !cancelAtPeriodEnd, //Toggle
    });

    return NextResponse.json({ success: true, subscription: updatedSubscription });
  } catch (error) {
    console.error('Error updating subscription renewal:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}