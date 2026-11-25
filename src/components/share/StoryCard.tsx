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
        data-vibe={vibe}
        style={{
          width: "360px",
          height: "640px",
          aspectRatio: "9 / 16",
        }}
        className="relative overflow-hidden rounded-card border-theme sticker-shadow flex flex-col justify-between p-6 select-none bg-bg text-ink"
      >
        {/* Background Graphic Accents */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(var(--border) 1.5px, transparent 1.5px), radial-gradient(var(--border) 1.5px, var(--bg) 1.5px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-btn bg-accent text-on-accent border-theme sticker-shadow flex items-center justify-center font-black text-sm">
                📦
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-sm tracking-tight leading-none text-ink">
                  Crib<span className="text-ink">Haulr</span>
                </span>
                <span className="text-[8px] font-bold tracking-wider text-muted uppercase">
                  Dorm Box Lab
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent text-on-accent border-theme sticker-shadow -rotate-2">
              {space.toUpperCase()} HAUL
            </span>
          </div>

          {/* User Name & Hostel Details */}
          <div className="bg-surface border-theme rounded-card p-2.5 sticker-shadow flex items-center justify-between">
            <div>
              <span className="text-[8px] font-body uppercase tracking-wider text-muted block leading-none">
                CURATED FOR:
              </span>
              <span className="font-display font-black text-xs text-ink truncate max-w-[150px] block mt-0.5">
                {userName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-body uppercase tracking-wider text-muted block leading-none">
                ROOM TARGET:
              </span>
              <span className="font-body font-bold text-[10px] text-ink block mt-0.5">
                {hostelRoom}
              </span>
            </div>
          </div>
        </div>

        {/* Center Vibe Hero & Score Stamp */}
        <div className="relative z-10 py-1 space-y-3 text-center">
          <div className="inline-block relative">
            <div className="px-4 py-1.5 rounded-card bg-accent text-on-accent border-theme sticker-shadow font-display font-black text-base inline-flex items-center gap-1.5 rotate-1">
              <span>{currentVibe.emoji}</span>
              <span>{currentVibe.name.split("/")[0].trim()} Vibe</span>
            </div>
          </div>

          {/* Vibe Score Big Badge */}
          <div className="bg-surface border-theme rounded-card p-3 sticker-shadow mx-auto max-w-[280px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted block">
              DORM AESTHETIC RATING
            </span>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-4xl font-black font-display text-ink leading-none">
                {vibeScore}
              </span>
              <span className="text-base font-bold text-muted">/ 100</span>
            </div>
            <span className="text-[10px] font-bold text-ink block mt-1 line-clamp-1">
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
          <span className="text-[9px] font-black uppercase tracking-wider text-muted block pl-1">
            HAUL CONTENTS ({items.length} ITEMS):
          </span>

          <div className="space-y-1.5 bg-surface border-theme rounded-card p-2.5 sticker-shadow">
            {items.length === 0 ? (
              <span className="text-xs text-muted block py-2 text-center">
                Box is empty!
              </span>
            ) : (
              items.slice(0, 4).map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1 border-b-width-theme border-line/15 last:border-0"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-body font-bold text-ink">
                      0{idx + 1}
                    </span>
                    <span className="font-display font-bold truncate max-w-[170px] text-ink">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-body font-bold text-[11px] text-muted shrink-0">
                    {formatINR(item.price)}
                  </span>
                </div>
              ))
            )}

            {items.length > 4 && (
              <div className="text-[10px] font-bold text-center text-ink pt-0.5">
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
              <span className="text-[8px] font-bold text-muted block">
                TOTAL BOX HAUL
              </span>
              <span className="theme-price text-xl font-black font-display text-ink">
                {formatINR(totalPrice)}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-accent text-on-accent border-width-theme border-line">
              {formatINR(budgetTier)} TIER
            </span>
          </div>

          {/* Big CTA Strip */}
          <div className="bg-primary text-on-primary rounded-card py-2 px-3 text-center sticker-shadow">
            <span className="text-[9px] font-body tracking-widest uppercase block text-on-primary">
              BUILD YOUR OWN AT
            </span>
            <span className="font-display font-black text-sm tracking-wide text-on-primary">
              cribhaulr.in
            </span>
          </div>
        </div>
      </div>
    );
  }
);

StoryCard.displayName = "StoryCard";
