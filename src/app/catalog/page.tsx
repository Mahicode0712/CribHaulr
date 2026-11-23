"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  Trash2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { api, ProductFilterParams } from "@/lib/api";
import { Product, ProductCategory } from "@/types";
import { VibeId, VIBES } from "@/data/vibes";
import { formatINR } from "@/lib/utils";

const CATEGORIES: { id: ProductCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All Items", emoji: "⚡" },
  { id: "decor", label: "Decor & Lights", emoji: "✨" },
  { id: "desk", label: "Desk & Study", emoji: "💻" },
  { id: "comfort", label: "Comfort & Chill", emoji: "☁️" },
  { id: "utility", label: "Dorm Essentials", emoji: "🔌" },
  { id: "fun", label: "Snacks & Minis", emoji: "🍜" },
];

export default function CatalogPage() {
  const { currentVibe, setVibe } = useTheme();
  const {
    items: haulItems,
    addItem,
    removeItem,
    isInBox,
    budgetTier,
    getTotalPrice,
    getVibeScore,
  } = useHaulStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedVibe, setSelectedVibe] = useState<VibeId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProductFilterParams["sortBy"]>("popular");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Fetch products from API layer
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.products
      .list({
        category: selectedCategory,
        vibe: selectedVibe,
        search: searchQuery,
        sortBy,
      })
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedVibe, searchQuery, sortBy]);

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();
  const isOverBudget = totalPrice > budgetTier;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Header Banner */}
      <div className="space-y-4 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b-2 border-[var(--border-color)] pb-6">
        <div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <Sticker color="vibe" tilt="left">
              📦 40+ DORM ESSENTIALS
            </Sticker>
            <Badge variant="accent">₹79 to ₹549</Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-[var(--text-primary)] tracking-tight">
            The Dorm Haul Catalog
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-1">
            Browse certified hostel survival gear. Quick-add items to test your live Vibe Score.
          </p>
        </div>

        {/* Quick Builder Link */}
        <div className="mt-4 sm:mt-0 flex justify-center">
          <Link href="/builder">
            <Button variant="primary" size="md" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Open 3D Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search fairy lights, desk pads, noodles, chargers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-medium text-sm shadow-[2px_2px_0px_var(--shadow-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex gap-2">
            {/* Vibe Filter Dropdown */}
            <select
              value={selectedVibe}
              onChange={(e) => {
                const val = e.target.value as VibeId | "all";
                setSelectedVibe(val);
                if (val !== "all") {
                  setVibe(val);
                }
              }}
              className="px-3 py-2 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-display font-bold text-xs shadow-[2px_2px_0px_var(--shadow-color)] cursor-pointer focus:outline-none"
            >
              <option value="all">🌈 All Vibes</option>
              <option value="cozy">🧶 Cozy / Dormcore</option>
              <option value="dark-academia">📜 Dark Academia</option>
              <option value="minimalist">📐 Clean Minimalist</option>
              <option value="kawaii">🌸 Kawaii Dream</option>
              <option value="neon-gamer">⚡ Neon Gamer</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductFilterParams["sortBy"])}
              className="px-3 py-2 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-display font-bold text-xs shadow-[2px_2px_0px_var(--shadow-color)] cursor-pointer focus:outline-none"
            >
              <option value="popular">🔥 Most Popular</option>
              <option value="price-asc">₹ Price: Low to High</option>
              <option value="price-desc">₹ Price: High to Low</option>
              <option value="name">🔤 Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl font-display font-bold text-xs border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] -translate-y-0.5"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)]/60 hover:border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl border-2 border-[var(--border-color)]/30 bg-[var(--bg-secondary)]/50 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-3xl p-8 shadow-[4px_4px_0px_var(--shadow-color)] max-w-md mx-auto">
          <span className="text-5xl">🕵️</span>
          <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
            No items found
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Try adjusting your search query or reset category & vibe filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedVibe("all");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const added = isInBox(product.id);
            const matchesCurrentTheme = product.vibes.includes(currentVibe);

            return (
              <Card
                key={product.id}
                hoverEffect
                className={`flex flex-col justify-between overflow-hidden p-0 relative ${
                  matchesCurrentTheme ? "ring-2 ring-[var(--accent)]/60" : ""
                }`}
              >
                {/* Product Image Header */}
                <div
                  className="h-44 w-full cursor-pointer relative group"
                  onClick={() => setDetailProduct(product)}
                >
                  <ProductImage
                    category={product.category}
                    name={product.name}
                    sprite={product.sprite}
                  />

                  {/* Stock or Popular Tag */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {product.isPopular && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-text)] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]">
                        🔥 Bestseller
                      </span>
                    )}
                    {product.stock <= 15 && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-950 border border-amber-900">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  {/* Info Peek Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailProduct(product);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center opacity-80 hover:opacity-100 shadow-[1px_1px_0px_var(--shadow-color)]"
                    aria-label="View product details"
                  >
                    <Info className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                  </button>
                </div>

                {/* Product Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {/* Vibe Tags */}
                    <div className="flex flex-wrap gap-1">
                      {product.vibes.map((v) => (
                        <span
                          key={v}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border text-[var(--text-secondary)] ${
                            v === currentVibe
                              ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)]"
                              : "bg-[var(--bg-secondary)] border-[var(--border-color)]/30"
                          }`}
                        >
                          #{v}
                        </span>
                      ))}
                    </div>

                    <h3
                      onClick={() => setDetailProduct(product)}
                      className="font-display font-bold text-base text-[var(--text-primary)] leading-tight hover:text-[var(--accent)] cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-2 border-t border-[var(--border-color)]/20 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block leading-none">
                        Student Price
                      </span>
                      <span className="text-lg font-black font-display text-[var(--text-primary)]">
                        {formatINR(product.price)}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant={added ? "secondary" : "primary"}
                      onClick={() => {
                        if (added) {
                          removeItem(product.id);
                        } else {
                          addItem(product);
                        }
                      }}
                      className="gap-1.5 min-w-[100px]"
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>In Haul</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Haul Bar */}
      {haulItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[var(--bg-card)] border-3 border-[var(--border-color)] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_var(--shadow-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Box Status & Score */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-[var(--accent-text)] border-2 border-[var(--border-color)] flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_var(--shadow-color)] shrink-0">
                📦
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-base text-[var(--text-primary)]">
                    {haulItems.length} {haulItems.length === 1 ? "Item" : "Items"} in Haul
                  </span>
                  <Badge variant={isOverBudget ? "warning" : "success"}>
                    {formatINR(totalPrice)} / {formatINR(budgetTier)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    Vibe Score:
                  </span>
                  <span className="text-xs font-black text-[var(--accent)]">
                    {vibeScore.score}/100
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[180px] sm:max-w-xs">
                    • {vibeScore.feedbackMessage}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link href="/builder" className="flex-1 sm:flex-initial">
                <Button variant="primary" size="md" className="w-full gap-2 font-black">
                  <span>Open 3D Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/checkout" className="flex-1 sm:flex-initial">
                <Button variant="secondary" size="md" className="w-full">
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        title={detailProduct?.name}
        description={`Category: ${detailProduct?.category.toUpperCase()} • Student Price: ${detailProduct ? formatINR(detailProduct.price) : ""}`}
      >
        {detailProduct && (
          <div className="space-y-4">
            <div className="h-48 w-full rounded-2xl overflow-hidden border-2 border-[var(--border-color)]">
              <ProductImage
                category={detailProduct.category}
                name={detailProduct.name}
                sprite={detailProduct.sprite}
              />
            </div>

            <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
              {detailProduct.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold font-display uppercase tracking-wider text-[var(--text-muted)] block">
                Matching Room Vibes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detailProduct.vibes.map((v) => (
                  <Badge key={v} variant={v === currentVibe ? "accent" : "default"}>
                    {VIBES[v]?.emoji} {VIBES[v]?.name || v}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--border-color)]/20">
              <div>
                <span className="text-xs text-[var(--text-muted)] block">Total Price</span>
                <span className="text-2xl font-black font-display text-[var(--text-primary)]">
                  {formatINR(detailProduct.price)}
                </span>
              </div>

              <Button
                variant={isInBox(detailProduct.id) ? "danger" : "primary"}
                size="md"
                onClick={() => {
                  if (isInBox(detailProduct.id)) {
                    removeItem(detailProduct.id);
                  } else {
                    addItem(detailProduct);
                  }
                  setDetailProduct(null);
                }}
                className="gap-2"
              >
                {isInBox(detailProduct.id) ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from Box</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Starter Box</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
