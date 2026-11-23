"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "vibe";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-display font-bold border-2 rounded-2xl select-none cursor-pointer transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-[var(--accent-hover)]",
      secondary:
        "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-[var(--bg-card)]",
      vibe:
        "bg-[var(--sticker-bg)] text-[var(--sticker-text)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]",
      outline:
        "bg-transparent text-[var(--text-primary)] border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] hover:bg-[var(--bg-secondary)]",
      ghost:
        "bg-transparent text-[var(--text-primary)] border-transparent hover:bg-[var(--bg-secondary)]",
      danger:
        "bg-rose-500 text-white border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-rose-600",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs tracking-wide",
      md: "h-11 px-5 text-sm tracking-wide min-h-[44px]",
      lg: "h-13 px-7 text-base tracking-wide min-h-[48px]",
      icon: "h-11 w-11 p-0 min-h-[44px] min-w-[44px]",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.96, y: disabled ? 0 : 2, x: disabled ? 0 : 2 }}
        whileHover={{ y: disabled ? 0 : -1, x: disabled ? 0 : -1 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Hold on...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
