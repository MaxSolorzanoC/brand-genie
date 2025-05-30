import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//Fetch all projects from the current user
export async function GET(req: Request) {
    //Get the current user's token
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    //Get the current user's info (using token)
    const {data: userData, error: userError} = await supabase.auth.getUser(token);

    if(userError) return new Response(JSON.stringify({ error: userError.message }), { status: 401 });

    if (!userData.user?.id) {
        return NextResponse.json({ error: 'No userId provided' }, { status: 400 });
    }

    //Fetch all the projects from the current user using his id
    const { data, error } = await supabase.from("projects").select("*").eq("userId", userData.user.id);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 401 });

    return new Response(JSON.stringify(data), { status: 200 });
}
