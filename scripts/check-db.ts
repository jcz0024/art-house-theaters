import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Parse .env.local manually
const envContent = readFileSync('.env.local', 'utf-8')
const envVars: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkDatabase() {
  // Get total count
  const { count, error: countError } = await supabase
    .from('theaters')
    .select('*', { count: 'exact', head: true })

  console.log('Total theaters:', count)
  if (countError) console.log('Count error:', countError)

  // Get sample of columns/structure
  const { data: sample, error: sampleError } = await supabase
    .from('theaters')
    .select('*')
    .limit(3)

  if (sampleError) {
    console.log('Sample error:', sampleError)
  } else {
    console.log('\nSample records:')
    console.log(JSON.stringify(sample, null, 2))

    if (sample && sample.length > 0) {
      console.log('\nColumns:', Object.keys(sample[0]))
    }
  }

  // Get count by state
  const { data: states, error: statesError } = await supabase
    .from('theaters')
    .select('state')

  if (states) {
    const stateCounts: Record<string, number> = {}
    states.forEach(t => {
      stateCounts[t.state] = (stateCounts[t.state] || 0) + 1
    })
    console.log('\nTheaters by state (top 15):')
    Object.entries(stateCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([state, count]) => console.log(`  ${state}: ${count}`))

    console.log('\nTotal states:', Object.keys(stateCounts).length)
  }

  // Check for nulls/missing data
  const { data: allTheaters } = await supabase
    .from('theaters')
    .select('*')

  if (allTheaters) {
    const missingDescription = allTheaters.filter(t => !t.description).length
    const missingWebsite = allTheaters.filter(t => !t.website).length
    const missingYear = allTheaters.filter(t => !t.year_established).length
    const missingScreens = allTheaters.filter(t => !t.screens).length

    console.log('\nData completeness:')
    console.log(`  Missing description: ${missingDescription}/${allTheaters.length}`)
    console.log(`  Missing website: ${missingWebsite}/${allTheaters.length}`)
    console.log(`  Missing year_established: ${missingYear}/${allTheaters.length}`)
    console.log(`  Missing screens: ${missingScreens}/${allTheaters.length}`)
  }
}

checkDatabase()
