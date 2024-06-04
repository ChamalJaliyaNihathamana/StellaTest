// celebrity-style/page.tsx
"use client";
import { useState } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { setCelebrityName } from "@/lib/features/celebrity-style/celebrityStyleSlice";
import { SET_CURRENT_DATA_TYPE } from "@/lib/features/fashion-insights/fashionInsightsSlice";
// models
import { Message } from "ai";
import { FashionInsightDataType } from "@/enums/fashion-insights-enum";
// hooks
import { useChatManager } from "@/client/hooks/useChatManager";
// utils
import { combineStylePrompt } from "@/client/prompts/combineStylePrompt.";
import { celebrityStyleAnalysisPrompt } from "@/client/prompts/celebrityStyleAnalyzerPrompt";
import {
  cleanupResponse,
  parseJsonResponse,
} from "@/client/utils/cleanerHelpers";
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



const CelebrityStyle: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { celebrityName } = useSelector(
    (state: RootState) => state.celebrityStyle
  );

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChatManager("/api/openai");
  const [showInput, setShowInput] = useState(true);
  const [LLMPipeLoading, setLLMPipeLoading] = useState(false);

  const handleSubmitWithLoading = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    dispatch(setCelebrityName(input));
    setShowInput(false);

    try {
      setLLMPipeLoading(true);
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
      dispatch(
        SET_CURRENT_DATA_TYPE(FashionInsightDataType.CELEBRITY_STYLE_DATA)
      );
      handleSubmit(e, {
        options: {
          body: {
            messages: [...messages, newCombinedMessage],
          },
        },
      });
    } catch (error: any) {
      console.error("Error in handleSubmitWithLoading:", error);
    } finally {
      setLLMPipeLoading(false);
    }
  };

  return (
    <Box>
      <h3 className="pt-20">Celebrity Style Analyzer</h3>
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
                  readOnly
                  onClick={() => setShowInput(true)}
                />
              </div>
            )}
            {isLoading || LLMPipeLoading ? (
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
              .filter((m) => m.role === "assistant")
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
