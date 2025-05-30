import { cookies } from 'next/headers';

import { supabase } from '@/lib/supabase';

export async function POST() {
    //Supabase signOut
    const { error } = await supabase.auth.signOut()

    if(error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  
    const cookieStore = await cookies();
        
    // Clear the authToken cookie
    cookieStore.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
        
    const response = new Response(JSON.stringify({ success: true }));
    return response;
}
