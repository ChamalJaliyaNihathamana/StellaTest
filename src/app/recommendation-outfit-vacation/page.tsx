// recommendation-outfit-vacation
"use client";
import { useEffect } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_DATA_TYPE } from "@/lib/features/fashion-insights/fashionInsightsSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { setVacation } from "@/lib/features/user-profile/userProfileSlice";
// hooks
import { useChatManager } from "@/client/hooks/useChatManager";
// model
import { FashionInsightDataType } from "@/enums/fashion-insights-enum";
// utils
import { recommendOutfitVacationPrompt } from "@/client/prompts/recommendOutfitVacationPrompt";
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

interface RecommendationOutfitVacationProps {}

const RecommendationOutfitVacation: React.FunctionComponent<
  RecommendationOutfitVacationProps
> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const { existingWardrobe, vacation } = useSelector(
    (state: RootState) => state.userProfile
  );
  const celebrityStyleData = useSelector(
    (state: RootState) =>
      state.fashionInsights.data[FashionInsightDataType.CELEBRITY_STYLE_DATA]
  );
  const { messages, setInput, handleSubmit, error, isLoading } =
    useChatManager("/api/openai");

  useEffect(() => {
    const modifiedInput = recommendOutfitVacationPrompt(
      celebrityName,
      celebrityStyleData,
      existingWardrobe,
      vacation
    );
    setInput(modifiedInput);
  }, [celebrityStyleData, celebrityName, existingWardrobe, setInput, vacation]);

  const handleSubmitVacation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      SET_CURRENT_DATA_TYPE(
        FashionInsightDataType.OUTFIT_RECOMMENDATION_VACATION
      )
    );
    handleSubmit(e);
  };

  const handleVacationInputBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    dispatch(setVacation(event.target.value));
  };
  return (
    <Box>
      <h3 className="pt-20">Outfit Recommendations for Vacation</h3>

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
          onSubmit={handleSubmitVacation}
        >
          <div>
            <CustomTextField
              label={"Vacation Destination"}
              placeholder="Enter Vacation Destination"
              onBlur={handleVacationInputBlur}
              defaultValue={vacation}
            />
            <CustomTextField
              label={"Celebrity Name"}
              placeholder="Enter celebrity name"
              value={celebrityName}
            />
            <CustomTextArea
              label={"Celebrity Style Data"}
              placeholder="Enter celebrity style data"
              value={celebrityStyleData}
              sx={{
                m: 1,
                width: "calc(100% - 16px)",
              }}
            />
            <CustomTextArea
              label={"Existing Wardrobe"}
              placeholder="Enter existing wardrobe"
              value={existingWardrobe}
              sx={{
                m: 1,
                width: "calc(100% - 16px)",
              }}
            />
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

export default RecommendationOutfitVacation;
