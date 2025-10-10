import { type NextRequest, NextResponse } from "next/server"

const DEFAULT_BASE = "https://waktu-sholat.vercel.app"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat") || "-6.2"
  const lng = searchParams.get("lng") || "106.816"

  const base = process.env.PRAYER_API_BASE || DEFAULT_BASE
  const url = `${base}/prayer?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}`

  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream failed", status: res.status }, { status: 502 })
    }
    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
