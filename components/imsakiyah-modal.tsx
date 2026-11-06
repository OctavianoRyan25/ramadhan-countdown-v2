"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, MapPin, Check, Loader2 } from "lucide-react";
import { usePrayer, PrayerTime } from "@/lib/prayer-context";

export default function ImsakiyahModal() {
  const {
    isImsakiyahModalOpen,
    setIsImsakiyahModalOpen,
    cityFullLabel,
    selectedCitySlug,
    monthlyPrayerData,
    todayTimes,
  } = usePrayer();

  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Render high-res 1080x1920 WhatsApp/Instagram Story PNG using HTML5 Canvas
  const handleDownloadStoryImage = async () => {
    setIsGeneratingImg(true);
    setDownloaded(false);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Warm Oasis Background
      ctx.fillStyle = "#FBF9F4";
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Deep Emerald Header Banner
      ctx.fillStyle = "#1B4D3E";
      ctx.fillRect(0, 0, 1080, 290);

      // 3. Gold Accent Border Frame
      ctx.strokeStyle = "#C5A059";
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, 1008, 1848);

      // 4. Header Typography
      ctx.fillStyle = "#C5A059";
      ctx.font = "600 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MUSLIMIN • JADWAL IMSAKIYAH & SHOLAT 30 HARI", 540, 95);

      ctx.fillStyle = "#FBF9F4";
      ctx.font = "bold 52px serif";
      ctx.fillText(cityFullLabel.toUpperCase(), 540, 165);

      ctx.fillStyle = "#E2C485";
      ctx.font = "500 26px sans-serif";
      ctx.fillText(
        `Periode ${monthName} • Ramadhan 1447/1448 H`,
        540,
        220
      );

      // 5. Table Header
      const tableTop = 330;
      const rowHeight = 46;
      const cols = [
        { label: "HARI", x: 110 },
        { label: "TANGGAL", x: 240 },
        { label: "IMSAK", x: 400 },
        { label: "SUBUH", x: 525 },
        { label: "DZUHUR", x: 650 },
        { label: "ASHAR", x: 775 },
        { label: "MAGHRIB", x: 900 },
        { label: "ISYA", x: 995 },
      ];

      ctx.fillStyle = "#1B4D3E";
      ctx.fillRect(60, tableTop, 960, 52);

      ctx.fillStyle = "#FBF9F4";
      ctx.font = "bold 20px sans-serif";
      cols.forEach((col) => {
        ctx.fillText(col.label, col.x, tableTop + 33);
      });

      // 6. Rows (up to 31 days)
      const rows = monthlyPrayerData.slice(0, 31);
      rows.forEach((row: PrayerTime, idx: number) => {
        const y = tableTop + 52 + idx * rowHeight;
        const isEven = idx % 2 === 0;
        const isToday = row.tanggal === todayTimes.tanggal;

        ctx.fillStyle = isToday
          ? "#E9DFC8"
          : isEven
            ? "#FFFFFF"
            : "#F4EFE4";
        ctx.fillRect(60, y, 960, rowHeight);

        // Row bottom divider
        ctx.strokeStyle = "#E6E0D3";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, y + rowHeight);
        ctx.lineTo(1020, y + rowHeight);
        ctx.stroke();

        ctx.fillStyle = "#1E293B";
        ctx.font = isToday ? "bold 20px monospace" : "500 20px monospace";
        ctx.fillText(String(idx + 1).padStart(2, "0"), cols[0].x, y + 30);
        ctx.fillText(row.tanggal.slice(5), cols[1].x, y + 30);

        // Highlight Imsak & Maghrib in Deep Forest Green
        ctx.fillStyle = "#1B4D3E";
        ctx.font = "bold 21px monospace";
        ctx.fillText(row.imsyak || "-", cols[2].x, y + 30);

        ctx.fillStyle = "#334155";
        ctx.font = "500 20px monospace";
        ctx.fillText(row.shubuh || "-", cols[3].x, y + 30);
        ctx.fillText(row.dzuhur || "-", cols[4].x, y + 30);
        ctx.fillText(row.ashr || "-", cols[5].x, y + 30);

        ctx.fillStyle = "#1B4D3E";
        ctx.font = "bold 21px monospace";
        ctx.fillText(row.magrib || "-", cols[6].x, y + 30);

        ctx.fillStyle = "#334155";
        ctx.font = "500 20px monospace";
        ctx.fillText(row.isya || "-", cols[7].x, y + 30);
      });

      // 7. Footer
      ctx.fillStyle = "#64748B";
      ctx.font = "500 22px sans-serif";
      ctx.fillText(
        "MuslimIN — Pendamping Ibadah & Hitung Mundur Ramadhan • Sumber Data: Kemenag / JadwalSholat",
        540,
        1850
      );

      // Trigger PNG Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `imsakiyah-${selectedCitySlug}-muslimin.png`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <Dialog open={isImsakiyahModalOpen} onOpenChange={setIsImsakiyahModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b border-border bg-secondary/50 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <DialogTitle className="font-serif text-2xl font-bold text-foreground">
                Jadwal Imsakiyah & Sholat 30 Hari
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>
                  Wilayah <strong>{cityFullLabel}</strong> • {monthName}
                </span>
              </DialogDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2 pr-6">
              <Button
                size="sm"
                onClick={handleDownloadStoryImage}
                disabled={isGeneratingImg}
                className="rounded-lg bg-primary text-primary-foreground"
              >
                {isGeneratingImg ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : downloaded ? (
                  <Check className="mr-1.5 h-4 w-4" />
                ) : (
                  <Download className="mr-1.5 h-4 w-4" />
                )}
                <span>
                  {downloaded ? "Tersimpan (PNG)" : "Unduh Gambar Story (PNG)"}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintPdf}
                className="rounded-lg"
              >
                <Printer className="mr-1.5 h-4 w-4 text-primary" />
                <span>Cetak / PDF</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable 30-Day Schedule Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-3 py-3 font-semibold">Hari</th>
                  <th className="px-3 py-3 font-semibold">Tanggal</th>
                  <th className="px-3 py-3 font-semibold text-center bg-black/15">
                    Imsak
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">Subuh</th>
                  <th className="px-3 py-3 font-semibold text-center">Terbit</th>
                  <th className="px-3 py-3 font-semibold text-center">Dzuhur</th>
                  <th className="px-3 py-3 font-semibold text-center">Ashar</th>
                  <th className="px-3 py-3 font-semibold text-center bg-black/15">
                    Maghrib
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">Isya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthlyPrayerData.map((item, idx) => {
                  const isToday = item.tanggal === todayTimes.tanggal;
                  return (
                    <tr
                      key={item.tanggal}
                      className={
                        isToday
                          ? "bg-primary/15 font-semibold"
                          : idx % 2 === 0
                            ? "bg-card"
                            : "bg-secondary/30"
                      }
                    >
                      <td className="px-3 py-2.5 font-mono tabular-nums text-muted-foreground">
                        #{String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-3 py-2.5 font-mono tabular-nums whitespace-nowrap">
                        {item.tanggal}
                        {isToday && (
                          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                            Hari Ini
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold tabular-nums text-primary bg-primary/[0.04]">
                        {item.imsyak}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono tabular-nums">
                        {item.shubuh}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono tabular-nums text-muted-foreground">
                        {item.terbit}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono tabular-nums">
                        {item.dzuhur}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono tabular-nums">
                        {item.ashr}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold tabular-nums text-primary bg-primary/[0.04]">
                        {item.magrib}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono tabular-nums">
                        {item.isya}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

