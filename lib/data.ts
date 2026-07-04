import { supabase } from './supabase'

export type ProjectRow = {
  id: string
  slug: string
  title: string
  year: string
  type: string
  status: 'live' | 'archived'
  stack: string[]
  description: string
  featured: boolean
  image: string | null
  link: string | null
  github: string | null
  challenge: string | null
  solution: string | null
  highlights: string[] | null
  created_at: string
}

// Alias supaya kompatibel dengan komponen lama yang mengharapkan
// bentuk data mirip frontmatter MDX.
export type ProjectMeta = ProjectRow
export type ProjectFull = ProjectRow

function normalize(row: Record<string, unknown>): ProjectRow {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title ?? ''),
    year: String(row.year ?? ''),
    type: String(row.type ?? ''),
    status: row.status === 'archived' ? 'archived' : 'live',
    stack: Array.isArray(row.stack) ? row.stack.map(String) : [],
    description: String(row.description ?? ''),
    featured: Boolean(row.featured),
    image: row.image ? String(row.image) : null,
    link: row.link ? String(row.link) : null,
    github: row.github ? String(row.github) : null,
    challenge: row.challenge ? String(row.challenge) : null,
    solution: row.solution ? String(row.solution) : null,
    highlights: Array.isArray(row.highlights) ? row.highlights.map(String) : [],
    created_at: String(row.created_at ?? ''),
  }
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[getAllProjects]', error.message)
    return []
  }
  return (data ?? []).map(normalize)
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null
  return normalize(data)
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from('projects').select('slug')
  if (error) return []
  return (data ?? []).map(d => String(d.slug))
}
