import Image from "next/image";

export default function HeaderNav() {
  return (
    <header className="w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/moon-star.jpg"
            alt="Ramadhan"
            width={24}
            height={24}
            className="rounded-sm"
            priority
          />
          <h3 className="font-semibold  text-green-500">
            Muslim<span className="text-purple-800">IN</span>
          </h3>
        </div>
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <a href="#countdown" className="hover:underline">
            Countdown
          </a>
          <a href="#prayer" className="hover:underline">
            Waktu Sholat
          </a>
        </nav>
      </div>
    </header>
  );
}
