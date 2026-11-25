"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { VIBES, VIBE_LIST } from "@/data/vibes";
import { cn } from "@/lib/utils";

export function VibeSwitcher() {
  const { currentVibe, setVibe } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeVibe = VIBES[currentVibe] || VIBES.cozy;

  return (
    <div
      className="relative inline-block text-left"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex h-11 items-center gap-2 px-3 rounded-card border-width-theme border-line bg-surface font-display font-bold text-xs sticker-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:sticker-shadow transition-all cursor-pointer select-none"
        )}
        aria-label="Change room aesthetic vibe"
        aria-expanded={isOpen}
        aria-controls="vibe-options"
      >
        <span className="text-base" role="img" aria-hidden="true">
          {activeVibe.emoji}
        </span>
        <span
          data-vibe={currentVibe}
          className="h-3 w-3 rounded-full bg-primary border-width-theme border-line"
          aria-hidden="true"
        />
        <span className="hidden sm:inline font-bold">Vibe:</span>
        <span className="text-ink font-extrabold capitalize">
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
              className="absolute right-0 mt-2 w-64 rounded-card bg-surface border-width-theme border-line p-2 sticker-shadow z-50 divide-y divide-line/10"
              id="vibe-options"
              role="group"
              aria-label="Room vibe options"
            >
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted flex items-center justify-between">
                <span>Select Room Vibe</span>
                <Sparkles className="w-3 h-3 text-accent" />
              </div>

              <div className="pt-1 space-y-1">
                {VIBE_LIST.map((v) => {
                  const isSelected = v.id === currentVibe;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setVibe(v.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-btn text-left text-xs font-bold transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary text-on-primary sticker-shadow"
                          : "text-ink hover:bg-secondary hover:text-on-secondary"
                      )}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          data-vibe={v.id}
                          className="h-3 w-3 shrink-0 rounded-full bg-primary border-width-theme border-line"
                          aria-hidden="true"
                        />
                        <span className="text-base">{v.emoji}</span>
                        <div>
                          <div className="font-display leading-tight">{v.name}</div>
                          <div className={cn("text-[10px] opacity-75 font-normal line-clamp-1", isSelected ? "text-on-accent" : "text-muted")}>
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
