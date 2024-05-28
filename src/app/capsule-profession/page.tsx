// capsule-profession
"use client";
import { useEffect } from "react";
import { useChatManager } from "@/client/hooks/useChatManager";
// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { setProfession } from "@/lib/features/user-profile/userProfileSlice";
// utils
import { capsuleCollectionPrompt } from "@/client/prompts/capsuleCollectionPrompt";
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

interface CapsuleProfessionProps {}

const CapsuleProfession: React.FunctionComponent<
  CapsuleProfessionProps
> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName, analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const { existingWardrobe, profession } = useSelector(
    (state: RootState) => state.userProfile
  );

  const { messages, setInput, handleSubmit, error, isLoading } =
    useChatManager("/api/openai");

  useEffect(() => {
    const modifiedInput = capsuleCollectionPrompt(
      celebrityName,
      analysisResults,
      existingWardrobe,
      profession
    );
    setInput(modifiedInput);
  }, [analysisResults, celebrityName, existingWardrobe, setInput, profession]);

  const handleSubmitCapsule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  const handleProfessionInputBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    dispatch(setProfession(event.target.value));
  };

  return (
    <Box>
      <h3 className="pt-20">Capsule for Profession X</h3>

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
          noValidate
          autoComplete="off"
          onSubmit={handleSubmitCapsule}
        >
          <div>
            <CustomTextField
              label={"Profession"}
              placeholder="Enter profession name"
              onBlur={handleProfessionInputBlur}
              defaultValue={profession}
            />
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

export default CapsuleProfession;
