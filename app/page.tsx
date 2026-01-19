import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeaturedTheaterCard } from "@/components/featured-theater-card"
import { CityCard } from "@/components/city-card"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"
import type { Theater, City } from "@/types"
import { ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

const cities: City[] = [
  { city: "Los Angeles", state: "California", slug: "los-angeles" },
  { city: "New York", state: "New York", slug: "new-york" },
  { city: "Chicago", state: "Illinois", slug: "chicago" },
  { city: "Austin", state: "Texas", slug: "austin" },
  { city: "Seattle", state: "Washington", slug: "seattle" },
  { city: "Portland", state: "Oregon", slug: "portland" },
  { city: "San Francisco", state: "California", slug: "san-francisco" },
  { city: "Boston", state: "Massachusetts", slug: "boston" },
  { city: "Philadelphia", state: "Pennsylvania", slug: "philadelphia" },
  { city: "Denver", state: "Colorado", slug: "denver" },
  { city: "Minneapolis", state: "Minnesota", slug: "minneapolis" },
  { city: "Atlanta", state: "Georgia", slug: "atlanta" },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

async function getFeaturedTheaters(): Promise<Theater[]> {
  try {
    // First, get theaters with descriptions
    const { data: withDescriptions, error: descError } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website, description')
      .not('description', 'is', null)
      .neq('description', '')
      .limit(20)

    if (descError) {
      console.error('Error fetching theaters with descriptions:', descError)
    }

    const theatersWithDesc = withDescriptions || []

    // If we have at least 3 theaters with descriptions, shuffle and return 3
    if (theatersWithDesc.length >= 3) {
      return shuffleArray(theatersWithDesc).slice(0, 3)
    }

    // If fewer than 3, supplement with random theaters without descriptions
    const needed = 3 - theatersWithDesc.length
    const { data: withoutDescriptions, error: noDescError } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website, description')
      .or('description.is.null,description.eq.')
      .limit(20)

    if (noDescError) {
      console.error('Error fetching theaters without descriptions:', noDescError)
    }

    const theatersWithoutDesc = withoutDescriptions || []
    const shuffledWithoutDesc = shuffleArray(theatersWithoutDesc).slice(0, needed)

    return [...shuffleArray(theatersWithDesc), ...shuffledWithoutDesc].slice(0, 3)
  } catch (e) {
    console.error('Error fetching featured theaters:', e)
    return []
  }
}

export default async function Home() {
  const featuredTheaters = await getFeaturedTheaters()

  return (
    <div className="dark min-h-screen bg-[#0a0a0a]">
      <HeroSection />

      {/* Featured Theaters Section */}
      <div className="bg-[#0a0a0a] mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-4xl font-medium text-amber-50 md:text-5xl">
            <span className="text-[#D4AF37]">Featured</span> Theaters
          </h2>
          <p className="mt-3 text-base text-neutral-400 md:text-lg">
            Discover exceptional art house cinemas
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredTheaters.map((theater) => (
            <FeaturedTheaterCard key={theater.slug} {...theater} />
          ))}
        </div>

        {/* Explore All Link */}
        <div className="mt-10 text-center">
          <Link
            href="/theaters"
            className="group inline-flex items-center gap-2 text-lg font-medium text-[#D4AF37] transition-all hover:gap-3 hover:text-[#E5C158]"
          >
            Explore All Theaters
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Browse by City section */}
      <div className="bg-[#0a0a0a] mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-medium text-amber-50 md:text-5xl">Browse by City</h2>
          <p className="mt-3 text-base text-neutral-400 md:text-lg">Discover art house theaters across America</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard key={city.slug} {...city} />
          ))}
        </div>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  )
}
