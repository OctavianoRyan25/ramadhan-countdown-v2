"use client";

import React, { useState } from "react";
import {
  Quote,
  Copy,
  Check,
  Share2,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  IslamicGeometricPattern,
  CornerOrnament,
} from "@/components/islamic-patterns";

interface HadithEntry {
  title: string;
  narrator: string;
  arab: string;
  id: string;
}

// Curated authentic Ramadhan & Ibadah hadiths with complete harakat
const CURATED_RAMADHAN_HADITHS: HadithEntry[] = [
  {
    title: "Keutamaan Puasa Ramadhan karena Iman dan Ihtisab",
    narrator: "HR. Bukhari No. 38 & Muslim No. 760",
    arab: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    id: "Barangsiapa berpuasa Ramadhan karena iman dan mengharap pahala dari Allah, maka diampuni dosa-dosanya yang telah lalu.",
  },
  {
    title: "Keutamaan Qiyamul Lail (Tarawih) di Bulan Ramadhan",
    narrator: "HR. Bukhari No. 37 & Muslim No. 759",
    arab: "مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    id: "Barangsiapa menegakkan sholat malam di bulan Ramadhan karena iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.",
  },
  {
    title: "Pintu Surga Dibuka di Bulan Ramadhan",
    narrator: "HR. Bukhari No. 1899 & Muslim No. 1079",
    arab: "إِذَا دَخَلَ شَهْرُ رَمَضَانَ فُتِّحَتْ أَبْوَابُ السَّمَاءِ، وَغُلِّقَتْ أَبْوَابُ جَهَنَّمَ، وَسُلْسِلَتِ الشَّيَاطِينُ",
    id: "Apabila bulan Ramadhan tiba, pintu-pintu langit (surga) dibuka, pintu-pintu neraka Jahannam ditutup, dan setan-setan dibelenggu.",
  },
  {
    title: "Keberkahan Makan Sahur",
    narrator: "HR. Bukhari No. 1923 & Muslim No. 1095",
    arab: "تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً",
    id: "Makan sahurlah kalian, karena sesungguhnya di dalam makan sahur itu terdapat keberkahan.",
  },
  {
    title: "Dua Kebahagiaan bagi Orang yang Berpuasa",
    narrator: "HR. Bukhari No. 1904 & Muslim No. 1151",
    arab: "لِلصَّائِمِ فَرْحَتَانِ يَفْرَحُهُمَا: إِذَا أَفْطَرَ فَرِحَ، وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ",
    id: "Bagi orang yang berpuasa ada dua kebahagiaan: kebahagiaan ketika ia berbuka puasa, dan kebahagiaan ketika ia bertemu dengan Rabb-nya karena puasanya.",
  },
  {
    title: "Anjuran Menyegerakan Berbuka Puasa",
    narrator: "HR. Bukhari No. 1957 & Muslim No. 1098",
    arab: "لَا يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الْفِطْرَ",
    id: "Manusia senantiasa berada dalam kebaikan selama mereka menyegerakan berbuka puasa.",
  },
  {
    title: "Pintu Ar-Rayyan Khusus bagi Ahli Puasa",
    narrator: "HR. Bukhari No. 1896 & Muslim No. 1152",
    arab: "إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ، يَدْخُلُ مِنْهُ الصَّائِمُونَ يَوْمَ الْقِيَامَةِ، لَا يَدْخُلُ مِنْهُ أَحَدٌ غَيْرُهُمْ",
    id: "Sesungguhnya di surga terdapat sebuah pintu yang disebut Ar-Rayyan. Orang-orang yang berpuasa akan masuk melaluinya pada hari Kiamat, dan tidak ada seorang pun selain mereka yang masuk darinya.",
  },
];

const HADITH_API_BASE_URL = "https://hadith-api-go.vercel.app/api/v1/hadis";
const TOTAL_HADITH_PAGES = 442;

export default function HadithHighlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customHadith, setCustomHadith] = useState<HadithEntry | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeHadith = customHadith || CURATED_RAMADHAN_HADITHS[currentIndex];

  const handleNextCurated = () => {
    setCustomHadith(null);
    setCurrentIndex((prev) => (prev + 1) % CURATED_RAMADHAN_HADITHS.length);
  };

  const handleFetchFromApi = async () => {
    setIsLoadingApi(true);
    try {
      const randomPage = Math.floor(Math.random() * TOTAL_HADITH_PAGES) + 1;
      const res = await fetch(`${HADITH_API_BASE_URL}?page=${randomPage}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        const picked =
          json.data[Math.floor(Math.random() * json.data.length)];
        setCustomHadith({
          title: "Khazanah Hadits Pilihan",
          narrator: `Kitab Hadits • No. ${picked.number}`,
          arab: picked.arab,
          id: picked.id,
        });
      } else {
        handleNextCurated();
      }
    } catch {
      handleNextCurated();
    } finally {
      setIsLoadingApi(false);
    }
  };

  const formatShareText = () =>
    `*Mutiara Hadits Hari Ini — MuslimIN*\n\n${activeHadith.arab}\n\n"${activeHadith.id}"\n— ${activeHadith.narrator}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(formatShareText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="hadits"
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
    >
      <IslamicGeometricPattern
        id="hadith-girih"
        className="text-primary opacity-[0.035] dark:opacity-[0.05]"
      />
      <CornerOrnament className="absolute -top-10 -right-10 h-32 w-32 opacity-15" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-8 sm:px-10 sm:py-11">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <Quote className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Tadabbur & Hikmah
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Mutiara Hadits Hari Ini
          </h2>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {activeHadith.title}
          </p>
        </div>

        {/* Quotation Content */}
        <div className="mt-7 rounded-2xl border border-border/80 bg-background/75 p-6 sm:p-8 text-center backdrop-blur-xs">
          {/* Arabic Text */}
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.1] text-foreground"
          >
            {activeHadith.arab}
          </p>

          {/* Subtle Gold Divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-border" />
            <span className="h-2 w-2 rotate-45 bg-[#C5A059] dark:bg-[#D4AF37]" />
            <span className="h-px w-16 bg-border" />
          </div>

          {/* Indonesian Translation */}
          <blockquote className="mx-auto max-w-2xl font-serif text-base sm:text-lg italic leading-relaxed text-foreground/90">
            &ldquo;{activeHadith.id}&rdquo;
          </blockquote>

          {/* Takhrij / Perawi */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3.5 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{activeHadith.narrator}</span>
          </div>
        </div>

        {/* Micro-Actions: Salin Kutipan, Bagikan ke WhatsApp, Kutipan Berikutnya */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="rounded-xl"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-primary" />
                Kutipan Tersalin
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4 text-primary" />
                Salin Kutipan
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleShareWhatsApp}
            className="rounded-xl"
          >
            <Share2 className="mr-2 h-4 w-4 text-primary" />
            Bagikan ke WhatsApp
          </Button>

          <Button
            type="button"
            onClick={handleNextCurated}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Hadits Ramadhan Berikutnya
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFetchFromApi}
            disabled={isLoadingApi}
            className="rounded-xl text-xs text-muted-foreground hover:text-foreground"
          >
            {isLoadingApi ? "Memuat..." : "Eksplorasi Kitab Hadits"}
          </Button>
        </div>
      </div>
    </section>
  );
}
