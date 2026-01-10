import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowRight, ExternalLink } from "lucide-react"

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
    <Card className="group relative overflow-hidden border-zinc-800/60 bg-[#1a1a1a] backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#1c1c1c] hover:shadow-lg hover:shadow-[#D4AF37]/10">
      <div className="relative h-48 overflow-hidden bg-zinc-900">
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-40" />

        {/* Gradient overlay from bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/20" />

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="p-6">
        {/* Theater Name */}
        <h3 className="mb-2 font-serif text-2xl font-semibold tracking-tight text-[#f5f1e8] transition-colors group-hover:text-[#D4AF37]">
          {name}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="h-3.5 w-3.5" />
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
              className="border border-zinc-700/50 bg-zinc-800/40 text-xs font-normal text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/60"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            href={`/theater/${slug}`}
            className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-[#D4AF37] transition-all hover:gap-2 hover:text-[#E5C158]"
          >
            View Theater
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  )
}
