import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        //Supabase sign up using email and password
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        //Once user is created, create a new profile row using the name and email, and the user id from the auth table
        if(data.user) {
            const { data: user, error } = await supabase.from("profiles").insert({
                id: data.user.id,
                name,
                email,
            }).select().single()

            if (error) {
                console.log(error)
                return new Response(JSON.stringify({ error: error.message }), { status: 401 });    
            }

            return new Response(JSON.stringify({ success: true, user }), { status: 200 });
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
    }
}
