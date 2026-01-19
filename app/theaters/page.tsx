import { TheaterCard } from "@/components/theater-card"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"
import type { Theater } from "@/types"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "All Art House Theaters | Art House Movie Theaters",
  description: "Browse all 488+ independent and art house movie theaters across the United States. Discover cinemas showing foreign films, classic cinema, and repertory programming.",
}

async function getAllTheaters(): Promise<Theater[]> {
  try {
    const { data, error } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website, description')
      .order('name')

    if (error) {
      console.error('Error fetching theaters:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('Error fetching theaters:', e)
    return []
  }
}

export default async function TheatersPage() {
  const theaters = await getAllTheaters()

  return (
    <div className="dark min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        <div className="text-center">
          <h1 className="font-serif text-4xl font-medium text-amber-50 md:text-5xl">
            All Art House Theaters
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Showing <span className="font-medium text-[#D4AF37]">{theaters.length}</span> theaters across the United States
          </p>
        </div>
      </div>

      {/* Theater Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {theaters.map((theater) => (
            <TheaterCard key={theater.slug} {...theater} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
