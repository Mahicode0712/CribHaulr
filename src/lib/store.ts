import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, SpaceType, BudgetTier, VibeScoreResult } from "@/types";
import { VibeId } from "@/data/vibes";
import { calculateVibeScore } from "./vibeScore";
import { api } from "./api";

export interface HaulState {
  // Box Configuration
  space: SpaceType;
  budgetTier: BudgetTier;
  vibe: VibeId;
  items: Product[];
  builderStep: number;

  // Roommate Collaboration Stub
  roommateModeEnabled: boolean;
  roommateCode: string;

  // Actions
  setSpace: (space: SpaceType) => void;
  setBudgetTier: (tier: BudgetTier) => void;
  setVibe: (vibe: VibeId) => void;
  setBuilderStep: (step: number) => void;

  // Item Management
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  swapItem: (oldItemId: string, newItem: Product) => void;
  clearBox: () => void;
  generateStarterBox: () => Promise<void>;
  isInBox: (itemId: string) => boolean;

  // Roommate Mode
  toggleRoommateMode: () => void;
  resetAll: () => void;

  // Computed helper getters
  getTotalPrice: () => number;
  getVibeScore: () => VibeScoreResult;
}

export const useHaulStore = create<HaulState>()(
  persist(
    (set, get) => ({
      space: "desk",
      budgetTier: 999,
      vibe: "cozy",
      items: [],
      builderStep: 0,
      roommateModeEnabled: false,
      roommateCode: "HAUL-8492",

      setSpace: (space: SpaceType) => {
        set({ space });
      },

      setBudgetTier: (budgetTier: BudgetTier) => {
        set({ budgetTier });
      },

      setVibe: (vibe: VibeId) => {
        set({ vibe });
        // Sync document vibe theme attribute as well
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-vibe", vibe);
          try {
            localStorage.setItem("cribhaulr-vibe", vibe);
          } catch {
            // ignore
          }
        }
      },

      setBuilderStep: (builderStep: number) => {
        set({ builderStep });
      },

      addItem: (item: Product) => {
        const { items } = get();
        // Prevent duplicate items
        if (items.some((i) => i.id === item.id)) return;
        set({ items: [...items, item] });
      },

      removeItem: (itemId: string) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== itemId) });
      },

      swapItem: (oldItemId: string, newItem: Product) => {
        const { items } = get();
        const index = items.findIndex((i) => i.id === oldItemId);
        if (index === -1) return;

        const nextItems = [...items];
        nextItems[index] = newItem;
        set({ items: nextItems });
      },

      clearBox: () => {
        set({ items: [] });
      },

      generateStarterBox: async () => {
        const { space, budgetTier, vibe } = get();
        const starterItems = await api.starterBox.generate(space, budgetTier, vibe);
        set({ items: starterItems });
      },

      isInBox: (itemId: string) => {
        return get().items.some((i) => i.id === itemId);
      },

      toggleRoommateMode: () => {
        set((state) => ({ roommateModeEnabled: !state.roommateModeEnabled }));
      },

      resetAll: () => {
        set({
          space: "desk",
          budgetTier: 999,
          vibe: "cozy",
          items: [],
          builderStep: 0,
          roommateModeEnabled: false,
        });
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },

      getVibeScore: () => {
        const { items, vibe, budgetTier } = get();
        return calculateVibeScore(items, vibe, budgetTier);
      },
    }),
    {
      name: "cribhaulr-box-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        space: state.space,
        budgetTier: state.budgetTier,
        vibe: state.vibe,
        items: state.items,
        builderStep: state.builderStep,
        roommateModeEnabled: state.roommateModeEnabled,
        roommateCode: state.roommateCode,
      }),
    }
  )
);
