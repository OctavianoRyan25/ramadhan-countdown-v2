"use client";

import useSWR from "swr";
import { useEffect, useState, useMemo } from "react";
// Mengimport ikon dari lucide-react untuk UI/UX yang lebih baik
import { Clock, RefreshCw, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Menggunakan komponen Select dari shadcn/ui

import { cn } from "@/lib/utils"; // Asumsi Anda memiliki utilitas untuk menggabungkan class Tailwind

// --- KONSTANTA API BARU (Menggunakan CDN Statically untuk performa) ---
const CITIES_API_URL =
  "https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json";
const PRAYER_SCHEDULE_BASE_URL =
  "https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan";

// --- Tipe Data Disesuaikan dengan API Baru ---
type PrayerTime = {
  imsyak?: string;
  shubuh?: string; // Fajr
  terbit?: string; // Sunrise
  dhuha?: string; // Duha
  dzuhur?: string; // Dhuhr
  ashr?: string; // Asr
  magrib?: string; // Maghrib
  isya?: string;
  tanggal: string; // e.g., "2019-12-01"
  [key: string]: string | undefined;
};

// Location data is now just an array of city slugs
type CityList = string[];

// Prayer response is an array of daily times
type PrayerResponse = PrayerTime[] | null;

// --- Helper Functions ---

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Request failed: ${r.status}`);
    return r.json();
  });

/** Mendapatkan tanggal hari ini dalam format YYYY-MM-DD */
const getTodayDate = () => new Date().toISOString().split("T")[0];

/**
 * Menghitung waktu sholat berikutnya yang akan datang berdasarkan kunci API.
 * Menggunakan kunci API baru: shubuh, dzuhur, ashr, magrib, isya.
 */
const getNextPrayer = (times: Record<string, string>): string | null => {
  const now = new Date();
  const nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerKeys = ["imsyak", "shubuh", "dzuhur", "ashr", "magrib", "isya"];

  for (const key of prayerKeys) {
    const timeStr = times[key];
    if (timeStr) {
      const [hour, minute] = timeStr.split(":").map(Number);
      const prayerTimeInMinutes = hour * 60 + minute;
      if (prayerTimeInMinutes > nowTimeInMinutes) {
        return key;
      }
    }
  }
  // Jika semua terlewat, waktu sholat berikutnya adalah shubuh keesokan harinya
  return prayerKeys.find((key) => key in times) || null;
};

// --- Komponen Utama ---

export default function PrayerTimesCard() {
  // State tunggal untuk lokasi: menggunakan city slug
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>("semarang");

  const today = getTodayDate();
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  // 1. Fetch Daftar Kota (City Slugs)
  const {
    data: citySlugs,
    isLoading: isLocationLoading,
    error: locationError,
  } = useSWR<CityList>(CITIES_API_URL, fetcher);

  // LOGIKA BARU: Filter duplikat kota menggunakan Set
  const uniqueCitySlugs = useMemo(() => {
    if (!citySlugs) return [];
    // Mengubah array menjadi Set (menghilangkan duplikat) lalu kembali ke array
    return Array.from(new Set(citySlugs));
  }, [citySlugs]);

  // 2. URL API untuk Jadwal Sholat Bulanan
  const apiUrl = selectedCitySlug
    ? `${PRAYER_SCHEDULE_BASE_URL}/${selectedCitySlug}/${currentYear}/${currentMonth}.json`
    : null;

  // 3. Fetch Waktu Sholat Utama
  const {
    data: monthlyPrayerData,
    error: prayerError,
    isLoading: isPrayerLoading,
    mutate,
  } = useSWR<PrayerResponse>(apiUrl, fetcher, { refreshInterval: 60_000 });

  // --- LOGIKA EKSTRAKSI DAN PENAMPILAN ---

  // Ambil data hari ini dari array bulanan
  const times: PrayerTime | null = useMemo(() => {
    if (monthlyPrayerData && Array.isArray(monthlyPrayerData)) {
      return monthlyPrayerData.find((p) => p.tanggal === today) || null;
    }
    return null;
  }, [monthlyPrayerData, today]);

  const nextPrayer = useMemo(() => {
    if (times && typeof times === "object") {
      return getNextPrayer(times as Record<string, string>);
    }
    return null;
  }, [times]);

  // Format slug menjadi nama kota yang rapi untuk ditampilkan
  const formatCityName = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const currentCityDisplay = formatCityName(selectedCitySlug);

  // --- HANDLERS ---

  const onCityChange = (value: string) => {
    setSelectedCitySlug(value);
    // SWR akan otomatis me-revalidate karena apiUrl berubah
  };

  const prayerOrder: { key: keyof PrayerTime; label: string }[] = [
    { key: "imsyak", label: "Imsak" },
    { key: "shubuh", label: "Subuh (Fajr)" },
    { key: "terbit", label: "Terbit" },
    { key: "dhuha", label: "Dhuha" },
    { key: "dzuhur", label: "Dzuhur" },
    { key: "ashr", label: "Ashar" },
    { key: "magrib", label: "Maghrib" },
    { key: "isya", label: "Isya" },
  ];

  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden border rounded-lg",
        isPrayerLoading && "ring-2 ring-green-500/50"
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-0 h-12 w-12 opacity-70 animate-twinkle"
      >
        <img
          src="/images/lantern.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-16 h-10 w-10 opacity-80 animate-sway"
      >
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <g className="fill-accent">
            <rect
              x="14"
              y="8"
              width="12"
              height="12"
              transform="rotate(45 20 14)"
              rx="1"
            />
            <rect
              x="22"
              y="16"
              width="12"
              height="12"
              transform="rotate(45 28 22)"
              rx="1"
            />
          </g>
          <path
            d="M28 33v8m-4-4h8"
            className="stroke-primary"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-24 opacity-15"
      >
        <svg
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,170 L60,170 C90,140 120,130 160,140 C200,150 230,150 260,130 C290,110 310,100 350,110 C390,120 420,120 450,110 C480,100 510,90 540,110 C570,130 600,140 640,130 C680,120 710,130 740,160 L800,160 L800,200 L0,200 Z"
            className="fill-primary"
          />
          {/* domes/minarets */}
          <g className="fill-primary">
            <rect x="110" y="110" width="12" height="40" />
            <rect x="500" y="100" width="12" height="50" />
            <circle cx="116" cy="108" r="8" />
            <circle cx="506" cy="98" r="10" />
          </g>
        </svg>
      </div>
      <CardHeader className="relative flex flex-col space-y-3 z-10">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-xl font-bold text-green-700">
              Waktu Sholat Hari Ini
            </CardTitle>
            <p className="text-sm text-primary font-medium">
              <MapPin className="h-3 w-3 inline mr-1" /> {currentCityDisplay}
            </p>
          </div>
        </div>

        {/* Pilihan kota */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pilih Kota/Kabupaten untuk menampilkan jadwal sholat.
          </p>
          {isLocationLoading ? (
            <div className="flex items-center text-sm text-green-500 justify-center h-10">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Memuat daftar
              kota...
            </div>
          ) : locationError ? (
            <div className="text-sm text-red-500 border border-red-300 bg-red-50 p-3 rounded-lg">
              Gagal memuat daftar kota. Harap muat ulang.
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="city-select" className="text-xs">
                Kota / Kabupaten (Total {uniqueCitySlugs?.length || 0} Kota)
              </Label>
              <Select value={selectedCitySlug} onValueChange={onCityChange}>
                <SelectTrigger className="w-full h-10 pl-10 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400 pointer-events-none" />
                  <SelectValue placeholder="Pilih kota..." className="pl-2" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {uniqueCitySlugs.map((slug) => (
                    <SelectItem key={slug} value={slug}>
                      {formatCityName(slug)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className="rounded-xl border border-green-300 p-4 bg-green-50/80 shadow-inner backdrop-blur-sm">
          {isPrayerLoading && (
            <div className="flex items-center justify-center py-4 text-sm text-green-600">
              <Clock className="h-4 w-4 mr-2 animate-spin" /> Memuat jadwal
              sholat ({currentCityDisplay}, {currentMonth}/{currentYear})…
            </div>
          )}

          {prayerError && (
            <div className="text-center space-y-3 py-4">
              <div className="text-sm text-red-500 font-medium">
                <RefreshCw className="h-4 w-4 inline mr-2" /> Gagal memuat
                jadwal sholat bulanan.
              </div>
              <Button onClick={() => mutate()} variant="destructive" size="sm">
                Coba Lagi
              </Button>
            </div>
          )}

          {!times && !isPrayerLoading && !prayerError && (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Tidak ada data sholat yang ditemukan untuk tanggal {today}.
            </div>
          )}

          {times && !prayerError && (
            <div className="grid grid-cols-3 gap-y-4 gap-x-2">
              {prayerOrder.map(({ key, label }) => {
                const timeValue = times[key];
                const isNext = key === nextPrayer;
                if (!timeValue) return null;
                return (
                  <div
                    key={key}
                    className={cn(
                      "text-center p-3 rounded-xl transition-all duration-300 border border-transparent",
                      isNext
                        ? "bg-gradient-to-br from-green-300 to-lime-300 shadow-xl shadow-green-500/30 transform scale-105 border-green-500"
                        : "hover:bg-green-100 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "text-[10px]",
                        isNext ? "text-green-900" : "text-green-500"
                      )}
                    >
                      {isNext ? "Waktu Selanjutnya" : null}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] sm:text-xs font-semibold uppercase",
                        isNext ? "text-green-900" : "text-green-500"
                      )}
                    >
                      {label}
                    </div>
                    <div
                      className={cn(
                        "text-base sm:text-lg font-extrabold",
                        isNext ? "text-green-950" : "text-gray-700"
                      )}
                    >
                      {timeValue}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground pt-2 text-center">
          Data Sholat untuk tanggal {today} | Sumber API Kota: {CITIES_API_URL}
        </p>
      </CardContent>
    </Card>
  );
}
