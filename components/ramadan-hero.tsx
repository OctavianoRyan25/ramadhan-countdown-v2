import RamadanDecor from "@/components/ramadan-decor";
import { Button } from "@/components/ui/button";

export default function RamadanHero() {
  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-balance text-3xl md:text-5xl font-semibold">
              MuslimIN
            </h1>
            <p className="mt-3 text-pretty text-sm md:text-base opacity-90">
              Muslimin adalah aplikasi web sederhana untuk menghitung mundur ke
              Ramadhan dan menampilkan waktu sholat harian berdasarkan lokasi
              pengguna. Aplikasi ini juga terdapat fitur tambahan seperti
              menampilkan hadis harian.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#countdown">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:opacity-90 hover:bg-accent"
                >
                  Lihat Countdown
                </Button>
              </a>
              <a href="#prayer">
                <Button size="lg" variant="secondary">
                  Waktu Sholat Hari Ini
                </Button>
              </a>
            </div>
          </div>
          <div>
            <RamadanDecor />
          </div>
        </div>
      </div>
    </div>
  );
}
