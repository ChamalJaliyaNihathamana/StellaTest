"use client";
import { useChat } from "ai/react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import CustomButton from "@/client/components/CustomButton";
import CustomTextField from "@/client/components/CustomTextField";
import {
  Box,
  ButtonGroup,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import CustomTextArea from "@/client/components/CustomTextArea";
import { celebrityStyleAnalysisPrompt } from "@/client/prompts/celebrityStyleAnalyzerPrompt";
import { ChatRequestOptions, Message } from "ai";
import { combineStylePrompt } from "@/client/prompts/combineStylePrompt.";
import { AppDispatch, RootState } from "@/lib/store";
import {
  setAnalysisResults,
  setCelebrityName,
  setError,
  setLoading,
} from "@/lib/features/celebrity-style/celebrityStyleSlice";

interface CelebrityStyleProps {}

const CelebrityStyle: React.FunctionComponent<CelebrityStyleProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName, isLoading, error, analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/gemini",
  });

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
      const apiEndpoints = ["/api/gemini", "/api/anthropic", "/api/openai"];
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
          output = output.replace(/\\n\d+:/g, "");

          return output; // Return the cleaned output
        })
      );

      console.log(responses);
      const combinedPrompt = combineStylePrompt(input, responses);
      const newCombinedMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: combinedPrompt,
      };

      handleSubmit(e, {
        options: {
          body: { messages: [...messages, newCombinedMessage] }, // Pass combined messages directly
        },
      });

      dispatch(setAnalysisResults(responses.join("\n\n")));
      dispatch(setLoading(false));
    } catch (err: any) {
      dispatch(setError(err.message || "Something went wrong"));
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
                value={input} // Use input from useChat
                onChange={handleInputChange}
              />
            ) : (
              <div>
                <CustomTextField
                  label={"Celebrity Name"}
                  value={celebrityName} // Use input from useChat
                  readOnly={true}
                  onFocus={() => setShowInput(false)}
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

                {/* <CustomButton onClick={() => setShowInput(true)}>
                  Change Celebrity
                </CustomButton> */}
              </ButtonGroup>
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
