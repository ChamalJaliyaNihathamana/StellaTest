import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai'; // Import AnthropicStream

export async function POST(req: Request) {
  const { messages } = await req.json();
  const formattedMessages = messages
  .filter(msg => msg.role !== 'system')
  .map((message: any) => ({
      role: message.role,
      content: message.content,
  }));
  try {
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_CLAUDE_OPUS_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key not found in environment variables");
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // 1. Call the Anthropic API
    const response = await anthropic.messages.stream({
      model: 'claude-3-opus-20240229', 
      messages: formattedMessages,
      max_tokens: 1024,
    }); // Note: No stream: true here

    // 2. Use AnthropicStream to convert the response
    const stream = AnthropicStream(response); // Use AnthropicStream directly

    // 3. Return the StreamingTextResponse
    return new StreamingTextResponse(stream); 
  } catch (error) {
    console.error('Anthropic Error:', error);
    return new Response(`Error processing Anthropic request: ${error?.message || error}`, { status: 500 });
  }
}

