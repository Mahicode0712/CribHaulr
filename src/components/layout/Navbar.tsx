"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Sparkles, Flame, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { VibeSwitcher } from "./VibeSwitcher";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Builder", href: "/builder", icon: Sparkles, badge: "Build" },
    { name: "Catalog", href: "/catalog", icon: Package },
    { name: "Drops", href: "/drops", icon: Flame, badge: "Hot" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-deep/90 border-b-width-theme border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group select-none"
        >
          <div className="w-10 h-10 rounded-card bg-accent text-on-accent border-width-theme border-line flex items-center justify-center font-display font-black text-xl sticker-shadow group-hover:-rotate-6 transition-transform">
            📦
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-ink">
              Crib<span className="text-ink">Haulr</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-muted -mt-1 uppercase">
              Dorm Box Lab
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2 rounded-btn font-display font-bold text-sm transition-all border-width-theme",
                  isActive
                    ? "bg-surface border-line sticker-shadow text-ink"
                    : "border-transparent text-muted hover:text-ink hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-1 text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-accent text-on-accent border-width-theme border-line">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Vibe Switcher */}
        <div className="flex items-center gap-3">
          <VibeSwitcher />

          <ButtonLink
            href="/checkout"
            variant="secondary"
            size="sm"
            className="relative hidden sm:inline-flex gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-accent" />
            <span className="font-bold">Haul</span>
          </ButtonLink>

          <ButtonLink
            href="/builder"
            variant="primary"
            size="sm"
            className="hidden lg:inline-flex gap-1.5"
          >
            <span>Start Haul</span>
            <ArrowRight className="w-4 h-4" />
          </ButtonLink>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-btn border-width-theme border-line bg-surface text-ink sticker-shadow"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-t-width-theme border-line bg-surface space-y-3 shadow-lg">
          <nav className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-card font-display font-bold text-base border-width-theme",
                    isActive
                      ? "bg-primary text-on-primary border-line sticker-shadow"
                      : "border-line bg-secondary text-on-secondary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-xs uppercase font-black px-2 py-0.5 rounded-full bg-accent text-on-accent border-width-theme border-line">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <ButtonLink
              href="/builder"
              onClick={() => setMobileMenuOpen(false)}
              variant="primary"
              size="lg"
              className="w-full justify-between"
            >
              <span>Build Starter Box</span>
              <ArrowRight className="w-5 h-5" />
            </ButtonLink>

            <ButtonLink
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              variant="secondary"
              size="md"
              className="w-full justify-between"
            >
              <span>View Haul / Checkout</span>
              <ShoppingBag className="w-4 h-4" />
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
