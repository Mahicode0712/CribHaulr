"use client";

import React, { useState } from "react";
import {
  Trash2,
  RefreshCw,
  Plus,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { Product, ProductCategory, BudgetTier, VibeScoreResult } from "@/types";
import { VibeId, VIBES } from "@/data/vibes";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/lib/utils";

interface StepCustomiserProps {
  items: Product[];
  vibe: VibeId;
  budgetTier: BudgetTier;
  totalPrice: number;
  vibeScore: VibeScoreResult;
  onAddItem: (item: Product) => void;
  onRemoveItem: (itemId: string) => void;
  onSwapItem: (oldItemId: string, newItem: Product) => void;
}

const CATEGORY_NAMES: Record<ProductCategory, { label: string; emoji: string }> = {
  decor: { label: "Decor", emoji: "✨" },
  desk: { label: "Desk & Study", emoji: "💻" },
  comfort: { label: "Comfort", emoji: "☁️" },
  utility: { label: "Utility", emoji: "🔌" },
  fun: { label: "Snacks & Fun", emoji: "🍜" },
};

export function StepCustomiser({
  items,
  vibe,
  budgetTier,
  totalPrice,
  vibeScore,
  onAddItem,
  onRemoveItem,
  onSwapItem,
}: StepCustomiserProps) {
  const [swapTargetItem, setSwapTargetItem] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategoryFilter, setAddCategoryFilter] = useState<ProductCategory | "all">("all");

  const isOverBudget = totalPrice > budgetTier;
  const budgetPercentage = Math.min(100, Math.round((totalPrice / budgetTier) * 100));

  // Category coverage check
  const allCategories: ProductCategory[] = ["decor", "desk", "comfort", "utility", "fun"];
  const presentCategories = new Set(items.map((i) => i.category));

  // Available alternatives for swapping target item
  const swapCandidates = swapTargetItem
    ? PRODUCTS.filter(
        (p) =>
          p.category === swapTargetItem.category &&
          p.id !== swapTargetItem.id &&
          !items.some((i) => i.id === p.id)
      )
    : [];

  // Available items for adding new
  const addCandidates = PRODUCTS.filter(
    (p) =>
      !items.some((i) => i.id === p.id) &&
      (addCategoryFilter === "all" || p.category === addCategoryFilter)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Live Budget & Vibe Score Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Budget Progress Bar */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
                Budget Tracker ({formatINR(budgetTier)} Tier)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="theme-price text-2xl sm:text-3xl font-black font-display">
                  {formatINR(totalPrice)}
                </span>
                <span className="text-xs text-muted font-bold">
                  used of {formatINR(budgetTier)}
                </span>
              </div>
            </div>

            <Badge variant={isOverBudget ? "warning" : "success"}>
              {isOverBudget
                ? `+${formatINR(vibeScore.overBudgetAmount)} Over Tier`
                : `${formatINR(budgetTier - totalPrice)} Left`}
            </Badge>
          </div>

          {/* Progress Bar Track */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-deep border-width-theme border-line overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverBudget
                    ? "bg-primary"
                    : budgetPercentage > 85
                    ? "bg-accent"
                    : "bg-primary"
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-muted">
              <span>₹0</span>
              <span>50%</span>
              <span>Tier Max ({formatINR(budgetTier)})</span>
            </div>
          </div>

          {/* Over Budget Warning Banner */}
          {isOverBudget && (
            <div className="p-3 rounded-card bg-primary/10 border-width-theme border-primary/40 text-ink flex items-center gap-2.5 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
              <span>
                You are {formatINR(vibeScore.overBudgetAmount)} over budget! A {vibeScore.budgetPenalty} pt penalty has been deducted from your Vibe Score.
              </span>
            </div>
          )}
        </Card>

        {/* Live Vibe Score Meter */}
        <Card className="lg:col-span-5 space-y-3 bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
              Live Vibe Meter
            </span>
            <Sticker color="vibe" tilt="none">
              🎯 {vibeScore.score} / 100
            </Sticker>
          </div>

          <div className="flex items-center gap-4">
            {/* Score Radial Indicator */}
            <div className="w-16 h-16 rounded-card bg-accent text-on-accent border-width-theme border-line sticker-shadow flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black font-display leading-none">
                {vibeScore.score}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">
                VIBE
              </span>
            </div>

            <div className="space-y-1 flex-1">
              <h4 className="font-display font-black text-sm text-ink leading-tight">
                {vibeScore.feedbackMessage}
              </h4>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-btn bg-secondary border-width-theme border-line/20">
                  ⚡ Match: {vibeScore.vibeMatchPoints}/70
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-btn bg-secondary border-width-theme border-line/20">
                  🌈 Diversity: +{vibeScore.categoryBonus}
                </span>
              </div>
            </div>
          </div>

          {/* Category Diversity Dots */}
          <div className="pt-2 border-t border-line/20 flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold text-muted">
              Category Balance ({presentCategories.size}/5):
            </span>
            <div className="flex items-center gap-1.5">
              {allCategories.map((cat) => {
                const isCovered = presentCategories.has(cat);
                return (
                  <span
                    key={cat}
                    title={`${CATEGORY_NAMES[cat].label} (${isCovered ? "Covered" : "Missing"})`}
                    className={`w-5 h-5 rounded-btn border flex items-center justify-center text-[10px] ${
                      isCovered
                        ? "bg-accent text-on-accent border-line font-bold"
                        : "bg-secondary text-on-secondary border-line/40 opacity-40"
                    }`}
                  >
                    {CATEGORY_NAMES[cat].emoji}
                  </span>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Items in the Box List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black font-display text-ink">
              Items in Your Box ({items.length})
            </h3>
            <p className="text-xs text-muted font-medium">
              Swap any product with certified aesthetic alternatives or remove items you don&apos;t want.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Add Extra Item</span>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 border-width-theme border-dashed border-line/50 rounded-card p-6 space-y-3">
            <span className="text-4xl">📦</span>
            <h4 className="font-display font-bold text-base">Your box is currently empty</h4>
            <p className="text-xs text-muted">
              Add at least 3-4 items to unlock your live Vibe Score and preview the scene.
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Browse Catalog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const matchesVibe = item.vibes.includes(vibe);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-card border-width-theme border-line bg-surface sticker-shadow flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-18 h-18 rounded-card overflow-hidden border-width-theme border-line shrink-0">
                      <ProductImage
                        category={item.category}
                        name={item.name}
                        sprite={item.sprite}
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-ink">
                          {CATEGORY_NAMES[item.category].emoji} {CATEGORY_NAMES[item.category].label}
                        </span>
                        {matchesVibe ? (
                          <span className="text-on-secondary bg-secondary px-1.5 py-0.2 rounded-btn">
                            Matches Vibe
                          </span>
                        ) : (
                          <span className="text-ink bg-accent/20 px-1.5 py-0.2 rounded-btn">
                            Cross-Vibe
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-sm text-ink truncate">
                        {item.name}
                      </h4>

                      <div className="theme-price text-sm font-black font-display">
                        {formatINR(item.price)}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Swap or Remove */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSwapTargetItem(item)}
                      className="gap-1 text-xs px-2.5 h-8 min-h-0"
                      title="Swap this product"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Swap</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onRemoveItem(item.id)}
                      className="px-2.5 h-8 min-h-0"
                      title="Remove from haul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Swap Item Modal */}
      <Modal
        isOpen={!!swapTargetItem}
        onClose={() => setSwapTargetItem(null)}
        title={swapTargetItem ? `Swap "${swapTargetItem.name}"` : "Swap Item"}
        description={`Choose a replacement in ${swapTargetItem?.category.toUpperCase()} to keep your category diversity balanced.`}
        className="max-w-2xl"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {swapCandidates.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted">
              No direct alternatives available in this category. You can add items from the catalog instead!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {swapCandidates.map((cand) => {
                const priceDiff = cand.price - (swapTargetItem?.price || 0);
                const matchesVibe = cand.vibes.includes(vibe);

                return (
                  <div
                    key={cand.id}
                    onClick={() => {
                      if (swapTargetItem) {
                        onSwapItem(swapTargetItem.id, cand);
                        setSwapTargetItem(null);
                      }
                    }}
                    className="p-3.5 rounded-card border-width-theme border-line bg-secondary hover:bg-surface transition-all cursor-pointer flex flex-col justify-between sticker-shadow hover:-translate-y-0.5"
                  >
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-btn border-width-theme border-line overflow-hidden shrink-0">
                        <ProductImage
                          category={cand.category}
                          name={cand.name}
                          sprite={cand.sprite}
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-display font-bold text-xs text-ink line-clamp-2">
                          {cand.name}
                        </h5>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="theme-price text-xs font-black">
                            {formatINR(cand.price)}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-btn ${
                              priceDiff > 0
                                ? "text-ink bg-accent/30"
                                : priceDiff < 0
                                ? "text-on-secondary bg-secondary"
                                : "text-muted bg-surface"
                            }`}
                          >
                            {priceDiff > 0
                              ? `+${formatINR(priceDiff)}`
                              : priceDiff < 0
                              ? `-${formatINR(Math.abs(priceDiff))}`
                              : "Same Price"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-line/20 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted">
                        {matchesVibe ? "✨ Vibe Match" : "Standard"}
                      </span>
                      <span className="text-xs font-black text-ink">
                        Select Swap &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* 4. Add Extra Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add to Your Haul Box"
        description="Pick extra decor, snacks, comfort pillows, or study accessories."
        className="max-w-3xl"
      >
        <div className="space-y-4">
          {/* Category Filter Tabs inside Modal */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setAddCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-btn font-display font-bold text-xs border ${
                addCategoryFilter === "all"
                  ? "bg-primary text-on-primary border-line"
                  : "bg-secondary border-line/40"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setAddCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-btn font-display font-bold text-xs border whitespace-nowrap ${
                  addCategoryFilter === cat
                    ? "bg-primary text-on-primary border-line"
                    : "bg-secondary border-line/40"
                }`}
              >
                {CATEGORY_NAMES[cat].emoji} {CATEGORY_NAMES[cat].label}
              </button>
            ))}
          </div>

          {/* Grid of Addable Candidates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {addCandidates.map((p) => {
              const matchesVibe = p.vibes.includes(vibe);

              return (
                <div
                  key={p.id}
                  className="p-3 rounded-card border-width-theme border-line bg-surface flex flex-col justify-between sticker-shadow"
                >
                  <div className="space-y-2">
                    <div className="h-28 rounded-btn border-width-theme border-line overflow-hidden">
                      <ProductImage category={p.category} name={p.name} sprite={p.sprite} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-ink">
                          {CATEGORY_NAMES[p.category].label}
                        </span>
                        {matchesVibe && (
                          <span className="text-[9px] font-bold text-on-secondary bg-secondary px-1 py-0.2 rounded">
                            ✨ Vibe
                          </span>
                        )}
                      </div>
                      <h5 className="font-display font-bold text-xs leading-snug line-clamp-1 mt-0.5">
                        {p.name}
                      </h5>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-line/20 flex items-center justify-between">
                    <span className="theme-price text-sm font-black font-display">
                      {formatINR(p.price)}
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        onAddItem(p);
                        setIsAddModalOpen(false);
                      }}
                      className="h-7 px-2.5 text-xs min-h-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
