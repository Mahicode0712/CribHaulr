# CribHaulr Design System & Vibe Theming

## 1. Aesthetic Direction: Soft Brutalism Meets Gen Z Zine
CribHaulr is designed specifically for Indian college students (aged 17–24) moving into hostels and dorms. The design blends:
- **Soft Brutalism**: Thick 2px–3px solid borders, hard offset drop shadows (`shadow-[4px_4px_0px_var(--shadow-color)]`), and large rounded corners (`rounded-2xl` to `rounded-3xl` / 20–28px).
- **Zine Collage & Physical Badges**: Tilted stickers (`-2.5deg` to `+3deg`), paper noise grain overlay (`public/grain.svg`), and tactile hover lifts (`hover:-translate-y-0.5`).
- **Tactile Micro-Interactions**: Springy button press squish (`whileTap={{ scale: 0.96, y: 2 }}`), rotating 3D box lid opening/closing, and live price and score roll animations.
- **Microcopy Tone**: Casual, witty, Gen Z Indian college slang without being cringe (*"your desk deserves better"*, *"add to the haul"*, *"no cap hostel drip"*, *"room 304 delivery"*).

---

## 2. Dynamic Vibe Theming System (`data-vibe`)
Theme switching is implemented via CSS Custom Properties on the root `<html>` element using the attribute `data-vibe="<vibe-id>"`. When the user selects a vibe, the entire application interface instantly transforms its palette, card backgrounds, border accents, and sticker colors.

### The 5 Supported Vibes

| Vibe ID | Display Name | Mood & Concept | Accent Token | Background Token | Border & Shadow Token |
|---|---|---|---|---|---|
| `cozy` *(Default)* | **Cozy / Dormcore** 🧶 | Knitted throws, warm chai, 1 AM lofi beats | `#D96B43` (Terracotta) | `#FAF5ED` (Oatmeal) | `#2C221E` (Espresso ink) |
| `dark-academia` | **Dark Academia** 📜 | Leather notebooks, antique brass, midnight study | `#C89B3C` (Burnished gold) | `#1A1412` (Dark parchment) | `#D4AF37` (Brass gold) |
| `minimalist` | **Clean Minimalist** 📐 | Zero clutter, monochrome precision, industrial focus | `#18181B` (Carbon slate) | `#F8F9FA` (Clean alabaster) | `#09090B` (Jet black) |
| `kawaii` | **Kawaii Dream** 🌸 | Pastel peach, strawberry milk, dopamine desk setup | `#FF5E8E` (Strawberry pink) | `#FFF2F5` (Peach blush) | `#3B202D` (Dark plum) |
| `neon-gamer` | **Neon Gamer / Cyber** ⚡ | Obsidian dark mode, electric cyan edges, acid glow | `#00F0FF` (Electric cyan) | `#0D0F18` (Midnight void) | `#00F0FF` (Cyan neon) |

### CSS Variables Contract (`src/app/globals.css`)
```css
:root {
  --vibe-name: "cozy";
  --bg-primary: #FAF5ED;
  --bg-secondary: #F3ECE1;
  --bg-card: #FFFFFF;
  --text-primary: #2C221E;
  --text-secondary: #63534C;
  --text-muted: #8E7A71;
  --border-color: #2C221E;
  --shadow-color: #2C221E;
  --accent: #D96B43;
  --accent-hover: #C55831;
  --accent-text: #FFFFFF;
  --accent-soft: #FCE8E0;
  --secondary-accent: #5E8256;
  --sticker-bg: #F5E3A9;
  --sticker-text: #2C221E;
  --glow-color: rgba(217, 107, 67, 0.25);
}
```

---

## 3. Typography Hierarchy
- **Display Headings**: `Space Grotesk`, sans-serif (Weights: 600, 700, 800) with `-0.025em` tracking for confident, geometric titles.
- **Body & Controls**: `Plus Jakarta Sans` / `Inter`, sans-serif (Weights: 400, 500, 600, 700) for pristine readability on mobile screens.
- **Monospace Metadata**: `font-mono` for pricing tags, delivery targets, coupon codes, and order IDs.

---

## 4. Reusable Soft-Brutalist UI Primitives

1. **`Button`** (`src/components/ui/Button.tsx`)
   - Min touch targets: $\ge 44\text{px}$ on mobile (`h-11` and `h-13`).
   - Tactile spring squish on tap via Framer Motion.
   - Variants: `primary`, `secondary`, `vibe`, `outline`, `ghost`, `danger`.

2. **`Card`** (`src/components/ui/Card.tsx`)
   - 2px solid border with hard offset drop-shadow (`shadow-[4px_4px_0px_var(--shadow-color)]`).
   - Hover lift (`hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px]`).
   - Modular subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

3. **`Sticker`** (`src/components/ui/Sticker.tsx`)
   - Physical zine sticker badges with randomized or explicit tilt angles (`-2.5deg` to `+3deg`).
   - Contrast-guaranteed background and text pairings (`vibe`, `yellow`, `pink`, `cyan`, `green`).

4. **`Badge`** (`src/components/ui/Badge.tsx`)
   - Solid border pill tags with subtle 1.5px hard shadows for stock tags and categories.

5. **`Modal`** (`src/components/ui/Modal.tsx`)
   - Spring-in dialog sheet with backdrop blur, keyboard `Escape` listener, and automatic body scroll lock.

6. **`Stepper`** (`src/components/ui/Stepper.tsx`)
   - Accessible `<nav>` and `<ol>` progress bar showing step numbers and completion checkmarks.

7. **`ProductImage`** (`src/components/ui/ProductImage.tsx`)
   - Playful vector SVG representations per category, preventing broken image links and supporting instant asset swapping.

---

## 5. Accessibility & Motion Guidelines

- **Mobile First**: All layouts designed for compact 390px screens first, scaling to tablet (`md:768px`) and desktop (`lg:1024px`, `xl:1280px`).
- **Touch Ergonomics**: 44px+ tap targets ensure effortless single-hand thumb navigation.
- **WCAG AA Compliance**: High contrast ratios ($\ge 4.5:1$) maintained across body text, cards, and buttons for all 5 room vibes.
- **Accessible Focus Indicators**: Explicit `:focus-visible` styling (`outline: 3px solid var(--accent); outline-offset: 3px`).
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
