"use client";

import React from "react";
import { SpaceType } from "@/types";
import { VibeId } from "@/data/vibes";

interface SceneBackgroundProps {
  space: SpaceType;
  vibe: VibeId;
}

export function SceneBackground({ space, vibe }: SceneBackgroundProps) {
  // Common theme color palettes for background scene
  const isDark = vibe === "dark-academia" || vibe === "neon-gamer";

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-3xl">
      {space === "desk" && (
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Wall Background */}
          <rect width="1000" height="650" fill="var(--bg-secondary)" />

          {/* Window Frame with Outdoor Campus Atmosphere */}
          <g transform="translate(720, 40)">
            <rect
              width="230"
              height="200"
              rx="8"
              fill={isDark ? "#0A0D18" : "#E2EEF8"}
              stroke="var(--border-color)"
              strokeWidth="4"
            />
            {/* Window Panes */}
            <line x1="115" y1="0" x2="115" y2="200" stroke="var(--border-color)" strokeWidth="3" />
            <line x1="0" y1="100" x2="230" y2="100" stroke="var(--border-color)" strokeWidth="3" />
            {/* Moon or Sun */}
            <circle
              cx="170"
              cy="60"
              r="24"
              fill={isDark ? "#FFF07C" : "#FFC837"}
              opacity={isDark ? "0.85" : "0.9"}
            />
            {/* Window Sill */}
            <rect x="-10" y="200" width="250" height="12" rx="3" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />
          </g>

          {/* Notice Board on Wall */}
          <rect
            x="80"
            y="60"
            width="220"
            height="150"
            rx="12"
            fill="var(--bg-card)"
            stroke="var(--border-color)"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          {/* Memo notes pinned on board */}
          <rect x="100" y="80" width="45" height="50" rx="3" fill="var(--sticker-bg)" transform="rotate(-4 100 80)" stroke="var(--border-color)" strokeWidth="1.5" />
          <rect x="160" y="85" width="45" height="45" rx="3" fill="var(--accent-soft, #FFDDE7)" transform="rotate(3 160 85)" stroke="var(--border-color)" strokeWidth="1.5" />
          <rect x="220" y="90" width="55" height="40" rx="3" fill="var(--bg-secondary)" transform="rotate(-2 220 90)" stroke="var(--border-color)" strokeWidth="1.5" />

          {/* Wall Molding Line */}
          <line x1="0" y1="360" x2="1000" y2="360" stroke="var(--border-color)" strokeWidth="2" opacity="0.3" />

          {/* Heavy Wooden Study Desk Surface */}
          <polygon
            points="0,380 1000,380 960,650 40,650"
            fill="var(--bg-card)"
            stroke="var(--border-color)"
            strokeWidth="4"
          />

          {/* Desk Depth Lip Line */}
          <line x1="0" y1="400" x2="1000" y2="400" stroke="var(--border-color)" strokeWidth="2" opacity="0.25" />

          {/* Desk Legs / Pedestal */}
          <rect x="80" y="400" width="28" height="250" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="3" />
          <rect x="892" y="400" width="28" height="250" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="3" />

          {/* Center Student Ergonomic Chair Backrest Outline */}
          <g transform="translate(420, 480)">
            <rect
              x="0"
              y="0"
              width="160"
              height="180"
              rx="28"
              fill="var(--bg-secondary)"
              stroke="var(--border-color)"
              strokeWidth="4"
            />
            <path d="M 40 40 Q 80 60 120 40" stroke="var(--border-color)" strokeWidth="2" fill="none" opacity="0.4" />
          </g>
        </svg>
      )}

      {space === "bed" && (
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Wall */}
          <rect width="1000" height="650" fill="var(--bg-secondary)" />

          {/* Fairy Lights Anchor Wire Across Wall */}
          <path
            d="M 50 80 Q 250 140 500 80 T 950 80"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Framed Wall Art Above Bed */}
          <rect x="380" y="60" width="240" height="130" rx="10" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="4" />
          <circle cx="500" cy="120" r="30" fill="var(--sticker-bg)" />

          {/* Floor Line */}
          <rect x="0" y="480" width="1000" height="170" fill="var(--bg-primary)" />
          <line x1="0" y1="480" x2="1000" y2="480" stroke="var(--border-color)" strokeWidth="3" />

          {/* Bedside Table on Left */}
          <rect x="70" y="340" width="130" height="180" rx="10" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />
          <rect x="85" y="360" width="100" height="40" rx="4" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="2" />
          <circle cx="135" cy="380" r="4" fill="var(--border-color)" />

          {/* Single Cot Headboard */}
          <rect x="240" y="220" width="560" height="140" rx="16" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="4" />
          <line x1="380" y1="220" x2="380" y2="360" stroke="var(--border-color)" strokeWidth="3" />
          <line x1="520" y1="220" x2="520" y2="360" stroke="var(--border-color)" strokeWidth="3" />
          <line x1="660" y1="220" x2="660" y2="360" stroke="var(--border-color)" strokeWidth="3" />

          {/* Mattress & Comforter */}
          <polygon
            points="220,340 820,340 860,540 180,540"
            fill="var(--bg-card)"
            stroke="var(--border-color)"
            strokeWidth="4"
          />

          {/* Pillow Block */}
          <rect x="280" y="310" width="190" height="70" rx="20" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="3" />
          <rect x="530" y="310" width="190" height="70" rx="20" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="3" />

          {/* Cozy Floor Rug */}
          <ellipse cx="500" cy="570" rx="280" ry="50" fill="var(--sticker-bg)" stroke="var(--border-color)" strokeWidth="3" opacity="0.85" />
        </svg>
      )}

      {space === "room" && (
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Room Corner Isometric Walls */}
          <polygon points="0,0 500,80 500,450 0,420" fill="var(--bg-secondary)" />
          <polygon points="500,80 1000,0 1000,420 500,450" fill="var(--bg-card)" opacity="0.9" />

          {/* Floor */}
          <polygon points="0,420 500,450 1000,420 1000,650 0,650" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="4" />

          {/* Corner Vertical Spine */}
          <line x1="500" y1="80" x2="500" y2="450" stroke="var(--border-color)" strokeWidth="3" />

          {/* Left Wall Window */}
          <polygon points="80,110 320,140 320,290 80,260" fill={isDark ? "#0D111E" : "#D4E8F8"} stroke="var(--border-color)" strokeWidth="3" />
          <line x1="200" y1="125" x2="200" y2="275" stroke="var(--border-color)" strokeWidth="2" />

          {/* Right Wall Poster */}
          <polygon points="620,130 840,100 840,240 620,270" fill="var(--sticker-bg)" stroke="var(--border-color)" strokeWidth="3" />
          <circle cx="730" cy="180" r="24" fill="var(--accent)" />

          {/* Desk on Left */}
          <polygon points="50,380 340,360 300,520 20,530" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />

          {/* Bed on Right */}
          <polygon points="660,360 980,380 950,540 630,510" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />

          {/* Big Circular Room Rug in Center */}
          <ellipse cx="500" cy="530" rx="190" ry="60" fill="var(--accent-soft, #FCE8E0)" stroke="var(--border-color)" strokeWidth="3" />
        </svg>
      )}

      {/* Ambient Lighting Gradient based on Vibe */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 transition-colors duration-500"
        style={{
          background:
            vibe === "neon-gamer"
              ? "radial-gradient(circle at 70% 30%, #00F0FF 0%, transparent 60%)"
              : vibe === "kawaii"
              ? "radial-gradient(circle at 30% 30%, #FFB7D5 0%, transparent 60%)"
              : vibe === "dark-academia"
              ? "radial-gradient(circle at 50% 50%, #C89B3C 0%, #0A0807 80%)"
              : "radial-gradient(circle at 50% 20%, #F5E3A9 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
