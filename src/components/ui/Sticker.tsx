"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StickerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  tilt?: "left" | "right" | "none";
  color?: "yellow" | "pink" | "cyan" | "green" | "vibe";
}

export function Sticker({
  className,
  tilt = "left",
  color = "vibe",
  children,
  ...props
}: StickerProps) {
  const tiltClasses = {
    left: "-rotate-2 hover:rotate-0",
    right: "rotate-3 hover:rotate-0",
    none: "rotate-0",
  };

  const colorStyles = {
    vibe: "bg-[var(--sticker-bg)] text-[var(--sticker-text)]",
    yellow: "bg-[#FFF07C] text-[#2C221E]",
    pink: "bg-[#FFB7D5] text-[#2C221E]",
    cyan: "bg-[#7CEFFF] text-[#0D0F18]",
    green: "bg-[#A7FF83] text-[#0D0F18]",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[var(--border-color)] font-display font-extrabold text-xs shadow-[2px_2px_0px_var(--shadow-color)] select-none cursor-default transition-transform duration-150",
        tiltClasses[tilt],
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
