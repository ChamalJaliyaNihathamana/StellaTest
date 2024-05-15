// /api/combinedAI.ts
import { combineStylePrompt } from '@/client/prompts/combineStylePrompt.';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from "openai";
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';


export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Ensure this is secure in production
});

export async function POST(request: Request) {
  try {
    const { messages, llmOutputs } = await request.json();

    // 3. Combine Outputs using the Prompt
    const combinedMessages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: combineStylePrompt(messages[0].content, llmOutputs),
        },
      ];
  
      // 4. Send Combined Output to OpenAI for Final Refinement
      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: combinedMessages,
        stream: true
      });
  
      return new StreamingTextResponse(OpenAIStream(finalResponse));

  } catch (error) {
    console.error("Error communicating with AI providers:", error);
    return new Response("Error processing request", { status: 500 });
  }
}