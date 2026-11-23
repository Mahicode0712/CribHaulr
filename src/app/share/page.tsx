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
  Sparkles,
  ShoppingBag,
  QrCode,
  Flame,
} from "lucide-react";
import { StoryCard } from "@/components/share/StoryCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";

export default function SharePage() {
  const { currentVibe } = useTheme();
  const { items, space, budgetTier, vibe, getTotalPrice, getVibeScore } = useHaulStore();

  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [userName, setUserName] = useState("Aesthetic Hostel Resident");
  const [hostelRoom, setHostelRoom] = useState("Room 304, Block-B");

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();

  // 1. Download Card as 1080x1920 PNG
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      // Trigger canvas confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D96B43", "#F5E3A9", "#00F0FF", "#FF5E8E", "#39FF14"],
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // 3x pixel ratio gives crisp 1080x1920 high-res output
      });

      const link = document.createElement("a");
      link.download = `cribhaulr-${vibe}-story.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export PNG failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Web Share API
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my CribHaulr Dorm Box!",
          text: `I just curated a ${vibe.toUpperCase()} dorm haul with a ${vibeScore.score}/100 Vibe Score for ${formatINR(totalPrice)}!`,
          url: typeof window !== "undefined" ? window.location.href : "https://cribhaulr.in",
        });
      } catch {
        // User dismissed share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  // 3. Copy Link to Clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/builder?vibe=${vibe}&tier=${budgetTier}&space=${space}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Breadcrumb & Title */}
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
              Social Proof & Card Generator
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)] tracking-tight">
            Instagram Story Haul Card
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Flex your dorm aesthetic to your college group or story in vertical 9:16 format.
          </p>
        </div>

        <Link href="/checkout">
          <Button variant="primary" size="md" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Proceed to Checkout</span>
          </Button>
        </Link>
      </div>

      {/* Main Layout: Card Preview on Left, Customizer & Export on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Story Card View */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-2 sm:p-6 bg-[var(--bg-secondary)]/50 border-2 border-[var(--border-color)] rounded-3xl">
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
          <span className="text-[11px] text-[var(--text-muted)] font-medium mt-3">
            Exact 9:16 (1080×1920) Story Card Output
          </span>
        </div>

        {/* Right Column: Customization Controls & Export Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card Label Customizer */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)]/20 pb-3">
              <h3 className="font-display font-black text-base text-[var(--text-primary)]">
                Personalize Your Story Card
              </h3>
              <Sticker color="vibe" tilt="right">
                📸 FLEX CARD
              </Sticker>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  Your Name / Handle:
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  Hostel & Room Target:
                </label>
                <input
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  placeholder="e.g. Room 204, Ganga Hostel"
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>
          </Card>

          {/* Quick Export Action Buttons */}
          <Card className="space-y-4">
            <h3 className="font-display font-black text-base text-[var(--text-primary)]">
              Export & Share
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Download PNG Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="gap-2 justify-center w-full shadow-[4px_4px_0px_var(--shadow-color)]"
              >
                <Download className="w-5 h-5" />
                <span>{isExporting ? "Rendering PNG..." : "Download PNG"}</span>
              </Button>

              {/* Native Web Share */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleWebShare}
                className="gap-2 justify-center w-full shadow-[4px_4px_0px_var(--shadow-color)]"
              >
                <Share2 className="w-5 h-5 text-[var(--accent)]" />
                <span>Share Story</span>
              </Button>
            </div>

            {/* Copy Link Button */}
            <Button
              variant="outline"
              size="md"
              onClick={handleCopyLink}
              className="gap-2 w-full justify-center"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-bold">Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Shareable Haul Link</span>
                </>
              )}
            </Button>
          </Card>

          {/* Roommate Mode Teaser */}
          <Card className="p-4 bg-[var(--bg-secondary)]/60 border-2 border-[var(--border-color)] flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--sticker-bg)] text-[var(--sticker-text)] flex items-center justify-center font-bold text-lg border-2 border-[var(--border-color)] shrink-0">
              👥
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-black text-sm text-[var(--text-primary)]">
                Roommate Mode Enabled
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Copying this link shares your exact item manifest and vibe configuration so your roommates can vote on additions or split the UPI bill.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
