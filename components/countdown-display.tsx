"use client"

import { useEffect, useMemo, useState } from "react"

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function getIslamicParts(d: Date) {
  // Using Intl Islamic calendar to derive Hijri month/day numerically
  const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
  const parts = fmt.formatToParts(d)
  const year = Number(parts.find((p) => p.type === "year")?.value || "0")
  const month = Number(parts.find((p) => p.type === "month")?.value || "0")
  const day = Number(parts.find((p) => p.type === "day")?.value || "0")
  return { year, month, day }
}

function findNextGregorianForIslamic(targetMonth: number, targetDay: number, from: Date) {
  // Scan forward up to ~450 days to find the next date whose Islamic month/day matches.
  // This leverages the browser's Intl Islamic calendar implementation (typically Umm al-Qura).
  const start = new Date(from)
  // Ensure we search starting from tomorrow if we're already past the target time today
  const probe = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  for (let i = 0; i < 450; i++) {
    const check = new Date(probe)
    check.setDate(probe.getDate() + i)
    const { month, day } = getIslamicParts(check)
    if (month === targetMonth && day === targetDay) {
      // Start of that day at 00:00 local
      return new Date(check.getFullYear(), check.getMonth(), check.getDate(), 0, 0, 0, 0)
    }
  }
  return null
}

function computeTarget(now: Date) {
  const { month: islamicMonth } = getIslamicParts(now)
  // Ramadan = month 9, Eid al-Fitr (1 Shawwal) = month 10 day 1
  if (islamicMonth === 9) {
    // During Ramadan → countdown to 1 Shawwal
    const eid = findNextGregorianForIslamic(10, 1, now)
    return { label: "Countdown to Eid al-Fitr", target: eid }
  } else {
    // Otherwise → countdown to next 1 Ramadan
    const ramadhan = findNextGregorianForIslamic(9, 1, now)
    return { label: "Countdown to Ramadan", target: ramadhan }
  }
}

function diff(now: number, target: number): TimeLeft {
  const ms = Math.max(0, target - now)
  const seconds = Math.floor(ms / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return { days, hours, minutes, seconds: secs }
}

export default function CountdownDisplay() {
  const [now, setNow] = useState<Date>(() => new Date())
  const { label, target } = useMemo(() => computeTarget(now), [now])

  const [remaining, setRemaining] = useState<TimeLeft>(() =>
    target ? diff(Date.now(), target.getTime()) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
  )

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date())
      if (target) setRemaining(diff(Date.now(), target.getTime()))
    }, 1000)
    return () => clearInterval(id)
    // target as dependency to recompute when switching between Ramadan/Eid windows
  }, [target])

  if (!target) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <h2 className="text-xl font-semibold">Countdown</h2>
        <p className="mt-2 text-muted-foreground">Unable to compute target date. Please refresh the page.</p>
      </div>
    )
  }

  const reached = target.getTime() - now.getTime() <= 0

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      <h2 className="text-xl font-semibold">{label}</h2>
      <p className="mt-1 text-muted-foreground">
        Target date:{" "}
        {target.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {reached ? (
        <div className="mt-4 text-2xl font-semibold">It’s time! 🎉</div>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-md border p-4 text-center">
            <div className="text-3xl font-bold">{remaining.days}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="rounded-md border p-4 text-center">
            <div className="text-3xl font-bold">{remaining.hours}</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="rounded-md border p-4 text-center">
            <div className="text-3xl font-bold">{remaining.minutes}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="rounded-md border p-4 text-center">
            <div className="text-3xl font-bold">{remaining.seconds}</div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Dates are calculated with the Islamic calendar via Intl and may vary by local moon sighting.
      </p>
    </div>
  )
}
