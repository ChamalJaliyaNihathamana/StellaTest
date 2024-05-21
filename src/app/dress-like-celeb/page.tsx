// dress-like-celeb/page.tsx
"use client";
import { useChat } from "ai/react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
// utils
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
import {
  setError,
  setLoading,
} from "@/lib/features/user-profile/userProfileSlice";
import { dressLikeCelebPrompt } from "@/client/prompts/dressLikeCelebPrompt";
import { Message } from "ai";
import { useChatContext } from "@/client/components/chatProvider";

interface DressLikeCelebProps {}

const DressLikeCeleb: React.FunctionComponent<DressLikeCelebProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName, analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const { existingWardrobe, isLoading, error } = useSelector(
    (state: RootState) => state.userProfile
  );

  const { messages:dressLikeMessages, handleSubmit:dressLikeHandleSubmit } = useChatContext();

  const handleSubmitDressLike = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log("handleSubmitWithLoading called");
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      console.log("inside try")
      // Construct the prompt using the current input
      const modifiedInput = dressLikeCelebPrompt(
        celebrityName,
        analysisResults,
        existingWardrobe
      );
      const newCombinedMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: modifiedInput,
      };
      console.log(newCombinedMessage)
      dressLikeHandleSubmit("dress-like-celeb-chat",e, {
        options: {
          body: { messages: [...dressLikeMessages, newCombinedMessage] }, // Pass combined messages directly
        },
      });
   
    } catch (err: any) {
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
              sx={{
                m: 1,
                width: "calc(100% - 16px)",
              }}
            />
            <CustomTextArea
              label={"Existing Wardrobe"}
              value={existingWardrobe}
              placeholder="Enter existing wardrobe"
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
            {dressLikeMessages
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

export default DressLikeCeleb;
