import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser:true
});


export async function POST(request: Request) {
    
    const {messages}= await request.json();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      stream: true
    });
  
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream); 
}