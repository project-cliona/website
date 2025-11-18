import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline" | "custom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-black-700",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300",
    custom: "",  // No predefined styles for custom variant
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
