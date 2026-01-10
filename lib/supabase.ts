import { createClient } from '@supabase/supabase-js'

// #region agent log
if (typeof window === 'undefined') { fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:3',message:'Checking env vars before initialization',data:{hasSupabaseUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasSupabaseKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,supabaseUrlLength:process.env.NEXT_PUBLIC_SUPABASE_URL?.length||0,supabaseKeyLength:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length||0,nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV||'not set'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{}); }
// #endregion

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars: string[] = []
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}. Please set them in your Vercel project settings.`
  
  // #region agent log
  if (typeof window === 'undefined') { fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:12',message:'Missing environment variables detected',data:{missingVars,supabaseUrl:!!supabaseUrl,supabaseKey:!!supabaseAnonKey,nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV||'not set',isVercel:!!process.env.VERCEL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{}); }
  // #endregion
  
  // In Vercel builds, throw error to fail fast and prevent deployment
  // Check VERCEL first as it's the most reliable indicator of Vercel environment
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    throw new Error(errorMsg)
  }
  
  // In production builds (but not Vercel), also fail
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMsg)
  }
  
  // In development, log warning but don't throw to allow local development
  console.warn(`⚠️ ${errorMsg}`)
  console.warn('⚠️ Creating Supabase client with placeholder values. Queries will fail.')
}

// #region agent log
if (typeof window === 'undefined') { fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:27',message:'Creating Supabase client',data:{supabaseUrl:supabaseUrl?`${supabaseUrl.substring(0,30)}...`:null,supabaseKey:supabaseAnonKey?`${supabaseAnonKey.substring(0,20)}...`:null,urlIsUndefined:supabaseUrl===undefined,keyIsUndefined:supabaseAnonKey===undefined,hasValidVars:!!(supabaseUrl && supabaseAnonKey)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{}); }
// #endregion

let supabase: ReturnType<typeof createClient>;
try {
  // Create client - use fallback only in development if env vars are missing
  const url = supabaseUrl || (process.env.NODE_ENV === 'development' ? 'https://placeholder.supabase.co' : '')
  const key = supabaseAnonKey || (process.env.NODE_ENV === 'development' ? 'placeholder-key' : '')
  
  if (!url || !key) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  supabase = createClient(url, key);
  // #region agent log
  if (typeof window === 'undefined') { fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:38',message:'Supabase client created successfully',data:{success:true,hasValidEnvVars:!!(supabaseUrl && supabaseAnonKey)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); }
  // #endregion
} catch (error: any) {
  // #region agent log
  if (typeof window === 'undefined') { fetch('http://127.0.0.1:7242/ingest/7b0b28d2-c14e-4ba4-8529-cf4e35d8452b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:42',message:'Supabase client creation failed',data:{success:false,error:error?.message||String(error),errorType:error?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{}); }
  // #endregion
  throw error;
}

export { supabase }
