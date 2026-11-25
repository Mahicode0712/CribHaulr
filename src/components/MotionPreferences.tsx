"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMotionPreferenceSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerMotionPreferenceSnapshot() {
  return false;
}

export function MotionPreferences({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreferenceSnapshot,
    getServerMotionPreferenceSnapshot
  );

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
