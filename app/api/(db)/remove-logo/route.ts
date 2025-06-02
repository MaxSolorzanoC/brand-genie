import { supabase } from "@/lib/supabase";

//Delete curretn project logo
export async function POST(req: Request) {

    const {id, url} = await req.json();
    
    //Delete logo from storage
    const { data, error } = await supabase
        .storage
        .from('images')
        .remove([url])
    if (error) return new Response(JSON.stringify({error: error.message}), {status: 401});

    //Set logo to null in project db
    if (data) {
        const {data, error } = await supabase.from('projects').update({logo: null}).eq('id', id).select("*").single();
        if (error) return new Response(JSON.stringify({error: error.message}), {status: 401});
        
        if (data) return new Response(JSON.stringify({data}), {status: 200});
    }
    return new Response(JSON.stringify({error: 'No data returned'}), { status: 401 });
}
