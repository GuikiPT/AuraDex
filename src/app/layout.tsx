import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraDex - Pokémon Database",
  description: "Discover and explore the world of Pokémon with comprehensive data, stats, evolution charts, and more. Built with Next.js and the PokéAPI.",
  keywords: "pokemon, pokedex, pokemon database, pokemon stats, pokemon evolution, pokemon types",
  authors: [{ name: "AuraDex Team" }],
  robots: "index, follow",
  openGraph: {
    title: "AuraDex - Pokémon Database",
    description: "Discover and explore the world of Pokémon with comprehensive data, stats, evolution charts, and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraDex - Pokémon Database",
    description: "Discover and explore the world of Pokémon with comprehensive data, stats, evolution charts, and more.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
