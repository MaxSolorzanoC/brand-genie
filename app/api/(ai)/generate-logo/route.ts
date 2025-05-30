import { NextResponse } from "next/server";

import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

//Generate a logo using open ai api
export async function POST(req: Request) {
    const {prompt, id, description, name, slogan, logo} = await req.json();

    //Check if there are missing fields
    if (!prompt || !id || !description || !name || !slogan) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //Check if project has a previous logo
    if (logo) {
        //Get logo path
        const { data, error} = await supabase.from("projects").select("logo").eq("id", id).single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        //Delete logo from storage
        const { error: storageError } = await supabase
            .storage
            .from('images')
            .remove([data?.logo])

        if (storageError) {
            return NextResponse.json({ error: storageError.message }, { status: 500 });
        }

        //Set project logo to null
        const { error: updateError } = await supabase.from("projects").update({
            logo: null
        }).eq("id", id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
    }

    //Generate new logo using open ai api
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `
            Generate a high-quality, creative logo for my business based on the following details:

            Business Name: ${name}
            Description: ${description}
            Slogan (optional to include): "${slogan}"
            Don't include the business name, business decription, or slogan in the image unless it is specified.

            The logo should visually reflect the brand identity and purpose described above. Please follow these specific instructions for the visual style and design:
            
            Logo Instructions:

            Generate the logo in a plain background (not a mockup).

            ${prompt}
        `.trim(),
        n: 1,
        size: "1024x1024",
        
    });
    
   if (response.data) {
    //Convert the image returned by open ai to an array buffer which will be uploaded to supabase storage
       const imageUrl = response.data[0].url;
       if (imageUrl) {
           const imageResponse = await fetch(imageUrl);
           const imageBuffer = await imageResponse.arrayBuffer();
           const buffer = Buffer.from(imageBuffer);
           const filePath = `${id}/logo/${Date.now()}.png`;

           //Upload array buffer to storage
           const { error } = await supabase.storage
            .from("images")
            .upload(filePath, buffer, { contentType: "image/png" });

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 }); //
            }
            
            //Update project logo file path in database
            const { error: projectError } = await supabase.from("projects").update({
                logo: filePath
            }).eq("id", id);

            if (projectError) {
                return NextResponse.json({ error: projectError.message }, { status: 500 });
            }
            //Return the url of the logo
            return NextResponse.json({ url: filePath });
        }
        return NextResponse.json({ message: "Image URL not found", status: 404 })
   }
    return NextResponse.json({ message: "Image URL not found", status: 404 })
}