"use client"

import { Search } from "lucide-react"
import { useState } from "react"

const cities = [
  "Los Angeles",
  "New York",
  "Chicago",
  "Austin",
  "Seattle",
  "Portland",
  "San Francisco",
  "Brooklyn",
  "Denver",
  "Boston",
  "Philadelphia",
  "Minneapolis",
  "Atlanta",
  "Nashville",
  "Miami",
  "Detroit",
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isHovering, setIsHovering] = useState(false)

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background via-background/98 to-[#0a0a0a] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mb-6 font-serif text-5xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
          Find Independent Cinema Near You
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-balance text-lg leading-relaxed text-[oklch(0.70_0.015_50)] sm:text-xl">
          A directory of art house theaters, repertory cinemas, and independent movie houses across America
        </p>

        <div className="mx-auto mb-10 max-w-2xl">
          <div className="group relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search by city or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card/50 py-4 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            />
          </div>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

          <div className="flex gap-3 overflow-hidden pb-2">
            <div
              className="flex gap-3"
              style={{
                animation: isHovering ? "marquee 40s linear infinite" : "none",
              }}
            >
              {cities.map((city) => (
                <button
                  key={city}
                  className="flex-shrink-0 rounded-full border border-border bg-card/30 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                >
                  {city}
                </button>
              ))}
              {cities.map((city) => (
                <button
                  key={`${city}-duplicate`}
                  className="flex-shrink-0 rounded-full border border-border bg-card/30 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
