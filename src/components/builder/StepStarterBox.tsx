"use client";

import React from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product, BudgetTier, VibeScoreResult } from "@/types";
import { VIBES, type VibeId } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

interface StepStarterBoxProps {
  items: Product[];
  vibe: VibeId;
  budgetTier: BudgetTier;
  totalPrice: number;
  vibeScore: VibeScoreResult;
  isGenerating: boolean;
  generationError: string | null;
  onRegenerate: () => void;
  onProceed: () => void;
}

export function StepStarterBox({
  items,
  vibe,
  budgetTier,
  totalPrice,
  vibeScore,
  isGenerating,
  generationError,
  onRegenerate,
  onProceed,
}: StepStarterBoxProps) {
  const currentVibeInfo = VIBES[vibe];
  const isOverBudget = totalPrice > budgetTier;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-width-theme border-line/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{currentVibeInfo.emoji}</span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-ink">
              Step 3: Your Auto-Built Starter Haul
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted font-medium">
            Curated to match your <strong className="text-ink">{currentVibeInfo.name}</strong> aesthetic within your {formatINR(budgetTier)} budget.
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
          <div className="w-10 h-10 rounded-card bg-accent text-on-accent flex items-center justify-center font-bold text-lg border-width-theme border-line">
            📦
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
              Starter Contents
            </span>
            <span className="theme-price text-base font-black font-display">
              {items.length} Handpicked Items
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-secondary text-on-secondary flex items-center justify-center font-bold text-lg border-width-theme border-line">
            ₹
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
              Starter Total
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-display text-ink">
                {formatINR(totalPrice)}
              </span>
              <span className="text-xs text-muted font-bold">
                / {formatINR(budgetTier)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-accent text-on-accent flex items-center justify-center font-bold text-lg border-width-theme border-line">
            ✨
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
              Starting Vibe Score
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-display text-ink">
                {vibeScore.score}/100
              </span>
              <span className="text-on-secondary bg-secondary px-1.5 py-0.2 rounded-full">
                Cohesive
              </span>
            </div>
          </div>
        </Card>
      </div>

      {isOverBudget && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-card border-width-theme border-primary/40 bg-primary/10 p-3 text-xs font-semibold text-ink"
        >
          <span aria-hidden="true">⚠️</span>
          <span>
            This haul is {formatINR(totalPrice - budgetTier)} over budget. Swap an item before checkout.
          </span>
        </div>
      )}

      {generationError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-card border-width-theme border-primary/40 bg-primary/10 p-4 text-sm text-ink sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{generationError}</span>
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            Try again
          </Button>
        </div>
      )}

      {/* Starter Items Grid */}
      {isGenerating ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-card bg-accent text-on-accent border-width-theme border-line mx-auto flex items-center justify-center text-3xl animate-bounce sticker-shadow">
            📦
          </div>
          <h3 className="text-xl font-bold font-display text-ink">
            Curating your hostel haul...
          </h3>
          <p className="text-xs text-muted">
            Balancing decor, comfort, study, utility, and munchies.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="space-y-3 rounded-card border-width-theme border-dashed border-line/50 p-8 text-center">
          <span className="text-4xl" aria-hidden="true">📦</span>
          <h3 className="font-display font-bold text-lg text-ink">
            No starter items fit this setup yet
          </h3>
          <p className="text-sm text-muted">
            Try another room vibe or budget, then shuffle the haul again.
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
                <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-surface border-width-theme border-line">
                  #{idx + 1} Starter
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-ink block">
                    {item.category.toUpperCase()}
                  </span>
                  <h4 className="font-display font-bold text-sm text-ink leading-snug line-clamp-1">
                    {item.name}
                  </h4>
                </div>

                <p className="text-xs text-muted line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-line/20 flex items-center justify-between">
                  <span className="theme-price text-sm font-black font-display">
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
      <div className="p-6 rounded-card bg-surface border-width-theme border-line sticker-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-display font-black text-base text-ink">
            Ready to fine-tune your items?
          </h4>
          <p className="text-xs text-muted">
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
