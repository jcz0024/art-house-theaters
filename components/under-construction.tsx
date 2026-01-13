export default function UnderConstruction() {
  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-[#D4AF37]/5 via-transparent to-transparent opacity-40" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1 className="font-serif text-6xl font-medium tracking-tight text-amber-50 md:text-7xl lg:text-8xl">
          Coming Soon
        </h1>
        <div className="mt-8">
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-[#D4AF37] md:text-4xl lg:text-5xl">
            Art House Theaters
          </h2>
        </div>
        <p className="mt-6 text-lg text-neutral-300 md:text-xl lg:text-2xl">
          A directory of independent cinemas across America
        </p>
        <div className="mx-auto mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/70" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>
      </div>
    </div>
  )
}
