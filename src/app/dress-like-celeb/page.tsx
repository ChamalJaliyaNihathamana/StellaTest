// dress-like-celeb/page.tsx
"use client";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useChatManager } from "@/client/hooks/useChatManager";
import {
  setError,
  setLoading,
} from "@/lib/features/user-profile/userProfileSlice";
import { dressLikeCelebPrompt } from "@/client/prompts/dressLikeCelebPrompt";
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
  const { celebrityName, analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const { existingWardrobe } = useSelector(
    (state: RootState) => state.userProfile
  );
  const { messages, setInput, handleSubmit, isLoading, error } =
    useChatManager("/api/openai");

  const handleSubmitDressLike = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const modifiedInput = dressLikeCelebPrompt(
        celebrityName,
        analysisResults,
        existingWardrobe
      );
      setInput(modifiedInput);
      await handleSubmit(e);

      console.log("After calling handleSubmit");
    } catch (err: any) {
      console.error("Error in handleSubmitDressLike:", err);
      dispatch(setError(err.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
    }
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

export default DressLikeCeleb;
