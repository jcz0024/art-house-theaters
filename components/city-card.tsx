import Link from "next/link"

interface CityCardProps {
  city: string
  state: string
  slug: string
}

export function CityCard({ city, state, slug }: CityCardProps) {
  return (
    <Link href={`/city/${slug}`}>
      <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:ring-1 hover:ring-[#D4AF37]/30">
        {/* Subtle noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          <h3 className="font-serif text-2xl font-medium text-[#f5f1e8] transition-colors duration-300 group-hover:text-[#E5C158]">
            {city}
          </h3>
          <p className="mt-1 font-sans text-sm text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300">
            {state}
          </p>
        </div>
      </div>
    </Link>
  )
}
