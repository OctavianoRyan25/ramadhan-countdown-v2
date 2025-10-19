import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MuslimIN",
  description:
    "Sebuah aplikasi web sumber terbuka untuk komunitas Muslim di Indonesia.",
  generator: "Next.js",
  applicationName: "MuslimIN",
  keywords: [
    "MuslimIN",
    "Muslim Indonesia",
    "Aplikasi Muslim",
    "Komunitas Muslim",
    "Sumber Terbuka",
    "Open Source",
    "Islam",
    "Indonesia",
    "Religi",
    "Faith",
  ],
  authors: [{ name: "TasteDespair", url: "https://tastedespair.site" }],
  icons: {
    icon: "/public/images/moon-star.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
