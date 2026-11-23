import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "CribHaulr | Build-Your-Own Dorm & Hostel Box",
  description:
    "Indian college dorm room aesthetic haul boxes. Pick your vibe (Cozy, Dark Academia, Minimalist, Kawaii, Neon Gamer), customize your haul for ₹499/₹999/₹1999, preview your room scene, and checkout with UPI.",
  keywords: [
    "dorm room haul",
    "hostel decor India",
    "college room aesthetic",
    "dark academia dorm",
    "kawaii desk setup",
    "UPI dorm box",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-vibe="cozy">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[var(--accent)] selection:text-[var(--accent-text)]">
        <ThemeProvider defaultVibe="cozy">
          <GrainOverlay />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
