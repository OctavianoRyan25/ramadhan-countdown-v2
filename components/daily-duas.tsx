"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Square,
  Copy,
  Check,
  BookHeart,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IslamicGeometricPattern } from "@/components/islamic-patterns";

interface DuaItem {
  id: string;
  title: string;
  tag: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  audioUrl?: string;
}

const RAMADHAN_DUAS: DuaItem[] = [
  {
    id: "buka-puasa",
    title: "Doa Buka Puasa",
    tag: "Saat Maghrib",
    arabic:
      "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    latin:
      "Dzahabazh zhama'u wabtallatil 'uruuqu, wa tsabatal ajru in syaa Allah.",
    translation:
      "Telah hilang rasa haus, dan urat-urat telah basah, serta pahala telah tetap, insya Allah.",
    source: "HR. Abu Daud No. 2357 (Derajat Hasan Shahih)",
  },
  {
    id: "niat-puasa",
    title: "Niat Puasa Ramadhan",
    tag: "Malam / Sahur",
    arabic:
      "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى",
    latin:
      "Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi Ta'aalaa.",
    translation:
      "Aku berniat puasa esok hari untuk menunaikan kewajiban di bulan Ramadhan tahun ini karena Allah Ta'ala.",
    source: "Kitab Minhajul Thalibin & Fiqih Syafi'iyah",
  },
  {
    id: "lailatul-qadar",
    title: "Doa Malam Lailatul Qadar",
    tag: "10 Malam Terakhir",
    arabic:
      "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    latin: "Allaahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annii.",
    translation:
      "Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai pemaafan, maka maafkanlah aku.",
    source: "HR. Tirmidzi No. 3513 & Ibnu Majah No. 3850",
  },
  {
    id: "ayat-puasa",
    title: "QS. Al-Baqarah Ayat 183 (Murottal)",
    tag: "Ayat Ramadhan",
    arabic:
      "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    latin:
      "Yaa ayyuhalladziina aamanuu kutiba 'alaikumush shiyaamu kamaa kutiba 'alalladziina min qablikum la'allakum tattaquun.",
    translation:
      "Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.",
    source: "Al-Qur'an Surah Al-Baqarah [2]: 183 • Syaikh Mishary Rashid Alafasy",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002183.mp3",
  },
  {
    id: "ampunan-ramadhan",
    title: "Doa Memohon Keberkahan & Rahmat",
    tag: "Harian Ramadhan",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin:
      "Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'adzaaban-naar.",
    translation:
      "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
    source: "QS. Al-Baqarah [2]: 201 & HR. Bukhari No. 4522",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002201.mp3",
  },
];

export default function DailyDuas() {
  const [selectedId, setSelectedId] = useState<string>(RAMADHAN_DUAS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeDua =
    RAMADHAN_DUAS.find((d) => d.id === selectedId) || RAMADHAN_DUAS[0];

  // Stop audio when switching dua
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [selectedId]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // 1. If the item has a direct MP3 Murottal stream, play it
    if (activeDua.audioUrl) {
      const audio = new Audio(activeDua.audioUrl);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        speakArabicFallback(activeDua.arabic);
      };
      audio.play().catch(() => {
        setIsPlaying(false);
        speakArabicFallback(activeDua.arabic);
      });
      return;
    }

    // 2. Otherwise use Web Speech API Arabic voice for clear pronunciation
    speakArabicFallback(activeDua.arabic);
  };

  const speakArabicFallback = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.82;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    const text = `${activeDua.title}\n\n${activeDua.arabic}\n\n"${activeDua.translation}" (${activeDua.source})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="doa-harian"
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm flex flex-col justify-between"
    >
      <IslamicGeometricPattern
        id="dua-girih"
        className="text-primary opacity-[0.03] dark:opacity-[0.04]"
      />

      <div className="relative z-10 p-5 sm:p-7 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="border-b border-border/80 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <BookHeart className="h-3.5 w-3.5" />
              <span>Audio Pelafalan & Murottal</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              Doa Harian & Ayat Ramadhan
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Kumpulan doa ma&apos;tsur beserta transliterasi dan pelafalan suara.
            </p>
          </div>

          {/* Selector Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {RAMADHAN_DUAS.map((item) => {
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "border-border bg-background/70 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span>{item.title}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-80" />}
                </button>
              );
            })}
          </div>

          {/* Active Dua Display Card */}
          <div className="mt-5 rounded-xl border border-border/90 bg-background/80 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#C5A059]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#8E6A24] dark:text-[#D4AF37]">
                {activeDua.tag}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {activeDua.source}
              </span>
            </div>

            {/* Arabic Calligraphy Text */}
            <div className="py-3 text-right" dir="rtl">
              <p className="font-arabic text-2xl sm:text-3xl leading-[2.1] text-foreground">
                {activeDua.arabic}
              </p>
            </div>

            {/* Latin & Indonesian Translation */}
            <div className="space-y-2 border-t border-border/70 pt-3">
              <p className="text-xs sm:text-sm font-medium italic text-primary">
                {activeDua.latin}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                &ldquo;{activeDua.translation}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Audio & Copy Micro-Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            onClick={handleTogglePlay}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? (
              <>
                <Square className="mr-2 h-4 w-4 fill-current" />
                Hentikan Audio
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                {activeDua.audioUrl
                  ? "Putar Murottal Ayat"
                  : "Dengarkan Pelafalan Doa"}
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="rounded-xl"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4 text-primary" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4 text-primary" />
                Salin Doa
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}

