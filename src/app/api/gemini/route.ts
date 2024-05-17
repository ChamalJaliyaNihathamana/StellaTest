"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
    contents: messages
        .filter(
            (message) => message.role === "user" || message.role === "assistant"
        )
        .map((message) => ({
            role: message.role === "user" ? "user" : "model",
            parts: [{ text: message.content }],
        })),
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const geminiStream = await genAI
            .getGenerativeModel({ model: "gemini-1.5-flash-latest" })
            .generateContentStream(buildGoogleGenAIPrompt(messages));

        const stream = GoogleGenerativeAIStream(geminiStream);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Gemini Error:', error);
        return new Response('Error processing Gemini request', { status: 500 });
    }
}
