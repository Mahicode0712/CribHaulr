export type VibeId =
  | "cozy"
  | "dark-academia"
  | "minimalist"
  | "kawaii"
  | "neon-gamer";

export type VibeIconName =
  | "lightbulb"
  | "coffee"
  | "flame"
  | "book"
  | "candle"
  | "pencil"
  | "gamepad"
  | "bolt"
  | "headphones"
  | "notebook"
  | "box"
  | "heart"
  | "star"
  | "cloud";

export interface VibeInfo {
  id: VibeId;
  name: string;
  tagline: string;
  headline: string;
  stickerLabel: string;
  emoji: string;
  description: string;
  iconNames: VibeIconName[];
  boxTint: string;
  moodKeywords: string[];
}

export const VIBES: Record<VibeId, VibeInfo> = {
  cozy: {
    id: "cozy",
    name: "Cozy / Dormcore",
    tagline: "Warm lights, warmer room.",
    headline: "Warm lights, warmer room.",
    stickerLabel: "SOFT RESET",
    emoji: "🧶",
    description: "Soft light, warm chai, and a tiny reset after that 8 AM lecture.",
    iconNames: ["lightbulb", "coffee", "flame"],
    boxTint: "var(--accent)",
    moodKeywords: ["Warm", "Earthy", "Soft Light", "Textured", "Relaxing"],
  },
  "dark-academia": {
    id: "dark-academia",
    name: "Dark Academia",
    tagline: "Your desk deserves a library.",
    headline: "Your desk deserves a library.",
    stickerLabel: "STUDY MODE",
    emoji: "📜",
    description: "Leather notebooks, candlelight, and midnight study energy.",
    iconNames: ["book", "candle", "pencil"],
    boxTint: "var(--accent)",
    moodKeywords: ["Vintage", "Scholar", "Moody", "Brass", "Classic"],
  },
  minimalist: {
    id: "minimalist",
    name: "Clean Minimalist",
    tagline: "Less stuff. Better stuff.",
    headline: "Less stuff. Better stuff.",
    stickerLabel: "LESS, BETTER",
    emoji: "📐",
    description: "A clear desk, useful essentials, and room to think.",
    iconNames: ["notebook", "box", "pencil"],
    boxTint: "var(--accent)",
    moodKeywords: ["Crisp", "Monochrome", "Geometric", "Clutter-Free"],
  },
  kawaii: {
    id: "kawaii",
    name: "Kawaii Dream",
    tagline: "Cute desk, who dis.",
    headline: "Cute desk, who dis.",
    stickerLabel: "CUTE MODE",
    emoji: "🌸",
    description: "Cloud pillows, tiny stars, and cute desk energy for the long week.",
    iconNames: ["heart", "star", "cloud"],
    boxTint: "var(--accent)",
    moodKeywords: ["Pastel", "Cute", "Playful", "Strawberry Milk", "Dopamine"],
  },
  "neon-gamer": {
    id: "neon-gamer",
    name: "Neon Gamer / Cyber",
    tagline: "Level up your cave.",
    headline: "Level up your cave.",
    stickerLabel: "GG / GO TIME",
    emoji: "⚡",
    description: "Headphones on, cables managed, ranked queue ready.",
    iconNames: ["gamepad", "bolt", "headphones"],
    boxTint: "var(--highlight)",
    moodKeywords: ["Cyberpunk", "RGB", "Electric", "Dark Mode", "Battlestation"],
  },
};

export const VIBE_LIST = Object.values(VIBES);
