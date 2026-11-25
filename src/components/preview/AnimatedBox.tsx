"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/types";
import { VibeId, VIBES } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

interface AnimatedBoxProps {
  items: Product[];
  vibe: VibeId;
  totalPrice: number;
}

export function AnimatedBox({ items, vibe, totalPrice }: AnimatedBoxProps) {
  const [isOpen, setIsOpen] = useState(true);
  const currentVibe = VIBES[vibe];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 3D Box Container */}
      <div className="relative w-full max-w-md h-80 flex items-center justify-center select-none perspective-1000">
        {/* Animated Box Lid */}
        <motion.div
          animate={{
            rotateX: isOpen ? -75 : 0,
            y: isOpen ? -45 : 0,
            scale: isOpen ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-10 w-64 sm:w-72 h-16 rounded-card border-width-theme border-line bg-secondary sticker-shadow z-30 origin-bottom flex items-center justify-between px-5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Packaging Tape */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-5 bg-accent border-y-width-theme border-accent flex items-center justify-center">
            <span className="text-[9px] font-body font-black tracking-widest text-on-accent uppercase">
              CRIBHAULR • HOSTEL READY
            </span>
          </div>

          <span className="text-xs font-black font-display text-ink z-10">
            {isOpen ? "LID: OPEN" : "LID: SEALED"}
          </span>
          <span className="text-base z-10">{currentVibe.emoji}</span>
        </motion.div>

        {/* Box Body */}
        <div
          className="relative w-64 sm:w-72 h-52 rounded-card border-width-theme border-line sticker-shadow p-4 flex flex-col justify-between overflow-hidden z-20 transition-colors duration-200"
          style={{
            backgroundColor: `color-mix(in srgb, ${currentVibe.boxTint} 14%, var(--surface))`,
          }}
        >
          {/* Interior Packed Items Peek (Visible when lid open) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-accent/20 rounded-card p-2.5 border-width-theme border-dashed border-accent/40 max-h-24 overflow-y-auto space-y-1 scrollbar-none"
              >
                {items.length === 0 ? (
                  <span className="text-[10px] font-bold text-ink block text-center py-2">
                    Box is currently empty!
                  </span>
                ) : (
                  items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-[10px] font-display font-black bg-surface px-2 py-0.5 rounded-btn border-width-theme border-line text-ink"
                    >
                      <span className="truncate max-w-[140px]">{item.name}</span>
                      <span className="theme-price font-bold">{formatINR(item.price)}</span>
                    </div>
                  ))
                )}
                {items.length > 4 && (
                  <div className="text-[9px] font-black text-ink text-center">
                    +{items.length - 4} more items inside
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Front Shipping Label & Stickers */}
          <div className="space-y-2 mt-auto">
            {/* White Shipping Label */}
            <div className="bg-surface border-width-theme border-line rounded-btn p-2 sticker-shadow flex items-center justify-between">
              <div>
                <span className="text-[8px] font-body uppercase tracking-wider text-muted block">
                  DELIVERY TARGET:
                </span>
                <span className="text-xs font-black font-display text-ink block leading-tight">
                  ROOM 304, HOSTEL BLOCK-B
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-body text-muted block">TIER TOTAL</span>
                <span className="theme-price text-xs font-black font-display">
                  {formatINR(totalPrice)}
                </span>
              </div>
            </div>

            {/* Gen Z Box Stickers */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] font-black font-display px-2 py-0.5 rounded-btn bg-accent text-on-accent border-width-theme border-line sticker-shadow -rotate-3 inline-block">
                FRAGILE AF 📦
              </span>
              <span className="text-[9px] font-black font-display px-2 py-0.5 rounded-btn bg-accent text-on-accent border-width-theme border-line sticker-shadow rotate-2 inline-block">
                #{vibe.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient Ground Shadow */}
        <div className="absolute -bottom-2 w-60 sm:w-68 h-4 rounded-full bg-ink/25 blur-xs z-10" />
      </div>

      {/* Toggle Controls */}
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 rounded-btn border-width-theme border-line bg-surface text-xs font-display font-bold sticker-shadow hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isOpen ? "Close Box Lid" : "Unbox & Peek"}</span>
        </button>

        <span className="text-xs text-muted font-bold">
          {items.length} {items.length === 1 ? "item" : "items"} packed
        </span>
      </div>
    </div>
  );
}
