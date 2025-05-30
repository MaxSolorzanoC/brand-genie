import { NextRequest, NextResponse } from "next/server";

import { openai } from "@/lib/openai";

//Regenerate info based on a prompt
export async function POST(req: NextRequest) {

  const { prompt, selectedField, previousData, temperature } = await req.json();

  if (!prompt || !selectedField || !previousData || !temperature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  //Update an especific field (selectedField) using an especific prompt and the previous data
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { 
          role: 'system', content: 'You are an expert branding consultant who specializes in naming, marketing, and business positioning.' 
      },
      { 
        role: 'user',       
        content: 
          `I'm developing a new brand identity for my business.

          I already have an existing ${selectedField} of my business, but I need a new version.
          
          The current version is: ${previousData}.

          Please generate a revised ${selectedField} based on the following instructions: ${prompt}
          
          Return only the new value as a plain string — no comments, explanations, or extra formatting.
          `.trim(),
      },
    ],
    temperature: temperature, 
  });

  //Response is a string
  let content = response.choices[0]?.message?.content || '';

  // Remove markdown formatting (like ```json ... ```)
  content = content.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1');

  return NextResponse.json({ status: 200, data: content });
}
