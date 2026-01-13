import { HeroSection } from "@/components/hero-section"
import { TheaterCard } from "@/components/theater-card"
import { CityCard } from "@/components/city-card"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"

export const dynamic = 'force-dynamic'

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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:35',message:'getTheaters function entry',data:{hasSupabase:!!supabase,nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV||'not set'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  let data, error;
  try {
    const result = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website')
    data = result.data;
    error = result.error;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:42',message:'Supabase query completed',data:{hasError:!!error,hasData:!!data,dataLength:data?.length||0,errorMessage:error?.message||null,errorCode:error?.code||null,errorDetails:error?.details||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  } catch (e: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:47',message:'Supabase query exception',data:{error:e?.message||String(e),errorType:e?.constructor?.name,stack:e?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Error fetching theaters:', e)
    return []
  }

  if (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:53',message:'Supabase query returned error',data:{errorMessage:error.message,errorCode:error.code,errorDetails:error.details},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.error('Error fetching theaters:', error)
    return []
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:60',message:'getTheaters returning data',data:{theaterCount:data?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  return data || []
}

export default async function Home() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:48',message:'Home component render start',data:{nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV||'not set'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  let theaters: Theater[];
  try {
    theaters = await getTheaters();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:53',message:'Home component got theaters',data:{theaterCount:theaters?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  } catch (e: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:56',message:'Home component getTheaters exception',data:{error:e?.message||String(e),errorType:e?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    theaters = [];
  }

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

