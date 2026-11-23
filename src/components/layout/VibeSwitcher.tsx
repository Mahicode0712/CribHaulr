"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { VIBES, VIBE_LIST, VibeId } from "@/data/vibes";
import { cn } from "@/lib/utils";

export function VibeSwitcher({ compact = false }: { compact?: boolean }) {
  const { currentVibe, setVibe } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const activeVibe = VIBES[currentVibe] || VIBES.cozy;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] font-display font-bold text-xs shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--shadow-color)] transition-all cursor-pointer select-none",
          compact ? "h-9" : "h-10"
        )}
        aria-label="Change room aesthetic vibe"
        aria-expanded={isOpen}
      >
        <span className="text-base" role="img" aria-hidden="true">
          {activeVibe.emoji}
        </span>
        <span className="hidden sm:inline font-bold">Vibe:</span>
        <span className="text-[var(--accent)] font-extrabold capitalize">
          {activeVibe.name.split("/")[0].trim()}
        </span>
        <ChevronDown
          className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to dismiss */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-2 shadow-[6px_6px_0px_var(--shadow-color)] z-50 divide-y divide-[var(--border-color)]/10"
            >
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                <span>Select Room Vibe</span>
                <Sparkles className="w-3 h-3 text-[var(--accent)]" />
              </div>

              <div className="pt-1 space-y-1">
                {VIBE_LIST.map((v) => {
                  const isSelected = v.id === currentVibe;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setVibe(v.id as VibeId);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer",
                        isSelected
                          ? "bg-[var(--accent)] text-[var(--accent-text)] shadow-[2px_2px_0px_var(--shadow-color)]"
                          : "hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{v.emoji}</span>
                        <div>
                          <div className="font-display leading-tight">{v.name}</div>
                          <div className={cn("text-[10px] opacity-75 font-normal line-clamp-1", isSelected ? "text-[var(--accent-text)]" : "text-[var(--text-muted)]")}>
                            {v.moodKeywords.slice(0, 3).join(" • ")}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
