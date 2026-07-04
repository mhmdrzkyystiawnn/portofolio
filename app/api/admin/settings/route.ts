import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('site_settings')
    .select('photo_url, bio')
    .eq('id', 1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data ?? { photo_url: null, bio: null } })
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Payload tidak valid.' }, { status: 400 })
  }
  const b = body as Record<string, unknown>

  const payload = {
    id: 1,
    photo_url: typeof b.photo_url === 'string' && b.photo_url ? b.photo_url : null,
    bio: typeof b.bio === 'string' && b.bio ? b.bio : null,
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('site_settings')
    .upsert(payload, { onConflict: 'id' })
    .select('photo_url, bio')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}
