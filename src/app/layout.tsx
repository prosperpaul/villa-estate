import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";

// Body + UI text: DM Sans (design system "body" and "label" tokens)
const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Headings + prices: Newsreader, the editorial serif
const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Haven Properties, verified homes and land across Nigeria",
  description:
    "Find a home you can trust, anywhere in Nigeria. Physically inspected listings, verified titles and escrow-protected transactions in Lagos, Abuja, Port Harcourt and beyond.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
