"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { Stepper } from "@/components/ui/Stepper";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StepSpaceBudget } from "@/components/builder/StepSpaceBudget";
import { StepVibePicker } from "@/components/builder/StepVibePicker";
import { StepStarterBox } from "@/components/builder/StepStarterBox";
import { StepCustomiser } from "@/components/builder/StepCustomiser";
import { LiveRoomScene } from "@/components/preview/LiveRoomScene";
import { hydrateHaulStore, useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { VIBE_LIST } from "@/data/vibes";
import type { BudgetTier, SpaceType } from "@/types";

const BUILDER_STEPS = [
  { id: "space-budget", label: "Space & Budget", sublabel: "Desk / Bed & Tier" },
  { id: "vibe", label: "Room Vibe", sublabel: "5 Themes" },
  { id: "starter-box", label: "Starter Haul", sublabel: "Auto-Generated" },
  { id: "customise", label: "Customise", sublabel: "Swap & Score" },
  { id: "preview", label: "Live Scene", sublabel: "Scene & Share" },
];

export default function BuilderPage() {
  const { setVibe } = useTheme();
  const hasAppliedSharedBox = useRef(false);
  const {
    space,
    budgetTier,
    vibe,
    items,
    builderStep,
    setSpace,
    setBudgetTier,
    setBuilderStep,
    replaceItems,
    addItem,
    removeItem,
    swapItem,
    generateStarterBox,
    getTotalPrice,
    getVibeScore,
  } = useHaulStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (hasAppliedSharedBox.current) return;

    const params = new URLSearchParams(window.location.search);
    if (!params.has("items")) return;

    let active = true;
    void hydrateHaulStore().then(() => {
      if (!active || hasAppliedSharedBox.current) return;
      hasAppliedSharedBox.current = true;

      const sharedSpace = params.get("space");
      const sharedTier = Number(params.get("tier"));
      const sharedVibe = params.get("vibe");
      const validSpace: SpaceType | undefined =
        sharedSpace === "desk" || sharedSpace === "bed" || sharedSpace === "room"
          ? sharedSpace
          : undefined;
      const validTier: BudgetTier | undefined =
        sharedTier === 499 || sharedTier === 999 || sharedTier === 1999
          ? sharedTier
          : undefined;
      const validVibe = VIBE_LIST.find(
        (candidate) => candidate.id === sharedVibe
      )?.id;
      const sharedItems = (params.get("items") ?? "")
        .split(",")
        .map((id) => PRODUCTS.find((product) => product.id === id))
        .filter((product) => product !== undefined);

      if (validSpace) setSpace(validSpace);
      if (validTier) setBudgetTier(validTier);
      if (validVibe) {
        setVibe(validVibe);
      }
      replaceItems(sharedItems);
      setBuilderStep(3);
    });

    return () => {
      active = false;
    };
  }, [
    replaceItems,
    setBuilderStep,
    setBudgetTier,
    setSpace,
    setVibe,
  ]);

  const handleSelectVibe = (newVibe: typeof vibe) => {
    setVibe(newVibe);
  };

  const generateStarter = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      await generateStarterBox();
    } catch (cause) {
      setGenerationError(
        cause instanceof Error
          ? cause.message
          : "The starter haul could not be generated."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdvanceToStarterBox = async () => {
    setBuilderStep(2);
    await generateStarter();
  };

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-width-theme border-line/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs font-bold text-muted hover:text-ink flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </Link>
            <span className="text-muted">•</span>
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Haul Architect v1.0
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-ink tracking-tight">
            Build-Your-Own Hostel Haul
          </h1>
        </div>

        {/* Live Mini Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
              Live Total
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black font-display text-ink">
                {formatINR(totalPrice)}
              </span>
              <span className="text-xs text-muted">
                / {formatINR(budgetTier)}
              </span>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-card bg-accent text-on-accent border-width-theme border-line sticker-shadow flex items-center gap-2">
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
      <div className="bg-surface border-width-theme border-line rounded-card p-4 sm:p-6 sticker-shadow">
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
            budgetTier={budgetTier}
            totalPrice={totalPrice}
            vibeScore={vibeScore}
            isGenerating={isGenerating}
            generationError={generationError}
            onRegenerate={generateStarter}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-width-theme border-line/30 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-ink">
                  Step 5: Live Scene & Box Preview
                </h2>
                <p className="text-xs sm:text-sm text-muted font-medium">
                  Toggle between the mock {space.toUpperCase()} scene and the 3D packing box.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ButtonLink href="/share" variant="secondary" size="sm" className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Story Card</span>
                </ButtonLink>

                <ButtonLink href="/checkout" variant="primary" size="sm" className="gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Checkout</span>
                </ButtonLink>
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
      <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md bg-bg/90 border-t-width-theme border-line p-4 sm:p-5">
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
            <span className="text-xs font-bold font-display text-muted">
              Step {builderStep + 1} of {BUILDER_STEPS.length}
            </span>
            <span className="text-xs font-black text-ink">
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
              disabled={isGenerating}
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
            <ButtonLink href="/checkout" variant="primary" size="md" className="gap-2">
              <span>Checkout Now</span>
              <ArrowRight className="w-4 h-4" />
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
