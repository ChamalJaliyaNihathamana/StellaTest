export const chunkWardrobeData = (
  data: string,
  chunkSize: number
): string[] => {
  const chunks: string[] = [];
  let currentChunk = "";
  const sentences = data.split(/(?<=[.!?])\s+/); // Split by sentence boundaries

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += sentence;
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
