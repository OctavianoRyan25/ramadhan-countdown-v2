import React from "react";
import { PrayerProvider } from "@/lib/prayer-context";
import HeaderNav from "@/components/header-nav";
import CountdownDisplay from "@/components/countdown-display";
import PrayerTimesCard from "@/components/prayer-times-card";
import RamadanTracker from "@/components/ramadan-tracker";
import DailyDuas from "@/components/daily-duas";
import HadithHighlight from "@/components/hadith-highlight";
import ImsakiyahModal from "@/components/imsakiyah-modal";

export default function HomePage() {
  return (
    <PrayerProvider>
      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        {/* Top Navigation Bar */}
        <HeaderNav />

        {/* Main Content Container */}
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-6 md:space-y-10 md:px-10 md:py-10">
          {/* 1. Hero Focal Point: Hitung Mundur Ramadhan & Mode Imsakiyah */}
          <CountdownDisplay />

          {/* 2. Jadwal Sholat & Imsakiyah Terintegrasi */}
          <PrayerTimesCard />

          {/* 3. High-Retention Companion Features: Target Amalan & Doa/Murottal Harian */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RamadanTracker />
            <DailyDuas />
          </div>

          {/* 4. Mutiara Hadits Hari Ini */}
          <HadithHighlight />
        </main>

        {/* Modal Tabel & Unduh Jadwal Imsakiyah 30 Hari (PNG Story & PDF) */}
        <ImsakiyahModal />

        {/* Clean Editorial Footer */}
        <footer className="mt-12 border-t border-border/80 bg-card/60 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left md:px-10">
            <div>
              <p className="font-serif text-base font-bold text-foreground">
                Muslim<span className="text-primary">IN</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Dibuat dengan niat ibadah sebagai pendamping menyambut dan
                menjalani bulan suci Ramadhan.
              </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 sm:text-right">
              <p>
                Sumber jadwal sholat: Kemenag RI / JadwalSholat.org • Kutipan
                Hadits: Kutubus Sittah
              </p>
              <p>
                &copy; {new Date().getFullYear()} MuslimIN Open Source Community
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PrayerProvider>
  );
}
