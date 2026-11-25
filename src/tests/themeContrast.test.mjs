import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const vibes = ["cozy", "dark-academia", "neon-gamer", "minimalist", "kawaii"];
const contrastPairs = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["ink", "deep"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["muted", "deep"],
  ["on-primary", "primary"],
  ["on-secondary", "secondary"],
  ["on-accent", "accent"],
];

function getVibeTokens(vibe) {
  const selector =
    vibe === "cozy"
      ? /:root,\s*\[data-vibe="cozy"\]\s*\{([^}]+)\}/
      : new RegExp(`\\[data-vibe="${vibe}"\\]\\s*\\{([^}]+)\\}`);
  const block = css.match(selector)?.[1];
  assert.ok(block, `Missing CSS token block for ${vibe}`);

  const tokens = Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-fA-F]{6})\s*;/g)].map(
      ([, name, value]) => [name, value]
    )
  );
  if (/--deep:\s*var\(--bg\)\s*;/.test(block)) {
    tokens.deep = tokens.bg;
  }
  return tokens;
}

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

test("theme text, deep surfaces, and control pairs meet WCAG AA contrast", () => {
  const failures = [];

  for (const vibe of vibes) {
    const tokens = getVibeTokens(vibe);
    for (const [foreground, background] of contrastPairs) {
      const ratio = contrastRatio(tokens[foreground], tokens[background]);
      if (ratio < 4.5) {
        failures.push(`${vibe}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1`);
      }
    }
  }

  assert.deepEqual(failures, [], failures.join("\n"));
});

test("deep surfaces fall back to the page background outside Dark Academia", () => {
  for (const vibe of vibes) {
    const selector =
      vibe === "cozy"
        ? /:root,\s*\[data-vibe="cozy"\]\s*\{([^}]+)\}/
        : new RegExp(`\\[data-vibe="${vibe}"\\]\\s*\\{([^}]+)\\}`);
    const block = css.match(selector)?.[1];
    assert.ok(block, `Missing CSS token block for ${vibe}`);

    if (vibe === "dark-academia") {
      assert.match(block, /--deep:\s*#18231D\s*;/);
    } else {
      assert.match(block, /--deep:\s*var\(--bg\)\s*;/);
    }
  }
});
