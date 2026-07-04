import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { slugify } from '@/lib/slug'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.from('projects').select('*').eq('id', id).maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Project tidak ditemukan.' }, { status: 404 })
  return NextResponse.json({ project: data })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Payload tidak valid.' }, { status: 400 })
  }
  const b = body as Record<string, unknown>

  if (typeof b.title !== 'string' || !b.title.trim()) {
    return NextResponse.json({ error: 'Judul project wajib diisi.' }, { status: 400 })
  }
  if (typeof b.description !== 'string' || !b.description.trim()) {
    return NextResponse.json({ error: 'Deskripsi project wajib diisi.' }, { status: 400 })
  }

  const payload = {
    title: b.title as string,
    slug: typeof b.slug === 'string' && b.slug.trim() ? slugify(b.slug) : slugify(b.title as string),
    year: typeof b.year === 'string' ? b.year : String(b.year ?? new Date().getFullYear()),
    type: typeof b.type === 'string' ? b.type : 'web app',
    status: b.status === 'archived' ? 'archived' : 'live',
    stack: Array.isArray(b.stack) ? b.stack.map(String).filter(Boolean) : [],
    description: b.description as string,
    featured: Boolean(b.featured),
    image: typeof b.image === 'string' && b.image ? b.image : null,
    link: typeof b.link === 'string' && b.link ? b.link : null,
    github: typeof b.github === 'string' && b.github ? b.github : null,
    challenge: typeof b.challenge === 'string' && b.challenge ? b.challenge : null,
    solution: typeof b.solution === 'string' && b.solution ? b.solution : null,
    highlights: Array.isArray(b.highlights) ? b.highlights.map(String).filter(Boolean) : [],
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    const isDuplicate = error.code === '23505'
    return NextResponse.json(
      { error: isDuplicate ? 'Slug sudah dipakai project lain.' : error.message },
      { status: isDuplicate ? 409 : 500 }
    )
  }

  return NextResponse.json({ project: data })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('projects').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
