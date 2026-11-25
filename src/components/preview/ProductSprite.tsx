"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, SpaceType } from "@/types";
import { formatINR } from "@/lib/utils";

interface ProductSpriteProps {
  product: Product;
  space: SpaceType;
  onRemove?: (id: string) => void;
}

export function ProductSprite({
  product,
  space,
  onRemove,
}: ProductSpriteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const anchor = product.spaceAnchors[space] || { x: 50, y: 50, scale: 1, zIndex: 5 };

  const xPos = anchor.x;
  const yPos = anchor.y;
  const scale = anchor.scale || 1;
  const zIndex = anchor.zIndex || 5;
  const rotation = anchor.rotation || 0;

  // Render vector graphic representation for product sprite
  const renderSpriteGraphic = () => {
    switch (product.category) {
      case "decor":
        if (product.sprite === "fairy-lights") {
          return (
            <svg viewBox="0 0 120 40" className="w-28 sm:w-36 drop-shadow-md">
              <path
                d="M 5 15 Q 35 30 65 15 T 115 15"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="2 3"
              />
              <circle cx="20" cy="22" r="4.5" fill="var(--accent)" className="animate-pulse" />
              <circle cx="50" cy="18" r="4.5" fill="var(--primary)" className="animate-pulse" />
              <circle cx="80" cy="22" r="4.5" fill="var(--secondary)" className="animate-pulse" />
              <circle cx="105" cy="18" r="4.5" fill="var(--highlight, var(--accent))" className="animate-pulse" />
            </svg>
          );
        }
        if (product.sprite === "neon-bolt") {
          return (
            <svg viewBox="0 0 50 80" className="w-10 sm:w-12 drop-shadow-[0_0_12px_var(--accent)]">
              <polygon
                points="28,2 6,42 24,42 18,78 44,32 26,32"
                fill="var(--accent)"
                stroke="var(--border-color)"
                strokeWidth="2"
              />
            </svg>
          );
        }
        if (product.sprite === "cloud-tapestry") {
          return (
            <svg viewBox="0 0 100 70" className="w-24 sm:w-32 drop-shadow-lg">
              <rect x="5" y="5" width="90" height="60" rx="6" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="2" />
              <circle cx="35" cy="35" r="14" fill="var(--bg)" />
              <circle cx="55" cy="32" r="18" fill="var(--bg)" />
              <circle cx="70" cy="38" r="12" fill="var(--bg)" />
              <path d="M 5 5 L 50 0 L 95 5" fill="none" stroke="var(--border-color)" strokeWidth="2" />
            </svg>
          );
        }
        // Default decor (plant/frame/grid)
        return (
          <svg viewBox="0 0 60 70" className="w-12 sm:w-14 drop-shadow-md">
            <rect x="8" y="10" width="44" height="50" rx="4" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2.5" />
            <circle cx="30" cy="32" r="12" fill="var(--sticker-bg)" stroke="var(--border-color)" strokeWidth="1.5" />
            <path d="M 18 55 Q 30 40 42 55" fill="none" stroke="var(--accent)" strokeWidth="2" />
          </svg>
        );

      case "desk":
        if (product.sprite === "desk-mat" || product.sprite === "rgb-mousepad") {
          return (
            <svg viewBox="0 0 160 50" className="w-40 sm:w-56 drop-shadow-md">
              <rect
                x="4"
                y="4"
                width="152"
                height="42"
                rx="6"
                fill="var(--bg-secondary)"
                stroke={product.sprite === "rgb-mousepad" ? "var(--accent)" : "var(--border-color)"}
                strokeWidth={product.sprite === "rgb-mousepad" ? 3 : 2}
              />
              <line x1="20" y1="25" x2="140" y2="25" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            </svg>
          );
        }
        if (product.sprite === "cat-wrist-rest") {
          return (
            <svg viewBox="0 0 90 35" className="w-20 sm:w-24 drop-shadow-sm">
              <rect x="4" y="8" width="82" height="22" rx="10" fill="var(--primary)" stroke="var(--border-color)" strokeWidth="2" />
              <circle cx="22" cy="18" r="4" fill="var(--surface)" />
              <circle cx="45" cy="18" r="4" fill="var(--surface)" />
              <circle cx="68" cy="18" r="4" fill="var(--surface)" />
            </svg>
          );
        }
        if (product.sprite === "laptop-stand") {
          return (
            <svg viewBox="0 0 80 60" className="w-16 sm:w-20 drop-shadow-md">
              <polygon points="15,45 65,45 70,52 10,52" fill="var(--border-color)" />
              <polygon points="15,45 65,45 58,15 22,15" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2" />
              <rect x="26" y="20" width="28" height="18" rx="2" fill="var(--accent)" opacity="0.8" />
            </svg>
          );
        }
        // General desk item (lamp/pen pot)
        return (
          <svg viewBox="0 0 50 70" className="w-10 sm:w-12 drop-shadow-md">
            <rect x="12" y="32" width="26" height="32" rx="4" fill="var(--sticker-bg)" stroke="var(--border-color)" strokeWidth="2" />
            <line x1="18" y1="32" x2="14" y2="15" stroke="var(--border-color)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="32" x2="32" y2="12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="32" x2="24" y2="10" stroke="var(--border-color)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case "comfort":
        if (product.sprite === "chenille-throw") {
          return (
            <svg viewBox="0 0 120 70" className="w-28 sm:w-36 drop-shadow-lg">
              <path
                d="M 10 15 C 30 5, 80 5, 110 15 C 115 35, 105 60, 95 65 C 60 70, 30 65, 10 55 Z"
                fill="var(--secondary)"
                stroke="var(--border-color)"
                strokeWidth="2.5"
              />
              <path d="M 20 25 Q 60 40 100 25" fill="none" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 25 45 Q 60 55 95 45" fill="none" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
          );
        }
        if (product.sprite === "boba-plushie") {
          return (
            <svg viewBox="0 0 60 80" className="w-12 sm:w-16 drop-shadow-md">
              <rect x="10" y="25" width="40" height="50" rx="12" fill="var(--primary)" stroke="var(--border-color)" strokeWidth="2" />
              {/* Straw */}
              <line x1="30" y1="25" x2="38" y2="6" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
              {/* Pearls */}
              <circle cx="20" cy="62" r="3" fill="var(--ink)" />
              <circle cx="30" cy="65" r="3" fill="var(--ink)" />
              <circle cx="40" cy="61" r="3" fill="var(--ink)" />
              {/* Cute face */}
              <circle cx="24" cy="40" r="2" fill="var(--ink)" />
              <circle cx="36" cy="40" r="2" fill="var(--ink)" />
              <path d="M 27 46 Q 30 49 33 46" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            </svg>
          );
        }
        // General cushion / pillow
        return (
          <svg viewBox="0 0 80 60" className="w-16 sm:w-20 drop-shadow-md">
            <rect x="6" y="8" width="68" height="44" rx="14" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2" />
            <circle cx="40" cy="30" r="4" fill="var(--accent)" />
            <path d="M 16 16 L 64 44" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
          </svg>
        );

      case "utility":
        if (product.sprite === "power-strip") {
          return (
            <svg viewBox="0 0 100 40" className="w-24 sm:w-28 drop-shadow-md">
              <rect x="4" y="8" width="85" height="24" rx="6" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2" />
              <circle cx="22" cy="20" r="4" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
              <circle cx="42" cy="20" r="4" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
              <circle cx="62" cy="20" r="4" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="89" y1="20" x2="100" y2="20" stroke="var(--border-color)" strokeWidth="3" />
            </svg>
          );
        }
        if (product.sprite === "steel-flask") {
          return (
            <svg viewBox="0 0 40 80" className="w-8 sm:w-10 drop-shadow-md">
              <rect x="8" y="20" width="24" height="54" rx="5" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="2" />
              <rect x="12" y="8" width="16" height="12" rx="3" fill="var(--accent)" stroke="var(--border-color)" strokeWidth="2" />
              <line x1="8" y1="36" x2="32" y2="36" stroke="var(--border-color)" strokeWidth="1" />
            </svg>
          );
        }
        // General utility
        return (
          <svg viewBox="0 0 60 60" className="w-12 sm:w-14 drop-shadow-md">
            <circle cx="30" cy="30" r="22" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="2" />
            <path d="M 22 30 L 28 36 L 38 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case "fun":
      default:
        if (product.sprite === "maggi-pack") {
          return (
            <svg viewBox="0 0 60 50" className="w-12 sm:w-16 drop-shadow-md">
              <rect x="4" y="6" width="52" height="38" rx="4" fill="var(--accent)" stroke="var(--border-color)" strokeWidth="2" />
              <circle cx="30" cy="24" r="10" fill="var(--primary)" />
              <path d="M 24 24 Q 30 20 36 24" fill="none" stroke="var(--surface)" strokeWidth="2" />
            </svg>
          );
        }
        if (product.sprite === "gingham-mug") {
          return (
            <svg viewBox="0 0 60 60" className="w-12 sm:w-14 drop-shadow-md">
              <rect x="8" y="14" width="34" height="38" rx="6" fill="var(--secondary)" stroke="var(--border-color)" strokeWidth="2" />
              {/* Handle */}
              <path d="M 42 22 C 54 22, 54 42, 42 42" fill="none" stroke="var(--border-color)" strokeWidth="3" />
              {/* Steam */}
              <path d="M 18 10 Q 20 4 22 10" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
              <path d="M 28 10 Q 30 4 32 10" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            </svg>
          );
        }
        // Sticker or snack pouch
        return (
          <svg viewBox="0 0 60 60" className="w-12 sm:w-14 drop-shadow-md">
            <polygon points="30,4 54,20 46,50 14,50 6,20" fill="var(--sticker-bg)" stroke="var(--border-color)" strokeWidth="2" />
            <circle cx="30" cy="30" r="8" fill="var(--accent)" />
          </svg>
        );
    }
  };

  return (
    <motion.button
      type="button"
      aria-label={`Remove ${product.name} from scene`}
      title={`Remove ${product.name} from scene`}
      disabled={!onRemove}
      onClick={() => onRemove?.(product.id)}
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{
        scale: scale,
        opacity: 1,
        y: 0,
        rotate: rotation,
      }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      whileHover={{ scale: scale * 1.12, zIndex: 50 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "absolute",
        left: `${xPos}%`,
        top: `${yPos}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isHovered ? 50 : zIndex,
      }}
      className="cursor-pointer select-none border-0 bg-transparent p-0 disabled:cursor-default"
    >
      {/* Sprite Vector Graphic */}
      <div className="relative group">
        {renderSpriteGraphic()}

        {/* Hover Tooltip Card */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 6 }}
              className="absolute left-1/2 -translate-x-1/2 -top-12 z-50 whitespace-nowrap bg-surface border-width-theme border-line px-3 py-1 rounded-btn sticker-shadow flex items-center gap-2 pointer-events-none"
            >
              <span className="text-[11px] font-display font-black text-ink">
                {product.name}
              </span>
              <span className="theme-price text-[10px] font-bold">
                {formatINR(product.price)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
