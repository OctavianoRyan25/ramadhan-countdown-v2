import CountdownDisplay from "@/components/countdown-display";
import PrayerTimesCard from "@/components/prayer-times-card";
import HeaderNav from "@/components/header-nav";
import RamadanHero from "@/components/ramadan-hero";
import { Card } from "@/components/ui/card";
import HadithHighlight from "@/components/hadith-highlight";
import ComingSoon from "@/components/coming-soon";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-start gap-8 p-0">
      <HeaderNav />

      <section className="w-full">
        <RamadanHero />
      </section>

      <section className="w-full max-w-6xl px-6 md:px-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden">
            <img
              src="/images/oil-lamp.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-1 z-50 -right-0.5 h-20 w-20 opacity-70"
            />
            <img
              src="/images/lantern.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-1 z-50 left-0.5 h-16 w-16 opacity-60"
            />
            <img
              src="/images/mosque-silhouette.jpg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-0 left-0 w-full opacity-25"
            />
            <img
              src="/images/ketupat.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2/5 z-50 left-0.5 h-16 w-16 opacity-60"
            />
            <img
              src="/images/ketupat.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-1/5 z-50 right-0.5 h-16 w-16 opacity-60"
            />
            <img
              src="/images/moon-star.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-1/12 z-20 right-2/12 h-16 w-16 opacity-60 scale-50"
            />
            <div className="relative z-10 p-4 md:p-6">
              <div id="countdown" className="w-full">
                <CountdownDisplay />
              </div>
            </div>
          </Card>

          <div className="relative z-10">
            <div id="prayer" className="w-full">
              <PrayerTimesCard />
            </div>
          </div>
        </div>
        <div id="hadith" className="w-full my-6">
          <HadithHighlight />
        </div>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          Data sumber waktu sholat: waktu-sholat.vercel.app
        </footer>
      </section>

      <section className="w-full">
        <ComingSoon />
      </section>

      <section className="w-full mt-auto">
        <Card className="w-full bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-6 md:px-10 py-6 md:py-8 text-center">
            <p className="text-sm md:text-base">
              &copy; {new Date().getFullYear()} Ramadhan Countdown & Prayer
              Times. All rights reserved.
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
