// chat/message/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  Slide,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message, useChat } from "ai/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  updateInput,
  clearError,
  addMessage,
  setIsLoading,
  setError,
} from "@/lib/features/chat/chatSlice";

import ChatMessage from "@/client/components/chatMessage";

interface ChatMessageProps {
  isChatOpen: boolean;
}

const ChatMessagePage: React.FC<ChatMessageProps> = ({ isChatOpen }) => {
  const dispatch = useDispatch();

  // Get state from chat slice
  const { messages: reduxMessages, input } = useSelector(
    (state: RootState) => state.chat
  );

  const { messages, append, isLoading, error } = useChat({
    api: "/api/openai",
    initialMessages: reduxMessages,
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateInput(e.target.value));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return; // Don't send if empty or loading

    dispatch(setIsLoading(true));

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    dispatch(addMessage(userMessage));
    dispatch(updateInput(""));

    try {
      const newMessage = await append(userMessage);
      dispatch(addMessage(newMessage));
    } catch (error) {
      dispatch(setError((error as Error).message || "Failed to fetch message"));
      console.error("Error while fetching message:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Box>
      <Box
        className="pt-5 pb-3 pl-4 pr-16 bg-gray-100 "
        sx={{
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" className="text-left text-white">
          {" "}
          {/* White text */}
          <span>Chat 🧑‍🚀</span>
        </Typography>
      </Box>

      <Box
        sx={{ maxHeight: "calc(100vh - 250px)", padding: 2 }}
        ref={messagesEndRef}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </Box>

      {/* Input Area (Styled like the reference image) */}
      <Box p={2} sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          value={input}
          onChange={handleInputChange}
          variant="outlined"
          placeholder="Type your message here..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          sx={{
            borderRadius: "24px", // Rounded corners for the input field
            "& fieldset": {
              border: "none", // Remove the default border
            },
            "& .MuiInputBase-root": {
              paddingRight: "48px", // Add padding to accommodate the Send button
              fontSize: "1rem",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSend}
                  sx={{
                    bgcolor: "transparent", // No background color
                    color: "warning.light", // Lighter warning color in normal state
                    borderRadius: "50%",
                    p: 1,
                    transition: "color 0.2s ease", // Smooth color transition

                    // Hover effect
                    "&:hover": {
                      color: "warning.main", // Full warning color on hover
                    },

                    // Disabled state (optional)
                    "&:disabled": {
                      color: "grey.700",
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatMessagePage;
