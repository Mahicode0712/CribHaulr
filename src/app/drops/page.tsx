"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Bell,
  Check,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { ProductImage } from "@/components/ui/ProductImage";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { api, SeasonalDrop } from "@/lib/api";
import { formatINR } from "@/lib/utils";

// Countdown Timer Component
function CountdownTimer({ targetIso }: { targetIso: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-mono font-black text-sm text-[var(--accent)] bg-[var(--bg-card)] border-2 border-[var(--border-color)] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_var(--shadow-color)]">
      <Clock className="w-4 h-4 text-[var(--accent)] shrink-0" />
      <span>{pad(timeLeft.hours)}h</span>
      <span>:</span>
      <span>{pad(timeLeft.minutes)}m</span>
      <span>:</span>
      <span>{pad(timeLeft.seconds)}s</span>
    </div>
  );
}

export default function DropsPage() {
  const router = useRouter();
  const { setVibe } = useTheme();
  const { clearBox, addItem, setBudgetTier, setVibe: setStoreVibe } = useHaulStore();

  const [drops, setDrops] = useState<SeasonalDrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifiedDrops, setNotifiedDrops] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.drops.list().then((data) => {
      setDrops(data);
      setIsLoading(false);
    });
  }, []);

  const handleClaimDrop = (drop: SeasonalDrop) => {
    clearBox();
    drop.featuredItems.forEach((item) => addItem(item));
    setBudgetTier(drop.price as 999 | 1999);
    setStoreVibe(drop.vibe);
    setVibe(drop.vibe);
    router.push("/builder");
  };

  const handleToggleNotify = (dropId: string) => {
    setNotifiedDrops((prev) => ({
      ...prev,
      [dropId]: !prev[dropId],
    }));
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 pb-32">
      {/* Ticker Tape */}
      <div className="w-full bg-[var(--sticker-bg)] text-[var(--sticker-text)] border-2 border-[var(--border-color)] rounded-2xl py-2 px-4 shadow-[3px_3px_0px_var(--shadow-color)] overflow-hidden">
        <div className="flex items-center justify-between gap-4 text-xs font-mono font-black uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none">
          <span>⚡ LIMITED CAMPUS BATCH #04</span>
          <span>•</span>
          <span>🔥 FRESHERS&apos; RESTOCK LIVE</span>
          <span>•</span>
          <span>🚀 SHIPS IN 24H TO DORM RECEPTION</span>
          <span>•</span>
          <span>📦 FREE STICKER SHEET WITH EVERY DROP</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Sticker color="vibe" tilt="left">
            🔥 CURATED THEME DROPS
          </Sticker>
          <Badge variant="accent">Limited Run</Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-[var(--text-primary)] tracking-tight leading-tight">
          Seasonal Hostel Drops
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
          Ultra-specific survival bundles engineered for exam weeks, freshers&apos; orientation, and North Indian winters. Locked prices, zero fluff.
        </p>
      </div>

      {/* Drops Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 rounded-3xl border-2 border-[var(--border-color)]/30 bg-[var(--bg-secondary)] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {drops.map((drop) => {
            const isLive = drop.status === "live";
            const isNotified = notifiedDrops[drop.id];

            return (
              <Card
                key={drop.id}
                hoverEffect
                className="flex flex-col justify-between p-6 space-y-6 relative overflow-hidden"
              >
                {/* Header: Badge & Countdown */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-[var(--accent)] text-[var(--accent-text)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">
                      {drop.badge}
                    </span>

                    {isLive ? (
                      <CountdownTimer targetIso={drop.countdownTarget} />
                    ) : (
                      <Badge variant="warning">Drops in 7d</Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                      {drop.subtitle}
                    </span>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)] leading-tight mt-0.5">
                      {drop.title}
                    </h2>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {drop.tagline}
                  </p>
                </div>

                {/* Featured Products Included Preview */}
                <div className="space-y-2.5 bg-[var(--bg-secondary)]/60 rounded-2xl p-3 border-2 border-[var(--border-color)]">
                  <div className="flex items-center justify-between text-[11px] font-bold font-display">
                    <span>What&apos;s Packed Inside:</span>
                    <span className="text-[var(--accent)]">
                      {drop.itemCount} Full-Sized Essentials
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {drop.featuredItems.map((item) => (
                      <div
                        key={item.id}
                        title={`${item.name} (${formatINR(item.price)})`}
                        className="aspect-square rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-xs"
                      >
                        <ProductImage
                          category={item.category}
                          name={item.name}
                          sprite={item.sprite}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Claim Button */}
                <div className="pt-2 border-t border-[var(--border-color)]/20 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block">
                        DROP BUNDLE PRICE
                      </span>
                      <span className="text-3xl font-black font-display text-[var(--text-primary)]">
                        {formatINR(drop.price)}
                      </span>
                    </div>

                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)]">
                      #{drop.vibe}
                    </span>
                  </div>

                  {isLive ? (
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => handleClaimDrop(drop)}
                      className="w-full gap-2 font-black justify-center shadow-[3px_3px_0px_var(--shadow-color)]"
                    >
                      <span>Claim This Haul Box</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleToggleNotify(drop.id)}
                      className="w-full gap-2 font-bold justify-center"
                    >
                      {isNotified ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Notification Set!</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          <span>Notify Me on Drop</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
