import React from "react";
import Button from "@mui/material/Button";

interface CustomButtonProps {
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  color?:
    | "primary"
    | "secondary"
    | "inherit"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  icon?: React.ReactElement;
  className?: string;
  type?: "button" | "reset" | "submit";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant,
  color,
  onClick,
  size,
  disabled,
  icon,
  className,
  type,
  ...otherProps
}) => {
  return (
    <Button
      variant={variant || "contained"}
      color={color || "primary"}
      onClick={onClick}
      size={size || "medium"}
      disabled={disabled}
      className={className}
      type={type || "button"}
      {...otherProps}
    >
      {icon ? <span className="button-icon">{icon}</span> : null}
      {children}
    </Button>
  );
};

export default CustomButton;
