export type VibeId =
  | "cozy"
  | "dark-academia"
  | "minimalist"
  | "kawaii"
  | "neon-gamer";

export interface VibeInfo {
  id: VibeId;
  name: string;
  tagline: string;
  emoji: string;
  description: string;
  palette: {
    bg: string;
    card: string;
    accent: string;
    border: string;
    shadow: string;
    stickerBg: string;
    stickerText: string;
  };
  moodKeywords: string[];
  bannerGradient: string;
}

export const VIBES: Record<VibeId, VibeInfo> = {
  cozy: {
    id: "cozy",
    name: "Cozy / Dormcore",
    tagline: "Knitted throws, warm chai, and 1 AM lofi beats.",
    emoji: "🧶",
    description:
      "Warm oatmeal textures, terracotta warmth, fairy lights, and soothing matcha accents. Your room feels like a hug after a brutal 8 AM lecture.",
    palette: {
      bg: "#FAF5ED",
      card: "#FFFFFF",
      accent: "#D96B43",
      border: "#2C221E",
      shadow: "#2C221E",
      stickerBg: "#F5E3A9",
      stickerText: "#2C221E",
    },
    moodKeywords: ["Warm", "Earthy", "Soft Light", "Textured", "Relaxing"],
    bannerGradient: "from-amber-100 via-orange-100 to-amber-200",
  },
  "dark-academia": {
    id: "dark-academia",
    name: "Dark Academia",
    tagline: "Leather notebooks, antique brass, and midnight study obsessions.",
    emoji: "📜",
    description:
      "Rich espresso browns, muted gold crests, vintage paper ephemera, and candle-lit scholar energy. Ideal for nocturnal thesis writers.",
    palette: {
      bg: "#1A1412",
      card: "#271F1B",
      accent: "#C89B3C",
      border: "#D4AF37",
      shadow: "#0A0807",
      stickerBg: "#D4AF37",
      stickerText: "#1A1412",
    },
    moodKeywords: ["Vintage", "Scholar", "Moody", "Brass", "Classic"],
    bannerGradient: "from-stone-900 via-yellow-950 to-stone-900",
  },
  minimalist: {
    id: "minimalist",
    name: "Clean Minimalist",
    tagline: "Zero clutter, monochrome precision, pure focus.",
    emoji: "📐",
    description:
      "Stark clean ivory, matte slate grey, architectural gridlines, and industrial typography. No distractions, just pristine study discipline.",
    palette: {
      bg: "#F8F9FA",
      card: "#FFFFFF",
      accent: "#18181B",
      border: "#09090B",
      shadow: "#09090B",
      stickerBg: "#E4E4E7",
      stickerText: "#09090B",
    },
    moodKeywords: ["Crisp", "Monochrome", "Geometric", "Clutter-Free"],
    bannerGradient: "from-slate-100 via-zinc-200 to-slate-100",
  },
  kawaii: {
    id: "kawaii",
    name: "Kawaii Dream",
    tagline: "Pastel peach, strawberry milk, and dopamine decor.",
    emoji: "🌸",
    description:
      "Sweet pastel pink, baby lavender, bubblegum stickers, cloud pillows, and cute collectible trinkets to survive engineering stress.",
    palette: {
      bg: "#FFF2F5",
      card: "#FFFFFF",
      accent: "#FF5E8E",
      border: "#3B202D",
      shadow: "#3B202D",
      stickerBg: "#FFF07C",
      stickerText: "#3B202D",
    },
    moodKeywords: ["Pastel", "Cute", "Playful", "Strawberry Milk", "Dopamine"],
    bannerGradient: "from-pink-100 via-rose-100 to-pink-200",
  },
  "neon-gamer": {
    id: "neon-gamer",
    name: "Neon Gamer / Cyber",
    tagline: "Obsidian dark mode, electric cyan, and RGB victory screens.",
    emoji: "⚡",
    description:
      "Deep obsidian night theme, electric cyan edges, acid green glow, and cable-managed cyberpunk battle station vibes.",
    palette: {
      bg: "#0D0F18",
      card: "#1A1E30",
      accent: "#00F0FF",
      border: "#00F0FF",
      shadow: "#030408",
      stickerBg: "#39FF14",
      stickerText: "#0D0F18",
    },
    moodKeywords: ["Cyberpunk", "RGB", "Electric", "Dark Mode", "Battlestation"],
    bannerGradient: "from-cyan-950 via-slate-900 to-purple-950",
  },
};

export const VIBE_LIST = Object.values(VIBES);
