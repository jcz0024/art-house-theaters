import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const debug: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV || 'not set',
  }

  // Check if env vars exist (don't expose full values)
  debug.env_vars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `SET (${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...)`
      : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? `SET (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...)`
      : 'NOT SET',
  }

  // Test Supabase connection
  try {
    const { data, error, count } = await supabase
      .from('theaters')
      .select('*', { count: 'exact' })
      .limit(3)

    debug.supabase_test = {
      success: !error,
      error: error ? { message: error.message, code: error.code, details: error.details } : null,
      row_count: count,
      sample_data: data,
    }
  } catch (e: any) {
    debug.supabase_test = {
      success: false,
      error: e.message,
      stack: e.stack,
    }
  }

  return NextResponse.json(debug, { status: 200 })
}
