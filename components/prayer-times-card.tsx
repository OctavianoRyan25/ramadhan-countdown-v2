"use client";

import React, { useState } from "react";
import {
  MapPin,
  LocateFixed,
  Clock,
  Check,
  ChevronsUpDown,
  Bell,
  Volume2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  usePrayer,
  PRAYER_LABELS,
  formatCityName,
} from "@/lib/prayer-context";
import { IslamicGeometricPattern } from "@/components/islamic-patterns";

export default function PrayerTimesCard() {
  const {
    selectedCitySlug,
    setSelectedCitySlug,
    cityFullLabel,
    uniqueCitySlugs,
    isDetectingGeo,
    geoMessage,
    detectLocation,
    todayTimes,
    isPrayerLoading,
    nextPrayer,
    isAlarmEnabled,
    toggleAlarm,
    playReminderSound,
    setIsImsakiyahModalOpen,
  } = usePrayer();

  const [openCityPicker, setOpenCityPicker] = useState(false);

  const formattedDateId = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section
      id="jadwal-sholat"
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
    >
      <IslamicGeometricPattern
        id="prayer-girih"
        className="text-primary opacity-[0.03] dark:opacity-[0.04]"
      />

      <div className="relative z-10 p-5 sm:p-7 md:p-8">
        {/* Top Bar: Title, Location Display & Location Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Clock className="h-3.5 w-3.5" />
              <span>Jadwal Sholat & Imsakiyah Hari Ini</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {cityFullLabel}
            </h2>
            <p className="text-xs text-muted-foreground">{formattedDateId}</p>
          </div>

          {/* Location Switcher & GPS Auto-Detect */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Searchable City Combobox */}
            <Popover open={openCityPicker} onOpenChange={setOpenCityPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCityPicker}
                  className="w-full sm:w-[230px] justify-between rounded-xl bg-background/90 text-xs sm:text-sm font-medium"
                >
                  <span className="flex items-center gap-2 truncate">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">
                      {formatCityName(selectedCitySlug)}
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0" align="end">
                <Command>
                  <CommandInput placeholder="Cari kota atau kabupaten..." />
                  <CommandList className="max-h-[280px]">
                    <CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
                    <CommandGroup heading={`Daftar Kota (${uniqueCitySlugs.length})`}>
                      {uniqueCitySlugs.map((slug) => (
                        <CommandItem
                          key={slug}
                          value={slug.replace(/-/g, " ")}
                          onSelect={() => {
                            setSelectedCitySlug(slug);
                            setOpenCityPicker(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              selectedCitySlug === slug
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {formatCityName(slug)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* GPS Auto-Detect Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={detectLocation}
              disabled={isDetectingGeo}
              className="rounded-xl text-xs font-medium"
              title="Deteksi lokasi otomatis menggunakan GPS browser"
            >
              {isDetectingGeo ? (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <LocateFixed className="mr-1.5 h-3.5 w-3.5 text-primary" />
              )}
              <span>Deteksi Lokasi</span>
            </Button>

            {/* 30-Day Imsakiyah Table Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImsakiyahModalOpen(true)}
              className="rounded-xl text-xs font-medium"
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-primary" />
              <span>Tabel 30 Hari</span>
            </Button>
          </div>
        </div>

        {geoMessage && (
          <div className="mt-3 rounded-lg bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary">
            {geoMessage}
          </div>
        )}

        {/* Active Next Prayer Highlight Banner */}
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] dark:bg-primary/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Waktu Ibadah Berikutnya
              </div>
              <div className="text-sm sm:text-base font-semibold text-foreground">
                Menuju <span className="text-primary">{nextPrayer.label}</span>{" "}
                pukul{" "}
                <span className="font-mono font-bold tabular-nums">
                  {nextPrayer.time}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            <div className="rounded-lg border border-primary/30 bg-card px-3.5 py-1.5 font-mono text-sm font-bold tabular-nums text-primary shadow-2xs">
              {nextPrayer.hoursLeft > 0 && `${nextPrayer.hoursLeft} jam `}
              {nextPrayer.minutesLeft} menit {nextPrayer.secondsLeft} detik lagi
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant={isAlarmEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAlarm}
                className="h-8 rounded-lg text-xs"
              >
                <Bell className="mr-1.5 h-3.5 w-3.5" />
                {isAlarmEnabled ? "Alarm Aktif" : "Ingatkan Saya"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => playReminderSound("adzan")}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                title="Uji Suara Pengingat Adzan / Imsak"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 8-Column Prayer Schedule Grid (Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya) */}
        <div
          className={cn(
            "mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8",
            isPrayerLoading && "opacity-70 transition-opacity"
          )}
        >
          {PRAYER_LABELS.map(({ key, label, shortDesc }) => {
            const timeValue = todayTimes[key] || "--:--";
            const isNext = nextPrayer.key === key && !nextPrayer.isTomorrow;
            const isSpecial = key === "imsyak" || key === "magrib";

            return (
              <div
                key={key}
                className={cn(
                  "relative flex flex-col items-center justify-between rounded-xl border p-3.5 text-center transition-all",
                  isNext
                    ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/25"
                    : isSpecial
                      ? "border-[#C5A059]/40 bg-secondary/60 text-foreground hover:border-primary/40"
                      : "border-border bg-background/70 text-foreground hover:border-primary/30"
                )}
              >
                {isNext && (
                  <span className="mb-1.5 rounded-full bg-background/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                     Berikutnya
                  </span>
                )}
                {!isNext && isSpecial && (
                  <span className="mb-1.5 rounded-full bg-[#C5A059]/20 text-[#9A742B] dark:text-[#D4AF37] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                    {key === "imsyak" ? "Sahur" : "Iftar"}
                  </span>
                )}
                {!isNext && !isSpecial && (
                  <span className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    {shortDesc}
                  </span>
                )}

                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    isNext ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>

                <span
                  className={cn(
                    "mt-1.5 font-mono text-xl font-bold tabular-nums",
                    isNext ? "text-primary-foreground" : "text-foreground"
                  )}
                >
                  {timeValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
