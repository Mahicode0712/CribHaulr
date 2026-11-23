import type { Product, BudgetTier, VibeScoreResult } from "../types";
import type { VibeId } from "../data/vibes";

/**
 * Pure function to calculate the Vibe Score (0 to 100) for a given set of box items.
 * 
 * Rules:
 * 1. Weighted Vibe Match (up to 70 pts):
 *    Average of (vibeWeight / 5) for items matching the selected vibe.
 * 2. Category Balance Bonus (up to 20 pts):
 *    Rewards diversity across decor, desk, comfort, utility, and fun categories.
 * 3. Item Count Completeness (up to 10 pts):
 *    Rewards filling the box with 4 to 5 starter items.
 * 4. Over-Budget Penalty:
 *    Deducts 1 pt for every 2% over budget tier (penalizes going over budget).
 */
export function calculateVibeScore(
  items: Product[],
  selectedVibe: VibeId,
  budgetTier: BudgetTier
): VibeScoreResult {
  const totalItemCount = items.length;

  // Empty box edge case
  if (totalItemCount === 0) {
    return {
      score: 0,
      vibeMatchPoints: 0,
      categoryBonus: 0,
      budgetPenalty: 0,
      isOverBudget: false,
      overBudgetAmount: 0,
      matchedItemCount: 0,
      totalItemCount: 0,
      uniqueCategoriesCount: 0,
      feedbackMessage: "Your box is empty! Add 4-5 items to calculate your dorm vibe.",
    };
  }

  // 1. Calculate weighted vibe match
  let matchedItemCount = 0;
  let totalMatchWeight = 0;

  for (const item of items) {
    if (item.vibes.includes(selectedVibe)) {
      matchedItemCount += 1;
      // Normalize weight (1-5) to (0.2 - 1.0)
      const normalizedWeight = Math.min(Math.max(item.vibeWeight, 1), 5) / 5;
      totalMatchWeight += normalizedWeight;
    }
  }

  // Average match score across all items in box, scaled to 70 max pts
  const averageMatchRatio = totalMatchWeight / totalItemCount;
  const vibeMatchPoints = Math.round(averageMatchRatio * 70);

  // 2. Category Balance Bonus (up to 20 pts)
  const uniqueCategories = new Set(items.map((item) => item.category));
  const uniqueCategoriesCount = uniqueCategories.size;

  let categoryBonus = 0;
  switch (uniqueCategoriesCount) {
    case 5:
      categoryBonus = 20;
      break;
    case 4:
      categoryBonus = 16;
      break;
    case 3:
      categoryBonus = 12;
      break;
    case 2:
      categoryBonus = 6;
      break;
    default:
      categoryBonus = 0;
      break;
  }

  // 3. Completeness bonus (up to 10 pts)
  let countBonus = 0;
  if (totalItemCount >= 4) {
    countBonus = 10;
  } else if (totalItemCount === 3) {
    countBonus = 7;
  } else if (totalItemCount === 2) {
    countBonus = 4;
  } else {
    countBonus = 2;
  }

  // Total raw score before budget penalties
  const rawScore = vibeMatchPoints + categoryBonus + countBonus;

  // 4. Budget Calculation & Penalty
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const isOverBudget = totalPrice > budgetTier;
  const overBudgetAmount = isOverBudget ? totalPrice - budgetTier : 0;

  let budgetPenalty = 0;
  if (isOverBudget) {
    // 1 point penalty per 2% over budget (e.g. 20% over = 10 pts penalty)
    const percentageOver = (overBudgetAmount / budgetTier) * 100;
    budgetPenalty = Math.round(percentageOver / 2);
  }

  // Final score clamped strictly between 0 and 100
  const finalScore = Math.min(100, Math.max(0, rawScore - budgetPenalty));

  // Gen Z feedback copy
  let feedbackMessage = "";
  if (isOverBudget && finalScore < 60) {
    feedbackMessage = `Over budget by ₹${overBudgetAmount}! Swap an item to save your score.`;
  } else if (finalScore >= 90) {
    feedbackMessage = "Certified Dorm Masterpiece 🔥 Peak hostel aesthetic achieved!";
  } else if (finalScore >= 75) {
    feedbackMessage = "Solid Drip 🤌 Super cohesive setup with balanced essentials.";
  } else if (finalScore >= 50) {
    feedbackMessage = "Getting There ✨ Add items from other categories to boost balance.";
  } else {
    feedbackMessage = "Chaotic Neutral 😵‍💫 Most items don't match your chosen vibe.";
  }

  return {
    score: finalScore,
    vibeMatchPoints,
    categoryBonus,
    budgetPenalty,
    isOverBudget,
    overBudgetAmount,
    matchedItemCount,
    totalItemCount,
    uniqueCategoriesCount,
    feedbackMessage,
  };
}
