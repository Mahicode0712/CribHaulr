"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Box as BoxIcon, Eye, Sparkles, RefreshCw, Maximize2 } from "lucide-react";
import { SceneBackground } from "./SceneBackground";
import { ProductSprite } from "./ProductSprite";
import { AnimatedBox } from "./AnimatedBox";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { Product, SpaceType } from "@/types";
import { VibeId, VIBES } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

interface LiveRoomSceneProps {
  items: Product[];
  space: SpaceType;
  vibe: VibeId;
  totalPrice: number;
  vibeScore: number;
  onSelectSpace?: (space: SpaceType) => void;
  onRemoveItem?: (id: string) => void;
}

export function LiveRoomScene({
  items,
  space,
  vibe,
  totalPrice,
  vibeScore,
  onSelectSpace,
  onRemoveItem,
}: LiveRoomSceneProps) {
  const [viewMode, setViewMode] = useState<"scene" | "box">("scene");
  const currentVibeInfo = VIBES[vibe];

  return (
    <div className="w-full space-y-4">
      {/* Top Scene Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-2xl p-2.5 sm:p-3 shadow-[3px_3px_0px_var(--shadow-color)]">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]/30">
          <button
            onClick={() => setViewMode("scene")}
            className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "scene"
                ? "bg-[var(--accent)] text-[var(--accent-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Room Scene</span>
          </button>

          <button
            onClick={() => setViewMode("box")}
            className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "box"
                ? "bg-[var(--accent)] text-[var(--accent-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <BoxIcon className="w-3.5 h-3.5" />
            <span>3D Box</span>
          </button>
        </div>

        {/* Space Picker (if onSelectSpace provided) */}
        {onSelectSpace && viewMode === "scene" && (
          <div className="flex items-center gap-1">
            {(["desk", "bed", "room"] as SpaceType[]).map((s) => (
              <button
                key={s}
                onClick={() => onSelectSpace(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-display font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                  space === s
                    ? "bg-[var(--sticker-bg)] text-[var(--sticker-text)] border-[var(--border-color)] shadow-[1.5px_1.5px_0px_var(--shadow-color)]"
                    : "bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Score & Item Count Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-display text-[var(--text-primary)]">
            {items.length} {items.length === 1 ? "Item" : "Items"} Placed
          </span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)]">
            Vibe: {vibeScore}/100
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[550px] bg-[var(--bg-secondary)] border-3 border-[var(--border-color)] rounded-3xl overflow-hidden shadow-[6px_6px_0px_var(--shadow-color)]">
        {viewMode === "scene" ? (
          <>
            {/* Layer 1: Background SVG Scene */}
            <SceneBackground space={space} vibe={vibe} />

            {/* Layer 2: Animated Product Sprites */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatePresence>
                {items.map((item) => (
                  <ProductSprite
                    key={item.id}
                    product={item}
                    space={space}
                    onRemove={onRemoveItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State Overlay */}
            {items.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-xs text-center z-20">
                <div className="p-4 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] max-w-sm space-y-2">
                  <span className="text-3xl">🪑</span>
                  <h4 className="font-display font-black text-sm text-[var(--text-primary)]">
                    Your {space.toUpperCase()} is bare!
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Add decor, fairy lights, cushions, or desk accessories from the customizer to populate your scene.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom-left Space Watermark Sticker */}
            <div className="absolute bottom-3 left-3 z-30">
              <Sticker color="vibe" tilt="left">
                {currentVibeInfo.emoji} {space.toUpperCase()} SETUP
              </Sticker>
            </div>

            {/* Bottom-right Price Tag */}
            <div className="absolute bottom-3 right-3 z-30 bg-[var(--bg-card)] border-2 border-[var(--border-color)] px-3 py-1 rounded-xl shadow-[2px_2px_0px_var(--shadow-color)] flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[var(--text-muted)]">HAUL TOTAL:</span>
              <span className="text-xs font-black font-display text-[var(--text-primary)]">
                {formatINR(totalPrice)}
              </span>
            </div>
          </>
        ) : (
          /* 3D Box Mode */
          <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]">
            <AnimatedBox items={items} vibe={vibe} totalPrice={totalPrice} />
          </div>
        )}
      </div>
    </div>
  );
}
