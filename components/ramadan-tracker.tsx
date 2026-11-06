"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IslamicGeometricPattern } from "@/components/islamic-patterns";

interface DailyAmalanState {
  date: string;
  checkedIds: string[];
  tilawahPages: number;
  tilawahTarget: number;
}

const AMALAN_ITEMS = [
  {
    id: "puasa",
    title: "Puasa Ramadhan / Puasa Sunnah",
    subtitle: "Menjaga lisan, pandangan, dan keikhlasan ibadah puasa",
    category: "Utama",
  },
  {
    id: "fardhu_berjamaah",
    title: "Sholat Fardhu 5 Waktu Tepat Waktu",
    subtitle: "Subuh, Dzuhur, Ashar, Maghrib, dan Isya",
    category: "Wajib",
  },
  {
    id: "tarawih_witir",
    title: "Sholat Tarawih & Witir / Qiyamul Lail",
    subtitle: "Menghidupkan malam dengan sholat sunnah",
    category: "Sunnah Malam",
  },
  {
    id: "sedekah_subuh",
    title: "Sedekah Subuh & Berbagi Buka Puasa",
    subtitle: "Amalan rutin harian walau sedikit namun istiqomah",
    category: "Sosial",
  },
  {
    id: "sholat_dhuha",
    title: "Sholat Sunnah Rawatib & Dhuha",
    subtitle: "Menyempurnakan pahala sholat fardhu harian",
    category: "Sunnah Siang",
  },
  {
    id: "dzikir_doa",
    title: "Dzikir Pagi-Petang & Istighfar Sahur",
    subtitle: "Memperbanyak doa di waktu mustajab",
    category: "Dzikir",
  },
];

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function RamadanTracker() {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [state, setState] = useState<DailyAmalanState>({
    date: todayKey,
    checkedIds: [],
    tilawahPages: 0,
    tilawahTarget: 20, // 20 halaman = 1 Juz per hari
  });
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(`muslimin_tracker_${todayKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          date: todayKey,
          checkedIds: Array.isArray(parsed.checkedIds) ? parsed.checkedIds : [],
          tilawahPages: Number(parsed.tilawahPages) || 0,
          tilawahTarget: Number(parsed.tilawahTarget) || 20,
        });
      }
    } catch {
      // ignore storage errors
    }
  }, [todayKey]);

  const saveState = (next: DailyAmalanState) => {
    setState(next);
    try {
      localStorage.setItem(`muslimin_tracker_${todayKey}`, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleItem = (id: string) => {
    const exists = state.checkedIds.includes(id);
    const nextIds = exists
      ? state.checkedIds.filter((item) => item !== id)
      : [...state.checkedIds, id];
    saveState({ ...state, checkedIds: nextIds });
  };

  const updateTilawah = (delta: number) => {
    const nextPages = Math.max(0, Math.min(604, state.tilawahPages + delta));
    saveState({ ...state, tilawahPages: nextPages });
  };

  const resetToday = () => {
    saveState({
      date: todayKey,
      checkedIds: [],
      tilawahPages: 0,
      tilawahTarget: 20,
    });
  };

  // Compute completion percentage (6 checklist items + tilawah target)
  const tilawahRatio = Math.min(1, state.tilawahPages / state.tilawahTarget);
  const totalPoints = AMALAN_ITEMS.length + 1;
  const earnedPoints = state.checkedIds.length + tilawahRatio;
  const progressPercent = Math.round((earnedPoints / totalPoints) * 100);

  return (
    <section
      id="amalan-tracker"
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm flex flex-col justify-between"
    >
      <IslamicGeometricPattern
        id="tracker-girih"
        className="text-primary opacity-[0.03] dark:opacity-[0.04]"
      />

      <div className="relative z-10 p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Jurnal Muhasabah Harian</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              Target Amalan Ramadhan
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tersimpan otomatis di perangkat Anda tanpa perlu login.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-mono text-2xl font-bold tabular-nums text-primary">
              {mounted ? `${progressPercent}%` : "0%"}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Capaian Hari Ini
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${mounted ? progressPercent : 0}%` }}
            />
          </div>
        </div>

        {/* Tilawah Al-Qur'an Counter Widget */}
        <div className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Target Tilawah Al-Qur&apos;an Harian
                </h3>
                <p className="text-xs text-muted-foreground">
                  20 halaman (1 Juz) per hari untuk khatam 30 Juz sebulan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateTilawah(-2)}
                className="h-8 w-8 rounded-lg"
                aria-label="Kurangi halaman tilawah"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <div className="min-w-[92px] text-center font-mono text-sm font-bold tabular-nums">
                <span className="text-lg text-primary">
                  {mounted ? state.tilawahPages : 0}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {state.tilawahTarget} hlm
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateTilawah(2)}
                className="h-8 w-8 rounded-lg"
                aria-label="Tambah halaman tilawah"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Checklist Amalan */}
        <div className="mt-4 space-y-2.5">
          {AMALAN_ITEMS.map((item) => {
            const isChecked = mounted && state.checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  isChecked
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border bg-background/60 hover:border-primary/30 hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isChecked ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        isChecked ? "line-through opacity-80" : ""
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-border/80 bg-card px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer Reset */}
        <div className="mt-4 flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            {mounted ? state.checkedIds.length : 0} dari {AMALAN_ITEMS.length} amalan
            selesai hari ini
          </span>
          <button
            type="button"
            onClick={resetToday}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Hari Ini</span>
          </button>
        </div>
      </div>
    </section>
  );
}

