import Link from "next/link"

interface CityCardProps {
  city: string
  state: string
  slug: string
}

export function CityCard({ city, state, slug }: CityCardProps) {
  return (
    <Link
      href={`/city/${slug}`}
      className="group relative block overflow-hidden rounded-lg bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
    >
      {/* Subtle noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-[#D4AF37]/10 to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />

      {/* Gold ring on hover/focus */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[#D4AF37]/0 motion-safe:transition-all motion-safe:duration-300 group-hover:ring-[#D4AF37]/30 group-focus-visible:ring-[#D4AF37]/30" aria-hidden="true" />

      <div className="relative">
        <h3 className="font-serif text-2xl font-medium text-[#f5f1e8] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-[#E5C158] group-focus-visible:text-[#E5C158]">
          {city}
        </h3>
        <p className="mt-1 font-sans text-sm text-neutral-400 motion-safe:transition-colors motion-safe:duration-300 group-hover:text-neutral-300 group-focus-visible:text-neutral-300">
          {state}
        </p>
      </div>
    </Link>
  )
}
