"use client"

import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// City buttons that link to metro area pages
const cities = [
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "New York", slug: "new-york" },
  { name: "Chicago", slug: "chicago" },
  { name: "Austin", slug: "austin" },
  { name: "Seattle", slug: "seattle" },
  { name: "Portland", slug: "portland" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Boston", slug: "boston" },
  { name: "Denver", slug: "denver" },
  { name: "Philadelphia", slug: "philadelphia" },
  { name: "Minneapolis", slug: "minneapolis" },
  { name: "Atlanta", slug: "atlanta" },
  { name: "Miami", slug: "miami" },
  { name: "Detroit", slug: "detroit" },
  { name: "Washington DC", slug: "washington-dc" },
  { name: "Dallas", slug: "dallas" },
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-background via-background/98 to-[#0a0a0a] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Film grain and vignette effects are now handled at page level */}
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mb-6 font-serif text-5xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
          Find Independent Cinema Near You
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-balance text-lg leading-relaxed text-[oklch(0.70_0.015_50)] sm:text-xl">
          A directory of art house theaters, repertory cinemas, and independent movie houses across America
        </p>

        <div className="mx-auto mb-10 max-w-2xl">
          <div className="group relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground motion-safe:transition-colors group-focus-within:text-[#D4AF37]" aria-hidden="true" />
            <label htmlFor="theater-search" className="sr-only">Search theaters by city, theater name, or state</label>
            <input
              id="theater-search"
              type="search"
              placeholder="Search by city, theater name, or state…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-card/50 py-4 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm motion-safe:transition-[border-color,box-shadow] focus-visible:border-[#D4AF37]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/30 focus-visible:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            />
          </div>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#0a0a0a] to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#0a0a0a] to-transparent" aria-hidden="true" />

          <div className="flex gap-3 overflow-hidden pb-2">
            <div
              className="flex gap-3"
              style={{
                animation: isHovering && !prefersReducedMotion ? "marquee 40s linear infinite" : "none",
              }}
            >
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/city/${city.slug}`}
                  className="shrink-0 rounded-full border border-border bg-card/30 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm motion-safe:transition-colors hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {city.name}
                </Link>
              ))}
              {cities.map((city) => (
                <Link
                  key={`${city.slug}-duplicate`}
                  href={`/city/${city.slug}`}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="shrink-0 rounded-full border border-border bg-card/30 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm motion-safe:transition-colors hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
