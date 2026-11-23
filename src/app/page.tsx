"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Zap,
  Layers,
  CheckCircle2,
  ChevronDown,
  Star,
  Smartphone,
  Truck,
  RotateCcw,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { AnimatedBox } from "@/components/preview/AnimatedBox";
import { useTheme } from "@/context/ThemeContext";
import { useHaulStore } from "@/lib/store";
import { VIBES, VIBE_LIST, VibeId } from "@/data/vibes";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/lib/utils";

const FAQS = [
  {
    q: "Does this fit standard Indian hostel cots and study tables?",
    a: "100% yes. We measured standard furniture across IITs, NITs, BITS, Manipal, and DU hostels. Every single item (desk mats, clamp study lights, collapsible hampers, bed organizers) is calibrated for narrow 3x6ft single cots and laminate study desks.",
  },
  {
    q: "How does UPI-First payment work?",
    a: "Zero card numbers needed. At checkout, tap Google Pay, PhonePe, Paytm, or BHIM. Your banking app will open automatically for 1-tap PIN authorization. You can also scan our dynamic QR code or choose Cash on Delivery at your hostel gate.",
  },
  {
    q: "What is the Vibe Score (0-100) and how is it calculated?",
    a: "It's an algorithmic rating powered by pure math: it combines weighted item-vibe affinity tags (up to 70 pts), category diversity bonus across decor, study, comfort, utility, and munchies (up to 20 pts), and applies a penalty if you blow past your budget tier.",
  },
  {
    q: "What if an item arrives broken or my roommate hates it?",
    a: "We offer a 48-hour no-questions-asked campus replacement guarantee. If a fairy light strand arrives DOA or your mug cracks during courier transit, we dispatch a fresh replacement to your hostel gate immediately.",
  },
  {
    q: "What is Roommate Mode?",
    a: "You can copy a shared haul link or 6-character room code to invite your roommate. They can see what you picked, vote on whether they approve, add their own snacks or utility items, and split the final UPI total with you.",
  },
];

const REVIEWS = [
  {
    name: "Kabir S.",
    campus: "IIT Bombay • Hostel 16",
    vibe: "Dark Academia",
    quote: "My 8 AM fluid mechanics lectures are still brutal, but coming back to this Dark Academia setup makes me feel like a nocturnal scholar. The brass bookends and amber diffuser are certified quality.",
    rating: 5,
    avatar: "📜",
  },
  {
    name: "Rhea Menon",
    campus: "BITS Pilani • Meera Bhawan",
    vibe: "Kawaii Dream",
    quote: "The fairy lights + boba cushion + cat wrist rest saved my sanity during semester end-sems. 10/10 hostel glow-up. Literally everyone in my corridor dropped by to ask where I got it.",
    rating: 5,
    avatar: "🌸",
  },
  {
    name: "Tanmay Deshmukh",
    campus: "Manipal University • Block 14",
    vibe: "Neon Gamer",
    quote: "Paid with PhonePe in 5 seconds. Reached our hostel security desk in under 24 hours. The XXL RGB mousepad and lightning bolt sign made our battle station look absurdly clean.",
    rating: 5,
    avatar: "⚡",
  },
  {
    name: "Ananya Sharma",
    campus: "SRM Chennai • M-Block",
    vibe: "Cozy Dormcore",
    quote: "The 9:16 Instagram story export got 40+ DMs from batchmates asking where I built the box. The chunky chenille blanket alone was worth the ₹999 tier.",
    rating: 5,
    avatar: "🧶",
  },
];

export default function Home() {
  const { currentVibe, setVibe, vibeInfo } = useTheme();
  const { setBudgetTier, setVibe: setStoreVibe, clearBox, addItem } = useHaulStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroItems = PRODUCTS.filter((p) => p.vibes.includes(currentVibe)).slice(0, 4);

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
              ⚡ UPI 1-TAP CHECKOUT
            </Sticker>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-display text-[var(--text-primary)] leading-[1.06]">
            Your dorm desk deserves <br className="hidden sm:inline" />
            <span className="text-[var(--accent)] underline decoration-wavy decoration-3 underline-offset-8">
              better than chaos.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Pick your aesthetic vibe, lock your student budget tier, customize 4-5 handpicked essentials, and preview your room before paying with UPI. No generic SaaS boring nonsense.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link href="/builder">
              <Button size="lg" variant="primary" className="gap-2 text-base font-black shadow-[4px_4px_0px_var(--shadow-color)]">
                <Sparkles className="w-5 h-5" />
                <span>Launch Haul Builder</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/catalog">
              <Button size="lg" variant="secondary" className="text-base font-bold">
                Browse 40+ Essentials
              </Button>
            </Link>

            <Link href="/drops">
              <Button size="lg" variant="vibe" className="text-base font-bold gap-1.5">
                <span>Seasonal Drops</span>
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-rose-500 text-white">HOT</span>
              </Button>
            </Link>
          </div>

          {/* Micro Trust Points */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ships in 24h to Dorm Gate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>GPay, PhonePe & Paytm Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free 9:16 Instagram Story Card</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive 3D Box Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-color)] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{vibeInfo.emoji}</span>
                <span className="font-display font-black text-sm text-[var(--text-primary)]">
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

            <div className="mt-4 pt-3 border-t border-[var(--border-color)]/20 text-center">
              <Link href="/builder" className="text-xs font-black text-[var(--accent)] hover:underline inline-flex items-center gap-1">
                <span>Start customizing this box in the 3D builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC VIBE PICKER STRIP */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{vibeInfo.emoji}</span>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-[var(--text-primary)] tracking-tight">
                Pick Your Room Vibe
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-medium">
              Tap any vibe below to instantly re-theme the entire platform into that aesthetic.
            </p>
          </div>

          <Badge variant="outline">
            Active Theme: <strong className="text-[var(--accent)] ml-1">{currentVibe}</strong>
          </Badge>
        </div>

        {/* 5 Vibe Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {VIBE_LIST.map((vibe) => {
            const isSelected = vibe.id === currentVibe;
            return (
              <button
                key={vibe.id}
                onClick={() => setVibe(vibe.id as VibeId)}
                className={`text-left p-4 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[5px_5px_0px_var(--shadow-color)] -translate-y-1"
                    : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    {vibe.emoji}
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)]">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-display font-extrabold text-base leading-tight">
                    {vibe.name.split("/")[0].trim()}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? "text-[var(--accent-text)]/90" : "text-[var(--text-muted)]"}`}>
                    {vibe.tagline}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {vibe.moodKeywords.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        isSelected
                          ? "bg-[var(--bg-card)]/20 text-[var(--accent-text)]"
                          : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
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
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Sticker color="vibe" tilt="none">
            ⚡ 3-STEP FLOW
          </Sticker>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--text-primary)]">
            How CribHaulr Works
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Zero decision fatigue. From bare hostel cot to certified aesthetic sanctuary in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center font-display font-black text-xl border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]">
              01
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                Choose Space & Vibe
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Pick your target zone (Desk, Bed Corner, or Full Room), select your budget tier (₹499, ₹999, ₹1999), and tap your room aesthetic.
              </p>
            </div>
          </Card>

          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] flex items-center justify-center font-display font-black text-xl border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]">
              02
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                Auto-Build & Customise
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Our algorithm generates a balanced 4-5 item starter haul. Swap products, add ramen or cable clips, and watch your live Vibe Score update.
              </p>
            </div>
          </Card>

          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--sticker-bg)] text-[var(--sticker-text)] flex items-center justify-center font-display font-black text-xl border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]">
              03
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                Live Scene & UPI Checkout
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Preview your items placed in the mock room scene, export a 9:16 Instagram story card, and pay in 1-tap with GPay, PhonePe, or Paytm.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. FEATURED BUDGET TIERS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[var(--border-color)] pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[var(--text-primary)]">
              Certified Student Tiers
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-medium">
              Transparent, student-budget pricing. Zero hidden fees.
            </p>
          </div>

          <Link href="/builder">
            <Button variant="outline" size="sm" className="gap-1">
              <span>Customise in Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <Card hoverEffect className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[var(--text-muted)]">
                  Fresher Starter
                </span>
                <Badge variant="default">Budget Pick</Badge>
              </div>
              <div className="text-4xl font-black font-display text-[var(--text-primary)]">
                ₹499
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Essential desk upgrade with copper fairy lights, cable organizer, and hostel midnight noodles.
              </p>
              <ul className="text-xs space-y-2 pt-2 text-[var(--text-secondary)] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3 - 4 Starter Essentials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Vinyl Sticker Sheet</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hostel Gate Delivery</span>
                </li>
              </ul>
            </div>

            <Link href="/builder" onClick={() => handleSelectTier(499)}>
              <Button variant="secondary" size="md" className="w-full">
                Build ₹499 Haul
              </Button>
            </Link>
          </Card>

          {/* Tier 2 */}
          <Card
            hoverEffect
            glow
            className="p-6 flex flex-col justify-between space-y-6 border-3 relative"
          >
            <div className="absolute -top-3 right-6">
              <Sticker color="vibe" tilt="right">
                🔥 MOST POPULAR
              </Sticker>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[var(--accent)]">
                  Hostel Core
                </span>
                <Badge variant="accent">Best Value</Badge>
              </div>
              <div className="text-4xl font-black font-display text-[var(--text-primary)]">
                ₹999
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The campus sweet spot: full aesthetic desk mat, clip study lamp, boba plush cushion, and power strip.
              </p>
              <ul className="text-xs space-y-2 pt-2 text-[var(--text-secondary)] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>4 - 5 Balanced Vibe Items</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>90+ Guaranteed Vibe Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free 9:16 Instagram Story Card</span>
                </li>
              </ul>
            </div>

            <Link href="/builder" onClick={() => handleSelectTier(999)}>
              <Button variant="primary" size="md" className="w-full shadow-[3px_3px_0px_var(--shadow-color)]">
                Build ₹999 Haul
              </Button>
            </Link>
          </Card>

          {/* Tier 3 */}
          <Card hoverEffect className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[var(--text-muted)]">
                  Baller Suite
                </span>
                <Badge variant="default">Luxury Drip</Badge>
              </div>
              <div className="text-4xl font-black font-display text-[var(--text-primary)]">
                ₹1,999
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Full dorm transformation: chunky chenille throw, neon sign, stainless insulated flask, and surge protection.
              </p>
              <ul className="text-xs space-y-2 pt-2 text-[var(--text-secondary)] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5 - 7 Premium Essentials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Roommate Split Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>VIP Priority Campus Dispatch</span>
                </li>
              </ul>
            </div>

            <Link href="/builder" onClick={() => handleSelectTier(1999)}>
              <Button variant="secondary" size="md" className="w-full">
                Build ₹1,999 Haul
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* 5. UGC / SOCIAL PROOF GRID */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Sticker color="yellow" tilt="left">
            ⭐ CAMPUS APPROVED
          </Sticker>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--text-primary)]">
            Approved by 4,200+ Hostel Residents
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Real feedback from students across top engineering, medical, and design campuses in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev, idx) => (
            <Card key={idx} hoverEffect className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{rev.avatar}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed italic">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)]/20">
                <div className="font-display font-black text-xs text-[var(--text-primary)]">
                  {rev.name}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-bold">
                  {rev.campus}
                </div>
                <span className="inline-block mt-1 text-[9px] font-bold text-[var(--accent)]">
                  #{rev.vibe}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black font-display text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Everything you need to know about dorm delivery, payment, and room dimensions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] shadow-[3px_3px_0px_var(--shadow-color)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-display font-black text-sm text-[var(--text-primary)] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--accent)] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[var(--text-secondary)] font-medium leading-relaxed border-t border-[var(--border-color)]/20 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PLAYFUL FOOTER */}
      <footer className="pt-12 border-t-3 border-[var(--border-color)] space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] border-2 border-[var(--border-color)] flex items-center justify-center font-display font-black text-2xl shadow-[2px_2px_0px_var(--shadow-color)]">
              📦
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-[var(--text-primary)]">
                Crib<span className="text-[var(--accent)]">Haulr</span>
              </span>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">
                Build-your-own dorm aesthetic box • UPI-First • Made in India
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-display font-bold">
            <Link href="/builder" className="hover:text-[var(--accent)]">
              Builder
            </Link>
            <Link href="/catalog" className="hover:text-[var(--accent)]">
              Catalog
            </Link>
            <Link href="/drops" className="hover:text-[var(--accent)]">
              Seasonal Drops
            </Link>
            <Link href="/checkout" className="hover:text-[var(--accent)]">
              Checkout
            </Link>
            <Link href="/share" className="hover:text-[var(--accent)]">
              Story Card
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-medium border-t border-[var(--border-color)]/20 pt-4">
          <span>&copy; {new Date().getFullYear()} CribHaulr. Built for Indian college dorm & hostel survivors.</span>
          <span className="flex items-center gap-1 font-bold">
            <span>Powered by Next.js & Turbopack</span>
            <span>•</span>
            <span className="text-[var(--accent)]">WCAG AA Compliant</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
