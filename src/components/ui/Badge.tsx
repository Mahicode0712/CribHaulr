import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-secondary text-on-secondary",
    accent: "bg-accent text-on-accent",
    success: "bg-primary text-on-primary",
    warning: "bg-accent text-on-accent",
    outline: "bg-transparent text-ink",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display uppercase tracking-wider border-theme sticker-shadow",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
