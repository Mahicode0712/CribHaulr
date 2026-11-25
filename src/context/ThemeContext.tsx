"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { VibeId, VIBES } from "@/data/vibes";
import { useHaulStore } from "@/lib/store";

const STORAGE_KEY = "cribhaulr-vibe";
const VIBE_CHANGE_EVENT = "cribhaulr-vibe-change";
let inMemoryVibe: VibeId | null = null;

interface ThemeContextType {
  currentVibe: VibeId;
  setVibe: (vibe: VibeId) => void;
  vibeInfo: (typeof VIBES)[VibeId];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isVibeId(value: string | null): value is VibeId {
  return value !== null && Object.prototype.hasOwnProperty.call(VIBES, value);
}

function getVibeSnapshot(defaultVibe: VibeId): VibeId {
  try {
    const savedVibe = window.localStorage.getItem(STORAGE_KEY);
    return isVibeId(savedVibe) ? savedVibe : inMemoryVibe ?? defaultVibe;
  } catch (cause) {
    console.warn("Could not read the saved room vibe:", cause);
    return inMemoryVibe ?? defaultVibe;
  }
}

function subscribeToVibe(onChange: () => void, defaultVibe: VibeId) {
  const syncTheme = () => {
    const vibe = getVibeSnapshot(defaultVibe);
    document.documentElement.setAttribute("data-vibe", vibe);
    onChange();
  };

  window.addEventListener("storage", syncTheme);
  window.addEventListener(VIBE_CHANGE_EVENT, syncTheme);
  return () => {
    window.removeEventListener("storage", syncTheme);
    window.removeEventListener(VIBE_CHANGE_EVENT, syncTheme);
  };
}

export function ThemeProvider({
  children,
  defaultVibe = "cozy",
}: {
  children: React.ReactNode;
  defaultVibe?: VibeId;
}) {
  const getSnapshot = useCallback(
    () => getVibeSnapshot(defaultVibe),
    [defaultVibe]
  );
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToVibe(onChange, defaultVibe),
    [defaultVibe]
  );
  const getServerSnapshot = useCallback(() => defaultVibe, [defaultVibe]);
  const currentVibe = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-vibe", currentVibe);
  }, [currentVibe]);

  const setVibe = useCallback((newVibe: VibeId) => {
    inMemoryVibe = newVibe;
    useHaulStore.getState().setVibe(newVibe);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentVibe,
        setVibe,
        vibeInfo: VIBES[currentVibe],
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
