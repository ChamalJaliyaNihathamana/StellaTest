
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

const anthropic = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_CLAUDE_OPUS_API_KEY,
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const response = await anthropic.messages.create({
            messages,
            model: 'claude-3-opus-20240229', // Or your preferred model
            stream: true,
            max_tokens: 300,
        });

        const stream = AnthropicStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Anthropic Error:', error);
        return new Response('Error processing Anthropic request', { status: 500 });
    }
}