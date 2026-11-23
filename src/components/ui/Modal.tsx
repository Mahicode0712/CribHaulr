"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={cn(
              "relative w-full max-w-lg bg-[var(--bg-card)] border-3 border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_var(--shadow-color)] z-10 my-auto",
              className
            )}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-[var(--accent-text)] transition-colors shadow-[2px_2px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {title && (
              <div className="mb-4 pr-10">
                <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
                    {description}
                  </p>
                )}
              </div>
            )}

            <div className="mt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
