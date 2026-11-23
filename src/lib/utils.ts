import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Indian Rupee currency format (₹499, ₹1,999, etc.)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Random rotation generator for zine/sticker styling
 */
export function getStickerRotation(index: number = 0): string {
  const angles = ["-3deg", "2.5deg", "-1.5deg", "3.5deg", "-2deg", "1.8deg"];
  return angles[index % angles.length];
}
