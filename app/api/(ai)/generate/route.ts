import { NextResponse } from "next/server";

import { openai } from "@/lib/openai";
  
//Generate a new project using open ai api
export async function POST(req: Request) {
  const { industry, audience, description, temperature } = await req.json();

  if (!industry || !audience || !description || !temperature) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  //Generate new project info
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert branding consultant who specializes in naming, marketing, and business positioning.' },
      { 
        role: 'user',       
        content: 
          `I need help creating a brand identity for my business.
              
          Industry: ${industry}
          Target Audience: ${audience}
          Product/Service Description: ${description}
          
          Please return the following in **strict JSON format**:
          
          {
            "name": "A creative and relevant name for the business",
            "slogan": "A short and impactful slogan",
            "description": "A clear, compelling business description written for the target audience"
          }`.trim(),
        },
    ],
    temperature: temperature[0],
  });

  //The response must be formated like: 
  //  {
  //   "name": "Projects name",
  //   "slogan": "Project slogan",
  //   "description": "Project description"
  // }
  let content = response.choices[0]?.message?.content || '{}';

  // Remove markdown formatting (like ```json ... ```)
  content = content.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1');

  //Parse to json return 
  const newProject = JSON.parse(content);

  return new Response(JSON.stringify(newProject), {
    status: 200,
  });

}
  