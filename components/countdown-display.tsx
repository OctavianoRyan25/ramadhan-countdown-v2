"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  Download,
  Sparkles,
  Info,
  Clock,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  IslamicGeometricPattern,
  CornerOrnament,
  LiveMoonPhaseBadge,
} from "@/components/islamic-patterns";
import { usePrayer } from "@/lib/prayer-context";

type CalculationMethod = "kemenag" | "muhammadiyah";
type CountdownMode = "ramadhan" | "imsakiyah";

interface RamadhanScheduleItem {
  hijriYear: number;
  gregorianYear: number;
  kemenagDate: Date; // MABIMS criteria (height >= 3 deg, elongation >= 6.4 deg)
  kemenagLabel: string;
  kemenagNote: string;
  muhammadiyahDate: Date; // Hisab Hakiki / KHGT criteria
  muhammadiyahLabel: string;
  muhammadiyahNote: string;
}

const RAMADHAN_TARGETS: RamadhanScheduleItem[] = [
  {
    hijriYear: 1447,
    gregorianYear: 2026,
    kemenagDate: new Date(2026, 1, 18, 0, 0, 0),
    kemenagLabel: "Rabu, 18 Februari 2026",
    kemenagNote:
      "Berdasarkan Kalender Hijriah Indonesia Kemenag RI (Kriteria Baru MABIMS: tinggi hilal ≥ 3° & elongasi ≥ 6,4°; menunggu Sidang Isbat 29 Sya'ban).",
    muhammadiyahDate: new Date(2026, 1, 18, 0, 0, 0),
    muhammadiyahLabel: "Rabu, 18 Februari 2026",
    muhammadiyahNote:
      "Berdasarkan Maklumat PP Muhammadiyah (Metode Hisab Hakiki / Kalender Hijriah Global Tunggal).",
  },
  {
    hijriYear: 1448,
    gregorianYear: 2027,
    kemenagDate: new Date(2027, 1, 8, 0, 0, 0),
    kemenagLabel: "Senin, 8 Februari 2027",
    kemenagNote:
      "Berdasarkan estimasi Kriteria MABIMS Kemenag RI (tinggi hilal ≥ 3° & elongasi ≥ 6,4°; menunggu penetapan Sidang Isbat).",
    muhammadiyahDate: new Date(2027, 1, 8, 0, 0, 0),
    muhammadiyahLabel: "Senin, 8 Februari 2027",
    muhammadiyahNote:
      "Berdasarkan perhitungan astronomis Hisab Hakiki Wujudul Hilal / KHGT.",
  },
  {
    hijriYear: 1449,
    gregorianYear: 2028,
    kemenagDate: new Date(2028, 0, 28, 0, 0, 0),
    kemenagLabel: "Jumat, 28 Januari 2028",
    kemenagNote:
      "Estimasi Kriteria MABIMS Kemenag RI (menunggu penetapan resmi Sidang Isbat).",
    muhammadiyahDate: new Date(2028, 0, 28, 0, 0, 0),
    muhammadiyahLabel: "Jumat, 28 Januari 2028",
    muhammadiyahNote:
      "Berdasarkan perhitungan astronomis Hisab Hakiki / KHGT.",
  },
];

function getFormattedHijriToday(date: Date): string {
  try {
    return new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "Kalender Hijriah";
  }
}

function isCurrentlyRamadhan(date: Date): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      month: "numeric",
    }).formatToParts(date);
    const m = Number(parts.find((p) => p.type === "month")?.value || "0");
    return m === 9;
  } catch {
    return false;
  }
}

export default function CountdownDisplay() {
  const {
    cityDisplay,
    todayTimes,
    imsakiyahCountdown,
    setIsImsakiyahModalOpen,
  } = usePrayer();

  const [now, setNow] = useState<Date>(() => new Date());
  const [method, setMethod] = useState<CalculationMethod>("kemenag");
  const [mode, setMode] = useState<CountdownMode>("ramadhan");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isCurrentlyRamadhan(new Date())) {
      setMode("imsakiyah");
    }
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Pick the next upcoming Ramadhan based on current time
  const activeRamadhan = useMemo(() => {
    const found = RAMADHAN_TARGETS.find((item) => {
      const target =
        method === "kemenag" ? item.kemenagDate : item.muhammadiyahDate;
      return target.getTime() > now.getTime();
    });
    return found || RAMADHAN_TARGETS[RAMADHAN_TARGETS.length - 1];
  }, [now, method]);

  const targetDate =
    method === "kemenag"
      ? activeRamadhan.kemenagDate
      : activeRamadhan.muhammadiyahDate;

  const targetDateLabel =
    method === "kemenag"
      ? activeRamadhan.kemenagLabel
      : activeRamadhan.muhammadiyahLabel;

  const methodDescription =
    method === "kemenag"
      ? activeRamadhan.kemenagNote
      : activeRamadhan.muhammadiyahNote;

  const timeLeft = useMemo(() => {
    const ms = Math.max(0, targetDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }, [now, targetDate]);

  const hijriToday = useMemo(() => getFormattedHijriToday(now), [now]);

  // Google Calendar URL generator
  const googleCalendarUrl = useMemo(() => {
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, "0");
    const d = String(targetDate.getDate()).padStart(2, "0");
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const ny = nextDay.getFullYear();
    const nm = String(nextDay.getMonth() + 1).padStart(2, "0");
    const nd = String(nextDay.getDate()).padStart(2, "0");

    const title = encodeURIComponent(
      `1 Ramadhan ${activeRamadhan.hijriYear} H — Awal Puasa Ramadhan`
    );
    const details = encodeURIComponent(
      `Pengingat 1 Ramadhan ${activeRamadhan.hijriYear} H (${
        method === "kemenag" ? "Metode Kemenag RI / MABIMS" : "Metode Hisab Muhammadiyah"
      }). Disimpan dari aplikasi MuslimIN.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${y}${m}${d}/${ny}${nm}${nd}&details=${details}`;
  }, [targetDate, activeRamadhan.hijriYear, method]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      id="countdown"
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
    >
      {/* Subtle Islamic Geometric Girih Watermark (4% opacity) */}
      <IslamicGeometricPattern
        id="hero-girih"
        className="text-primary opacity-[0.04] dark:opacity-[0.06]"
      />

      {/* Subtle Corner Architectural Ornaments */}
      <CornerOrnament className="absolute -top-10 -left-10 h-36 w-36 opacity-15" />
      <CornerOrnament className="absolute -right-10 -bottom-10 h-36 w-36 opacity-15" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-10 sm:px-8 md:py-14 text-center">
        {/* Top Meta Bar: Hijri Date, Live Moon Phase & Countdown Mode Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/70 px-3.5 py-1.5 text-xs font-medium text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059] dark:text-[#D4AF37]" />
            <span>{mounted ? hijriToday : "Kalender Hijriah"}</span>
          </div>

          <LiveMoonPhaseBadge date={now} />

          {/* Mode Toggle: Menuju Ramadhan vs Mode Imsakiyah (Sahur & Buka Puasa) */}
          <div className="inline-flex items-center rounded-full border border-border bg-muted/70 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode("ramadhan")}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                mode === "ramadhan"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Menuju Ramadhan
            </button>
            <button
              type="button"
              onClick={() => setMode("imsakiyah")}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                mode === "imsakiyah"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mode Imsakiyah
            </button>
          </div>
        </div>

        {mode === "ramadhan" ? (
          <>
            {/* Editorial Heading */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Hitung Mundur Bulan Suci
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Menuju Ramadhan {activeRamadhan.hijriYear} H
            </h1>

            {/* Focal Point Countdown Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5 max-w-2xl mx-auto">
              {[
                { value: mounted ? pad(timeLeft.days) : "--", label: "HARI" },
                { value: mounted ? pad(timeLeft.hours) : "--", label: "JAM" },
                { value: mounted ? pad(timeLeft.minutes) : "--", label: "MENIT" },
                { value: mounted ? pad(timeLeft.seconds) : "--", label: "DETIK" },
              ].map((unit, index) => (
                <div
                  key={unit.label}
                  className="relative flex flex-col items-center justify-center rounded-xl border border-border bg-background/80 px-4 py-5 shadow-2xs backdrop-blur-xs transition-colors hover:border-primary/40"
                >
                  <span className="font-mono text-4xl font-bold tracking-tight tabular-nums text-primary sm:text-5xl md:text-6xl">
                    {unit.value}
                  </span>
                  <span className="mt-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    {unit.label}
                  </span>
                  {index < 3 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 font-mono text-2xl font-bold text-muted-foreground/40"
                    >
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Target Date & Calculation Method Switcher */}
            <div className="mt-7 flex flex-col items-center justify-center space-y-3">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-lg border border-border/70 bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground">
                <span>
                  1 Ramadhan {activeRamadhan.hijriYear} H • Estimasi{" "}
                  <strong className="font-semibold text-primary">
                    {targetDateLabel}
                  </strong>
                </span>
              </div>

              {/* Educational Toggle Switch: Kemenag RI (MABIMS) vs Muhammadiyah (Hisab) */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background p-1 text-xs">
                  <span className="px-2.5 py-1 text-muted-foreground font-medium">
                    Metode:
                  </span>
                  <button
                    type="button"
                    onClick={() => setMethod("kemenag")}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${
                      method === "kemenag"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Kemenag RI (MABIMS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("muhammadiyah")}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${
                      method === "muhammadiyah"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Muhammadiyah (Hisab)
                  </button>
                </div>

                <p className="max-w-xl text-xs text-muted-foreground flex items-center justify-center gap-1.5 leading-relaxed">
                  <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{methodDescription}</span>
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Mode Imsakiyah: Hitung Mundur Imsak (Sahur) & Maghrib (Buka Puasa) */
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Mode Imsakiyah • Wilayah {cityDisplay}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {imsakiyahCountdown.targetLabel}
            </h1>

            {/* Focal Point Countdown for Imsak / Maghrib */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5 max-w-xl mx-auto">
              {[
                {
                  value: mounted ? pad(imsakiyahCountdown.hours) : "--",
                  label: "JAM",
                },
                {
                  value: mounted ? pad(imsakiyahCountdown.minutes) : "--",
                  label: "MENIT",
                },
                {
                  value: mounted ? pad(imsakiyahCountdown.seconds) : "--",
                  label: "DETIK",
                },
              ].map((unit, index) => (
                <div
                  key={unit.label}
                  className="relative flex flex-col items-center justify-center rounded-xl border border-border bg-background/80 px-4 py-5 shadow-2xs backdrop-blur-xs"
                >
                  <span className="font-mono text-4xl font-bold tracking-tight tabular-nums text-primary sm:text-5xl md:text-6xl">
                    {unit.value}
                  </span>
                  <span className="mt-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    {unit.label}
                  </span>
                  {index < 2 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 font-mono text-2xl font-bold text-muted-foreground/40"
                    >
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Dual Summary Cards: Waktu Imsak/Sahur & Waktu Buka Puasa (Maghrib) */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              <div
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${
                  imsakiyahCountdown.targetKey === "imsyak"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sunrise className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Imsak & Sahur
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      Subuh {todayTimes.shubuh}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xl font-bold tabular-nums text-primary">
                  {todayTimes.imsyak}
                </div>
              </div>

              <div
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${
                  imsakiyahCountdown.targetKey === "magrib"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sunset className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Buka Puasa (Maghrib)
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      Isya {todayTimes.isya}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xl font-bold tabular-nums text-primary">
                  {todayTimes.magrib}
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{imsakiyahCountdown.subtitle}</span>
            </p>
          </>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Simpan ke Google Calendar
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsImsakiyahModalOpen(true)}
            className="rounded-xl border-primary/30 bg-card hover:bg-secondary/80"
          >
            <Download className="mr-2 h-4 w-4 text-primary" />
            Unduh Jadwal Imsakiyah 30 Hari
          </Button>
        </div>
      </div>
    </div>
  );
}
