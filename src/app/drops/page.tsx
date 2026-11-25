"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ArrowRight,
  Bell,
  Check,
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
    <div className="flex items-center gap-1.5 font-body font-black text-sm text-ink bg-surface border-width-theme border-line px-3 py-1.5 rounded-btn sticker-shadow">
      <Clock className="w-4 h-4 text-accent shrink-0" />
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
  const {
    clearBox,
    addItem,
    setBudgetTier,
    setBuilderStep,
  } = useHaulStore();

  const [drops, setDrops] = useState<SeasonalDrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [notifiedDrops, setNotifiedDrops] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    api.drops
      .list()
      .then((data) => {
        if (active) setDrops(data);
      })
      .catch((cause: unknown) => {
        if (active) {
          setLoadError(
            cause instanceof Error
              ? cause.message
              : "Seasonal drops could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const handleClaimDrop = (drop: SeasonalDrop) => {
    clearBox();
    drop.featuredItems.forEach((item) => addItem(item));
    setBudgetTier(drop.price);
    setVibe(drop.vibe);
    setBuilderStep(3);
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
      <div className="w-full bg-primary text-on-primary border-width-theme border-line rounded-card py-2 px-4 sticker-shadow overflow-hidden">
        <div className="flex items-center justify-between gap-4 text-xs font-body font-black uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none">
          <span>⚡ LIMITED CAMPUS BATCH #04</span>
          <span>•</span>
          <span>🔥 FRESHERS&apos; RESTOCK LIVE</span>
          <span>•</span>
          <span>🚀 CAMPUS DELIVERY PREVIEW</span>
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

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-ink tracking-tight leading-tight">
          Seasonal Hostel Drops
        </h1>

        <p className="text-sm sm:text-base text-muted font-medium max-w-xl mx-auto">
          Ultra-specific survival bundles engineered for exam weeks, freshers&apos; orientation, and North Indian winters. Locked prices, zero fluff.
        </p>
      </div>

      {/* Drops Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 rounded-card border-width-theme border-line/30 bg-secondary animate-pulse"
            />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-card border-width-theme border-line bg-surface p-8 text-center sticker-shadow">
          <p role="alert" className="font-bold text-ink">
            {loadError}
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => {
              setIsLoading(true);
              setLoadError(null);
              setReloadToken((token) => token + 1);
            }}
          >
            Try again
          </Button>
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
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-btn bg-accent text-on-accent border-width-theme border-line sticker-shadow">
                      {drop.badge}
                    </span>

                    {isLive ? (
                      <CountdownTimer targetIso={drop.countdownTarget} />
                    ) : (
                      <Badge variant="warning">Drops in 7d</Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted block">
                      {drop.subtitle}
                    </span>
                    <h2 className="text-2xl font-black font-display text-ink leading-tight mt-0.5">
                      {drop.title}
                    </h2>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {drop.tagline}
                  </p>
                </div>

                {/* Featured Products Included Preview */}
                <div className="space-y-2.5 bg-secondary/60 rounded-card p-3 border-width-theme border-line">
                  <div className="flex items-center justify-between text-[11px] font-bold font-display">
                    <span>What&apos;s Packed Inside:</span>
                    <span className="text-ink">
                      {drop.itemCount} Full-Sized Essentials
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {drop.featuredItems.map((item) => (
                      <div
                        key={item.id}
                        title={`${item.name} (${formatINR(item.price)})`}
                        className="aspect-square rounded-btn border-width-theme border-line bg-surface overflow-hidden shadow-xs"
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
                <div className="pt-2 border-t border-line/20 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted block">
                        DROP BUNDLE PRICE
                      </span>
                      <span className="theme-price text-3xl font-black font-display">
                        {formatINR(drop.price)}
                      </span>
                    </div>

                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-btn bg-accent text-on-accent border-width-theme border-line">
                      #{drop.vibe}
                    </span>
                  </div>

                  {isLive ? (
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => handleClaimDrop(drop)}
                      className="w-full gap-2 font-black justify-center sticker-shadow"
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
                          <Check className="w-4 h-4 text-primary" />
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
