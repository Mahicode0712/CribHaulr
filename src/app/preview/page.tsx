"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2, ShoppingBag, Trash2 } from "lucide-react";
import { LiveRoomScene } from "@/components/preview/LiveRoomScene";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { VIBE_LIST, type VibeId } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

export default function PreviewPage() {
  const { setVibe } = useTheme();
  const {
    items,
    space,
    budgetTier,
    vibe,
    setSpace,
    removeItem,
    getTotalPrice,
    getVibeScore,
  } = useHaulStore();

  const handleVibeChange = (newVibe: VibeId) => {
    setVibe(newVibe);
  };

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-width-theme border-line/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/builder"
              className="text-xs font-bold text-muted hover:text-ink flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Builder</span>
            </Link>
            <span className="text-muted">•</span>
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Layered Visualizer
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-ink tracking-tight">
            Live Room & Box Preview
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium mt-1">
            Watch your curated items render directly into your hostel room coordinates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ButtonLink href="/share" variant="secondary" size="md" className="gap-2">
            <Share2 className="w-4 h-4 text-accent" />
            <span>Export Story Card</span>
          </ButtonLink>

          <ButtonLink href="/checkout" variant="primary" size="md" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Checkout ({formatINR(totalPrice)})</span>
          </ButtonLink>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Canvas (Scene + Box) */}
        <div className="lg:col-span-8 space-y-4">
          <LiveRoomScene
            items={items}
            space={space}
            vibe={vibe}
            totalPrice={totalPrice}
            vibeScore={vibeScore.score}
            onSelectSpace={(s) => setSpace(s)}
            onRemoveItem={(id) => removeItem(id)}
          />

          {/* Quick Vibe Palette Strip */}
          <div className="p-4 rounded-card bg-surface border-width-theme border-line sticker-shadow flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-display font-black text-ink">
              Switch Room Vibe:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {VIBE_LIST.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVibeChange(v.id as VibeId)}
                  className={`px-3 py-1 rounded-btn text-xs font-display font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    vibe === v.id
                      ? "bg-primary text-on-primary border-line sticker-shadow"
                      : "bg-secondary border-line/30 hover:border-line"
                  }`}
                >
                  <span>{v.emoji}</span>
                  <span>{v.name.split("/")[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Haul Inspector & Score Card */}
        <div className="lg:col-span-4 space-y-5">
          {/* Vibe Score Gauge Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
                  Overall Score
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black font-display text-ink">
                    {vibeScore.score}
                  </span>
                  <span className="text-sm font-bold text-muted">/ 100</span>
                </div>
              </div>
              <Sticker color="vibe" tilt="right">
                ✨ {items.length} ITEMS
              </Sticker>
            </div>

            <p className="text-xs font-bold text-ink leading-relaxed">
              {vibeScore.feedbackMessage}
            </p>

            <div className="pt-3 border-t border-line/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Budget Tier:</span>
                <span className="theme-price font-bold">{formatINR(budgetTier)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Haul Total:</span>
                <span className="theme-price font-black">
                  {formatINR(totalPrice)}
                </span>
              </div>
            </div>
          </Card>

          {/* Packed Items List in Scene */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-sm text-ink">
                Placed In Scene ({items.length})
              </h3>
              <Link
                href="/builder"
                className="text-[11px] font-bold text-ink hover:underline"
              >
                + Add / Swap Items
              </Link>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-card border-width-theme border-line bg-surface flex items-center justify-between gap-3 sticker-shadow"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-ink block">
                      {item.category}
                    </span>
                    <h5 className="font-display font-bold text-xs truncate">
                      {item.name}
                    </h5>
                    <span className="theme-price text-xs font-black">
                      {formatINR(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-btn border-width-theme border-line bg-secondary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
