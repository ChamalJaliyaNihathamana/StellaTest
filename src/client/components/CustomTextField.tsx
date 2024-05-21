"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

// Define your custom styling
const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "gray",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "blue",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "blue",
    },
    "&.Mui-focused fieldset": {
      borderColor: "blue",
    },
  },
});

interface CustomTextFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  defaultValue?: string;
  // Add more props as needed (e.g., error, helperText, variant, etc.)
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  onClick,
  placeholder,
  readOnly = false,
  onFocus,
  onBlur,
  defaultValue,
  ...rest
}) => {
  return (
    <StyledTextField
      label={label}
      value={value}
      onChange={onChange}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      defaultValue={defaultValue}
      placeholder={placeholder}
      inputProps={{ readOnly: readOnly ,'aria-readonly': readOnly }}
      {...rest} // Pass any other props directly to the underlying TextField
    />
  );
};

export default CustomTextField;
