import { cookies } from "next/headers";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    //Supabase signIn using email and password
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }

    //If sign in was successfull, set the authToken cookie to the current session's access token
    if (data.session) {
        const cookieStore = await cookies();

        cookieStore.set('authToken', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })
    }

    //Get the current user's profile (from the profiles table), using the user id and return it
    const {data: user, error: userError} = await supabase.from('profiles').select('id, name, email, isPro, subscriptionId, customerId').eq('id', data.user.id).single();

    return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
