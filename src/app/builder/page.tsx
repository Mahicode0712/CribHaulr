"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, ShoppingBag, Eye, RefreshCw } from "lucide-react";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { Badge } from "@/components/ui/Badge";
import { StepSpaceBudget } from "@/components/builder/StepSpaceBudget";
import { StepVibePicker } from "@/components/builder/StepVibePicker";
import { StepStarterBox } from "@/components/builder/StepStarterBox";
import { StepCustomiser } from "@/components/builder/StepCustomiser";
import { LiveRoomScene } from "@/components/preview/LiveRoomScene";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";

const BUILDER_STEPS = [
  { id: "space-budget", label: "Space & Budget", sublabel: "Desk / Bed & Tier" },
  { id: "vibe", label: "Room Vibe", sublabel: "5 Themes" },
  { id: "starter-box", label: "Starter Haul", sublabel: "Auto-Generated" },
  { id: "customise", label: "Customise", sublabel: "Swap & Score" },
  { id: "preview", label: "Live Scene", sublabel: "Scene & Share" },
];

export default function BuilderPage() {
  const { currentVibe, setVibe } = useTheme();
  const {
    space,
    budgetTier,
    vibe,
    items,
    builderStep,
    setSpace,
    setBudgetTier,
    setVibe: setStoreVibe,
    setBuilderStep,
    addItem,
    removeItem,
    swapItem,
    generateStarterBox,
    getTotalPrice,
    getVibeScore,
  } = useHaulStore();

  const [isGenerating, setIsGenerating] = useState(false);

  // Sync theme context with store vibe
  const handleSelectVibe = (newVibe: typeof vibe) => {
    setStoreVibe(newVibe);
    setVibe(newVibe);
  };

  // Generate starter box when advancing to starter box step if items are empty
  const handleAdvanceToStarterBox = async () => {
    setIsGenerating(true);
    setBuilderStep(2);
    if (items.length === 0) {
      await generateStarterBox();
    }
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await generateStarterBox();
    setIsGenerating(false);
  };

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();
  const isOverBudget = totalPrice > budgetTier;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[var(--border-color)]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </Link>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Haul Architect v1.0
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)] tracking-tight">
            Build-Your-Own Hostel Haul
          </h1>
        </div>

        {/* Live Mini Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
              Live Total
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black font-display text-[var(--text-primary)]">
                {formatINR(totalPrice)}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                / {formatINR(budgetTier)}
              </span>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--sticker-bg)] text-[var(--sticker-text)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] flex items-center gap-2">
            <span className="text-base">✨</span>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider block leading-none">
                Vibe Score
              </span>
              <span className="text-xs font-black font-display">
                {vibeScore.score} / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
        <Stepper
          steps={BUILDER_STEPS}
          currentStepIndex={builderStep}
          onStepClick={(idx) => setBuilderStep(idx)}
        />
      </div>

      {/* Active Step Content */}
      <div className="min-h-[450px]">
        {builderStep === 0 && (
          <StepSpaceBudget
            space={space}
            budgetTier={budgetTier}
            onSelectSpace={(s) => setSpace(s)}
            onSelectBudget={(b) => setBudgetTier(b)}
          />
        )}

        {builderStep === 1 && (
          <StepVibePicker
            selectedVibe={vibe}
            onSelectVibe={handleSelectVibe}
          />
        )}

        {builderStep === 2 && (
          <StepStarterBox
            items={items}
            vibe={vibe}
            space={space}
            budgetTier={budgetTier}
            totalPrice={totalPrice}
            vibeScore={vibeScore}
            isGenerating={isGenerating}
            onRegenerate={handleRegenerate}
            onProceed={() => setBuilderStep(3)}
          />
        )}

        {builderStep === 3 && (
          <StepCustomiser
            items={items}
            vibe={vibe}
            budgetTier={budgetTier}
            totalPrice={totalPrice}
            vibeScore={vibeScore}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onSwapItem={swapItem}
          />
        )}

        {builderStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[var(--border-color)]/30 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
                  Step 5: Live Scene & Box Preview
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                  Toggle between the mock {space.toUpperCase()} scene and the 3D packing box.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/share">
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Story Card</span>
                  </Button>
                </Link>

                <Link href="/checkout">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Checkout</span>
                  </Button>
                </Link>
              </div>
            </div>

            <LiveRoomScene
              items={items}
              space={space}
              vibe={vibe}
              totalPrice={totalPrice}
              vibeScore={vibeScore.score}
              onSelectSpace={(s) => setSpace(s)}
              onRemoveItem={removeItem}
            />
          </div>
        )}
      </div>

      {/* Navigation Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md bg-[var(--bg-primary)]/90 border-t-2 border-[var(--border-color)] p-4 sm:p-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="md"
            disabled={builderStep === 0}
            onClick={() => setBuilderStep(Math.max(0, builderStep - 1))}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {/* Center Summary Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-display text-[var(--text-secondary)]">
              Step {builderStep + 1} of {BUILDER_STEPS.length}
            </span>
            <span className="text-xs font-black text-[var(--accent)]">
              • {formatINR(totalPrice)}
            </span>
          </div>

          {/* Forward Action Button */}
          {builderStep === 0 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setBuilderStep(1)}
              className="gap-2"
            >
              <span>Next: Choose Vibe</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {builderStep === 1 && (
            <Button
              variant="primary"
              size="md"
              onClick={handleAdvanceToStarterBox}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Starter Haul</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {builderStep === 2 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setBuilderStep(3)}
              className="gap-2"
            >
              <span>Customise Items</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {builderStep === 3 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setBuilderStep(4)}
              className="gap-2"
            >
              <span>Preview Room Scene</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {builderStep === 4 && (
            <Link href="/checkout">
              <Button variant="primary" size="md" className="gap-2">
                <span>Checkout Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
