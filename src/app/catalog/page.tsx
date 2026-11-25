"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  Trash2,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { useHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";
import { api, type ProductFilterParams } from "@/lib/api";
import type { Product, ProductCategory } from "@/types";
import { VIBES, type VibeId } from "@/data/vibes";
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

  const [catalogResult, setCatalogResult] = useState<{
    queryKey: string;
    products: Product[];
    error: string | null;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedVibe, setSelectedVibe] = useState<VibeId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProductFilterParams["sortBy"]>("popular");
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const queryKey = JSON.stringify({
    selectedCategory,
    selectedVibe,
    searchQuery,
    sortBy,
    maxPrice,
    retryAttempt,
  });
  const isLoading = catalogResult?.queryKey !== queryKey;
  const products = isLoading ? [] : catalogResult?.products ?? [];
  const loadError = isLoading ? null : catalogResult?.error ?? null;

  useEffect(() => {
    let isMounted = true;

    api.products
      .list({
        category: selectedCategory,
        vibe: selectedVibe,
        search: searchQuery,
        sortBy,
        maxPrice,
      })
      .then((data) => {
        if (isMounted) {
          setCatalogResult({ queryKey, products: data, error: null });
        }
      })
      .catch((cause: unknown) => {
        if (isMounted) {
          setCatalogResult({
            queryKey,
            products: [],
            error:
              cause instanceof Error
                ? cause.message
                : "The product catalogue could not be loaded.",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [maxPrice, queryKey, searchQuery, selectedCategory, selectedVibe, sortBy]);

  const totalPrice = getTotalPrice();
  const vibeScore = getVibeScore();
  const isOverBudget = totalPrice > budgetTier;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Header Banner */}
      <div className="space-y-4 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b-width-theme border-line pb-6">
        <div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <Sticker color="vibe" tilt="left">
              📦 40+ MOCK DORM ITEMS
            </Sticker>
            <Badge variant="accent">₹79 to ₹549</Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-ink tracking-tight">
            The Dorm Haul Catalog
          </h1>
          <p className="text-sm sm:text-base text-muted font-medium mt-1">
            Browse the mock hostel catalog. Quick-add items to test your live Vibe Score.
          </p>
        </div>

        {/* Quick Builder Link */}
        <div className="mt-4 sm:mt-0 flex justify-center">
          <ButtonLink href="/builder" variant="primary" size="md" className="gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Open 3D Builder</span>
            <ArrowRight className="w-4 h-4" />
          </ButtonLink>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search fairy lights, desk pads, noodles, chargers..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-card border-width-theme border-line bg-surface text-ink placeholder:text-muted font-medium text-sm sticker-shadow focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Vibe Filter Dropdown */}
            <select
              aria-label="Filter products by vibe"
              value={selectedVibe}
              onChange={(e) => {
                const val = e.target.value as VibeId | "all";
                setSelectedVibe(val);
                if (val !== "all") {
                  setVibe(val);
                }
              }}
              className="px-3 py-2 rounded-card border-width-theme border-line bg-surface text-ink font-display font-bold text-xs sticker-shadow cursor-pointer focus:outline-none"
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
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductFilterParams["sortBy"])}
              className="px-3 py-2 rounded-card border-width-theme border-line bg-surface text-ink font-display font-bold text-xs sticker-shadow cursor-pointer focus:outline-none"
            >
              <option value="popular">🔥 Most Popular</option>
              <option value="price-asc">₹ Price: Low to High</option>
              <option value="price-desc">₹ Price: High to Low</option>
              <option value="name">🔤 Name A-Z</option>
            </select>

            <select
              aria-label="Filter products by maximum price"
              value={maxPrice ?? ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
              }
              className="px-3 py-2 rounded-card border-width-theme border-line bg-surface text-ink font-display font-bold text-xs sticker-shadow cursor-pointer focus:outline-none"
            >
              <option value="">💸 Any price</option>
              <option value="199">Up to ₹199</option>
              <option value="299">Up to ₹299</option>
              <option value="399">Up to ₹399</option>
              <option value="499">Up to ₹499</option>
              <option value="599">Up to ₹599</option>
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
                className={`whitespace-nowrap px-4 py-2 rounded-card font-display font-bold text-xs border-width-theme transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-accent text-on-accent border-line sticker-shadow -translate-y-0.5"
                    : "bg-surface text-muted border-line/60 hover:border-line hover:bg-secondary"
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
              className="h-80 rounded-card border-width-theme border-line/30 bg-secondary/50 animate-pulse"
            />
          ))}
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="text-center py-16 space-y-4 bg-surface border-width-theme border-line rounded-card p-8 sticker-shadow max-w-md mx-auto"
        >
          <span className="text-5xl" aria-hidden="true">🫠</span>
          <h3 className="text-xl font-bold font-display text-ink">
            The catalogue hit a snag
          </h3>
          <p className="text-xs text-muted">{loadError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRetryAttempt((attempt) => attempt + 1)}
          >
            Try again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-surface border-width-theme border-line rounded-card p-8 sticker-shadow max-w-md mx-auto">
          <span className="text-5xl">🕵️</span>
          <h3 className="text-xl font-bold font-display text-ink">
            No items found
          </h3>
          <p className="text-xs text-muted">
            Try adjusting your search query or reset category & vibe filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedVibe("all");
              setSearchQuery("");
              setMaxPrice(undefined);
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
                  matchesCurrentTheme ? "ring-2 ring-primary/60" : ""
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
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-on-accent border-width-theme border-line sticker-shadow">
                        🔥 Bestseller
                      </span>
                    )}
                    {product.stock <= 15 && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-btn bg-accent/30 text-ink border-width-theme border-line">
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
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-surface border-width-theme border-line flex items-center justify-center opacity-80 hover:opacity-100 sticker-shadow"
                    aria-label="View product details"
                  >
                    <Info className="w-3.5 h-3.5 text-ink" />
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
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-btn border text-muted ${
                            v === currentVibe
                              ? "bg-accent text-on-accent border-line"
                              : "bg-secondary border-line/30"
                          }`}
                        >
                          #{v}
                        </span>
                      ))}
                    </div>

                    <h3
                      onClick={() => setDetailProduct(product)}
                      className="font-display font-bold text-base text-ink leading-tight hover:text-ink cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-muted line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-2 border-t border-line/20 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-muted block leading-none">
                        Student Price
                      </span>
                      <span className="theme-price text-lg font-black font-display">
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
                          <Check className="w-4 h-4 text-primary stroke-[3]" />
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
          <div className="bg-surface border-width-theme border-line rounded-card p-4 sm:p-5 sticker-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Box Status & Score */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="w-12 h-12 rounded-card bg-accent text-on-accent border-width-theme border-line flex items-center justify-center font-black text-xl sticker-shadow shrink-0">
                📦
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-base text-ink">
                    {haulItems.length} {haulItems.length === 1 ? "Item" : "Items"} in Haul
                  </span>
                  <Badge variant={isOverBudget ? "warning" : "success"}>
                    {formatINR(totalPrice)} / {formatINR(budgetTier)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted font-medium">
                    Vibe Score:
                  </span>
                  <span className="text-xs font-black text-ink">
                    {vibeScore.score}/100
                  </span>
                  <span className="text-[10px] text-muted truncate max-w-[180px] sm:max-w-xs">
                    • {vibeScore.feedbackMessage}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <ButtonLink
                href="/builder"
                variant="primary"
                size="md"
                className="w-full flex-1 gap-2 font-black sm:flex-initial"
              >
                <span>Open 3D Builder</span>
                <ArrowRight className="w-4 h-4" />
              </ButtonLink>

              <ButtonLink
                href="/checkout"
                variant="secondary"
                size="md"
                className="w-full flex-1 sm:flex-initial"
              >
                Checkout
              </ButtonLink>
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
            <div className="h-48 w-full rounded-card overflow-hidden border-width-theme border-line">
              <ProductImage
                category={detailProduct.category}
                name={detailProduct.name}
                sprite={detailProduct.sprite}
              />
            </div>

            <p className="text-sm text-ink font-medium leading-relaxed">
              {detailProduct.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold font-display uppercase tracking-wider text-muted block">
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

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-line/20">
              <div>
                <span className="text-xs text-muted block">Total Price</span>
                <span className="theme-price text-2xl font-black font-display">
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
