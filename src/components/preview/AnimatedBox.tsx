"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";
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
          className="absolute top-10 w-64 sm:w-72 h-16 rounded-t-3xl border-3 border-[var(--border-color)] bg-[#D4A373] shadow-[4px_4px_0px_var(--shadow-color)] z-30 origin-bottom flex items-center justify-between px-5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Packaging Tape */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-5 bg-[#C5925A] border-y border-[#A67540] flex items-center justify-center">
            <span className="text-[9px] font-mono font-black tracking-widest text-[#5C3A16] uppercase">
              CRIBHAULR • HOSTEL READY
            </span>
          </div>

          <span className="text-xs font-black font-display text-[#38210A] z-10">
            {isOpen ? "LID: OPEN" : "LID: SEALED"}
          </span>
          <span className="text-base z-10">{currentVibe.emoji}</span>
        </motion.div>

        {/* Box Body */}
        <div className="relative w-64 sm:w-72 h-52 rounded-b-3xl rounded-t-md border-3 border-[var(--border-color)] bg-[#E6BE8A] shadow-[8px_8px_0px_var(--shadow-color)] p-4 flex flex-col justify-between overflow-hidden z-20">
          {/* Interior Packed Items Peek (Visible when lid open) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-[#C5925A]/40 rounded-2xl p-2.5 border-2 border-dashed border-[#8A5A2B]/40 max-h-24 overflow-y-auto space-y-1 scrollbar-none"
              >
                {items.length === 0 ? (
                  <span className="text-[10px] font-bold text-[#4A2D0E] block text-center py-2">
                    Box is currently empty!
                  </span>
                ) : (
                  items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-[10px] font-display font-black bg-[#FAF5ED] px-2 py-0.5 rounded-md border border-[var(--border-color)] text-[var(--text-primary)]"
                    >
                      <span className="truncate max-w-[140px]">{item.name}</span>
                      <span className="text-[var(--accent)] font-bold">{formatINR(item.price)}</span>
                    </div>
                  ))
                )}
                {items.length > 4 && (
                  <div className="text-[9px] font-black text-[#4A2D0E] text-center">
                    +{items.length - 4} more items inside
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Front Shipping Label & Stickers */}
          <div className="space-y-2 mt-auto">
            {/* White Shipping Label */}
            <div className="bg-white border-2 border-[var(--border-color)] rounded-xl p-2 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] flex items-center justify-between">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block">
                  DELIVERY TARGET:
                </span>
                <span className="text-xs font-black font-display text-zinc-900 block leading-tight">
                  ROOM 304, HOSTEL BLOCK-B
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono text-zinc-400 block">TIER TOTAL</span>
                <span className="text-xs font-black font-display text-zinc-900">
                  {formatINR(totalPrice)}
                </span>
              </div>
            </div>

            {/* Gen Z Box Stickers */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] font-black font-display px-2 py-0.5 rounded-md bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)] -rotate-3 inline-block">
                FRAGILE AF 📦
              </span>
              <span className="text-[9px] font-black font-display px-2 py-0.5 rounded-md bg-[var(--accent)] text-[var(--accent-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)] rotate-2 inline-block">
                #{vibe.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient Ground Shadow */}
        <div className="absolute -bottom-2 w-60 sm:w-68 h-4 rounded-full bg-black/25 blur-xs z-10" />
      </div>

      {/* Toggle Controls */}
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-display font-bold shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isOpen ? "Close Box Lid" : "Unbox & Peek"}</span>
        </button>

        <span className="text-xs text-[var(--text-muted)] font-bold">
          {items.length} {items.length === 1 ? "item" : "items"} packed
        </span>
      </div>
    </div>
  );
}
