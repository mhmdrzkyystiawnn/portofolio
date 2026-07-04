import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { slugify } from '@/lib/slug'

type ProjectPayload = {
  title: string
  slug?: string
  year: string
  type: string
  status: 'live' | 'archived'
  stack: string[]
  description: string
  featured: boolean
  image?: string | null
  link?: string | null
  github?: string | null
  challenge?: string | null
  solution?: string | null
  highlights?: string[]
}

function validate(body: unknown): { ok: true; data: ProjectPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Payload tidak valid.' }
  const b = body as Record<string, unknown>

  if (typeof b.title !== 'string' || !b.title.trim()) {
    return { ok: false, error: 'Judul project wajib diisi.' }
  }
  if (typeof b.description !== 'string' || !b.description.trim()) {
    return { ok: false, error: 'Deskripsi project wajib diisi.' }
  }

  return {
    ok: true,
    data: {
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
    },
  }
}

export async function GET() {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('projects')
    .select('*')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const result = validate(body)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('projects')
    .insert(result.data)
    .select('*')
    .single()

  if (error) {
    const isDuplicate = error.code === '23505'
    return NextResponse.json(
      { error: isDuplicate ? 'Slug sudah dipakai project lain.' : error.message },
      { status: isDuplicate ? 409 : 500 }
    )
  }

  return NextResponse.json({ project: data }, { status: 201 })
}
