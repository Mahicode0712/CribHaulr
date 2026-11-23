"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { VibeId, VIBE_LIST } from "@/data/vibes";

interface StepVibePickerProps {
  selectedVibe: VibeId;
  onSelectVibe: (vibe: VibeId) => void;
}

export function StepVibePicker({
  selectedVibe,
  onSelectVibe,
}: StepVibePickerProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
            Step 3: Pick Your Aesthetic Vibe
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            Tap a card to preview how your entire box & room will transform.
          </p>
        </div>
        <Sticker color="vibe" tilt="right">
          🎨 STEP 2 / 4
        </Sticker>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIBE_LIST.map((vibe) => {
          const isSelected = selectedVibe === vibe.id;

          return (
            <div
              key={vibe.id}
              onClick={() => onSelectVibe(vibe.id)}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] -translate-y-1"
                  : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--shadow-color)]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-4xl p-2.5 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">
                    {vibe.emoji}
                  </span>

                  {isSelected ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>Active Vibe</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]/30">
                      Tap to Apply
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-display font-black text-xl leading-tight">
                    {vibe.name}
                  </h3>
                  <p
                    className={`text-xs font-bold mt-1 ${
                      isSelected ? "text-[var(--accent-text)]/90" : "text-[var(--accent)]"
                    }`}
                  >
                    {vibe.tagline}
                  </p>
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      isSelected ? "text-[var(--accent-text)]/90" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {vibe.description}
                  </p>
                </div>

                {/* Mood Keywords */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {vibe.moodKeywords.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? "bg-[var(--bg-card)]/20 text-[var(--accent-text)] border-current/30"
                          : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]/30"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="mt-5 pt-3 border-t border-current/20 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                  Palette Swatch:
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black shadow-xs inline-block"
                    style={{ backgroundColor: vibe.palette.bg }}
                    title="Background"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black shadow-xs inline-block"
                    style={{ backgroundColor: vibe.palette.accent }}
                    title="Accent"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black shadow-xs inline-block"
                    style={{ backgroundColor: vibe.palette.stickerBg }}
                    title="Sticker"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
