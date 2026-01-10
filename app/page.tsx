import { HeroSection } from "@/components/hero-section"
import { TheaterCard } from "@/components/theater-card"
import { CityCard } from "@/components/city-card"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"

interface Theater {
  slug: string
  name: string
  city: string
  state: string
  year_established: number | null
  screens: number | null
  is_nonprofit: boolean | null
  website: string | null
}

const cities = [
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

async function getTheaters(): Promise<Theater[]> {
  const { data, error } = await supabase
    .from('theaters')
    .select('slug, name, city, state, year_established, screens, is_nonprofit, website')

  if (error) {
    console.error('Error fetching theaters:', error)
    return []
  }

  return data || []
}

export default async function Home() {
  const theaters = await getTheaters()

  return (
    <div className="dark min-h-screen bg-[#0a0a0a]">
      <HeroSection />

      {/* Theater Grid */}
      <div className="bg-[#0a0a0a] mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {theaters.map((theater) => (
            <TheaterCard key={theater.slug} {...theater} />
          ))}
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
