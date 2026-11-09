"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  Volume2,
  Square,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Info,
  Loader2,
  FileEdit,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IslamicGeometricPattern } from "@/components/islamic-patterns";

// Types based on https://equran.id/apidev/v2
export interface SurahListItem {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface AyatItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetailData extends SurahListItem {
  ayat: AyatItem[];
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
}

export interface ReadingProgressNote {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  totalAyah: number;
  note: string;
  updatedAt: string;
  isCompleted?: boolean;
}

const EQURAN_BASE_URL = "https://equran.id/api/v2";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil data dari eQuran API");
  const json = await res.json();
  return json.data;
};

export default function QuranSection() {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [readingProgress, setReadingProgress] = useState<ReadingProgressNote | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "juz30" | "makkiyah" | "madaniyah">("all");
  
  // Audio state
  const [playingAyah, setPlayingAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Note dialog state
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteFormAyah, setNoteFormAyah] = useState<{ surah: number; surahName: string; ayah: number; totalAyah: number }>({
    surah: 1,
    surahName: "Al-Fatihah",
    ayah: 1,
    totalAyah: 7,
  });
  const [noteText, setNoteText] = useState("");
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load saved bookmark / notes from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("muslimin_quran_bookmark");
      if (saved) {
        setReadingProgress(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch list of all 114 Surahs
  const { data: surahList, isLoading: isSurahListLoading, error: surahListError } = useSWR<SurahListItem[]>(
    `${EQURAN_BASE_URL}/surat`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch detail for selected Surah
  const { data: surahDetail, isLoading: isDetailLoading, error: detailError } = useSWR<SurahDetailData>(
    selectedSurahNumber ? `${EQURAN_BASE_URL}/surat/${selectedSurahNumber}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Cleanup audio on unmount or surah switch
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedSurahNumber]);

  // Audio Play handler
  const handlePlayAyahAudio = (audioObj: Record<string, string>, surahNum: number, ayahNum: number) => {
    if (playingAyah?.surah === surahNum && playingAyah?.ayah === ayahNum) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Prefer Misyari Rasyid (05) or any available reciter
    const audioUrl = audioObj["05"] || audioObj["01"] || Object.values(audioObj)[0];
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyah({ surah: surahNum, ayah: ayahNum });

    audio.onended = () => {
      setPlayingAyah(null);
    };

    audio.onerror = () => {
      setPlayingAyah(null);
    };

    audio.play().catch(() => setPlayingAyah(null));
  };

  // Bookmark & Note Saving
  const handleOpenNoteModal = (surah: number, surahName: string, ayah: number, totalAyah: number) => {
    setNoteFormAyah({ surah, surahName, ayah, totalAyah });
    // Pre-fill with existing note if same ayah
    if (readingProgress && readingProgress.surahNumber === surah && readingProgress.ayahNumber === ayah) {
      setNoteText(readingProgress.note || "");
    } else {
      setNoteText("");
    }
    setIsNoteDialogOpen(true);
  };

  const handleSaveBookmark = (isCompleteMark: boolean = false) => {
    const newProgress: ReadingProgressNote = {
      surahNumber: noteFormAyah.surah,
      surahName: noteFormAyah.surahName,
      ayahNumber: noteFormAyah.ayah,
      totalAyah: noteFormAyah.totalAyah,
      note: noteText.trim(),
      updatedAt: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
      isCompleted: isCompleteMark,
    };

    setReadingProgress(newProgress);
    try {
      localStorage.setItem("muslimin_quran_bookmark", JSON.stringify(newProgress));
    } catch {
      // ignore
    }
    setIsNoteDialogOpen(false);
  };

  const handleQuickBookmark = (surah: number, surahName: string, ayah: number, totalAyah: number) => {
    const isCurrent = readingProgress?.surahNumber === surah && readingProgress?.ayahNumber === ayah;
    const isCompletedNow = ayah === totalAyah;

    const newProgress: ReadingProgressNote = {
      surahNumber: surah,
      surahName: surahName,
      ayahNumber: ayah,
      totalAyah: totalAyah,
      note: isCurrent ? readingProgress.note : (isCompletedNow ? "Selesai membaca seluruh surat" : "Terakhir dibaca"),
      updatedAt: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
      isCompleted: isCompletedNow,
    };

    setReadingProgress(newProgress);
    try {
      localStorage.setItem("muslimin_quran_bookmark", JSON.stringify(newProgress));
    } catch {
      // ignore
    }
  };

  const handleDeleteBookmark = () => {
    setReadingProgress(null);
    try {
      localStorage.removeItem("muslimin_quran_bookmark");
    } catch {
      // ignore
    }
    setIsNoteDialogOpen(false);
  };

  const handleCopyAyah = async (ayah: AyatItem, surahName: string) => {
    const text = `QS. ${surahName}: ${ayah.nomorAyat}\n\n${ayah.teksArab}\n\n"${ayah.teksIndonesia}" (Kemenag RI)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAyah(ayah.nomorAyat);
      setTimeout(() => setCopiedAyah(null), 2500);
    } catch {
      // ignore
    }
  };

  // Filtered Surahs
  const filteredSurahs = useMemo(() => {
    if (!surahList) return [];
    let list = surahList;

    if (filterMode === "juz30") {
      // Surah An-Naba' (78) to An-Nas (114)
      list = list.filter((s) => s.nomor >= 78);
    } else if (filterMode === "makkiyah") {
      list = list.filter((s) => s.tempatTurun.toLowerCase() === "mekah");
    } else if (filterMode === "madaniyah") {
      list = list.filter((s) => s.tempatTurun.toLowerCase() === "madinah");
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        String(s.nomor) === q
    );
  }, [surahList, searchQuery, filterMode]);

  return (
    <section
      id="al-quran"
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
    >
      <IslamicGeometricPattern
        id="quran-girih"
        className="text-primary opacity-[0.035] dark:opacity-[0.05]"
      />

      <div className="relative z-10 p-5 sm:p-7 md:p-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <BookOpen className="h-4 w-4" />
              <span>Al-Qur&apos;an Digital & Penanda Tilawah</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tadarus Al-Qur&apos;an 30 Juz
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Teks resmi standar Kemenag RI via API eQuran.id lengkap dengan audio pelafalan qari internasional.
            </p>
          </div>

          {/* Quick Bookmark Status Widget */}
          {mounted && readingProgress && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookmarkCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">
                    Terakhir Dibaca
                  </span>
                  {readingProgress.isCompleted && (
                    <span className="rounded-full bg-primary px-2 py-0.2 text-[9px] font-bold text-primary-foreground">
                      Khatam Surat
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  QS. {readingProgress.surahName} : Ayat {readingProgress.ayahNumber}
                </div>
                <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                  {readingProgress.note ? `Catatan: "${readingProgress.note}"` : readingProgress.updatedAt}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedSurahNumber(readingProgress.surahNumber);
                }}
                className="ml-auto rounded-lg text-xs"
              >
                Lanjutkan
              </Button>
            </div>
          )}
        </div>

        {/* VIEW 1: Detail Surah (when a surah is selected) */}
        {selectedSurahNumber !== null ? (
          <div className="mt-6 space-y-6">
            {/* Back to Surah List Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSurahNumber(null)}
                className="gap-2 text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Surat
              </Button>

              {surahDetail && (
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span>
                    QS. {surahDetail.nomor}. {surahDetail.namaLatin} ({surahDetail.jumlahAyat} Ayat)
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="capitalize">{surahDetail.tempatTurun}</span>
                </div>
              )}
            </div>

            {/* Surah Detail Header Banner */}
            {isDetailLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Memuat surat dan ayat...</p>
              </div>
            ) : detailError || !surahDetail ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
                Gagal memuat isi surat. Periksa koneksi internet Anda atau coba kembali.
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-6 text-center">
                  <span className="font-arabic text-3xl sm:text-4xl text-primary font-bold">
                    {surahDetail.nama}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-foreground">
                    {surahDetail.namaLatin}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    &ldquo;{surahDetail.arti}&rdquo; • {surahDetail.tempatTurun} • {surahDetail.jumlahAyat} Ayat
                  </p>

                  {/* Bismillah for surahs except At-Taubah (9) and Al-Fatihah (1 has it as verse 1) */}
                  {surahDetail.nomor !== 1 && surahDetail.nomor !== 9 && (
                    <div className="mt-6 pt-4 border-t border-primary/20">
                      <p className="font-arabic text-2xl sm:text-3xl text-foreground/90">
                        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                      </p>
                    </div>
                  )}
                </div>

                {/* Ayat-by-Ayat List */}
                <div className="space-y-4">
                  {surahDetail.ayat.map((ayah) => {
                    const isBookmarked =
                      readingProgress?.surahNumber === surahDetail.nomor &&
                      readingProgress?.ayahNumber === ayah.nomorAyat;
                    const isPlaying =
                      playingAyah?.surah === surahDetail.nomor &&
                      playingAyah?.ayah === ayah.nomorAyat;

                    return (
                      <div
                        key={ayah.nomorAyat}
                        id={`ayah-${ayah.nomorAyat}`}
                        className={`rounded-xl border p-4 sm:p-5 transition-all ${
                          isBookmarked
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-background/80 hover:border-primary/30"
                        }`}
                      >
                        {/* Top Bar for each Ayah: Number, Audio, Bookmark Button */}
                        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 font-mono text-xs font-bold text-primary">
                              {ayah.nomorAyat}
                            </span>
                            {isBookmarked && (
                              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                                Bookmark Aktif
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Play Audio Button */}
                            <Button
                              variant={isPlaying ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handlePlayAyahAudio(ayah.audio, surahDetail.nomor, ayah.nomorAyat)}
                              className="h-8 rounded-lg px-2.5 text-xs"
                              title="Dengarkan Qari (Misyari Rasyid)"
                            >
                              {isPlaying ? (
                                <>
                                  <Square className="mr-1.5 h-3.5 w-3.5 fill-current" />
                                  Stop
                                </>
                              ) : (
                                <>
                                  <Volume2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                                  Audio
                                </>
                              )}
                            </Button>

                            {/* Copy Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyAyah(ayah, surahDetail.namaLatin)}
                              className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground"
                              title="Salin Ayat"
                            >
                              {copiedAyah === ayah.nomorAyat ? (
                                <Check className="h-4 w-4 text-primary" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>

                            {/* Bookmark & Note Button */}
                            <Button
                              variant={isBookmarked ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleOpenNoteModal(
                                  surahDetail.nomor,
                                  surahDetail.namaLatin,
                                  ayah.nomorAyat,
                                  surahDetail.jumlahAyat
                                )
                              }
                              className="h-8 gap-1.5 rounded-lg text-xs"
                              title="Tandai terakhir dibaca atau tambahkan catatan"
                            >
                              <Bookmark className="h-3.5 w-3.5" />
                              <span>{isBookmarked ? "Tersimpan" : "Tandai"}</span>
                            </Button>
                          </div>
                        </div>

                        {/* Arabic Script */}
                        <div className="py-4 text-right" dir="rtl">
                          <p className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-foreground">
                            {ayah.teksArab}
                          </p>
                        </div>

                        {/* Transliteration & Indonesian Translation */}
                        <div className="space-y-1.5 border-t border-border/60 pt-3">
                          <p className="text-xs sm:text-sm font-medium italic text-primary">
                            {ayah.teksLatin}
                          </p>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                            {ayah.teksIndonesia}
                          </p>
                        </div>

                        {/* Display Note if active on this Ayah */}
                        {isBookmarked && readingProgress?.note && (
                          <div className="mt-3 flex items-start gap-2 rounded-lg bg-card/90 border border-primary/20 p-2.5 text-xs text-muted-foreground">
                            <FileEdit className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                            <div>
                              <strong className="text-foreground">Catatan Tadarus:</strong> {readingProgress.note}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer Navigation: Previous / Next Surah & Khatam Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-6">
                  {surahDetail.suratSebelumnya && typeof surahDetail.suratSebelumnya === "object" ? (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSurahNumber((surahDetail.suratSebelumnya as { nomor: number }).nomor)}
                      className="rounded-xl text-xs"
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      QS. {surahDetail.suratSebelumnya.namaLatin}
                    </Button>
                  ) : (
                    <div />
                  )}

                  {/* Mark Entire Surah Complete Button */}
                  <Button
                    onClick={() =>
                      handleQuickBookmark(
                        surahDetail.nomor,
                        surahDetail.namaLatin,
                        surahDetail.jumlahAyat,
                        surahDetail.jumlahAyat
                      )
                    }
                    className="rounded-xl bg-primary text-primary-foreground text-xs"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    Tandai Selesai Membaca Surat Ini ({surahDetail.jumlahAyat} Ayat)
                  </Button>

                  {surahDetail.suratSelanjutnya && typeof surahDetail.suratSelanjutnya === "object" ? (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSurahNumber((surahDetail.suratSelanjutnya as { nomor: number }).nomor)}
                      className="rounded-xl text-xs"
                    >
                      QS. {surahDetail.suratSelanjutnya.namaLatin}
                      <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <div />
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          /* VIEW 2: 114 Surahs Directory */
          <div className="mt-6 space-y-6">
            {/* Search and Category Filter Tabs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari surat (contoh: Al-Baqarah, Yasin, 36)..."
                  className="pl-9 rounded-xl bg-background/90 text-xs sm:text-sm"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { key: "all", label: "Semua Surat (114)" },
                  { key: "juz30", label: "Juz 30 (Juz 'Amma)" },
                  { key: "makkiyah", label: "Makkiyah" },
                  { key: "madaniyah", label: "Madaniyah" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilterMode(f.key as any)}
                    className={`rounded-xl px-3 py-1.5 font-medium transition-colors ${
                      filterMode === f.key
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "border border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Surahs Grid */}
            {isSurahListLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Memuat daftar 114 surat Al-Qur&apos;an...</p>
              </div>
            ) : surahListError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
                Gagal memuat daftar surat. Pastikan koneksi internet stabil.
              </div>
            ) : filteredSurahs.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                Tidak ada surat yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSurahs.map((surah) => {
                  const hasBookmarkHere = readingProgress?.surahNumber === surah.nomor;

                  return (
                    <button
                      key={surah.nomor}
                      type="button"
                      onClick={() => setSelectedSurahNumber(surah.nomor)}
                      className={`group relative flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                        hasBookmarkHere
                          ? "border-primary bg-primary/[0.08] shadow-xs"
                          : "border-border bg-background/70 hover:border-primary/40 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 font-mono text-sm font-bold text-primary group-hover:scale-105 transition-transform">
                          {surah.nomor}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                              {surah.namaLatin}
                            </span>
                            {hasBookmarkHere && (
                              <BookmarkCheck className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {surah.arti} • {surah.jumlahAyat} Ayat
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-arabic text-xl font-bold text-foreground/80 group-hover:text-primary transition-colors">
                          {surah.nama}
                        </span>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {surah.tempatTurun}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bookmark & Note Creation Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">
              Penanda & Catatan Tilawah
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tandai progress tilawah QS. {noteFormAyah.surahName} Ayat {noteFormAyah.ayah}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Lokasi Bacaan:</span> QS. {noteFormAyah.surahName} ({noteFormAyah.surah}) : Ayat {noteFormAyah.ayah} dari total {noteFormAyah.totalAyah} ayat.
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Catatan Renungan / Catatan Hafalan (Opsional):
              </label>
              <Textarea
                rows={3}
                placeholder="Tuliskan catatan, muhasabah, atau batas bacaan harian..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSaveBookmark(false)}
                  className="flex-1 rounded-xl bg-primary text-primary-foreground text-xs"
                >
                  <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                  Simpan Sebagai Terakhir Dibaca
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSaveBookmark(true)}
                  className="flex-1 rounded-xl text-xs"
                  title="Tandai surat ini telah selesai dibaca"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  Tandai Selesai
                </Button>
              </div>

              {readingProgress &&
                readingProgress.surahNumber === noteFormAyah.surah &&
                readingProgress.ayahNumber === noteFormAyah.ayah && (
                  <Button
                    variant="ghost"
                    onClick={handleDeleteBookmark}
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Hapus Bookmark Ini
                  </Button>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
