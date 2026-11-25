import type { Metadata } from "next";
import {
  Bodoni_Moda,
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Fredoka,
  Inter,
  Nunito,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { HaulStoreHydration } from "@/components/HaulStoreHydration";
import { MotionPreferences } from "@/components/MotionPreferences";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Navbar } from "@/components/layout/Navbar";
import { VIBE_LIST } from "@/data/vibes";

const vibeIds = JSON.stringify(VIBE_LIST.map(({ id }) => id));
const themeInitScript = `(function(){try{var vibe=localStorage.getItem("cribhaulr-vibe");if(${vibeIds}.includes(vibe||""))document.documentElement.setAttribute("data-vibe",vibe)}catch(cause){console.warn("Could not restore the saved room vibe before paint:",cause)}})()`;

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});
const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  display: "swap",
});
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="en"
      data-vibe="cozy"
      suppressHydrationWarning
      className={`${fraunces.variable} ${bodoniModa.variable} ${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${fredoka.variable} ${dmSans.variable} ${inter.variable} ${nunito.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-primary selection:text-on-primary">
        <ThemeProvider defaultVibe="cozy">
          <MotionPreferences>
            <HaulStoreHydration />
            <GrainOverlay />
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </MotionPreferences>
        </ThemeProvider>
      </body>
    </html>
  );
}
