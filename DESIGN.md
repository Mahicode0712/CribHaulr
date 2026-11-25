# CribHaulr Design System

CribHaulr uses a shared sticker/zine visual language with five token-driven room
vibes. The selected vibe is stored on `<html data-vibe="…">`; components consume
CSS variables rather than defining their own palette.

## Shared design language

- Warm, playful surfaces with strong outlines, offset shadows, and expressive
  display typography.
- `rounded-card`, `rounded-btn`, `border-width-theme`, and `sticker-shadow`
  adapt to the selected vibe.
- `Button`, `Card`, `Badge`, `Sticker`, and `Stepper` provide the shared UI
  patterns. Interactive controls keep visible focus states and 44px targets.
- `prefers-reduced-motion` disables non-essential transitions and animations.

## Theme tokens and roles

The canonical values live in `src/app/globals.css`. Each selector defines
`--bg`, `--surface`, `--deep`, `--ink`, `--primary`, `--secondary`, `--accent`, the
matching `--on-*` foregrounds, `--border`, `--shadow-color`, `--shadow-offset`,
`--muted`, `--radius-card`, `--radius-btn`, `--border-w`, `--font-display`, and
`--font-body`.

| Vibe | Background / surface / deep | Ink / muted | Primary / secondary / accent |
|---|---|---|---|
| Cozy | `#FCFACD` / `#FFFBE6` / `#FCFACD` | `#270903` / `#983109` | `#B84E10` / `#983109` / `#D2832A` |
| Dark Academia | `#2A1016` / `#51202C` / `#18231D` | `#E9E0D0` / `#A99F8E` | `#6B3543` / `#2F4736` / `#C9A96B` |
| Neon Gamer | `#021826` / `#082B3F` / `#021826` | `#EAFFF3` / `#A9C6C4` | `#06F284` / `#5C1966` / `#EAF405` |
| Minimalist | `#F2E7D5` / `#FAF7F0` / `#F2E7D5` | `#3B2A20` / `#7B5E4A` | `#3B2A20` / `#D1B89A` / `#A67C52` |
| Kawaii | `#B8E8EE` / `#F7FDFE` / `#B8E8EE` | `#2F3358` / `#2F3358` | `#F2C7DB` / `#CBB7F5` / `#7ADDF2` |

Color roles:

- `--bg` is the page canvas; `--surface` is for cards and panels; `--deep` is
  for headers, footers, form fields, and meter tracks. Deep defaults to `--bg`
  except for Dark Academia.
- `--ink` is the default readable text; `--muted` is secondary copy.
- `--primary`, `--secondary`, and `--accent` are paired with their respective
  `--on-*` token whenever text is placed on those fills.
- `--border` and `--shadow-color` control outlines and hard shadows.
- Neon Gamer also defines `--highlight` for small price highlights; Kawaii
  defines `--mint` for success states.

Tailwind v4 exposes these as utilities such as `bg-bg`, `bg-surface`, `bg-deep`,
`text-ink`, `text-muted`, `bg-primary`, `text-on-primary`, `border-line`,
`rounded-card`, `rounded-btn`, `font-display`, and `font-body`. The
`.theme-price` utility uses readable ink in every vibe and the Neon Gamer
highlight token for prices.

## Typography and personality

`src/app/layout.tsx` loads Fraunces, Bodoni Moda, Space Grotesk, DM Serif Display,
Fredoka, DM Sans, Inter, and Nunito through `next/font/google`. The CSS tokens
choose the display and body pair per vibe.

`src/data/vibes.ts` defines each vibe's headline, sticker label, descriptive
copy, emoji, icon motifs, and box tint. The picker cards scope themselves with
their own `data-vibe` attribute, so each palette preview comes from the same
CSS tokens as the full page.

## Adding a vibe

1. Add its ID to `VibeId` and define its copy, icon names, and token-based box
   tint in `src/data/vibes.ts`.
2. Add a complete `[data-vibe="<id>"]` token block in
   `src/app/globals.css`, including readable `--on-*` values and font tokens.
   Use CSS variables for all component colors; do not add component-level hex
   values.
3. Add any new icon name to the icon map in `src/app/page.tsx`. Keep
   `VIBE_LIST` as the source for switcher options and the pre-paint theme
   initializer.
4. Add the vibe to `src/tests/themeContrast.test.mjs` and verify all nine
   foreground/background pairs remain at least 4.5:1.
5. Test the landing page, builder picker, room scene, checkout, and exported
   story card at mobile and desktop widths.

## Accessibility and share exports

`src/tests/themeContrast.test.mjs` checks ink and muted text on background,
surface, and deep surfaces, plus each `--on-*` token on its fill against WCAG
AA's 4.5:1 contrast target. Focus indicators use the active ink token. Keep
accent colors for compact visual highlights rather than paragraph text.
Dark Academia adds small brass heading rules and four-point-star section
dividers; its brass accent is reserved for those details, not large fills.

The room scene and product illustrations use CSS variables for every fill and
stroke. `StoryCard` sets its own `data-vibe`; before PNG export, the share page
copies resolved theme tokens inline so the rendered image retains the selected
palette.
