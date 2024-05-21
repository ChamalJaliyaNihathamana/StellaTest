// celebrity-style/page.tsx
"use client";
import { useState } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  setAnalysisResults,
  setCelebrityName,
  setError,
  setLoading,
} from "@/lib/features/celebrity-style/celebrityStyleSlice";
// modals
import { ChatRequestOptions, Message } from "ai";
// utils
import { combineStylePrompt } from "@/client/prompts/combineStylePrompt.";
import { celebrityStyleAnalysisPrompt } from "@/client/prompts/celebrityStyleAnalyzerPrompt";
// ui
import CustomButton from "@/client/components/CustomButton";
import CustomTextField from "@/client/components/CustomTextField";
import {
  Box,
  ButtonGroup,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import CustomTextArea from "@/client/components/CustomTextArea";
import { useChatContext } from "@/client/components/chatProvider";
import {
  cleanupResponse,
  parseJsonResponse,
} from "@/client/utils/cleanerHelpers";

interface CelebrityStyleProps {}

const CelebrityStyle: React.FunctionComponent<CelebrityStyleProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName, isLoading, error, analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );

  const { messages, input, handleInputChange, handleSubmit } = useChatContext();

  const [showInput, setShowInput] = useState(true);

  const handleSubmitWithLoading = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setCelebrityName(input));
    setShowInput(false);

    try {
      const apiEndpoints = [
        { name: "Gemini", endpoint: "/api/gemini" },
        { name: "Anthropic", endpoint: "/api/anthropic" },
        { name: "OpenAI", endpoint: "/api/openai" },
      ];

      const responses = await Promise.all(
        apiEndpoints.map(async ({ name, endpoint }) => {
          const modifiedPrompt = celebrityStyleAnalysisPrompt(input);
          const newMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: modifiedPrompt,
          };

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [...messages, newMessage],
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Request to ${endpoint} failed with status ${response.status}`
            );
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error(`No response body from ${endpoint}`);

          const decoder = new TextDecoder();
          let output = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            output += decoder.decode(value, { stream: true });
          }

          // clean up
          output = cleanupResponse(endpoint, output);
          let content = parseJsonResponse(output) || output; 

          if (content.trim()) {
            console.log(`${name} Response:\n${content.trim()}`);
          }

          return content.trim() || "";
        })
      );
      console.log("Parsed responses:", responses);

      const combinedPrompt = combineStylePrompt(input, responses);
      const newCombinedMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: combinedPrompt,
      };

      handleSubmit(e, {
        options: {
          body: { messages: [...messages, newCombinedMessage] },
        },
      });

      dispatch(setAnalysisResults(responses.join("\n\n")));
    } catch (error: any) {
      console.error("Error in handleSubmitWithLoading:", error);
      dispatch(setError(error.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
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
            {showInput ? (
              <CustomTextField
                label={"Celebrity Name"}
                placeholder="Enter celebrity name"
                value={input}
                onChange={handleInputChange}
              
              />
            ) : (
              <div>
                <CustomTextField
                  label={"Celebrity Name"}
                  value={celebrityName} 
                  readOnly={true}
                  onClick={() => setShowInput(true)}
                />
              </div>
            )}
            {isLoading ? (
              <CircularProgress />
            ) : (
              <ButtonGroup>
                <CustomButton type="submit" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate"}
                </CustomButton>
              </ButtonGroup>
            )}
            {error && <FormHelperText>{error}</FormHelperText>}
            {messages
              .filter((m) => m.role === "assistant") // filter only AI messages
              .map((m) => (
                <CustomTextArea
                  showLabel={false}
                  // defaultValue={analysisResults}
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
