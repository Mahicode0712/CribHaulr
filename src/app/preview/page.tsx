"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Share2, ShoppingBag, Plus, Trash2 } from "lucide-react";
import { LiveRoomScene } from "@/components/preview/LiveRoomScene";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { VIBES, VIBE_LIST, VibeId } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

export default function PreviewPage() {
  const { currentVibe, setVibe } = useTheme();
  const {
    items,
    space,
    budgetTier,
    vibe,
    setSpace,
    setVibe: setStoreVibe,
    removeItem,
    getTotalPrice,
    getVibeScore,
  } = useHaulStore();

  const handleVibeChange = (newVibe: VibeId) => {
    setStoreVibe(newVibe);
    setVibe(newVibe);
  };

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();
  const isOverBudget = totalPrice > budgetTier;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[var(--border-color)]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/builder"
              className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Builder</span>
            </Link>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Layered Visualizer
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)] tracking-tight">
            Live Room & Box Preview
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Watch your curated items render directly into your hostel room coordinates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link href="/share">
            <Button variant="secondary" size="md" className="gap-2">
              <Share2 className="w-4 h-4 text-[var(--accent)]" />
              <span>Export Story Card</span>
            </Button>
          </Link>

          <Link href="/checkout">
            <Button variant="primary" size="md" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout ({formatINR(totalPrice)})</span>
            </Button>
          </Link>
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
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-display font-black text-[var(--text-primary)]">
              Switch Room Vibe:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {VIBE_LIST.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVibeChange(v.id as VibeId)}
                  className={`px-3 py-1 rounded-xl text-xs font-display font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    vibe === v.id
                      ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]"
                      : "bg-[var(--bg-secondary)] border-[var(--border-color)]/30 hover:border-[var(--border-color)]"
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
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                  Overall Score
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black font-display text-[var(--accent)]">
                    {vibeScore.score}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-secondary)]">/ 100</span>
                </div>
              </div>
              <Sticker color="vibe" tilt="right">
                ✨ {items.length} ITEMS
              </Sticker>
            </div>

            <p className="text-xs font-bold text-[var(--text-primary)] leading-relaxed">
              {vibeScore.feedbackMessage}
            </p>

            <div className="pt-3 border-t border-[var(--border-color)]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] font-medium">Budget Tier:</span>
                <span className="font-bold">{formatINR(budgetTier)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] font-medium">Haul Total:</span>
                <span className={`font-black ${isOverBudget ? "text-rose-600" : "text-emerald-600"}`}>
                  {formatINR(totalPrice)}
                </span>
              </div>
            </div>
          </Card>

          {/* Packed Items List in Scene */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-sm text-[var(--text-primary)]">
                Placed In Scene ({items.length})
              </h3>
              <Link
                href="/builder"
                className="text-[11px] font-bold text-[var(--accent)] hover:underline"
              >
                + Add / Swap Items
              </Link>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between gap-3 shadow-[2px_2px_0px_var(--shadow-color)]"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-[var(--accent)] block">
                      {item.category}
                    </span>
                    <h5 className="font-display font-bold text-xs truncate">
                      {item.name}
                    </h5>
                    <span className="text-xs font-black">
                      {formatINR(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
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
