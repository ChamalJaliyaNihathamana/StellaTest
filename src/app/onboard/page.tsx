import CustomButton from "@/client/components/CustomButton";
import CustomTextArea from "@/client/components/CustomTextArea";
import { entityExtractionWardrobePrompt } from "@/client/prompts/entityExtractionWardrobePrompt";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { AccessoryItem, ClothingItem } from "../api/pinecone/types";
import { chunkWardrobeData } from "@/client/utils/chunkHelper";

interface VideoOnboardProps {}

const MAX_CHUNK_SIZE = 2000;

const VideoOnboard: React.FunctionComponent<VideoOnboardProps> = () => {
  const [wardrobeData, setWardrobeData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upsertMessage, setUpsertMessage] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<
    (ClothingItem | AccessoryItem)[]
  >([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setUpsertMessage(null);

    try {
      const chunks = chunkWardrobeData(wardrobeData, MAX_CHUNK_SIZE);
      let allParsedItems: (ClothingItem | AccessoryItem)[] = [];

      for (const chunk of chunks) {
        const parsedChunkItems = await entityExtractionWardrobePrompt(chunk);
        allParsedItems.push(...parsedChunkItems);
      }

      // Update extractedItems state with all parsed items
      setExtractedItems(allParsedItems);
      console.log(allParsedItems);
      // Upsert allParsedItems to Pinecone (Implement this part based on your Pinecone setup)
      const pineconeResponse = await fetch("/api/pinecone", {
        // Call to your Pinecone API Route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "upsert", data: allParsedItems }),
      });

      if (pineconeResponse.ok) {
        const data = await pineconeResponse.json();
        setUpsertMessage(data.message || "Items upserted successfully!");
      } else {
        throw new Error(
          `Error upserting to Pinecone: ${pineconeResponse.statusText}`
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container maxWidth="md">
      <Box className="container mx-auto p-4" p={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          Video Onboard
        </Typography>

        <Box mt={4} display="flex" alignItems="center">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomTextArea
                  label="existing wardrobe items"
                  value={wardrobeData}
                  onChange={(e) => setWardrobeData(e.target.value)}
                  placeholder="Enter your wardrobe item descriptions..."
                  sx={{ mb: 2, width: "calc(100% - 16px)" }}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomButton
                  type="submit"
                  color="customBlack"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add to Pinecone"}
                </CustomButton>
              </Grid>
            </Grid>
          </form>
        </Box>
        {isLoading ? (
          <Box mt={2} display="flex" alignItems="center">
            <CircularProgress color="warning" />
            <Typography variant="body1" ml={2}>
              Uploading...
            </Typography>
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" mt={2}>
            {error}
          </Typography>
        ) : (
          <Box mt={2}>
            <Typography variant="body1" color="error" mt={2}>
              {upsertMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default VideoOnboard;
