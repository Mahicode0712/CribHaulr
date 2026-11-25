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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border-width-theme border-line rounded-card p-2.5 sm:p-3 sticker-shadow">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-btn border-width-theme border-line/30">
          <button
            onClick={() => setViewMode("scene")}
            className={`px-3 py-1.5 rounded-btn font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "scene"
                ? "bg-accent text-on-accent border-width-theme border-line sticker-shadow"
                : "text-muted hover:text-ink"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Room Scene</span>
          </button>

          <button
            onClick={() => setViewMode("box")}
            className={`px-3 py-1.5 rounded-btn font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "box"
                ? "bg-accent text-on-accent border-width-theme border-line sticker-shadow"
                : "text-muted hover:text-ink"
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
                className={`px-2.5 py-1 rounded-btn text-[11px] font-display font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                  space === s
                    ? "bg-accent text-on-accent border-line sticker-shadow"
                    : "bg-transparent text-muted border-transparent hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Score & Item Count Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-display text-ink">
            {items.length} {items.length === 1 ? "Item" : "Items"} Placed
          </span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-accent text-on-accent border-width-theme border-line">
            Vibe: {vibeScore}/100
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[550px] bg-secondary border-width-theme border-line rounded-card overflow-hidden sticker-shadow">
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
              <div className="theme-scrim-subtle absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-xs text-center z-20">
                <div className="p-4 rounded-card bg-surface border-width-theme border-line sticker-shadow max-w-sm space-y-2">
                  <span className="text-3xl">🪑</span>
                  <h4 className="font-display font-black text-sm text-ink">
                    Your {space.toUpperCase()} is bare!
                  </h4>
                  <p className="text-xs text-muted">
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
            <div className="absolute bottom-3 right-3 z-30 bg-surface border-width-theme border-line px-3 py-1 rounded-btn sticker-shadow flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted">HAUL TOTAL:</span>
              <span className="text-xs font-black font-display text-ink">
                {formatINR(totalPrice)}
              </span>
            </div>
          </>
        ) : (
          /* 3D Box Mode */
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <AnimatedBox items={items} vibe={vibe} totalPrice={totalPrice} />
          </div>
        )}
      </div>
    </div>
  );
}
