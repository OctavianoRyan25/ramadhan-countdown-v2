"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import useSWR from "swr";

export type PrayerTime = {
  imsyak: string;
  shubuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashr: string;
  magrib: string;
  isya: string;
  tanggal: string;
  [key: string]: string | undefined;
};

export type PrayerKey =
  | "imsyak"
  | "shubuh"
  | "terbit"
  | "dhuha"
  | "dzuhur"
  | "ashr"
  | "magrib"
  | "isya";

export const PRAYER_LABELS: {
  key: PrayerKey;
  label: string;
  shortDesc: string;
  isFardhu: boolean;
}[] = [
  { key: "imsyak", label: "Imsak", shortDesc: "Batas Akhir Sahur", isFardhu: false },
  { key: "shubuh", label: "Subuh", shortDesc: "2 Rakaat", isFardhu: true },
  { key: "terbit", label: "Terbit", shortDesc: "Syuruq", isFardhu: false },
  { key: "dhuha", label: "Dhuha", shortDesc: "Sunnah", isFardhu: false },
  { key: "dzuhur", label: "Dzuhur", shortDesc: "4 Rakaat", isFardhu: true },
  { key: "ashr", label: "Ashar", shortDesc: "4 Rakaat", isFardhu: true },
  { key: "magrib", label: "Maghrib", shortDesc: "Buka Puasa • 3 Rakaat", isFardhu: true },
  { key: "isya", label: "Isya", shortDesc: "4 Rakaat & Tarawih", isFardhu: true },
];

const CITIES_API_URL =
  "https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json";
const PRAYER_SCHEDULE_BASE_URL =
  "https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan";

// Reference coordinates for major Indonesian cities for fast, privacy-friendly GPS matching without external geocoding API keys
const INDONESIAN_CITY_COORDS: {
  slug: string;
  province: string;
  lat: number;
  lng: number;
}[] = [
  { slug: "banda-aceh", province: "Aceh", lat: 5.5483, lng: 95.3238 },
  { slug: "medan", province: "Sumatera Utara", lat: 3.5952, lng: 98.6722 },
  { slug: "padang", province: "Sumatera Barat", lat: -0.9471, lng: 100.4172 },
  { slug: "pekanbaru", province: "Riau", lat: 0.5071, lng: 101.4478 },
  { slug: "batam", province: "Kepulauan Riau", lat: 1.0456, lng: 104.0305 },
  { slug: "jambi", province: "Jambi", lat: -1.6101, lng: 103.6131 },
  { slug: "palembang", province: "Sumatera Selatan", lat: -2.9761, lng: 104.7754 },
  { slug: "bengkulu", province: "Bengkulu", lat: -3.7928, lng: 102.2608 },
  { slug: "bandar-lampung", province: "Lampung", lat: -5.3971, lng: 105.2668 },
  { slug: "serang", province: "Banten", lat: -6.1104, lng: 106.164 },
  { slug: "tangerang", province: "Banten", lat: -6.1783, lng: 106.6319 },
  { slug: "jakarta-pusat", province: "DKI Jakarta", lat: -6.1865, lng: 106.8341 },
  { slug: "jakarta-selatan", province: "DKI Jakarta", lat: -6.2615, lng: 106.8106 },
  { slug: "depok", province: "Jawa Barat", lat: -6.4025, lng: 106.7942 },
  { slug: "bogor", province: "Jawa Barat", lat: -6.5971, lng: 106.806 },
  { slug: "bekasi", province: "Jawa Barat", lat: -6.2383, lng: 106.9756 },
  { slug: "bandung", province: "Jawa Barat", lat: -6.9175, lng: 107.6191 },
  { slug: "cirebon", province: "Jawa Barat", lat: -6.732, lng: 108.5523 },
  { slug: "tegal", province: "Jawa Tengah", lat: -6.8694, lng: 109.1402 },
  { slug: "pekalongan", province: "Jawa Tengah", lat: -6.8886, lng: 109.6753 },
  { slug: "purwokerto", province: "Jawa Tengah", lat: -7.4244, lng: 109.2302 },
  { slug: "magelang", province: "Jawa Tengah", lat: -7.4797, lng: 110.2177 },
  { slug: "semarang", province: "Jawa Tengah", lat: -6.9667, lng: 110.4167 },
  { slug: "surakarta", province: "Jawa Tengah", lat: -7.5755, lng: 110.8243 },
  { slug: "yogyakarta", province: "DI Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { slug: "madiun", province: "Jawa Timur", lat: -7.6298, lng: 111.5239 },
  { slug: "kediri", province: "Jawa Timur", lat: -7.848, lng: 112.0178 },
  { slug: "malang", province: "Jawa Timur", lat: -7.9666, lng: 112.6326 },
  { slug: "surabaya", province: "Jawa Timur", lat: -7.2575, lng: 112.7521 },
  { slug: "banyuwangi", province: "Jawa Timur", lat: -8.2192, lng: 114.3691 },
  { slug: "denpasar", province: "Bali", lat: -8.6705, lng: 115.2126 },
  { slug: "mataram", province: "Nusa Tenggara Barat", lat: -8.5833, lng: 116.1167 },
  { slug: "kupang", province: "Nusa Tenggara Timur", lat: -10.1772, lng: 123.607 },
  { slug: "pontianak", province: "Kalimantan Barat", lat: -0.0263, lng: 109.3425 },
  { slug: "palangkaraya", province: "Kalimantan Tengah", lat: -2.2136, lng: 113.9108 },
  { slug: "banjarmasin", province: "Kalimantan Selatan", lat: -3.3194, lng: 114.5908 },
  { slug: "balikpapan", province: "Kalimantan Timur", lat: -1.2379, lng: 116.8529 },
  { slug: "samarinda", province: "Kalimantan Timur", lat: -0.5022, lng: 117.1536 },
  { slug: "makassar", province: "Sulawesi Selatan", lat: -5.1477, lng: 119.4327 },
  { slug: "palu", province: "Sulawesi Tengah", lat: -0.901, lng: 119.8707 },
  { slug: "kendari", province: "Sulawesi Tenggara", lat: -3.9985, lng: 122.513 },
  { slug: "gorontalo", province: "Gorontalo", lat: 0.5435, lng: 123.0568 },
  { slug: "manado", province: "Sulawesi Utara", lat: 1.4748, lng: 124.8421 },
  { slug: "ambon", province: "Maluku", lat: -3.6954, lng: 128.1814 },
  { slug: "ternate", province: "Maluku Utara", lat: 0.7893, lng: 127.3771 },
  { slug: "jayapura", province: "Papua", lat: -2.5337, lng: 140.7181 },
];

export function formatCityName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCityProvinceLabel(slug: string): string {
  const found = INDONESIAN_CITY_COORDS.find((c) => c.slug === slug);
  const name = formatCityName(slug);
  return found ? `${name}, ${found.province}` : name;
}

// Generate 30-day fallback schedule if user is offline or API fails
function generateFallbackSchedule(year: number, month: number): PrayerTime[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: PrayerTime[] = [];
  const mm = String(month).padStart(2, "0");
  for (let d = 1; d <= daysInMonth; d++) {
    const dd = String(d).padStart(2, "0");
    list.push({
      tanggal: `${year}-${mm}-${dd}`,
      imsyak: "04:12",
      shubuh: "04:22",
      terbit: "05:38",
      dhuha: "06:05",
      dzuhur: "11:52",
      ashr: "15:14",
      magrib: "17:58",
      isya: "19:09",
    });
  }
  return list;
}

const fetcherWithFallback = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    // If year > 2026 returns 404 on static GitHub repo, fallback to 2026 same month
    if (url.includes("/adzan/")) {
      const fallback2026Url = url.replace(/\/(\d{4})\/(\d{2})\.json$/, "/2026/$2.json");
      if (fallback2026Url !== url) {
        const res2 = await fetch(fallback2026Url);
        if (res2.ok) {
          const data = await res2.json();
          const targetYearMatch = url.match(/\/(\d{4})\/(\d{2})\.json$/);
          const targetYear = targetYearMatch ? targetYearMatch[1] : "2026";
          return data.map((item: PrayerTime) => ({
            ...item,
            tanggal: item.tanggal.replace(/^\d{4}/, targetYear),
          }));
        }
      }
    }
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
};

interface PrayerContextValue {
  selectedCitySlug: string;
  setSelectedCitySlug: (slug: string) => void;
  cityDisplay: string;
  cityFullLabel: string;
  uniqueCitySlugs: string[];
  isLocationLoading: boolean;
  isDetectingGeo: boolean;
  geoMessage: string | null;
  detectLocation: () => void;
  monthlyPrayerData: PrayerTime[];
  todayTimes: PrayerTime;
  isPrayerLoading: boolean;
  prayerError: any;
  refreshSchedule: () => void;
  nextPrayer: {
    key: PrayerKey;
    label: string;
    time: string;
    hoursLeft: number;
    minutesLeft: number;
    secondsLeft: number;
    totalSecondsLeft: number;
    isTomorrow: boolean;
  };
  imsakiyahCountdown: {
    targetLabel: string;
    targetKey: "imsyak" | "magrib";
    targetTime: string;
    hours: number;
    minutes: number;
    seconds: number;
    subtitle: string;
  };
  isAlarmEnabled: boolean;
  toggleAlarm: () => void;
  playReminderSound: (type?: "imsak" | "adzan") => void;
  isImsakiyahModalOpen: boolean;
  setIsImsakiyahModalOpen: (open: boolean) => void;
}

const PrayerContext = createContext<PrayerContextValue | null>(null);

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [selectedCitySlug, setSelectedCitySlugState] = useState<string>("semarang");
  const [isDetectingGeo, setIsDetectingGeo] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [isImsakiyahModalOpen, setIsImsakiyahModalOpen] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const lastTriggeredRef = useRef<string>("");

  // Load saved city & alarm preference from localStorage
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("muslimin_city_slug");
      if (savedCity) setSelectedCitySlugState(savedCity);
      const savedAlarm = localStorage.getItem("muslimin_alarm_enabled");
      if (savedAlarm === "true") setIsAlarmEnabled(true);
    } catch {
      // ignore storage errors
    }
  }, []);

  const setSelectedCitySlug = useCallback((slug: string) => {
    setSelectedCitySlugState(slug);
    setGeoMessage(null);
    try {
      localStorage.setItem("muslimin_city_slug", slug);
    } catch {
      // ignore
    }
  }, []);

  // Tick every second for accurate countdown to next prayer & Imsak/Maghrib
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch city list
  const { data: citySlugs, isLoading: isLocationLoading } = useSWR<string[]>(
    CITIES_API_URL,
    fetcherWithFallback,
    {
      revalidateOnFocus: false,
      fallbackData: INDONESIAN_CITY_COORDS.map((c) => c.slug),
    }
  );

  const uniqueCitySlugs = useMemo(() => {
    if (!citySlugs || citySlugs.length === 0) {
      return INDONESIAN_CITY_COORDS.map((c) => c.slug).sort();
    }
    return Array.from(new Set(citySlugs)).sort();
  }, [citySlugs]);

  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const todayStr = `${currentYear}-${currentMonth}-${String(now.getDate()).padStart(2, "0")}`;

  const scheduleUrl = `${PRAYER_SCHEDULE_BASE_URL}/${selectedCitySlug}/${currentYear}/${currentMonth}.json`;

  const {
    data: rawMonthlyData,
    error: prayerError,
    isLoading: isPrayerLoading,
    mutate: refreshSchedule,
  } = useSWR<PrayerTime[]>(scheduleUrl, fetcherWithFallback, {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
  });

  const monthlyPrayerData = useMemo(() => {
    if (rawMonthlyData && Array.isArray(rawMonthlyData) && rawMonthlyData.length > 0) {
      return rawMonthlyData;
    }
    return generateFallbackSchedule(currentYear, now.getMonth() + 1);
  }, [rawMonthlyData, currentYear, now]);

  const todayTimes: PrayerTime = useMemo(() => {
    const match = monthlyPrayerData.find((p) => p.tanggal === todayStr);
    if (match) return match;
    const dayIndex = Math.min(now.getDate() - 1, monthlyPrayerData.length - 1);
    return (
      monthlyPrayerData[Math.max(0, dayIndex)] ||
      generateFallbackSchedule(currentYear, now.getMonth() + 1)[0]
    );
  }, [monthlyPrayerData, todayStr, now, currentYear]);

  // Calculate next prayer and exact time remaining
  const nextPrayer = useMemo(() => {
    const currentSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const orderedKeys: { key: PrayerKey; label: string }[] = [
      { key: "imsyak", label: "Imsak (Sahur)" },
      { key: "shubuh", label: "Subuh" },
      { key: "terbit", label: "Terbit" },
      { key: "dhuha", label: "Dhuha" },
      { key: "dzuhur", label: "Dzuhur" },
      { key: "ashr", label: "Ashar" },
      { key: "magrib", label: "Maghrib (Buka Puasa)" },
      { key: "isya", label: "Isya" },
    ];

    for (const item of orderedKeys) {
      const timeStr = todayTimes[item.key];
      if (!timeStr) continue;
      const [h, m] = timeStr.split(":").map(Number);
      const targetSeconds = h * 3600 + m * 60;
      if (targetSeconds > currentSeconds) {
        const diffSec = targetSeconds - currentSeconds;
        return {
          key: item.key,
          label: item.label,
          time: timeStr,
          hoursLeft: Math.floor(diffSec / 3600),
          minutesLeft: Math.floor((diffSec % 3600) / 60),
          secondsLeft: diffSec % 60,
          totalSecondsLeft: diffSec,
          isTomorrow: false,
        };
      }
    }

    // All prayers today have passed -> Next is Imsak tomorrow
    const imsakStr = todayTimes.imsyak || "04:12";
    const [ih, im] = imsakStr.split(":").map(Number);
    const targetSecTomorrow = 24 * 3600 - currentSeconds + (ih * 3600 + im * 60);

    return {
      key: "imsyak" as PrayerKey,
      label: "Imsak (Sahur Esok Hari)",
      time: imsakStr,
      hoursLeft: Math.floor(targetSecTomorrow / 3600),
      minutesLeft: Math.floor((targetSecTomorrow % 3600) / 60),
      secondsLeft: targetSecTomorrow % 60,
      totalSecondsLeft: targetSecTomorrow,
      isTomorrow: true,
    };
  }, [now, todayTimes]);

  // Dedicated Imsak & Maghrib countdown for Imsakiyah Mode
  const imsakiyahCountdown = useMemo(() => {
    const currentSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const imsakStr = todayTimes.imsyak || "04:12";
    const magribStr = todayTimes.magrib || "17:58";

    const [ih, im] = imsakStr.split(":").map(Number);
    const [mh, mm] = magribStr.split(":").map(Number);

    const imsakSec = ih * 3600 + im * 60;
    const magribSec = mh * 3600 + mm * 60;

    if (currentSeconds < imsakSec) {
      const diff = imsakSec - currentSeconds;
      return {
        targetLabel: "Hitung Mundur Imsak (Batas Sahur)",
        targetKey: "imsyak" as const,
        targetTime: imsakStr,
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        subtitle: `Waktu Imsak hari ini pukul ${imsakStr} • Subuh pukul ${todayTimes.shubuh}`,
      };
    } else if (currentSeconds < magribSec) {
      const diff = magribSec - currentSeconds;
      return {
        targetLabel: "Hitung Mundur Buka Puasa (Maghrib)",
        targetKey: "magrib" as const,
        targetTime: magribStr,
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        subtitle: `Adzan Maghrib hari ini pukul ${magribStr} • Isya & Tarawih pukul ${todayTimes.isya}`,
      };
    } else {
      const diff = 24 * 3600 - currentSeconds + imsakSec;
      return {
        targetLabel: "Hitung Mundur Imsak (Sahur Esok Hari)",
        targetKey: "imsyak" as const,
        targetTime: imsakStr,
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        subtitle: `Selamat beristirahat & sholat malam • Imsak esok hari pukul ${imsakStr}`,
      };
    }
  }, [now, todayTimes]);

  // Synthesize gentle harmonic chime / bedug reminder via Web Audio API
  const playReminderSound = useCallback((type: "imsak" | "adzan" = "adzan") => {
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes =
        type === "imsak"
          ? [440, 554.37, 659.25, 880] // Warm A-major arpeggio for Sahur/Imsak
          : [392, 493.88, 587.33, 783.99, 587.33]; // Gentle harmonic chime for Adzan/Maghrib

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.28);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.28);
        gain.gain.exponentialRampToValueAtTime(
          0.18,
          ctx.currentTime + idx * 0.28 + 0.05
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + idx * 0.28 + 1.1
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.28);
        osc.stop(ctx.currentTime + idx * 0.28 + 1.15);
      });
    } catch {
      // AudioContext blocked or unsupported
    }
  }, []);

  const toggleAlarm = useCallback(() => {
    setIsAlarmEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("muslimin_alarm_enabled", String(next));
      } catch {
        // ignore
      }
      if (next) {
        playReminderSound("adzan");
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "default") {
            Notification.requestPermission().catch(() => {});
          }
        }
      }
      return next;
    });
  }, [playReminderSound]);

  // Monitor 10 minutes before Imsak & exact prayer times when alarm is enabled
  useEffect(() => {
    if (!isAlarmEnabled) return;
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const currentHM = `${hh}:${mm}`;

    if (lastTriggeredRef.current === currentHM) return;

    // Check 10 minutes before Imsak
    if (todayTimes.imsyak) {
      const [ih, im] = todayTimes.imsyak.split(":").map(Number);
      const tenMinBefore = new Date(now);
      tenMinBefore.setHours(ih, im - 10, 0, 0);
      const warnHM = `${String(tenMinBefore.getHours()).padStart(2, "0")}:${String(
        tenMinBefore.getMinutes()
      ).padStart(2, "0")}`;

      if (currentHM === warnHM) {
        lastTriggeredRef.current = currentHM;
        playReminderSound("imsak");
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Pengingat Imsak — MuslimIN", {
            body: `10 menit menuju waktu Imsak (${todayTimes.imsyak}) untuk wilayah ${formatCityName(
              selectedCitySlug
            )}.`,
          });
        }
      }
    }

    // Check exact prayer times (Subuh, Dzuhur, Ashar, Maghrib, Isya)
    const watchKeys: { key: PrayerKey; name: string }[] = [
      { key: "imsyak", name: "Waktu Imsak" },
      { key: "shubuh", name: "Adzan Subuh" },
      { key: "dzuhur", name: "Adzan Dzuhur" },
      { key: "ashr", name: "Adzan Ashar" },
      { key: "magrib", name: "Adzan Maghrib (Buka Puasa)" },
      { key: "isya", name: "Adzan Isya" },
    ];

    for (const item of watchKeys) {
      if (todayTimes[item.key] === currentHM) {
        lastTriggeredRef.current = currentHM;
        playReminderSound(item.key === "imsyak" ? "imsak" : "adzan");
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`${item.name} — MuslimIN`, {
            body: `Telah masuk ${item.name} (${currentHM}) untuk wilayah ${formatCityName(
              selectedCitySlug
            )}.`,
          });
        }
        break;
      }
    }
  }, [now, isAlarmEnabled, todayTimes, selectedCitySlug, playReminderSound]);

  // Geolocation Auto-Detect -> Match nearest Indonesian city
  const detectLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoMessage("Browser tidak mendukung fitur Geolocation.");
      return;
    }

    setIsDetectingGeo(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closestCity = INDONESIAN_CITY_COORDS[0];
        let minDistance = Infinity;

        for (const city of INDONESIAN_CITY_COORDS) {
          const dLat = latitude - city.lat;
          const dLng = longitude - city.lng;
          const dist = dLat * dLat + dLng * dLng;
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = city;
          }
        }

        // Verify slug exists or use closestCity.slug
        const matchedSlug =
          uniqueCitySlugs.find((s) => s === closestCity.slug) ||
          uniqueCitySlugs.find((s) => s.includes(closestCity.slug.split("-")[0])) ||
          closestCity.slug;

        setSelectedCitySlug(matchedSlug);
        setGeoMessage(`Lokasi terdeteksi: ${formatCityName(matchedSlug)}`);
        setIsDetectingGeo(false);
      },
      () => {
        setGeoMessage("Izin lokasi ditolak. Silakan pilih kota secara manual.");
        setIsDetectingGeo(false);
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [uniqueCitySlugs, setSelectedCitySlug]);

  const value: PrayerContextValue = {
    selectedCitySlug,
    setSelectedCitySlug,
    cityDisplay: formatCityName(selectedCitySlug),
    cityFullLabel: getCityProvinceLabel(selectedCitySlug),
    uniqueCitySlugs,
    isLocationLoading,
    isDetectingGeo,
    geoMessage,
    detectLocation,
    monthlyPrayerData,
    todayTimes,
    isPrayerLoading,
    prayerError,
    refreshSchedule,
    nextPrayer,
    imsakiyahCountdown,
    isAlarmEnabled,
    toggleAlarm,
    playReminderSound,
    isImsakiyahModalOpen,
    setIsImsakiyahModalOpen,
  };

  return (
    <PrayerContext.Provider value={value}>{children}</PrayerContext.Provider>
  );
}

export function usePrayer() {
  const ctx = useContext(PrayerContext);
  if (!ctx) {
    throw new Error("usePrayer must be used within a PrayerProvider");
  }
  return ctx;
}

