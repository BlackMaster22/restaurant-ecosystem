import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const Button: React.FC<Props> = ({ variant = "primary", className, children, ...props }) => {
  const base = "px-4 py-2 rounded";
  const style = variant === "primary" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800";
  return (
    <button className={clsx(base, style, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;