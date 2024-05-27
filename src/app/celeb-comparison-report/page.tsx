// celeb-comparison-report/page.tsx
"use client";
// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
// utils
import { celebrityComparisonPrompt } from "@/client/prompts/celebrityComparisonPrompt";
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
import { useChatManager } from "@/client/hooks/useChatManager";

interface CelebComparisonReportProps {}

const CelebComparisonReport: React.FunctionComponent<
  CelebComparisonReportProps
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

  const handleSubmitComparison = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const modifiedInput = celebrityComparisonPrompt(
        celebrityName,
        analysisResults,
        existingWardrobe
      );
      setInput(modifiedInput);
      await handleSubmit(e);

      console.log("After calling handleSubmit");
    } catch (err: any) {
      console.error("Error in handleSubmitDressLike:", err);
    } finally {
    }
  };

  return (
    <Box>
      <h3 className="pt-20">Celeb Comparison Report</h3>

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
            "& .MuiButton-root": { m: 1, width: "auto" },
          }}
          onSubmit={handleSubmitComparison}
          noValidate
          autoComplete="off"
        >
          <div>
            <CustomTextField
              label={"Celebrity Name"}
              placeholder="Enter celebrity name"
              value={celebrityName}
            />
            <CustomTextArea
              label={"Celebrity Style Data"}
              placeholder="Enter celebrity style data"
              value={analysisResults}
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

export default CelebComparisonReport;
