import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars: string[] = []
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}. Please set them in your Vercel project settings.`

  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    throw new Error(errorMsg)
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMsg)
  }

  console.warn(`⚠️ ${errorMsg}`)
  console.warn('⚠️ Creating Supabase client with placeholder values. Queries will fail.')
}

const url = supabaseUrl || (process.env.NODE_ENV === 'development' ? 'https://placeholder.supabase.co' : '')
const key = supabaseAnonKey || (process.env.NODE_ENV === 'development' ? 'placeholder-key' : '')

if (!url || !key) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, key)
