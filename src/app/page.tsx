"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Lightbulb,
  Coffee,
  Flame,
  BookOpen,
  Pencil,
  Gamepad2,
  Zap,
  Headphones,
  NotebookPen,
  Package,
  Heart,
  Cloud,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { AnimatedBox } from "@/components/preview/AnimatedBox";
import { useTheme } from "@/context/ThemeContext";
import { useHaulStore } from "@/lib/store";
import { VIBE_LIST, type VibeId, type VibeIconName } from "@/data/vibes";
import { PRODUCTS } from "@/data/products";
import { generateStarterBox } from "@/lib/starterBox";

const FAQS = [
  {
    q: "Does this fit standard Indian hostel cots and study tables?",
    a: "This preview uses mock product data, so fit and measurements are not verified. Check item dimensions against your room before ordering from a real store.",
  },
  {
    q: "How does UPI-First payment work?",
    a: "This is a checkout UI preview. You can explore UPI apps, a sample QR, cards, and COD, but no banking app opens and no payment is collected.",
  },
  {
    q: "What is the Vibe Score (0-100) and how is it calculated?",
    a: "It's an algorithmic rating powered by pure math: it combines weighted item-vibe affinity tags (up to 70 pts), category diversity bonus across decor, study, comfort, utility, and munchies (up to 20 pts), and applies a penalty if you blow past your budget tier.",
  },
  {
    q: "What if an item arrives broken or my roommate hates it?",
    a: "Returns and replacements are not configured in this prototype. A live store should publish a clear, verified policy before taking orders.",
  },
  {
    q: "What is Roommate Mode?",
    a: "Copy a link with your selected items and vibe to show a roommate. Voting and bill-splitting are not connected in this preview.",
  },
];

const REVIEWS = [
  {
    name: "Sample student 01",
    campus: "Demo content • Dark Academia",
    vibe: "Dark Academia",
    quote: "Brass-toned bookends, warm light, and a well-loved notebook make a late-night study corner feel like a tiny archive.",
    rating: 5,
    avatar: "📜",
  },
  {
    name: "Sample student 02",
    campus: "Demo content • Kawaii Dream",
    vibe: "Kawaii Dream",
    quote: "Fairy lights, a boba cushion, and pastel desk bits are a cute little reset after a long day on campus.",
    rating: 5,
    avatar: "🌸",
  },
  {
    name: "Sample student 03",
    campus: "Demo content • Neon Gamer",
    vibe: "Neon Gamer",
    quote: "An XXL RGB mousepad, a neon sign, and fewer cable tangles: battle-station energy without taking over the whole room.",
    rating: 5,
    avatar: "⚡",
  },
  {
    name: "Sample student 04",
    campus: "Demo content • Cozy Dormcore",
    vibe: "Cozy Dormcore",
    quote: "A chunky throw, warm desk light, and a shareable story card make a cozy corner feel complete.",
    rating: 5,
    avatar: "🧶",
  },
];

const VIBE_ICONS: Record<VibeIconName, LucideIcon> = {
  lightbulb: Lightbulb,
  coffee: Coffee,
  flame: Flame,
  book: BookOpen,
  candle: Flame,
  pencil: Pencil,
  gamepad: Gamepad2,
  bolt: Zap,
  headphones: Headphones,
  notebook: NotebookPen,
  box: Package,
  heart: Heart,
  star: Star,
  cloud: Cloud,
};

export default function Home() {
  const { currentVibe, setVibe, vibeInfo } = useTheme();
  const { setBudgetTier } = useHaulStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroItems = generateStarterBox(PRODUCTS, "desk", 999, currentVibe);

  const handleSelectVibe = (selectedVibe: VibeId) => {
    setVibe(selectedVibe);
  };

  const handleSelectTier = (tier: 499 | 999 | 1999) => {
    setBudgetTier(tier);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20 pb-32">
      {/* 1. HERO SECTION WITH ANIMATED 3D BOX */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 sm:pt-6">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Tilted Sticker Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <Sticker color="vibe" tilt="left">
              📦 BUILD-YOUR-OWN DORM BOX
            </Sticker>
            <Badge variant="accent">
              ₹499 • ₹999 • ₹1999 Tiers
            </Badge>
            <Sticker color="yellow" tilt="right">
              ⚡ UPI-FIRST CHECKOUT PREVIEW
            </Sticker>
          </div>

          <h1 className="vibe-headline text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-display text-ink leading-[1.06]">
            {vibeInfo.headline}
          </h1>
          <div className="theme-headline-rule h-0.5 w-20 bg-transparent mx-auto lg:mx-0" aria-hidden="true" />
          <div className="flex items-center justify-center lg:justify-start gap-2" aria-label={`${vibeInfo.name} motifs`}>
            {vibeInfo.iconNames.map((iconName) => {
              const Icon = VIBE_ICONS[iconName];
              return (
                <span key={iconName} className="flex h-10 w-10 items-center justify-center rounded-btn border-width-theme border-line bg-secondary text-on-secondary sticker-shadow">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
              );
            })}
            <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted">
              {vibeInfo.stickerLabel}
            </span>
          </div>

          <p className="text-base sm:text-xl text-muted font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Pick your aesthetic vibe, lock your student budget tier, customize up to five handpicked essentials, and preview the demo checkout. No generic SaaS boring nonsense.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <ButtonLink href="/builder" size="lg" variant="primary" className="gap-2 text-base font-black sticker-shadow">
              <Sparkles className="w-5 h-5" />
              <span>Launch Haul Builder</span>
              <ArrowRight className="w-5 h-5" />
            </ButtonLink>

            <ButtonLink href="/catalog" size="lg" variant="secondary" className="text-base font-bold">
              Browse 40+ Essentials
            </ButtonLink>

            <ButtonLink href="/drops" size="lg" variant="vibe" className="text-base font-bold gap-1.5">
              <span>Seasonal Drops</span>
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-primary text-on-primary">HOT</span>
            </ButtonLink>
          </div>

          {/* Micro Trust Points */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Hostel-gate delivery preview</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>UPI-first checkout preview</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free 9:16 Instagram Story Card</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive 3D Box Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md p-6 rounded-card bg-surface border-width-theme border-line sticker-shadow relative">
            <div className="flex items-center justify-between pb-3 border-b-width-theme border-line mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{vibeInfo.emoji}</span>
                <span className="font-display font-black text-sm text-ink">
                  Live {vibeInfo.name.split("/")[0].trim()} Haul Box
                </span>
              </div>
              <Badge variant="accent">₹999 Tier</Badge>
            </div>

            <AnimatedBox
              items={heroItems}
              vibe={currentVibe}
              totalPrice={heroItems.reduce((s, i) => s + i.price, 0)}
            />

            <div className="mt-4 pt-3 border-t border-line/20 text-center">
              <Link href="/builder" className="text-xs font-black text-ink hover:underline inline-flex items-center gap-1">
                <span>Start customizing this box in the 3D builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC VIBE PICKER STRIP */}
      <section className="relative space-y-6">
        <SectionDivider />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-width-theme border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{vibeInfo.emoji}</span>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-ink tracking-tight">
                Pick Your Room Vibe
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted mt-1 font-medium">
              Tap any vibe below to instantly re-theme the entire platform into that aesthetic.
            </p>
          </div>

          <Badge variant="outline">
            Active Theme: <strong className="text-ink ml-1">{currentVibe}</strong>
          </Badge>
        </div>

        {/* 5 Vibe Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {VIBE_LIST.map((vibe) => {
            const isSelected = vibe.id === currentVibe;
            return (
              <button
                key={vibe.id}
                type="button"
                aria-pressed={isSelected}
                data-vibe={vibe.id}
                onClick={() => handleSelectVibe(vibe.id)}
                className={`vibe-picker-card text-left p-4 rounded-card border-width-theme transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? "bg-primary text-on-primary border-line sticker-shadow -translate-y-1"
                    : "bg-bg text-ink border-line sticker-shadow hover:-translate-y-0.5 hover:sticker-shadow"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl p-2 rounded-card bg-secondary text-on-secondary border-width-theme border-line">
                    {vibe.emoji}
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface text-ink border-width-theme border-line">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-display font-extrabold text-base leading-tight">
                    {vibe.name.split("/")[0].trim()}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? "text-on-primary" : "text-muted"}`}>
                    {vibe.tagline}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {vibe.moodKeywords.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-btn uppercase tracking-wider ${
                        isSelected
                          ? "bg-surface/20 text-on-primary"
                          : "bg-secondary text-on-secondary"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="relative space-y-8">
        <SectionDivider />
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Sticker color="vibe" tilt="none">
            ⚡ 3-STEP FLOW
          </Sticker>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-ink">
            How CribHaulr Works
          </h2>
          <p className="text-sm text-muted font-medium">
            Zero decision fatigue. Build a room setup that feels like yours in a few taps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-card bg-accent text-on-accent flex items-center justify-center font-display font-black text-xl border-width-theme border-line sticker-shadow">
              01
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black font-display text-ink">
                Choose Space & Vibe
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Pick your target zone (Desk, Bed Corner, or Full Room), select your budget tier (₹499, ₹999, ₹1999), and tap your room aesthetic.
              </p>
            </div>
          </Card>

          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-card bg-secondary text-on-secondary flex items-center justify-center font-display font-black text-xl border-width-theme border-line sticker-shadow">
              02
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black font-display text-ink">
                Auto-Build & Customise
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Our algorithm generates the best affordable starter haul for your tier. Swap products, add ramen or cable clips, and watch your live Vibe Score update.
              </p>
            </div>
          </Card>

          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-card bg-accent text-on-accent flex items-center justify-center font-display font-black text-xl border-width-theme border-line sticker-shadow">
              03
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black font-display text-ink">
                Live Scene & UPI Checkout
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Preview your items in the mock room scene, export a 9:16 Instagram story card, and explore the UPI-first checkout demo.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. FEATURED BUDGET TIERS */}
      <section className="relative space-y-8">
        <SectionDivider />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-width-theme border-line pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-ink">
              Certified Student Tiers
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 font-medium">
              Transparent, student-budget pricing. Zero hidden fees.
            </p>
          </div>

          <ButtonLink href="/builder" variant="outline" size="sm" className="gap-1">
            <span>Customise in Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <Card hoverEffect className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-muted">
                  Fresher Starter
                </span>
                <Badge variant="default">Budget Pick</Badge>
              </div>
              <div className="theme-price text-4xl font-black font-display">
                ₹499
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Essential desk upgrade with copper fairy lights, cable organizer, and hostel midnight noodles.
              </p>
              <ul className="text-xs space-y-2 pt-2 text-muted font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Vibe-matched essentials under ₹499</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Free Vinyl Sticker Sheet</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Delivery UI preview</span>
                </li>
              </ul>
            </div>

            <ButtonLink href="/builder" onClick={() => handleSelectTier(499)} variant="secondary" size="md" className="w-full">
              Build ₹499 Haul
            </ButtonLink>
          </Card>

          {/* Tier 2 */}
          <Card
            hoverEffect
            glow
            className="p-6 flex flex-col justify-between space-y-6 border-width-theme relative"
          >
            <div className="absolute -top-3 right-6">
              <Sticker color="vibe" tilt="right">
                🔥 MOST POPULAR
              </Sticker>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-ink">
                  Hostel Core
                </span>
                <Badge variant="accent">Best Value</Badge>
              </div>
              <div className="theme-price text-4xl font-black font-display">
                ₹999
              </div>
              <p className="text-xs text-muted leading-relaxed">
                The campus sweet spot: full aesthetic desk mat, clip study lamp, boba plush cushion, and power strip.
              </p>
              <ul className="text-xs space-y-2 pt-2 text-muted font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Up to 5 balanced vibe items</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Live Vibe Score as you build</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Free 9:16 Instagram Story Card</span>
                </li>
              </ul>
            </div>

            <ButtonLink href="/builder" onClick={() => handleSelectTier(999)} variant="primary" size="md" className="w-full sticker-shadow">
              Build ₹999 Haul
            </ButtonLink>
          </Card>

          {/* Tier 3 */}
          <Card hoverEffect className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-muted">
                  Baller Suite
                </span>
                <Badge variant="default">Luxury Drip</Badge>
              </div>
              <div className="theme-price text-4xl font-black font-display">
                ₹1,999
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Full dorm transformation: chunky chenille throw, neon sign, stainless insulated flask, and surge protection.
              </p>
              <ul className="text-xs space-y-2 pt-2 text-muted font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Up to 5 premium essentials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Roommate share-link preview</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Priority delivery not connected</span>
                </li>
              </ul>
            </div>

            <ButtonLink href="/builder" onClick={() => handleSelectTier(1999)} variant="secondary" size="md" className="w-full">
              Build ₹1,999 Haul
            </ButtonLink>
          </Card>
        </div>
      </section>

      {/* 5. UGC / SOCIAL PROOF GRID */}
      <section className="relative space-y-8">
        <SectionDivider />
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Sticker color="yellow" tilt="left">
            ⭐ CAMPUS APPROVED
          </Sticker>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-ink">
            Sample Hostel Haul Reactions
          </h2>
          <p className="text-sm text-muted font-medium">
            Illustrative demo copy only—not verified customer reviews or real student feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev, idx) => (
            <Card key={idx} hoverEffect className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{rev.avatar}</span>
                  <div className="flex items-center text-accent">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted font-medium leading-relaxed italic">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-line/20">
                <div className="font-display font-black text-xs text-ink">
                  {rev.name}
                </div>
                <div className="text-[10px] text-muted font-bold">
                  {rev.campus}
                </div>
                <span className="inline-block mt-1 text-[9px] font-bold text-ink">
                  #{rev.vibe}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="relative space-y-6 max-w-3xl mx-auto">
        <SectionDivider />
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black font-display text-ink">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Everything you need to know about dorm delivery, payment, and room dimensions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-card border-width-theme border-line bg-surface sticker-shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-display font-black text-sm text-ink flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-accent shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-muted font-medium leading-relaxed border-t border-line/20 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PLAYFUL FOOTER */}
      <footer className="pt-12 border-t-width-theme border-line space-y-8 bg-deep">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-card bg-accent text-on-accent border-width-theme border-line flex items-center justify-center font-display font-black text-2xl sticker-shadow">
              📦
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-ink">
                Crib<span className="text-ink">Haulr</span>
              </span>
              <p className="text-[11px] text-muted font-medium">
                Build-your-own dorm aesthetic box • UPI-First • Made in India
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-display font-bold">
            <Link href="/builder" className="hover:text-ink">
              Builder
            </Link>
            <Link href="/catalog" className="hover:text-ink">
              Catalog
            </Link>
            <Link href="/drops" className="hover:text-ink">
              Seasonal Drops
            </Link>
            <Link href="/checkout" className="hover:text-ink">
              Checkout
            </Link>
            <Link href="/share" className="hover:text-ink">
              Story Card
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted font-medium border-t border-line/20 pt-4">
          <span>&copy; {new Date().getFullYear()} CribHaulr. Built for Indian college dorm & hostel survivors.</span>
          <span className="flex items-center gap-1 font-bold">
            <span>Powered by Next.js & Turbopack</span>
            <span>•</span>
            <span className="text-ink">WCAG AA Compliant</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
