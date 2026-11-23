"use client";

import React from "react";
import { Monitor, Bed, Home, Sparkles, Check, IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { SpaceType, BudgetTier } from "@/types";
import { formatINR } from "@/lib/utils";

interface StepSpaceBudgetProps {
  space: SpaceType;
  budgetTier: BudgetTier;
  onSelectSpace: (space: SpaceType) => void;
  onSelectBudget: (tier: BudgetTier) => void;
}

const SPACES: {
  id: SpaceType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: typeof Monitor;
}[] = [
  {
    id: "desk",
    title: "Study Desk Station",
    subtitle: "Compact & Functional",
    description: "Focus on desk mats, task lighting, cable management, and study motivators.",
    badge: "Most Popular",
    icon: Monitor,
  },
  {
    id: "bed",
    title: "Bed Corner & Chill",
    subtitle: "Sanctuary After Lectures",
    description: "Focus on plush cushions, knitted throws, soothing lighting, and sleep essentials.",
    badge: "Ultimate Comfort",
    icon: Bed,
  },
  {
    id: "room",
    title: "Full Room Glow-Up",
    subtitle: "Total Dorm Transformation",
    description: "Covers walls, desk, bedding, and utility gear for the complete aesthetic setup.",
    badge: "Full Experience",
    icon: Home,
  },
];

const BUDGET_TIERS: {
  tier: BudgetTier;
  label: string;
  subtitle: string;
  itemCount: string;
  badge?: string;
  highlight?: boolean;
}[] = [
  {
    tier: 499,
    label: "Fresher Starter",
    subtitle: "Pocket-friendly survival essentials",
    itemCount: "3 - 4 Items",
  },
  {
    tier: 999,
    label: "Hostel Core",
    subtitle: "The sweet spot: full aesthetic setup",
    itemCount: "4 - 5 Items",
    badge: "🔥 Best Value",
    highlight: true,
  },
  {
    tier: 1999,
    label: "Baller Suite",
    subtitle: "Premium lighting, plush comforts & tech gear",
    itemCount: "5 - 7 Items",
    badge: "✨ Luxury Vibe",
  },
];

export function StepSpaceBudget({
  space,
  budgetTier,
  onSelectSpace,
  onSelectBudget,
}: StepSpaceBudgetProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* 1. Space Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
              Step 1: Choose Your Space
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              Where do you spend 90% of your time in the hostel?
            </p>
          </div>
          <Sticker color="vibe" tilt="right">
            🎯 STEP 1 / 4
          </Sticker>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SPACES.map((item) => {
            const isSelected = space === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => onSelectSpace(item.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[5px_5px_0px_var(--shadow-color)] -translate-y-1"
                    : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl border-2 border-[var(--border-color)] flex items-center justify-center ${
                        isSelected
                          ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
                          : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] flex items-center justify-center font-bold">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      </span>
                    ) : (
                      <Badge variant="outline">{item.badge}</Badge>
                    )}
                  </div>

                  <h3 className="font-display font-black text-lg mt-4 leading-tight">
                    {item.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold block mt-0.5 ${
                      isSelected ? "text-[var(--accent-text)]/90" : "text-[var(--accent)]"
                    }`}
                  >
                    {item.subtitle}
                  </span>

                  <p
                    className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                      isSelected ? "text-[var(--accent-text)]/90" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between text-xs font-bold font-display">
                  <span>Targeted Anchors</span>
                  <span className="uppercase text-[10px] tracking-wider">
                    {item.id.toUpperCase()} SCENE
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Budget Tier Selection */}
      <div className="space-y-4 pt-4 border-t-2 border-[var(--border-color)]/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
              Step 2: Lock Your Budget Tier
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              We&apos;ll auto-select starter items to maximize your vibe within this limit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BUDGET_TIERS.map((tierItem) => {
            const isSelected = budgetTier === tierItem.tier;

            return (
              <div
                key={tierItem.tier}
                onClick={() => onSelectBudget(tierItem.tier)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[5px_5px_0px_var(--shadow-color)] -translate-y-1"
                    : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider block opacity-80">
                        {tierItem.label}
                      </span>
                      <div className="text-3xl font-black font-display mt-1">
                        {formatINR(tierItem.tier)}
                      </div>
                    </div>

                    {tierItem.badge && (
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)]"
                            : "bg-[var(--sticker-bg)] text-[var(--sticker-text)] border-[var(--border-color)]"
                        }`}
                      >
                        {tierItem.badge}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs mt-3 leading-relaxed ${
                      isSelected ? "text-[var(--accent-text)]/90" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {tierItem.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-current/20 flex items-center justify-between text-xs font-bold font-display">
                  <span>Expected Box Size:</span>
                  <span className="px-2 py-0.5 rounded-md bg-black/10">
                    {tierItem.itemCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
