"use client";

import React, { forwardRef } from "react";
import { Product, SpaceType, BudgetTier } from "@/types";
import { VibeId, VIBES } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

interface StoryCardProps {
  items: Product[];
  vibe: VibeId;
  space: SpaceType;
  budgetTier: BudgetTier;
  totalPrice: number;
  vibeScore: number;
  userName?: string;
  hostelRoom?: string;
}

export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  (
    {
      items,
      vibe,
      space,
      budgetTier,
      totalPrice,
      vibeScore,
      userName = "Student Haul",
      hostelRoom = "Hostel Block B",
    },
    ref
  ) => {
    const currentVibe = VIBES[vibe];

    return (
      <div
        ref={ref}
        style={{
          width: "360px",
          height: "640px",
          aspectRatio: "9 / 16",
        }}
        className="relative overflow-hidden rounded-[32px] border-4 border-[#2C221E] shadow-[8px_8px_0px_#2C221E] flex flex-col justify-between p-6 select-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
      >
        {/* Background Graphic Accents */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#2C221E 1.5px, transparent 1.5px), radial-gradient(#2C221E 1.5px, var(--bg-primary) 1.5px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-[var(--accent-text)] border-2 border-[#2C221E] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#2C221E]">
                📦
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-sm tracking-tight leading-none text-[#2C221E]">
                  Crib<span className="text-[var(--accent)]">Haulr</span>
                </span>
                <span className="text-[8px] font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  Dorm Box Lab
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--sticker-bg)] text-[var(--sticker-text)] border-2 border-[#2C221E] shadow-[1.5px_1.5px_0px_#2C221E] -rotate-2">
              {space.toUpperCase()} HAUL
            </span>
          </div>

          {/* User Name & Hostel Details */}
          <div className="bg-[var(--bg-card)] border-2 border-[#2C221E] rounded-2xl p-2.5 shadow-[2px_2px_0px_#2C221E] flex items-center justify-between">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)] block leading-none">
                CURATED FOR:
              </span>
              <span className="font-display font-black text-xs text-[var(--text-primary)] truncate max-w-[150px] block mt-0.5">
                {userName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)] block leading-none">
                ROOM TARGET:
              </span>
              <span className="font-mono font-bold text-[10px] text-[var(--accent)] block mt-0.5">
                {hostelRoom}
              </span>
            </div>
          </div>
        </div>

        {/* Center Vibe Hero & Score Stamp */}
        <div className="relative z-10 py-1 space-y-3 text-center">
          <div className="inline-block relative">
            <div className="px-4 py-1.5 rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] border-2 border-[#2C221E] shadow-[3px_3px_0px_#2C221E] font-display font-black text-base inline-flex items-center gap-1.5 rotate-1">
              <span>{currentVibe.emoji}</span>
              <span>{currentVibe.name.split("/")[0].trim()} Vibe</span>
            </div>
          </div>

          {/* Vibe Score Big Badge */}
          <div className="bg-[var(--bg-card)] border-3 border-[#2C221E] rounded-3xl p-3 shadow-[4px_4px_0px_#2C221E] mx-auto max-w-[280px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block">
              DORM AESTHETIC RATING
            </span>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-4xl font-black font-display text-[var(--accent)] leading-none">
                {vibeScore}
              </span>
              <span className="text-base font-bold text-[var(--text-muted)]">/ 100</span>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-primary)] block mt-1 line-clamp-1">
              {vibeScore >= 90
                ? "Certified Dorm Masterpiece 🔥"
                : vibeScore >= 75
                ? "Solid Drip 🤌 Super Cohesive"
                : "Getting There ✨ Nice Setup"}
            </span>
          </div>
        </div>

        {/* Box Contents List Manifest */}
        <div className="relative z-10 space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)] block pl-1">
            HAUL CONTENTS ({items.length} ITEMS):
          </span>

          <div className="space-y-1.5 bg-[var(--bg-card)] border-2 border-[#2C221E] rounded-2xl p-2.5 shadow-[3px_3px_0px_#2C221E]">
            {items.length === 0 ? (
              <span className="text-xs text-[var(--text-muted)] block py-2 text-center">
                Box is empty!
              </span>
            ) : (
              items.slice(0, 4).map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-[#2C221E]/15 last:border-0"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)]">
                      0{idx + 1}
                    </span>
                    <span className="font-display font-bold truncate max-w-[170px] text-[var(--text-primary)]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[11px] text-[var(--text-secondary)] shrink-0">
                    {formatINR(item.price)}
                  </span>
                </div>
              ))
            )}

            {items.length > 4 && (
              <div className="text-[10px] font-bold text-center text-[var(--accent)] pt-0.5">
                +{items.length - 4} more dorm essentials
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA & Price Banner */}
        <div className="relative z-10 pt-2 space-y-2">
          {/* Price & Tier Ribbon */}
          <div className="flex items-center justify-between px-2">
            <div>
              <span className="text-[8px] font-bold text-[var(--text-muted)] block">
                TOTAL BOX HAUL
              </span>
              <span className="text-xl font-black font-display text-[var(--text-primary)]">
                {formatINR(totalPrice)}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[#2C221E]">
              {formatINR(budgetTier)} TIER
            </span>
          </div>

          {/* Big CTA Strip */}
          <div className="bg-[#2C221E] text-white rounded-2xl py-2 px-3 text-center shadow-[3px_3px_0px_var(--accent)]">
            <span className="text-[9px] font-mono tracking-widest uppercase block text-[var(--sticker-bg)]">
              BUILD YOUR OWN AT
            </span>
            <span className="font-display font-black text-sm tracking-wide text-white">
              cribhaulr.in
            </span>
          </div>
        </div>
      </div>
    );
  }
);

StoryCard.displayName = "StoryCard";
