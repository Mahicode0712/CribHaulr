"use client";

import { useEffect } from "react";
import { hydrateHaulStore } from "@/lib/store";
import { useTheme } from "@/context/ThemeContext";

export function HaulStoreHydration() {
  const { currentVibe, setVibe } = useTheme();

  useEffect(() => {
    let active = true;
    void hydrateHaulStore().then(() => {
      if (active) setVibe(currentVibe);
    });

    return () => {
      active = false;
    };
  }, [currentVibe, setVibe]);

  return null;
}
