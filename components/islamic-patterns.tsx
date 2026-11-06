"use client";

import React, { useMemo } from "react";

/**
 * Subtle SVG Islamic 8-point star (Rub el Hizb / Girih) geometric background pattern
 * Used at 3% - 6% opacity as recommended in the redesign guide.
 */
export function IslamicGeometricPattern({
  className = "opacity-[0.04] dark:opacity-[0.05]",
  id = "girih-pattern",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 h-full w-full ${className}`}
       xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Octagram / 8-pointed Star */}
            <polygon points="40,6 49,25 68,16 59,35 78,40 59,45 68,64 49,55 40,74 31,55 12,64 21,45 2,40 21,35 12,16 31,25" />
            {/* Inner Geometric Rosette */}
            <polygon points="40,18 46,34 62,40 46,46 40,62 34,46 18,40 34,34" />
            {/* Corner Girih Connections */}
            <circle cx="40" cy="40" r="6" />
            <path d="M0,20 L12,16 M68,16 L80,20 M0,60 L12,64 M68,64 L80,60" />
            <path d="M20,0 L16,12 M60,0 L64,12 M20,80 L16,68 M60,80 L64,68" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Corner Rosette Ornament for Editorial Cards
 */
export function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`pointer-events-none select-none text-primary ${className}`}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <polygon points="60,8 73,38 104,24 90,55 120,60 90,65 104,96 73,82 60,112 47,82 16,96 30,65 0,60 30,55 16,24 47,38" />
        <rect
          x="35"
          y="35"
          width="50"
          height="50"
          transform="rotate(45 60 60)"
        />
        <rect x="35" y="35" width="50" height="50" />
        <circle cx="60" cy="60" r="10" />
      </g>
    </svg>
  );
}

/**
 * Live Astronomical Moon Phase (Hilal Dinamis) Indicator
 * Calculates real lunar age & illumination percentage for any given date.
 */
export function getMoonPhaseData(date: Date = new Date()) {
  // Known new moon reference: Jan 6, 2000 18:14 UTC
  const synodicMonth = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phaseRatio = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
  const normalizedPhase = phaseRatio / synodicMonth; // 0 to 1
  const illumination = Math.round(
    (1 - Math.cos(2 * Math.PI * normalizedPhase)) * 50
  );

  let phaseNameId = "Hilal Awal Bulan";
  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    phaseNameId = "Ijtimak (Bulan Baru)";
  } else if (normalizedPhase < 0.22) {
    phaseNameId = "Hilal Sabit Awal";
  } else if (normalizedPhase < 0.28) {
    phaseNameId = "Paruh Pertama (Tarbi' Awal)";
  } else if (normalizedPhase < 0.47) {
    phaseNameId = "Cembung Awal (Ahdab)";
  } else if (normalizedPhase < 0.53) {
    phaseNameId = "Purnama (Badr)";
  } else if (normalizedPhase < 0.72) {
    phaseNameId = "Cembung Akhir";
  } else if (normalizedPhase < 0.78) {
    phaseNameId = "Paruh Akhir (Tarbi' Tsani)";
  } else {
    phaseNameId = "Sabit Tua (Mihaq)";
  }

  return {
    ageDays: Math.round(phaseRatio * 10) / 10,
    normalizedPhase,
    illumination,
    phaseNameId,
  };
}

export function LiveMoonPhaseBadge({ date }: { date?: Date }) {
  const targetDate = useMemo(() => date || new Date(), [date]);
  const moon = useMemo(() => getMoonPhaseData(targetDate), [targetDate]);

  // Create accurate SVG path for the lit portion of the moon
  const r = 14;
  const cx = 18;
  const cy = 18;
  const p = moon.normalizedPhase;

  const isWaxing = p <= 0.5;
  const k = Math.cos(2 * Math.PI * p);
  const rx = Math.abs(k) * r;

  // Sweep flags for outer limb and terminator
  const outerSweep = isWaxing ? 1 : 0;
  const innerSweep = p < 0.25 || p > 0.75 ? (isWaxing ? 0 : 1) : isWaxing ? 1 : 0;

  const d =
    p < 0.02 || p > 0.98
      ? ""
      : p > 0.48 && p < 0.52
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`
        : `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${innerSweep} ${cx} ${cy - r} Z`;

  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/90 px-3.5 py-1.5 text-xs shadow-2xs backdrop-blur-xs"
      title={`Fase Bulan Live: ${moon.phaseNameId} (Umur bulan ~${moon.ageDays} hari, iluminasi ${moon.illumination}%)`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 36 36"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Dark disc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          className="fill-primary/15 stroke-primary/40 dark:fill-white/10 dark:stroke-primary/50"
          strokeWidth="1.2"
        />
        {/* Lit crescent/phase */}
        {d && (
          <path
            d={d}
            className="fill-[#C5A059] dark:fill-[#D4AF37]"
          />
        )}
      </svg>
      <div className="flex flex-col text-left leading-tight">
        <span className="font-medium text-foreground">{moon.phaseNameId}</span>
        <span className="text-[10px] text-muted-foreground">
          Iluminasi {moon.illumination}% • Hari ke-{Math.max(1, Math.round(moon.ageDays))}
        </span>
      </div>
    </div>
  );
}

