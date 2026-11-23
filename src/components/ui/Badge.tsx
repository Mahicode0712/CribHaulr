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
    default:
      "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-color)]",
    accent:
      "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)]",
    success:
      "bg-emerald-100 text-emerald-900 border-[var(--border-color)]",
    warning:
      "bg-amber-100 text-amber-900 border-[var(--border-color)]",
    outline:
      "bg-transparent text-[var(--text-primary)] border-[var(--border-color)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display uppercase tracking-wider border-2 shadow-[1.5px_1.5px_0px_var(--shadow-color)]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
