"use client";
import { useChatContext } from "@/client/components/chatProvider";
// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { setProfession } from "@/lib/features/user-profile/userProfileSlice";
// utils
// ui
import CustomButton from "@/client/components/CustomButton";
import CustomTextArea from "@/client/components/CustomTextArea";
import CustomTextField from "@/client/components/CustomTextField";
import { Box } from "@mui/material";

interface CapsuleProfessionProps {}

const CapsuleProfession: React.FunctionComponent<
  CapsuleProfessionProps
> = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { celebrityName,  analysisResults } = useSelector(
    (state: RootState) => state.celebrityStyle
  );
  const {existingWardrobe ,profession} = useSelector(
    (state: RootState) => state.userProfile
  );

  const { messages, input, handleInputChange, handleSubmit } = useChatContext();
  

  const handleProfessionInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
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
            <CustomButton>Generate</CustomButton>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default CapsuleProfession;
