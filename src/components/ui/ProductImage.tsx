import React from "react";
import { ProductCategory } from "@/types";

interface ProductImageProps {
  category: ProductCategory;
  name: string;
  className?: string;
  sprite?: string;
}

/**
 * Aesthetic SVG Product Visualizer
 * Provides crisp, playful illustrated vector graphics for all product categories,
 * ensuring zero missing image broken links while allowing instant image swapping.
 */
export function ProductImage({
  category,
  name,
  className = "w-full h-full",
  sprite,
}: ProductImageProps) {
  // Category-based color schemes and SVG motifs
  switch (category) {
    case "decor":
      return (
        <div
          className={`flex items-center justify-center bg-amber-500/10 border-b-2 border-[var(--border-color)] overflow-hidden relative ${className}`}
        >
          <svg
            className="w-2/3 h-2/3 text-[var(--accent)] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Hanging fairy lights & frame motif */}
            <path d="M10 25 Q 35 40 50 25 T 90 25" strokeDasharray="3 3" />
            <circle cx="25" cy="32" r="5" fill="#F5E3A9" stroke="currentColor" />
            <circle cx="50" cy="25" r="5" fill="#FF5E8E" stroke="currentColor" />
            <circle cx="75" cy="32" r="5" fill="#00F0FF" stroke="currentColor" />
            {/* Framed wall art motif */}
            <rect
              x="30"
              y="45"
              width="40"
              height="45"
              rx="6"
              fill="var(--bg-card)"
              stroke="currentColor"
            />
            <circle cx="50" cy="62" r="8" fill="#FCE8E0" stroke="currentColor" />
            <path d="M35 80 Q 50 68 65 80" stroke="currentColor" fill="none" />
          </svg>
          <span className="absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]">
            ✨ Decor
          </span>
        </div>
      );

    case "desk":
      return (
        <div
          className={`flex items-center justify-center bg-blue-500/10 border-b-2 border-[var(--border-color)] overflow-hidden relative ${className}`}
        >
          <svg
            className="w-2/3 h-2/3 text-[var(--accent)] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Laptop & desk stand motif */}
            <rect
              x="20"
              y="25"
              width="60"
              height="40"
              rx="4"
              fill="var(--bg-card)"
              stroke="currentColor"
            />
            <rect x="25" y="30" width="50" height="30" rx="2" fill="var(--bg-secondary)" />
            <path d="M10 70 L 90 70 L 85 75 L 15 75 Z" fill="currentColor" stroke="currentColor" />
            <path d="M45 72 L 55 72" stroke="var(--bg-card)" strokeWidth="2" />
            {/* Pen cup & accessories */}
            <rect
              x="75"
              y="45"
              width="15"
              height="25"
              rx="3"
              fill="var(--sticker-bg)"
              stroke="currentColor"
            />
            <line x1="78" y1="45" x2="74" y2="35" stroke="currentColor" />
            <line x1="85" y1="45" x2="88" y2="33" stroke="currentColor" />
          </svg>
          <span className="absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]">
            💻 Study
          </span>
        </div>
      );

    case "comfort":
      return (
        <div
          className={`flex items-center justify-center bg-rose-500/10 border-b-2 border-[var(--border-color)] overflow-hidden relative ${className}`}
        >
          <svg
            className="w-2/3 h-2/3 text-[var(--accent)] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Fluffy cushion & throw blanket */}
            <rect
              x="25"
              y="30"
              width="50"
              height="50"
              rx="18"
              fill="var(--bg-card)"
              stroke="currentColor"
            />
            <path
              d="M30 35 Q 50 50 70 35 Q 50 50 70 75 Q 50 50 30 75 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <circle cx="50" cy="55" r="4" fill="currentColor" />
            {/* Eye mask motif */}
            <path
              d="M30 22 C 30 16, 45 16, 50 20 C 55 16, 70 16, 70 22 C 70 28, 55 26, 50 24 C 45 26, 30 28, 30 22 Z"
              fill="var(--sticker-bg)"
              stroke="currentColor"
            />
          </svg>
          <span className="absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]">
            ☁️ Cozy
          </span>
        </div>
      );

    case "utility":
      return (
        <div
          className={`flex items-center justify-center bg-emerald-500/10 border-b-2 border-[var(--border-color)] overflow-hidden relative ${className}`}
        >
          <svg
            className="w-2/3 h-2/3 text-[var(--accent)] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Power strip & cable motif */}
            <rect
              x="22"
              y="35"
              width="56"
              height="30"
              rx="6"
              fill="var(--bg-card)"
              stroke="currentColor"
            />
            <circle cx="34" cy="50" r="4" fill="currentColor" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <circle cx="66" cy="50" r="4" fill="currentColor" />
            <path d="M78 50 L 92 50 C 95 50 95 75 80 80 L 40 80" stroke="currentColor" />
            <line x1="30" y1="35" x2="30" y2="40" stroke="var(--accent)" strokeWidth="3" />
            <line x1="46" y1="35" x2="46" y2="40" stroke="var(--accent)" strokeWidth="3" />
            <line x1="62" y1="35" x2="62" y2="40" stroke="var(--accent)" strokeWidth="3" />
          </svg>
          <span className="absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]">
            ⚡ Essential
          </span>
        </div>
      );

    case "fun":
    default:
      return (
        <div
          className={`flex items-center justify-center bg-purple-500/10 border-b-2 border-[var(--border-color)] overflow-hidden relative ${className}`}
        >
          <svg
            className="w-2/3 h-2/3 text-[var(--accent)] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Snack bowl / stickers / noodle cup motif */}
            <path
              d="M25 40 L 75 40 L 68 75 C 68 80, 32 80, 32 75 Z"
              fill="var(--bg-card)"
              stroke="currentColor"
            />
            <path d="M20 40 Q 50 35 80 40" stroke="currentColor" fill="none" />
            {/* Noodles chopsticks */}
            <line x1="15" y1="20" x2="65" y2="50" stroke="currentColor" strokeWidth="3" />
            <line x1="18" y1="15" x2="70" y2="48" stroke="currentColor" strokeWidth="3" />
            {/* Sparkles */}
            <path
              d="M75 20 Q 80 25 85 20 Q 80 15 75 20"
              fill="#F5E3A9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--sticker-bg)] text-[var(--sticker-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]">
            🍜 Snacks & Fun
          </span>
        </div>
      );
  }
}
