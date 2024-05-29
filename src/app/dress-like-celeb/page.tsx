// dress-like-celeb/page.tsx
"use client";
import { useEffect } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_DATA_TYPE } from "@/lib/features/fashion-insights/fashionInsightsSlice";
import { AppDispatch, RootState } from "@/lib/store";
// hooks
import { useChatManager } from "@/client/hooks/useChatManager";
// utils
import { dressLikeCelebPrompt } from "@/client/prompts/dressLikeCelebPrompt";
// model
import { FashionInsightDataType } from "@/enums/fashion-insights-enum";
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

const DressLikeCeleb: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const celebrityStyleData = useSelector(
    (state: RootState) =>
      state.fashionInsights.data[FashionInsightDataType.CELEBRITY_STYLE_DATA]
  );
  const { existingWardrobe } = useSelector(
    (state: RootState) => state.userProfile
  );

  const { messages, setInput, handleSubmit, isLoading, error } =
    useChatManager("/api/openai");

  useEffect(() => {
    const modifiedInput = dressLikeCelebPrompt(
      celebrityName,
      celebrityStyleData,
      existingWardrobe
    );
    setInput(modifiedInput);
  }, [celebrityStyleData, celebrityName, existingWardrobe, setInput]);

  const handleSubmitDressLike = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(SET_CURRENT_DATA_TYPE(FashionInsightDataType.WAYS_TO_DRESS_LIKE));
    handleSubmit(e);
  };

  return (
    <Box>
      <h3 className="pt-20">8 Ways to Dress like Celeb X</h3>
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
          onSubmit={handleSubmitDressLike}
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
              value={celebrityStyleData}
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

export default DressLikeCeleb;
