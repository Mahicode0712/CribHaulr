import type { Product, ProductCategory, SpaceType, BudgetTier, Box } from "../types";
import { PRODUCTS } from "../data/products";
import { VIBES, VIBE_LIST, type VibeId, type VibeInfo } from "../data/vibes";
import { generateStarterBox } from "./starterBox";

/**
 * CribHaulr API Abstraction Layer
 * 
 * Currently backed by typed in-memory mock datasets in /data.
 * Designed with a clean async interface so replacing this with a
 * FastAPI or Supabase client in the future only requires changing
 * this single file (or toggling API_BASE_URL).
 */

export interface ProductFilterParams {
  category?: ProductCategory | "all";
  vibe?: VibeId | "all";
  search?: string;
  maxPrice?: number;
  sortBy?: "popular" | "price-asc" | "price-desc" | "name";
}

export interface SeasonalDrop {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
  price: 999 | 1999;
  itemCount: number;
  countdownTarget: string; // ISO timestamp
  vibe: VibeId;
  featuredItems: Product[];
  bannerImage: string;
  status: "live" | "dropping-soon" | "sold-out";
}

// Simulated network delay for realism (0 in test, 60ms in dev)
const simulateDelay = async (ms: number = 60): Promise<void> => {
  if (process.env.NODE_ENV === "test") return;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const api = {
  products: {
    /**
     * Lists products with optional filtering and sorting
     */
    async list(params: ProductFilterParams = {}): Promise<Product[]> {
      await simulateDelay();
      let results = [...PRODUCTS];

      if (params.category && params.category !== "all") {
        results = results.filter((p) => p.category === params.category);
      }

      const vibe = params.vibe;
      if (vibe && vibe !== "all") {
        results = results.filter((p) => p.vibes.includes(vibe));
      }

      if (params.search && params.search.trim() !== "") {
        const query = params.search.toLowerCase().trim();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      const maxPrice = params.maxPrice;
      if (maxPrice !== undefined) {
        results = results.filter((p) => p.price <= maxPrice);
      }

      if (params.sortBy) {
        switch (params.sortBy) {
          case "popular":
            results.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
            break;
          case "price-asc":
            results.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            results.sort((a, b) => b.price - a.price);
            break;
          case "name":
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      }

      return results;
    },

    /**
     * Retrieves a single product by ID
     */
    async getById(id: string): Promise<Product | null> {
      await simulateDelay();
      return PRODUCTS.find((p) => p.id === id) || null;
    },

    /**
     * Retrieves products strongly matching a vibe
     */
    async getByVibe(vibeId: VibeId): Promise<Product[]> {
      await simulateDelay();
      return PRODUCTS.filter((p) => p.vibes.includes(vibeId));
    },

    /**
     * Retrieves products by category
     */
    async getByCategory(category: ProductCategory): Promise<Product[]> {
      await simulateDelay();
      return PRODUCTS.filter((p) => p.category === category);
    },
  },

  vibes: {
    /**
     * Lists all 5 room vibes
     */
    async list(): Promise<VibeInfo[]> {
      await simulateDelay();
      return VIBE_LIST;
    },

    /**
     * Gets details for a single vibe
     */
    async getById(id: VibeId): Promise<VibeInfo | null> {
      await simulateDelay();
      return VIBES[id] || null;
    },
  },

  starterBox: {
    /**
     * Algorithmic starter box builder:
     * Picks up to five balanced, vibe-matched items while respecting
     * the selected budget tier (₹499 / ₹999 / ₹1999).
     */
    async generate(
      space: SpaceType,
      budgetTier: BudgetTier,
      vibe: VibeId
    ): Promise<Product[]> {
      await simulateDelay(80);
      return generateStarterBox(PRODUCTS, space, budgetTier, vibe);
    },
  },

  boxes: {
    /**
     * Saves a user box configuration (local or remote)
     */
    async save(box: Box): Promise<{ id: string; success: boolean }> {
      await simulateDelay();
      try {
        localStorage.setItem(`cribhaulr-box-${box.id}`, JSON.stringify(box));
      } catch {
        // ignore storage quota issues
      }
      return { id: box.id, success: true };
    },

    /**
     * Retrieves a box configuration by ID
     */
    async getById(id: string): Promise<Box | null> {
      await simulateDelay();
      try {
        const data = localStorage.getItem(`cribhaulr-box-${id}`);
        if (data) return JSON.parse(data);
      } catch {
        // ignore
      }
      return null;
    },
  },

  drops: {
    /**
     * Lists limited-edition seasonal drops
     */
    async list(): Promise<SeasonalDrop[]> {
      await simulateDelay();
      return [
        {
          id: "drop-freshers",
          title: "Freshers' Survival Haul",
          subtitle: "Semester 1 Orientation Drop",
          badge: "🔥 High Demand",
          tagline: "Everything you need to survive 8 AM lectures, mess food, and roommate drama.",
          price: 999,
          itemCount: 5,
          countdownTarget: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 48h from now
          vibe: "cozy",
          bannerImage: "/drops/freshers.svg",
          status: "live",
          featuredItems: PRODUCTS.filter((product) =>
            ["dec-01", "dsk-09", "com-07", "utl-03", "fun-02"].includes(product.id)
          ),
        },
        {
          id: "drop-exam",
          title: "Exam Night All-Nighter",
          subtitle: "Midnight Study Drop",
          badge: "⚡ Limited Run",
          tagline: "High caffeine, zero-distraction blue light setups for nocturnal syllabus rushing.",
          price: 1999,
          itemCount: 6,
          countdownTarget: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(), // 4 days
          vibe: "neon-gamer",
          bannerImage: "/drops/exam.svg",
          status: "live",
          featuredItems: PRODUCTS.filter((product) =>
            ["dec-03", "dec-09", "dsk-03", "dsk-05", "dsk-06", "fun-05"].includes(product.id)
          ),
        },
        {
          id: "drop-winter",
          title: "Hostel Winter Warmth",
          subtitle: "North India Campus Drop",
          badge: "❄️ Coming Soon",
          tagline: "Thermal flasks, knitted chenille blankets, and spicy tea heaters for chilly hostels.",
          price: 1999,
          itemCount: 5,
          countdownTarget: new Date(Date.now() + 1000 * 60 * 60 * 168).toISOString(), // 7 days
          vibe: "cozy",
          bannerImage: "/drops/winter.svg",
          status: "dropping-soon",
          featuredItems: PRODUCTS.filter((p) => p.category === "comfort").slice(0, 5),
        },
      ];
    },
  },
};
