import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

//Get the current user
export async function GET(req: Request) {
    //Get the current user's token
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    
    //Get the current user's info (using token)
    const { data, error } = await supabase.auth.getUser(token);

    //If error, token is no longer valid (expired)
    if (error) {    
        // Clear the authToken cookie
        cookieStore.set('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 0,
        });
        return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }

    //Fetch the user's corresponding profile row by passing in the user's id
    const {data: user, error: userError} = await supabase.from('profiles').select('id, name, email, isPro, subscriptionId, customerId').eq('id', data.user.id).single();
 
    if (userError)  return new Response(JSON.stringify({ error: userError.message }), { status: 401 });

    return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
