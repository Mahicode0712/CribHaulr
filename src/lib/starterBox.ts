import type {
  BudgetTier,
  Product,
  ProductCategory,
  SpaceType,
} from "../types";
import type { VibeId } from "../data/vibes";

export function generateStarterBox(
  products: Product[],
  space: SpaceType,
  budgetTier: BudgetTier,
  vibe: VibeId
): Product[] {
  const vibeCandidates = products.filter((product) => product.vibes.includes(vibe));
  const byCategory: Record<ProductCategory, Product[]> = {
    decor: [],
    desk: [],
    comfort: [],
    utility: [],
    fun: [],
  };

  for (const product of vibeCandidates) {
    byCategory[product.category].push(product);
  }

  const targetCategories: ProductCategory[] =
    space === "desk"
      ? ["desk", "decor", "utility", "fun"]
      : space === "bed"
        ? ["comfort", "decor", "utility", "fun"]
        : ["decor", "desk", "comfort", "utility", "fun"];

  let bestSelection: Product[] = [];

  const isBetterSelection = (candidate: Product[], current: Product[]) => {
    if (candidate.length !== current.length) {
      return candidate.length > current.length;
    }

    const candidateCategoryCount = new Set(
      candidate.map((product) => product.category)
    ).size;
    const currentCategoryCount = new Set(
      current.map((product) => product.category)
    ).size;
    if (candidateCategoryCount !== currentCategoryCount) {
      return candidateCategoryCount > currentCategoryCount;
    }

    const candidateVibeWeight = candidate.reduce(
      (total, product) => total + product.vibeWeight,
      0
    );
    const currentVibeWeight = current.reduce(
      (total, product) => total + product.vibeWeight,
      0
    );
    if (candidateVibeWeight !== currentVibeWeight) {
      return candidateVibeWeight > currentVibeWeight;
    }

    const candidatePopularCount = candidate.filter(
      (product) => product.isPopular
    ).length;
    const currentPopularCount = current.filter(
      (product) => product.isPopular
    ).length;
    if (candidatePopularCount !== currentPopularCount) {
      return candidatePopularCount > currentPopularCount;
    }

    const candidateTotal = candidate.reduce(
      (total, product) => total + product.price,
      0
    );
    const currentTotal = current.reduce(
      (total, product) => total + product.price,
      0
    );
    return candidateTotal < currentTotal;
  };

  const considerSelection = (candidate: Product[]) => {
    if (isBetterSelection(candidate, bestSelection)) {
      bestSelection = candidate;
    }
  };

  const searchSelections = (
    categoryIndex: number,
    chosen: Product[],
    currentTotal: number
  ) => {
    if (categoryIndex === targetCategories.length) {
      considerSelection(chosen);

      if (chosen.length < 5) {
        for (const extra of vibeCandidates) {
          if (
            targetCategories.includes(extra.category) &&
            !chosen.some((product) => product.id === extra.id) &&
            currentTotal + extra.price <= budgetTier
          ) {
            considerSelection([...chosen, extra]);
          }
        }
      }
      return;
    }

    searchSelections(categoryIndex + 1, chosen, currentTotal);

    const category = targetCategories[categoryIndex];
    for (const product of byCategory[category]) {
      if (currentTotal + product.price <= budgetTier) {
        searchSelections(
          categoryIndex + 1,
          [...chosen, product],
          currentTotal + product.price
        );
      }
    }
  };

  searchSelections(0, [], 0);
  return bestSelection;
}
