"use client";
import { useChat } from "ai/react";
import { useState } from "react";

import CustomButton from "@/client/components/CustomButton";
import CustomTextField from "@/client/components/CustomTextField";
import { Box, CircularProgress, FormHelperText } from "@mui/material";
import CustomTextArea from "@/client/components/CustomTextArea";
import { celebrityStyleAnalysisPrompt } from "@/client/prompts/celebrityStyleAnalyzerPrompt";
import { ChatRequestOptions, Message } from "ai";
import { combineStylePrompt } from "@/client/prompts/combineStylePrompt.";

interface CelebrityStyleProps {}


const CelebrityStyle: React.FunctionComponent<CelebrityStyleProps> = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/gemini",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [llmOutputs, setLlmOutputs] = useState<string[]>([]);

  const handleSubmitWithLoading = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const apiEndpoints = ["/api/gemini",  "/api/openai" ,"/api/anthropic"];
      const responses = await Promise.all(
        apiEndpoints.map(async (endpoint) => {
          const modifiedPrompt = celebrityStyleAnalysisPrompt(input);
          const newMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: modifiedPrompt,
          };
  
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [...messages, newMessage] }),
          });
  
          if (!response.ok) {
            throw new Error(`Request to ${endpoint} failed`);
          }
  
          const reader = response.body?.getReader();
          if (!reader) throw new Error("No response body");
  
          const decoder = new TextDecoder();
          let output = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            output += decoder.decode(value, { stream: true });
          }
          output = output.replace(/\\n\d+:/g, ''); 

          return output; // Return the cleaned output
        })
      );
  
      setLlmOutputs(responses); // Set all outputs to state
      console.log(responses)
      await combineAndSubmitToOpenAI(input, responses);
  
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const combineAndSubmitToOpenAI = async (celebrityName: string, outputs: string[]) => {
    const combinedPrompt = combineStylePrompt(celebrityName, outputs);

    try {

      const newMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: combinedPrompt,
      };


      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error("OpenAI request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let aiResponse = "";

      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;

      //   const chunk = decoder.decode(value, { stream: true });
      //   aiResponse += chunk;
      //   setAiResponse(aiResponse);
      // }

      // Update messages with the combined response
      // await handleSubmit(e);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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