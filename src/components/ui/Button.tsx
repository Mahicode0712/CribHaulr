"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center font-display font-bold border-theme rounded-btn select-none cursor-pointer transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

const variantStyles = {
  primary:
    "bg-primary text-on-primary sticker-shadow hover:bg-secondary hover:text-on-secondary",
  secondary:
    "bg-secondary text-on-secondary sticker-shadow hover:bg-surface hover:text-ink",
  vibe:
    "bg-accent text-on-accent sticker-shadow",
  outline:
    "bg-transparent text-ink border-theme sticker-shadow hover:bg-secondary hover:text-on-secondary",
  ghost:
    "bg-transparent text-ink border-theme sticker-shadow hover:bg-secondary hover:text-on-secondary",
  danger:
    "bg-primary text-on-primary border-theme sticker-shadow hover:bg-secondary hover:text-on-secondary",
};

const sizeStyles = {
  sm: "h-11 min-h-[44px] px-3 text-xs tracking-wide",
  md: "h-11 px-5 text-sm tracking-wide min-h-[44px]",
  lg: "h-13 px-7 text-base tracking-wide min-h-[48px]",
  icon: "h-11 w-11 p-0 min-h-[44px] min-w-[44px]",
};

type ButtonVariant = keyof typeof variantStyles;
type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export interface ButtonLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "className"> {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5",
        className
      )}
    />
  );
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
