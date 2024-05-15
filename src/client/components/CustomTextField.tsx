"use client"
import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

// Define your custom styling
const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'gray', 
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'blue', 
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: 'blue',
    },
    '&.Mui-focused fieldset': {
        borderColor: 'blue',
    },
  },
});

interface CustomTextFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Add more props as needed (e.g., error, helperText, variant, etc.)
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  ...rest
}) => {
  return (

    
    <StyledTextField 
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest} // Pass any other props directly to the underlying TextField
    />
  );
};

export default CustomTextField;