// recommendation-accessory
"use client";
import { useEffect } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
// hooks
import { useChatManager } from "@/client/hooks/useChatManager";
// utils
import { recommendNewAccessoryPrompt } from "@/client/prompts/recommendNewAccessoryPrompt";
// ui
import CustomButton from "@/client/components/CustomButton";
import CustomTextArea from "@/client/components/CustomTextArea";
import CustomTextField from "@/client/components/CustomTextField";
import {
  Box,
  ButtonGroup,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

interface RecommendationAccessoryProps {}

const RecommendationAccessory: React.FunctionComponent<
  RecommendationAccessoryProps
> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName, analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const { existingWardrobe } = useSelector(
    (state: RootState) => state.userProfile
  );
  const { messages, setInput, handleSubmit, isLoading, error } =
    useChatManager("/api/openai");

  useEffect(() => {
    const modifiedInput = recommendNewAccessoryPrompt(
      celebrityName,
      analysisResults,
      existingWardrobe
    );
    setInput(modifiedInput);
  }, [analysisResults, celebrityName, existingWardrobe, setInput]);

  const handleSubmitRecommendationAccessory = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await handleSubmit(e);
  };

  return (
    <Box>
      <h3 className="pt-20">Accessory Recommendations</h3>

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
            "& .MuiTextField-root": {
              m: 1,
              width: "100%",
            },
            "& .MuiTextareaAutosize-root": {
              m: 1,
              width: "calc(100% - 16px)",
            },
            "& .MuiButton-root": { m: 1, width: "auto" }, // Auto-width for button
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmitRecommendationAccessory}
        >
          <div>
            <CustomTextField
              label={"Celebrity Name"}
              value={celebrityName}
              readOnly={true}
            />
            <CustomTextArea
              label={"Celebrity Style Data"}
              placeholder="Enter celebrity style data"
              value={analysisResults}
              sx={{ m: 1, width: "calc(100% - 16px)" }}
            />
            <CustomTextArea
              label={"Existing Wardrobe"}
              value={existingWardrobe}
              placeholder="Enter existing wardrobe"
              sx={{ m: 1, width: "calc(100% - 16px)" }}
            />
            {/* <CustomTextArea
              label={"Prompt"}
              placeholder="8 Ways to Dress like Celeb X"
              value={input}
              onChange={handleInputChange}
              sx={{ m: 1, width: "calc(100% - 16px)" }}
              hidden={true}
            /> */}
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
              .filter((m) => m.role === "assistant")
              .map((m) => (
                <CustomTextArea
                  key={m.id}
                  showLabel={false}
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

export default RecommendationAccessory;
