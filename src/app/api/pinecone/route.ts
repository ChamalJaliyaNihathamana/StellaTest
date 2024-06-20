import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ClothingItem, AccessoryItem } from "./types";
import { entityExtractionWardrobePrompt } from "@/client/prompts/entityExtractionWardrobePrompt";
import { chunkWardrobeData } from "@/client/utils/chunkHelper";

const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
});
const INDEX_NAME =
  process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME;

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type PineconeRecordWithMetadata<T> = PineconeRecord<{ [key: string]: any } & T>;
const MAX_CHUNK_SIZE = 2000;

export async function POST(request: Request) {
  try {
    const index = pinecone.Index(INDEX_NAME);
    const { method, data } = await request.json();
    let parsedItems: (ClothingItem | AccessoryItem)[] = [];

    if (method === "upsert") {
      const chunks = chunkWardrobeData(data, MAX_CHUNK_SIZE);

      for (const chunk of chunks) {
        const items = await entityExtractionWardrobePrompt(chunk);
        parsedItems.push(...items);
      }

      // Generate embeddings and upsert to Pinecone
      const batchSize = 500; // Choose an appropriate batch size
      for (let i = 0; i < parsedItems.length; i += batchSize) {
        const batch = parsedItems.slice(i, i + batchSize);
        const vectors = await Promise.all(
          batch.map(async (item: ClothingItem | AccessoryItem) => {
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
        console.log('Upserting vectors:', vectors);
        try {
          // Upsert to Pinecone
          await index.upsert(vectors); 
        } catch (upsertError: any) { // Catch upsert-specific errors
          if (upsertError.response && upsertError.response.status >= 500) { // Check for 5xx errors (server-side)
            console.error("Pinecone internal server error:", upsertError);
            return NextResponse.json(
              { error: "An error occurred on the Pinecone server. Please try again later." },
              { status: 500 } 
            );
          } else {
            console.error("Pinecone upsert error:", upsertError);
            return NextResponse.json(
              { error: upsertError.message || "Pinecone upsert failed." },
              { status: upsertError.response?.status || 500 } // Fallback to 500 if no specific status available
            );
          }
        } 
      }
      return NextResponse.json(
        {
          message: `${parsedItems.length} items upserted to Pinecone successfully.`,
        },
        { status: 200 }
      );
    } else if (method === "query") {
      let { query, topK = 5, filter } = data;

      // Handle empty query: Use an empty vector to fetch all items
      if (!query || query.trim() === "") {
        query = ""; // Explicitly set to empty string for clarity
      }

      // Generate embedding (even for empty query) to maintain consistent format
      const queryEmbedding = query
        ? await openai.embeddings
            .create({ model: "text-embedding-ada-002", input: query })
            .then((r) => r.data[0].embedding)
        : []; // Empty embedding for empty query

      // Handle empty or missing filter:  Fetch all if no filter provided
      filter = filter || undefined; // Explicitly set to undefined if empty/missing

      const queryResponse = await index.query({
        topK: query ? topK : 10000, // Adjust if you expect more than 10,000 items
        includeMetadata: true,
        vector: queryEmbedding,
        filter,
      });

      return NextResponse.json(queryResponse);
    } else if (method === "fetchWardrobeEmbeddings") {
      let { query: originalQuery, topK = 3 } = data; // Get the original query

      let queryToSend = originalQuery; // Create a new variable to work with
      if (!queryToSend || queryToSend.trim() === "") {
        queryToSend = "";
      }

      // Use queryToSend in your Pinecone query
      const queryEmbedding = queryToSend
        ? await openai.embeddings
            .create({ model: "text-embedding-ada-002", input: queryToSend })
            .then((r) => r.data[0].embedding)
        : [];
      const queryResponse = await index.query({
        topK,
        includeValues: true,
        includeMetadata: true,
        vector: queryEmbedding,
      });

      const wardrobeEmbeddings = queryResponse.matches.map((match) => ({
        itemId: match.id,
        embedding: match.values,
      }));

      return NextResponse.json(wardrobeEmbeddings); // Send the embeddings as response
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
