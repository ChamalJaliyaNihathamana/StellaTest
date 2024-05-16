"use client";
import { useChat } from "ai/react";
import { useState } from "react";

import CustomButton from "@/client/components/CustomButton";
import CustomTextField from "@/client/components/CustomTextField";
import { Box, CircularProgress, FormHelperText } from "@mui/material";
import CustomTextArea from "@/client/components/CustomTextArea";
import { celebrityStyleAnalysisPrompt } from "@/client/prompts/celebrityStyleAnalyzerPrompt";
import { ChatRequestOptions, Message } from "ai";

interface CelebrityStyleProps {}


const CelebrityStyle: React.FunctionComponent<CelebrityStyleProps> = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/gemini",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitWithLoading = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Construct the prompt using the current input
      const modifiedInput = celebrityStyleAnalysisPrompt(input); 
  
      // Add the message with the modified prompt to the messages array
      const newMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: modifiedInput,
      };
  
      // Directly append to the messages array before submitting
      messages.push(newMessage);
  
      // Submit with the updated messages
      await handleSubmit(e); 
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <h3 className="pt-20">Celebrity Style Analyzer</h3>{" "}
      <Box
        sx={{
          padding: 2,
          border: "2px solid",
          borderColor: "rgb(210,210,210)",
        }}
      >
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "100%" },
            "& .MuiButton-root": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmitWithLoading}
        >
          <div>
            <CustomTextField
              label={"Celebrity Name"}
              placeholder="Enter celebrity name"
              value={input}
              onChange={handleInputChange}
            />
            {loading ? (
              <CircularProgress />
            ) : (
              <CustomButton type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate"}
              </CustomButton>
            )}
            {error && <FormHelperText>{error}</FormHelperText>}
            {messages
              .filter((m) => m.role === "assistant") // Filter only AI messages
              .map((m) => (
                <CustomTextArea
                  showLabel={false}
                  key={m.id}
                  label="AI Response"
                  value={m.content}
                  sx={{ m: 1, width: "calc(100% - 16px)" }}
                />
              ))}
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default CelebrityStyle;