"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import {
  Download,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { StoryCard } from "@/components/share/StoryCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { useHaulStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { getThemeConfettiColors } from "@/lib/theme";

const STORY_THEME_TOKENS = [
  "--bg",
  "--surface",
  "--ink",
  "--primary",
  "--secondary",
  "--accent",
  "--on-primary",
  "--on-secondary",
  "--on-accent",
  "--border",
  "--shadow-color",
  "--shadow-offset",
  "--muted",
  "--radius-card",
  "--radius-btn",
  "--border-w",
] as const;

export default function SharePage() {
  const { items, space, budgetTier, vibe, getTotalPrice, getVibeScore } = useHaulStore();

  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Aesthetic Hostel Resident");
  const [hostelRoom, setHostelRoom] = useState("Room 304, Block-B");

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();

  const getShareUrl = () => {
    const url = new URL("/builder", window.location.origin);
    url.searchParams.set("vibe", vibe);
    url.searchParams.set("tier", String(budgetTier));
    url.searchParams.set("space", space);
    url.searchParams.set("items", items.map((item) => item.id).join(","));
    return url.toString();
  };

  // 1. Download Card as 1080x1920 PNG
  const handleDownloadPNG = async () => {
    const card = cardRef.current;
    if (!card) return;
    setIsExporting(true);
    setActionError(null);
    const previousTokens = new Map<string, string>();

    try {
      // Trigger canvas confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: getThemeConfettiColors(),
      });

      const cardStyles = getComputedStyle(card);
      for (const token of STORY_THEME_TOKENS) {
        const value = cardStyles.getPropertyValue(token).trim();
        if (!value) {
          throw new Error(`Missing required story card theme token: ${token}`);
        }
        previousTokens.set(token, card.style.getPropertyValue(token));
        card.style.setProperty(token, value);
      }

      const dataUrl = await toPng(card, {
        cacheBust: true,
        pixelRatio: 3, // 3x pixel ratio gives crisp 1080x1920 high-res output
      });

      const link = document.createElement("a");
      link.download = `cribhaulr-${vibe}-story.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export PNG failed:", err);
      setActionError("Could not export the story card. Please try again.");
    } finally {
      for (const [token, value] of previousTokens) {
        if (value) card.style.setProperty(token, value);
        else card.style.removeProperty(token);
      }
      setIsExporting(false);
    }
  };

  // 2. Web Share API
  const handleWebShare = async () => {
    setActionError(null);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my CribHaulr Dorm Box!",
          text: `I just curated a ${vibe.toUpperCase()} dorm haul with a ${vibeScore.score}/100 Vibe Score for ${formatINR(totalPrice)}!`,
          url: getShareUrl(),
        });
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        console.error("Web Share failed:", cause);
        setActionError("Sharing is unavailable. Try copying the haul link instead.");
      }
    } else {
      await handleCopyLink();
    }
  };

  // 3. Copy Link to Clipboard
  const handleCopyLink = async () => {
    setActionError(null);
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (cause) {
      console.error("Copy haul link failed:", cause);
      setActionError("Could not copy the haul link. Check clipboard permissions and try again.");
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Breadcrumb & Title */}
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
              Social Proof & Card Generator
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-ink tracking-tight">
            Instagram Story Haul Card
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium mt-1">
            Flex your dorm aesthetic to your college group or story in vertical 9:16 format.
          </p>
        </div>

        <ButtonLink href="/checkout" variant="primary" size="md" className="gap-2">
          <ShoppingBag className="w-4 h-4" />
          <span>Proceed to Checkout</span>
        </ButtonLink>
      </div>

      {/* Main Layout: Card Preview on Left, Customizer & Export on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Story Card View */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-2 sm:p-6 bg-secondary/50 border-width-theme border-line rounded-card">
          <div className="scale-[0.9] sm:scale-100 origin-top">
            <StoryCard
              ref={cardRef}
              items={items}
              vibe={vibe}
              space={space}
              budgetTier={budgetTier}
              totalPrice={totalPrice}
              vibeScore={vibeScore.score}
              userName={userName}
              hostelRoom={hostelRoom}
            />
          </div>
          <span className="text-[11px] text-muted font-medium mt-3">
            Exact 9:16 (1080×1920) Story Card Output
          </span>
        </div>

        {/* Right Column: Customization Controls & Export Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card Label Customizer */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-line/20 pb-3">
              <h3 className="font-display font-black text-base text-ink">
                Personalize Your Story Card
              </h3>
              <Sticker color="vibe" tilt="right">
                📸 FLEX CARD
              </Sticker>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="share-name" className="text-xs font-bold font-display uppercase tracking-wider text-muted block mb-1">
                  Your Name / Handle:
                </label>
                <input
                  id="share-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-card border-width-theme border-line bg-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="share-hostel-room" className="text-xs font-bold font-display uppercase tracking-wider text-muted block mb-1">
                  Hostel & Room Target:
                </label>
                <input
                  id="share-hostel-room"
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  placeholder="e.g. Room 204, Ganga Hostel"
                  className="w-full px-3.5 py-2.5 rounded-card border-width-theme border-line bg-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          {/* Quick Export Action Buttons */}
          <Card className="space-y-4">
            <h3 className="font-display font-black text-base text-ink">
              Export & Share
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Download PNG Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="gap-2 justify-center w-full sticker-shadow"
              >
                <Download className="w-5 h-5" />
                <span>{isExporting ? "Rendering PNG..." : "Download PNG"}</span>
              </Button>

              {/* Native Web Share */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleWebShare}
                className="gap-2 justify-center w-full sticker-shadow"
              >
                <Share2 className="w-5 h-5 text-accent" />
                <span>Share Story</span>
              </Button>
            </div>

            {/* Copy Link Button */}
            <Button
              variant="outline"
              size="md"
              onClick={() => void handleCopyLink()}
              className="gap-2 w-full justify-center"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-primary stroke-[3]" />
                  <span className="text-primary font-bold">Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Shareable Haul Link</span>
                </>
              )}
            </Button>
            {actionError && (
              <p role="alert" className="text-sm font-bold text-primary">
                {actionError}
              </p>
            )}
          </Card>

          {/* Roommate Mode Teaser */}
          <Card className="p-4 bg-secondary/60 border-width-theme border-line flex items-start gap-3">
            <div className="w-10 h-10 rounded-card bg-accent text-on-accent flex items-center justify-center font-bold text-lg border-width-theme border-line shrink-0">
              👥
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-black text-sm text-ink">
                Roommate Mode Enabled
              </h4>
              <p className="text-xs text-muted">
                Copying this link shares your item list and vibe configuration so your roommates can compare ideas.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
