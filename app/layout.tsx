import type { Metadata } from "next";
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Amiri,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "600", "700"],
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MuslimIN — Pendamping Ibadah & Hitung Mundur Ramadhan",
  description:
    "Pendamping ibadah Ramadhan modern: hitung mundur Ramadhan & Imsakiyah, jadwal sholat seluruh kota di Indonesia, jurnal amalan harian, doa pilihan, dan mutiara hadits.",
  generator: "Next.js",
  applicationName: "MuslimIN",
  keywords: [
    "MuslimIN",
    "Jadwal Imsakiyah",
    "Countdown Ramadhan",
    "Jadwal Sholat Indonesia",
    "Tracker Ibadah Ramadhan",
    "Hadits Harian",
    "Doa Puasa",
  ],
  authors: [{ name: "TasteDespair", url: "https://tastedespair.site" }],
  icons: {
    icon: "/images/moon-star.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable} ${amiri.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
