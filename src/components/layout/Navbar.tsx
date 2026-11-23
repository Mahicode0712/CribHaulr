"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Sparkles, Flame, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { VibeSwitcher } from "./VibeSwitcher";
import { Button } from "@/components/ui/Button";
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg-primary)]/90 border-b-2 border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] border-2 border-[var(--border-color)] flex items-center justify-center font-display font-black text-xl shadow-[2px_2px_0px_var(--shadow-color)] group-hover:-rotate-6 transition-transform">
            📦
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
              Crib<span className="text-[var(--accent)]">Haulr</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] -mt-1 uppercase">
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
                  "relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-display font-bold text-sm transition-all border-2",
                  isActive
                    ? "bg-[var(--bg-card)] border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-1 text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)]">
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

          <Link href="/checkout" className="relative hidden sm:inline-flex">
            <Button variant="secondary" size="sm" className="gap-2">
              <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-bold">Haul</span>
            </Button>
          </Link>

          <Link href="/builder" className="hidden lg:inline-flex">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>Start Haul</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[2px_2px_0px_var(--shadow-color)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-t-2 border-[var(--border-color)] bg-[var(--bg-card)] space-y-3 shadow-lg">
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
                    "flex items-center justify-between px-4 py-3 rounded-2xl font-display font-bold text-base border-2",
                    isActive
                      ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]"
                      : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-xs uppercase font-black px-2 py-0.5 rounded-full bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/builder"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" size="lg" className="w-full justify-between">
                <span>Build Starter Box</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="secondary" size="md" className="w-full justify-between">
                <span>View Haul / Checkout</span>
                <ShoppingBag className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
