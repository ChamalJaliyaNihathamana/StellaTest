import CustomButton from "@/client/components/CustomButton";
import CustomTextArea from "@/client/components/CustomTextArea";
import CustomTextField from "@/client/components/CustomTextField";
import { Box } from "@mui/material";

interface RecommendationOutfitOccasionProps {}

const RecommendationOutfitOccasion: React.FunctionComponent<
RecommendationOutfitOccasionProps
> = () => {
  return (
    <Box>
      <h3 className="pt-20">Outfit Recommendations for Occasion X</h3>

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
        >
          <div>
    
              <CustomTextField
              label={"Occasion"}
              placeholder="Enter occasion"
            />
              <CustomTextField
              label={"Celebrity Name"}
              placeholder="Enter celebrity name"
            />
            <CustomTextArea
              label={"Celebrity Style Data"}
              placeholder="Enter celebrity style data"
              sx={{
                m: 1,
                width: "calc(100% - 16px)",
              }}
            />
            <CustomTextArea
              label={"Existing Wardrobe"}
              placeholder="Enter existing wardrobe"
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

export default RecommendationOutfitOccasion;
