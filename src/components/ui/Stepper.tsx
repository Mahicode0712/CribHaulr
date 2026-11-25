"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  label: string;
  sublabel?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStepIndex,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <nav
      aria-label="Progress Stepper"
      className={cn("w-full py-2 select-none", className)}
    >
      <ol className="flex items-center justify-between w-full relative">
        {/* Connecting track line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-deep/70 z-0 mx-6 sm:mx-10" />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;
          const canClick = isCompleted && onStepClick;

          return (
            <li
              key={step.id}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <button
                type="button"
                disabled={!canClick}
                onClick={() => canClick && onStepClick(idx)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${isCompleted ? "Go back to" : "Step"} ${idx + 1}: ${step.label}`}
                className={cn(
                  "w-11 h-11 sm:w-12 sm:h-12 rounded-card flex items-center justify-center font-display font-extrabold text-xs sm:text-sm border-width-theme transition-all duration-200",
                  isCurrent &&
                    "bg-accent text-on-accent border-line sticker-shadow scale-110",
                  isCompleted &&
                    "bg-accent text-on-accent border-line sticker-shadow cursor-pointer hover:scale-105",
                  isUpcoming &&
                    "bg-surface text-muted border-line/40 shadow-none"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>

              <div className="mt-2 text-center max-w-[80px] sm:max-w-[120px]">
                <span
                  className={cn(
                    "block text-[11px] sm:text-xs font-display font-bold truncate leading-tight",
                    isCurrent && "text-ink",
                    isCompleted && "text-ink",
                    isUpcoming && "text-muted"
                  )}
                >
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className="hidden sm:block text-[9px] text-muted font-medium truncate mt-0.5">
                    {step.sublabel}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
