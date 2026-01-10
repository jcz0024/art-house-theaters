/** @type {import('next').NextConfig} */

// #region agent log
import fs from 'fs';
const logPath = '/Users/jcz0024/art-house-theaters/.cursor/debug.log';
const logEntry = JSON.stringify({
  location: 'next.config.mjs:5',
  message: 'Build-time env var check',
  data: {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    isVercelBuild: !!process.env.VERCEL
  },
  timestamp: Date.now(),
  sessionId: 'debug-session',
  runId: 'run1',
  hypothesisId: 'A'
}) + '\n';
try { fs.appendFileSync(logPath, logEntry); } catch (e) {}
// #endregion

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
