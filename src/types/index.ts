import { VibeId } from "@/data/vibes";

export type ProductCategory =
  | "decor"
  | "desk"
  | "comfort"
  | "utility"
  | "fun";

export type SpaceType = "desk" | "bed" | "room";

export type BudgetTier = 499 | 999 | 1999;

export interface SpaceAnchor {
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  scale?: number; // scale multiplier (e.g. 1, 0.8)
  zIndex?: number;
  rotation?: number; // degrees
}

export interface SpaceAnchors {
  desk?: SpaceAnchor;
  bed?: SpaceAnchor;
  room?: SpaceAnchor;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in INR
  vibes: VibeId[]; // which vibes this item belongs to
  vibeWeight: number; // 1 to 5 (how strongly this represents the vibe)
  image: string; // image path or placeholder identifier
  sprite: string; // svg sprite or icon identifier for scene layering
  spaceAnchors: SpaceAnchors; // relative coordinates for live scene preview
  stock: number; // stock count (e.g. 15, 3)
  tags: string[]; // searchable tags e.g. ["lighting", "led", "aesthetic"]
  description: string;
  isPopular?: boolean;
}

export interface Box {
  id: string;
  space: SpaceType;
  budgetTier: BudgetTier;
  vibe: VibeId;
  items: Product[];
  total: number;
  vibeScore: number;
  createdAt?: string;
  roommateMode?: {
    enabled: boolean;
    collaboratorCount: number;
    shareCode: string;
  };
}

export interface VibeScoreResult {
  score: number; // 0 to 100
  vibeMatchPoints: number;
  categoryBonus: number;
  budgetPenalty: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  matchedItemCount: number;
  totalItemCount: number;
  uniqueCategoriesCount: number;
  feedbackMessage: string;
}
