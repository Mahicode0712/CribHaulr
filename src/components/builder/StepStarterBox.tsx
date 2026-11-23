"use client";

import React from "react";
import { Sparkles, RefreshCw, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { ProductImage } from "@/components/ui/ProductImage";
import { Product, BudgetTier, SpaceType, VibeScoreResult } from "@/types";
import { VibeId, VIBES } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

interface StepStarterBoxProps {
  items: Product[];
  vibe: VibeId;
  space: SpaceType;
  budgetTier: BudgetTier;
  totalPrice: number;
  vibeScore: VibeScoreResult;
  isGenerating: boolean;
  onRegenerate: () => void;
  onProceed: () => void;
}

export function StepStarterBox({
  items,
  vibe,
  space,
  budgetTier,
  totalPrice,
  vibeScore,
  isGenerating,
  onRegenerate,
  onProceed,
}: StepStarterBoxProps) {
  const currentVibeInfo = VIBES[vibe];
  const isOverBudget = totalPrice > budgetTier;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[var(--border-color)]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{currentVibeInfo.emoji}</span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
              Step 4: Your Auto-Built Starter Haul
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            Curated to match your <strong className="text-[var(--accent)]">{currentVibeInfo.name}</strong> aesthetic within your {formatINR(budgetTier)} budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Shuffle Haul</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onProceed}
            className="gap-1.5"
          >
            <span>Customise Items</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Box Summary Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center font-bold text-lg border-2 border-[var(--border-color)]">
            📦
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
              Starter Contents
            </span>
            <span className="text-base font-black font-display text-[var(--text-primary)]">
              {items.length} Handpicked Items
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-lg border-2 border-[var(--border-color)]">
            ₹
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
              Starter Total
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-display text-[var(--text-primary)]">
                {formatINR(totalPrice)}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-bold">
                / {formatINR(budgetTier)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--sticker-bg)] text-[var(--sticker-text)] flex items-center justify-center font-bold text-lg border-2 border-[var(--border-color)]">
            ✨
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
              Starting Vibe Score
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-display text-[var(--accent)]">
                {vibeScore.score}/100
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                Cohesive
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Starter Items Grid */}
      {isGenerating ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[var(--accent)] text-[var(--accent-text)] border-3 border-[var(--border-color)] mx-auto flex items-center justify-center text-3xl animate-bounce shadow-[4px_4px_0px_var(--shadow-color)]">
            📦
          </div>
          <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
            Curating your hostel haul...
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Balancing decor, comfort, study, utility, and munchies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <Card
              key={item.id}
              className="p-0 overflow-hidden flex flex-col justify-between"
            >
              <div className="h-36 w-full relative">
                <ProductImage
                  category={item.category}
                  name={item.name}
                  sprite={item.sprite}
                />
                <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                  #{idx + 1} Starter
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--accent)] block">
                    {item.category.toUpperCase()}
                  </span>
                  <h4 className="font-display font-bold text-sm text-[var(--text-primary)] leading-snug line-clamp-1">
                    {item.name}
                  </h4>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)]/20 flex items-center justify-between">
                  <span className="text-sm font-black font-display text-[var(--text-primary)]">
                    {formatINR(item.price)}
                  </span>
                  <Badge variant="accent">In Box</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom CTA Bar */}
      <div className="p-6 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-display font-black text-base text-[var(--text-primary)]">
            Ready to fine-tune your items?
          </h4>
          <p className="text-xs text-[var(--text-secondary)]">
            Swap any item with 40+ alternatives, remove things you don&apos;t need, and boost your vibe score.
          </p>
        </div>

        <Button
          size="lg"
          variant="primary"
          onClick={onProceed}
          className="w-full sm:w-auto gap-2"
        >
          <span>Customise This Haul</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
