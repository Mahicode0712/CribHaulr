# CribHaulr (📦 Dorm Box Lab)

> A Gen Z-oriented build-your-own dorm & hostel box e-commerce web app for Indian college students. Pick your room vibe, lock your student budget tier (₹499 / ₹999 / ₹1,999), customize 4–5 handpicked essentials, preview your room scene in real-time, export a 9:16 Instagram story card, and checkout with UPI in 1 tap.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **Package Manager**: npm (or pnpm / yarn)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/cribhaulr.git
cd cribhaulr

# Install dependencies
npm install
```

### 3. Local Development
```bash
# Start the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Unit Tests
Unit tests run using Node's high-speed native test runner:
```bash
npm test
```
Runs `src/tests/vibeScore.test.mjs`, verifying the pure mathematical Vibe Score engine, category diversity bonuses, budget penalties, and boundary clamping.

### 5. Production Build
```bash
npm run build
npm run start
```
Turbopack compiles and prerenders all 7 application routes statically in under 200ms.

---

## 🎨 Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Soft-Brutalist Design Tokens
- **Theming**: Dynamic `data-vibe` CSS Custom Properties system (Cozy, Dark Academia, Clean Minimalist, Kawaii Dream, Neon Gamer)
- **Animation**: Framer Motion (spring press physics, lid rotation, scene sprite entries)
- **State Management**: Zustand with `localStorage` persistence (`useHaulStore`)
- **Export & Canvas**: `html-to-image` (1080×1920 9:16 story card generator) + `canvas-confetti`
- **Icons**: Lucide React
- **API Layer**: Typed async abstraction in `src/lib/api.ts` (ready for FastAPI or Supabase drop-in)

---

## 🗺️ Application Routes

| Route | Purpose | Key Features |
|---|---|---|
| `/` | **Landing Page** | 3D animated box hero, live vibe morpher, 3-step guide, student tiers, UGC reviews, FAQ accordion. |
| `/builder` | **Haul Builder** | 5-step flow: Space & Budget $\to$ Vibe Picker $\to$ Auto Starter $\to$ Customizer $\to$ Live Preview. |
| `/catalog` | **Product Catalog** | 43 seeded hostel items across 5 categories, search, vibe filters, student prices in INR, floating haul bar. |
| `/preview` | **Live Scene Visualizer** | Layered SVG room scene (Desk / Bed / Room), animated product sprites on coordinates, 3D box view. |
| `/share` | **9:16 Story Card** | 1080×1920 story card generator, PNG download with confetti, Web Share API, shareable link copy. |
| `/drops` | **Seasonal Drops** | Limited drops (Freshers' Box, Exam All-Nighter, Winter Warmth) with live ticking countdown timers. |
| `/checkout` | **UPI Checkout** | UPI intents (GPay, PhonePe, Paytm, BHIM), dynamic QR, hostel address validation, Roommate Mode stub. |

---

## 🧮 Vibe Score Math Formula

The Vibe Score ($0 \text{ to } 100$) is computed via a pure function in `src/lib/vibeScore.ts`:

$$\text{Score} = \text{Clamp}_{0}^{100}\Big(\text{VibeMatchPoints} + \text{CategoryBonus} + \text{CountBonus} - \text{BudgetPenalty}\Big)$$

1. **Weighted Vibe Match (up to 70 pts)**:
   $$\text{VibeMatchPoints} = \text{round}\left( \frac{\sum_{i=1}^{n} (\text{weight}_i / 5)}{n} \times 70 \right)$$
   where matching items have normalized weight between $0.2$ and $1.0$.
2. **Category Diversity Bonus (up to 20 pts)**:
   Rewards covering diverse essentials (Decor ✨, Desk 💻, Comfort ☁️, Utility 🔌, Fun/Snacks 🍜):
   - 5 categories = **+20 pts**
   - 4 categories = **+16 pts**
   - 3 categories = **+12 pts**
   - 2 categories = **+6 pts**
3. **Box Completeness Bonus (up to 10 pts)**:
   - $\ge 4$ items = **+10 pts**
   - $3$ items = **+7 pts**
4. **Budget Overage Penalty**:
   $$\text{BudgetPenalty} = \text{round}\left( \frac{\text{Total} - \text{BudgetTier}}{\text{BudgetTier}} \times 50 \right)$$
   Deducts 1 point for every 2% exceeded over the selected tier.

---

## 🔌 How to Connect a Real Backend (FastAPI / Supabase)

CribHaulr is architected with a strict separation between UI components and data fetching. All data access runs through the async abstraction layer in `src/lib/api.ts`. 

To connect a real production backend, follow the guide below:

### Option A: Connecting with FastAPI (Python)

#### 1. Database Schema (PostgreSQL)
```sql
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    vibes TEXT[] NOT NULL,
    vibe_weight INTEGER DEFAULT 4,
    image TEXT,
    sprite VARCHAR(100),
    space_anchors JSONB,
    stock INTEGER DEFAULT 20,
    tags TEXT[],
    description TEXT,
    is_popular BOOLEAN DEFAULT false
);

CREATE TABLE boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space VARCHAR(20) NOT NULL,
    budget_tier INTEGER NOT NULL,
    vibe VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    total INTEGER NOT NULL,
    vibe_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_id UUID REFERENCES boxes(id),
    student_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    college VARCHAR(255) NOT NULL,
    hostel_block VARCHAR(255) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    upi_vpa VARCHAR(100),
    amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. FastAPI Endpoints (`main.py`)
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="CribHaulr Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://cribhaulr.in"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/products")
async def list_products(
    category: Optional[str] = None,
    vibe: Optional[str] = None,
    search: Optional[str] = None
):
    # Query database and return matching items
    return {"products": [...]}

@app.post("/api/v1/starter-box")
async def generate_starter_box(space: str, budget_tier: int, vibe: str):
    # Algorithmic selection logic in Python
    return {"starter_items": [...]}

@app.post("/api/v1/orders")
async def create_order(order_data: dict):
    # Persist order and generate UPI payment intent
    return {"order_id": "CRB-938210", "status": "confirmed"}
```

#### 3. Updating `src/lib/api.ts`
Set the base URL in your `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.cribhaulr.in/api/v1
```

Replace the mock implementation in `src/lib/api.ts`:
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = {
  products: {
    async list(params = {}) {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${BASE_URL}/products?${query}`);
      return res.json();
    },
    async getById(id: string) {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      return res.json();
    },
  },
  starterBox: {
    async generate(space, budgetTier, vibe) {
      const res = await fetch(`${BASE_URL}/starter-box`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ space, budget_tier: budgetTier, vibe }),
      });
      return res.json();
    },
  },
  // ...
};
```

---

### Option B: Connecting with Supabase

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Create `src/lib/supabase.ts`:
   ```typescript
   import { createClient } from "@supabase/supabase-js";

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```
3. Query Supabase directly inside `src/lib/api.ts`:
   ```typescript
   async list(params = {}) {
     let query = supabase.from("products").select("*");
     if (params.category && params.category !== "all") {
       query = query.eq("category", params.category);
     }
     if (params.vibe && params.vibe !== "all") {
       query = query.contains("vibes", [params.vibe]);
     }
     const { data, error } = await query;
     if (error) throw error;
     return data;
   }
   ```

---

## ♿ Accessibility & Performance Standards

- **Touch Ergonomics**: All interactive elements exceed $44 \times 44\text{px}$ minimum tap boundaries.
- **Focus States**: High-visibility `:focus-visible` ring (`3px solid var(--accent)`) with 3px offset.
- **Contrast**: WCAG AA compliance ($> 4.5:1$ contrast ratio) across light and dark mode vibes.
- **Motion Reduction**: `@media (prefers-reduced-motion: reduce)` zeroes transitions and animations for motion-sensitive users.
- **Semantic HTML**: Proper `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, and `<ol>` stepper hierarchies.

---

## 📄 License
MIT © 2026 CribHaulr Team. Built for Indian college dorm & hostel survivors.
