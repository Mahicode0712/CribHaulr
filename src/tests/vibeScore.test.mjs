import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateVibeScore } from "../lib/vibeScore.ts";

// Sample mock products for unit testing
const mockFairyLights = {
  id: "test-01",
  name: "Fairy Lights",
  category: "decor",
  price: 199,
  vibes: ["cozy"],
  vibeWeight: 5,
  image: "/img1",
  sprite: "s1",
  spaceAnchors: {},
  stock: 10,
  tags: ["light"],
  description: "warm lights",
};

const mockDeskMat = {
  id: "test-02",
  name: "Desk Mat",
  category: "desk",
  price: 299,
  vibes: ["cozy"],
  vibeWeight: 5,
  image: "/img2",
  sprite: "s2",
  spaceAnchors: {},
  stock: 10,
  tags: ["mat"],
  description: "cozy mat",
};

const mockBlanket = {
  id: "test-03",
  name: "Chenille Blanket",
  category: "comfort",
  price: 499,
  vibes: ["cozy"],
  vibeWeight: 5,
  image: "/img3",
  sprite: "s3",
  spaceAnchors: {},
  stock: 10,
  tags: ["blanket"],
  description: "soft blanket",
};

const mockPowerStrip = {
  id: "test-04",
  name: "Power Strip",
  category: "utility",
  price: 399,
  vibes: ["cozy"],
  vibeWeight: 5,
  image: "/img4",
  sprite: "s4",
  spaceAnchors: {},
  stock: 10,
  tags: ["power"],
  description: "utility strip",
};

const mockMaggi = {
  id: "test-05",
  name: "Hostel Maggi Pack",
  category: "fun",
  price: 129,
  vibes: ["cozy"],
  vibeWeight: 5,
  image: "/img5",
  sprite: "s5",
  spaceAnchors: {},
  stock: 10,
  tags: ["food"],
  description: "midnight snack",
};

const mockCyberNeon = {
  id: "test-cyber",
  name: "Neon Bolt",
  category: "decor",
  price: 499,
  vibes: ["neon-gamer"],
  vibeWeight: 5,
  image: "/img6",
  sprite: "s6",
  spaceAnchors: {},
  stock: 10,
  tags: ["neon"],
  description: "cyber bolt",
};

describe("Vibe Score Logic", () => {
  test("returns score 0 for an empty box", () => {
    const result = calculateVibeScore([], "cozy", 999);
    assert.equal(result.score, 0);
    assert.equal(result.totalItemCount, 0);
    assert.equal(result.isOverBudget, false);
  });

  test("calculates maximum score for a 5-item, 5-category cohesive box within budget", () => {
    // Total price: 199 + 299 + 499 + 399 + 129 = 1525, which fits in 1999 tier
    const items = [mockFairyLights, mockDeskMat, mockBlanket, mockPowerStrip, mockMaggi];
    const result = calculateVibeScore(items, "cozy", 1999);

    assert.equal(result.score, 100);
    assert.equal(result.vibeMatchPoints, 70);
    assert.equal(result.categoryBonus, 20);
    assert.equal(result.uniqueCategoriesCount, 5);
    assert.equal(result.isOverBudget, false);
    assert.equal(result.budgetPenalty, 0);
  });

  test("penalizes non-matching vibes", () => {
    // Cyber neon does not match cozy
    const items = [mockCyberNeon];
    const result = calculateVibeScore(items, "cozy", 999);

    assert.equal(result.matchedItemCount, 0);
    assert.equal(result.vibeMatchPoints, 0);
    assert.ok(result.score < 20);
  });

  test("rewards category diversity with higher bonus", () => {
    // 2 items from same category vs 2 items from different categories
    const sameCategory = [
      mockFairyLights,
      { ...mockFairyLights, id: "test-decor-2" },
    ];
    const differentCategory = [mockFairyLights, mockDeskMat];

    const resultSame = calculateVibeScore(sameCategory, "cozy", 999);
    const resultDiff = calculateVibeScore(differentCategory, "cozy", 999);

    assert.equal(resultSame.categoryBonus, 0);
    assert.equal(resultDiff.categoryBonus, 6);
    assert.ok(resultDiff.score > resultSame.score);
  });

  test("deducts points when total exceeds budget tier", () => {
    // Total price: 199 + 299 = 498 (within 499 tier)
    const inBudget = calculateVibeScore([mockFairyLights, mockDeskMat], "cozy", 499);
    assert.equal(inBudget.isOverBudget, false);
    assert.equal(inBudget.budgetPenalty, 0);

    // Total price: 199 + 299 + 499 = 997 (exceeds 499 tier by 498, ~100% over)
    const overBudget = calculateVibeScore(
      [mockFairyLights, mockDeskMat, mockBlanket],
      "cozy",
      499
    );
    assert.equal(overBudget.isOverBudget, true);
    assert.ok(overBudget.budgetPenalty > 20);
    assert.ok(overBudget.score < inBudget.score);
  });

  test("clamps score strictly between 0 and 100", () => {
    // Way over budget: 10 items in a 499 tier
    const manyItems = [
      mockFairyLights,
      mockDeskMat,
      mockBlanket,
      mockPowerStrip,
      mockMaggi,
      mockCyberNeon,
      mockBlanket,
    ];
    const result = calculateVibeScore(manyItems, "minimalist", 499);
    assert.ok(result.score >= 0);
    assert.ok(result.score <= 100);
  });
});
