"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  MapPin,
  Bell,
  BellOff,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrayer } from "@/lib/prayer-context";

export default function HeaderNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    cityDisplay,
    isAlarmEnabled,
    toggleAlarm,
    setIsImsakiyahModalOpen,
  } = usePrayer();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-10">
        {/* Brand Identity */}
        <a
          href="#"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            {/* Minimalist Geometric Hilal & Rub el Hizb SVG */}
            <svg
              viewBox="0 0 32 32"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21.5 22.8A9 9 0 0 1 12.2 10.5a9.02 9.02 0 0 1 2.2-5.9A9 9 0 1 0 25.4 19a8.9 8.9 0 0 1-3.9 3.8Z"
                fill="currentColor"
              />
              <polygon
                points="21,6 22.2,8.8 25,10 22.2,11.2 21,14 19.8,11.2 17,10 19.8,8.8"
                fill="#C5A059"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              Muslim<span className="text-primary dark:text-primary">IN</span>
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest uppercase text-muted-foreground sm:inline-block">
              Pendamping Ramadhan
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a
            href="#countdown"
            className="transition-colors hover:text-foreground"
          >
            Hitung Mundur
          </a>
          <a
            href="#jadwal-sholat"
            className="transition-colors hover:text-foreground"
          >
            Jadwal Sholat
          </a>
          <a
            href="#amalan-tracker"
            className="transition-colors hover:text-foreground"
          >
            Target Ibadah
          </a>
          <a
            href="#doa-harian"
            className="transition-colors hover:text-foreground"
          >
            Doa & Murottal
          </a>
          <a
            href="#hadits"
            className="transition-colors hover:text-foreground"
          >
            Mutiara Hadits
          </a>
        </nav>

        {/* Actions: Location Badge, Imsakiyah Quick Open, Alarm, Theme Toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#jadwal-sholat"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
            title="Klik untuk mengubah lokasi kota jadwal sholat"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[100px] truncate sm:max-w-[140px]">
              {cityDisplay}
            </span>
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsImsakiyahModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium"
            title="Lihat & Unduh Jadwal Imsakiyah 30 Hari"
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Imsakiyah</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleAlarm}
            className={`h-9 w-9 rounded-full ${
              isAlarmEnabled
                ? "border-primary/50 bg-primary/10 text-primary"
                : "text-muted-foreground"
            }`}
            title={
              isAlarmEnabled
                ? "Pengingat Suara Imsak & Adzan Aktif (Klik untuk matikan)"
                : "Aktifkan Pengingat Suara Imsak & Adzan"
            }
            aria-label="Toggle Pengingat Suara Adzan dan Imsak"
          >
            {isAlarmEnabled ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>

          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full"
              title={
                theme === "dark"
                  ? "Beralih ke Tema Terang (Warm Oasis)"
                  : "Beralih ke Tema Gelap (Midnight Emerald)"
              }
              aria-label="Ubah Tema Terang atau Gelap"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-[#D4AF37]" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
