import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
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
