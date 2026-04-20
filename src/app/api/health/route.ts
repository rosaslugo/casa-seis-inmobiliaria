import { NextResponse } from 'next/server'
import { createSupabaseNoCacheClient } from '@/lib/supabase-server'

export async function GET() {
  const start = Date.now()
  try {
    // Siempre fresh — queremos el estado REAL de la DB en cada check
    const supabase = createSupabaseNoCacheClient()
    const { error } = await supabase.from('properties').select('id').limit(1)
    if (error) throw error
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      latency_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'disconnected', timestamp: new Date().toISOString() },
      { status: 503 }
    )
  }
}
