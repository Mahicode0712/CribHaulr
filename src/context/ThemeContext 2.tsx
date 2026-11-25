"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { VibeId, VIBES } from "@/data/vibes";

interface ThemeContextType {
  currentVibe: VibeId;
  setVibe: (vibe: VibeId) => void;
  vibeInfo: typeof VIBES[VibeId];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultVibe = "cozy",
}: {
  children: React.ReactNode;
  defaultVibe?: VibeId;
}) {
  const [currentVibe, setCurrentVibeState] = useState<VibeId>(defaultVibe);

  useEffect(() => {
    // Read persisted vibe from localStorage on mount
    try {
      const saved = localStorage.getItem("cribhaulr-vibe") as VibeId;
      if (saved && VIBES[saved]) {
        setCurrentVibeState(saved);
        document.documentElement.setAttribute("data-vibe", saved);
      } else {
        document.documentElement.setAttribute("data-vibe", defaultVibe);
      }
    } catch {
      document.documentElement.setAttribute("data-vibe", defaultVibe);
    }
  }, [defaultVibe]);

  const setVibe = (newVibe: VibeId) => {
    setCurrentVibeState(newVibe);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-vibe", newVibe);
    }
    try {
      localStorage.setItem("cribhaulr-vibe", newVibe);
    } catch {
      // localStorage may fail in private mode
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentVibe,
        setVibe,
        vibeInfo: VIBES[currentVibe] || VIBES.cozy,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
export function useVision () { 
  const context = useContext(ThemeContext);
  if (!context){
    throw new Error("useVision must be used within a themeProvider");

  }
}

