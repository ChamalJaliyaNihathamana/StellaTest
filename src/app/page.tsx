// Home.tsx
"use client";
import { useState } from "react";
import { Box, Stack } from "@mui/material"; // Add Stack for vertical layout
import VideoOnboard from "./onboard/page";
import Pinecone from "./pinecone/page";
import Chat from "./chat/page";
import { ChatIcon } from "@/client/components/chatIcon";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatOpen = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  return (
    <Box>
      <VideoOnboard />
      {/* <Pinecone /> */}

     
    </Box>
  );
}
