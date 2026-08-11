import type { Metadata } from "next";
import { Libre_Caslon_Text, Hanken_Grotesk, JetBrains_Mono, Bodoni_Moda, Kalam, Space_Mono, Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  variable: "--font-caslon",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
});

const kalam = Kalam({
  weight: ["700"],
  subsets: ["devanagari"],
  variable: "--font-kalam",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "HH GOA 2026 - Identity Generator",
  description: "Create your Coastal Cyber-Brutalism identity card for Hacker House Goa 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${libreCaslon.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${bodoni.variable} ${kalam.variable} ${spaceMono.variable} ${bebasNeue.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-on-surface">{children}</body>
    </html>
  );
}
