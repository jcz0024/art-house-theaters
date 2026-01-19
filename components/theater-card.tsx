import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, ExternalLink } from "lucide-react"

interface TheaterCardProps {
  name: string
  city: string
  state: string
  slug: string
  year_established?: number | null
  screens?: number | null
  is_nonprofit?: boolean | null
  website?: string | null
}

export function TheaterCard({ name, city, state, slug, year_established, screens, is_nonprofit, website }: TheaterCardProps) {
  // Build tags from database fields
  const tags: string[] = []
  if (year_established) tags.push(`Est. ${year_established}`)
  if (screens) tags.push(`${screens} ${screens === 1 ? 'Screen' : 'Screens'}`)
  if (is_nonprofit) tags.push('Nonprofit')

  return (
    <Link href={`/theater/${slug}`} className="block">
    <Card className="group relative cursor-pointer overflow-hidden border-zinc-800/60 bg-[#1a1a1a] backdrop-blur-sm motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.02] hover:border-[#D4AF37]/40 hover:bg-[#1c1c1c] hover:shadow-lg hover:shadow-[#D4AF37]/10 focus-within:border-[#D4AF37]/40 focus-within:shadow-lg focus-within:shadow-[#D4AF37]/10">
      {/* Image area with fixed aspect ratio to prevent CLS */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-40" />

        {/* Gradient overlay from bottom for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-black/20" />

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="p-6">
        {/* Theater Name */}
        <h3 className="mb-2 font-serif text-2xl font-semibold tracking-tight text-[#f5f1e8] motion-safe:transition-colors group-hover:text-[#D4AF37] group-focus-within:text-[#D4AF37]">
          {name}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {city}, {state}
          </span>
        </div>

        {/* Tags */}
        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border border-zinc-700/50 bg-zinc-800/40 text-xs font-normal text-zinc-300 motion-safe:transition-colors hover:border-zinc-600 hover:bg-zinc-800/60"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Links - minimum 44px touch targets on mobile */}
        <div className="flex items-center gap-4">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name} website (opens in new tab)`}
              className="inline-flex min-h-11 items-center gap-1 rounded-md px-1 py-2 text-sm text-zinc-400 motion-safe:transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] sm:min-h-6"
            >
              Website
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Subtle gradient overlay on hover/focus */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#D4AF37]/10 via-transparent to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
    </Card>
    </Link>
  )
}
