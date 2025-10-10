export default function RamadanDecor() {
  return (
    <div
      className="w-full rounded-lg border bg-accent/40 text-accent-foreground px-4 py-6"
      role="img"
      aria-label="Decor Ramadhan: bulan sabit, bintang, ketupat, dan lampion"
    >
      <div className="mx-auto max-w-4xl flex items-end justify-center gap-8">
        {/* Hanging crescent & star */}
        <div className="flex flex-col items-center">
          <div className="w-px h-14 bg-border" aria-hidden="true" />
          <img
            src="/images/mosque.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-auto animate-sway scale-150"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        {/* Lantern */}
        <div className="flex flex-col items-center">
          <div className="w-px h-16 bg-border" aria-hidden="true" />
          <img
            src="/images/lantern.png"
            alt=""
            aria-hidden="true"
            className="h-12 w-auto animate-sway"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
        {/* Lantern */}
        <div className="flex flex-col items-center">
          <div className="w-px h-12 bg-border" aria-hidden="true" />
          <img
            src="/images/lantern2.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-auto animate-sway"
            style={{ animationDelay: "0.6s" }}
          />
        </div>
        {/* Lantern (existing) */}
        <div className="flex flex-col items-center">
          <div className="w-px h-14 bg-border" aria-hidden="true" />
          <img
            src="/images/lantern.svg"
            alt=""
            aria-hidden="true"
            className="h-11 w-auto animate-sway"
            style={{ animationDelay: "0.8s" }}
          />
        </div>
        {/* Small star */}
        <div className="flex flex-col items-center">
          <div className="w-px h-10 bg-border" aria-hidden="true" />
          <img
            src="/images/night.png"
            alt=""
            aria-hidden="true"
            className="h-7 w-auto animate-sway scale-150"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>
      <p className="sr-only">
        Hiasan Ramadhan: bulan sabit, bintang, ketupat, dan lampion
      </p>
    </div>
  );
}
