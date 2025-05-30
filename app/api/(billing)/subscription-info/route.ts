import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

//Get subscription info (from stripe)
export async function GET(req: NextRequest) {

  //Get the user token
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  //Get the user (using token)
  const {data: userData, error: userError} = await supabase.auth.getUser(token);

  if(userError) return new Response(JSON.stringify({ error: userError.message }), { status: 401 });

  //Get the customerId from the profiles table
  const { data, error } = await supabase.from("profiles").select("customerId").eq("id", userData.user.id).single();

  if(error) return new Response(JSON.stringify({ error: error.message }), { status: 401 });

  const customerId = data?.customerId;

  if (!customerId) {
    return NextResponse.json(
      { error: 'Customer ID is required' },
      { status: 400 }
    );
  }

  try {
    //Retusn all stripe subscriptions from the corresponding customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    const subscription = subscriptions.data[0];

    return NextResponse.json(subscription);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch customer information' },
      { status: 500 }
    );
  }
}
