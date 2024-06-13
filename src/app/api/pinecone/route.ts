import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ClothingItem, AccessoryItem } from "./types";  
import { parseClosetData } from "@/client/utils/parsedClosetData";

const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
});
const INDEX_NAME = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME || "clothing-items";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type PineconeRecordWithMetadata<T> = PineconeRecord<{ [key: string]: any } & T>;

export async function POST(request: Request) {
  try {
    const index = pinecone.Index(INDEX_NAME);
    const { method, data } = await request.json();

    if (method === "upsert") {
    //   const closetData: string = data;
    //   const parsedItems = await parseClosetData(closetData);

      const batchSize = 500;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const vectors = await Promise.all(
          batch.map(async (item) => {
            const embeddingResponse = await openai.embeddings.create({
              model: "text-embedding-ada-002",
              input: item.additionalNotes,
            });
            const embedding = embeddingResponse.data[0].embedding;
            const record: PineconeRecordWithMetadata<
              ClothingItem | AccessoryItem
            > = {
              id: item.itemId,
              values: embedding,
              metadata: item,
            };
            return record;
          })
        );
        await index.upsert(vectors);
      }

      return NextResponse.json({
        message: `${data.length} items upserted to Pinecone successfully`,
      });
    } else if (method === "query") {
      const { query, topK = 5, filter } = data;

      // Input Validation for Query
      if (typeof query !== "string" || query.trim() === "") {
        return NextResponse.json(
          { error: "Invalid or empty query" },
          { status: 400 }
        );
      }

      const queryEmbeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: query,
      });
      const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

      const queryResponse = await index.query({
        topK,
        includeMetadata: true,
        vector: queryEmbedding,
        filter, // Apply filters if provided
      });
      return NextResponse.json(queryResponse);
    } else {
      return NextResponse.json({ error: "Invalid method" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error in /api/pinecone:", error);
    if (error.response && error.response.status) {
      // If it's a Pinecone API error, return the status code
      return NextResponse.json(
        { error: error.message },
        { status: error.response.status }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
