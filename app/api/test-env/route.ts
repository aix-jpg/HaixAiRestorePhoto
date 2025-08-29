import { NextResponse } from 'next/server'

export async function GET() {
  const replicateToken = process.env.REPLICATE_API_TOKEN
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  return NextResponse.json({
    replicateToken: replicateToken ? 'Found' : 'Not found',
    supabaseUrl: supabaseUrl ? 'Found' : 'Not found',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('REPLICATE') || key.includes('SUPABASE')),
    nodeEnv: process.env.NODE_ENV
  })
}
