import { test } from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS } from "../data/products.ts";
import { generateStarterBox } from "../lib/starterBox.ts";

const spaces = ["desk", "bed", "room"];
const vibes = ["cozy", "dark-academia", "minimalist", "kawaii", "neon-gamer"];
const budgetTiers = [499, 999, 1999];

test("starter boxes stay within budget and match the requested vibe", () => {
  for (const space of spaces) {
    for (const vibe of vibes) {
      for (const budgetTier of budgetTiers) {
        const items = generateStarterBox(PRODUCTS, space, budgetTier, vibe);
        const total = items.reduce((sum, item) => sum + item.price, 0);

        assert.ok(total <= budgetTier, `${space}/${vibe}/${budgetTier} exceeded budget`);
        assert.ok(items.length <= 5, `${space}/${vibe}/${budgetTier} has over five items`);
        assert.equal(
          new Set(items.map((item) => item.id)).size,
          items.length,
          `${space}/${vibe}/${budgetTier} contains duplicate products`
        );
        assert.ok(
          items.every((item) => item.vibes.includes(vibe)),
          `${space}/${vibe}/${budgetTier} contains a mismatched vibe`
        );
      }
    }
  }
});

test("the ₹499 Neon Gamer desk starter includes an affordable multi-item haul", () => {
  const items = generateStarterBox(PRODUCTS, "desk", 499, "neon-gamer");

  assert.ok(items.length >= 3);
  assert.ok(items.reduce((sum, item) => sum + item.price, 0) <= 499);
});
