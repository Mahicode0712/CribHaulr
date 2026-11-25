"use client";

import React from "react";
import { Check } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { VIBE_LIST, type VibeId } from "@/data/vibes";

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
          <h2 className="text-xl sm:text-2xl font-black font-display text-ink">
            Step 2: Pick Your Aesthetic Vibe
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium">
            Tap a card to preview how your entire box & room will transform.
          </p>
        </div>
        <Sticker color="vibe" tilt="right">
          🎨 STEP 2 / 5
        </Sticker>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIBE_LIST.map((vibe) => {
          const isSelected = selectedVibe === vibe.id;

          return (
            <button
              type="button"
              aria-pressed={isSelected}
              data-vibe={vibe.id}
              key={vibe.id}
              onClick={() => onSelectVibe(vibe.id)}
              className={`vibe-picker-card p-6 rounded-card border-width-theme transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden group text-left ${
                isSelected
                  ? "bg-primary text-on-primary border-line sticker-shadow -translate-y-1"
                  : "bg-bg text-ink border-line sticker-shadow hover:-translate-y-0.5 hover:sticker-shadow"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-4xl p-2.5 rounded-card bg-secondary text-on-secondary border-width-theme border-line sticker-shadow">
                    {vibe.emoji}
                  </span>

                  {isSelected ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-surface text-ink border-width-theme border-line sticker-shadow flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                      <span>Active Vibe</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-btn bg-secondary text-on-secondary border-width-theme border-line/30">
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
                    isSelected ? "text-on-primary" : "text-ink"
                    }`}
                  >
                    {vibe.tagline}
                  </p>
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      isSelected ? "text-on-primary" : "text-muted"
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
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-btn border ${
                        isSelected
                          ? "bg-surface text-ink border-current/30"
                          : "bg-secondary text-on-secondary border-line/30"
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
                  <span className="w-4 h-4 rounded-full border-width-theme border-line sticker-shadow inline-block bg-bg" title="Background" />
                  <span className="w-4 h-4 rounded-full border-width-theme border-line sticker-shadow inline-block bg-primary" title="Primary" />
                  <span className="w-4 h-4 rounded-full border-width-theme border-line sticker-shadow inline-block bg-accent" title="Accent" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
