"use client";
import React, { useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled, InputLabel, SxProps } from "@mui/material";

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  multiline: true,
  padding: theme.spacing(1),
  fontSize: theme.typography.body1.fontSize,
  border: "1px solid gray",
  borderRadius: theme.shape.borderRadius,
  resize: "vertical",
  "&:focus": {
    outline: "none",
    border: "1px solid blue",
    borderColor: "blue",
  },
  "&:hover ": {
    borderColor: "blue",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "& textarea": {
    resize: "vertical",
    paddingTop: theme.spacing(2),
    "&::placeholder": {
      color: "rgba(0, 0, 0, 0.54)",
    },
  },
}));

interface CustomTextAreaProps {
  label: string;
  showLabel?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number; // Number of initial rows
  maxRows?: number; // Maximum number of rows // ... other props you want to pass down
}
const CustomTextArea: React.FC<CustomTextAreaProps & { sx?: SxProps }> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxRows,
  showLabel = true,
  sx,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setHasValue(!!value);
  };

  return (
    <div style={{ position: "relative" }}>
      {showLabel ? (
        <InputLabel
          htmlFor="custom-textarea"
          sx={{
            position: "absolute",
            top: isFocused || hasValue ? "-8px" : "16px",
            left: "16px",
            backgroundColor: "white",
            padding: "4px 8px",
            zIndex: 1,
            transition: "top 200ms ease-in-out",
            fontSize: isFocused || hasValue ? "12px" : "16px",
          }}
        >
          {label}
        </InputLabel>
      ) : null}

      <StyledTextarea
        id="custom-textarea"
        aria-label={label}
        value={value}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          if (onChange) onChange(e);
        }}
        placeholder={isFocused || hasValue ? placeholder : null}
        minRows={rows}
        maxRows={maxRows}
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={sx} // Apply sx prop here
        {...rest}
      />
    </div>
  );
};

export default CustomTextArea;
