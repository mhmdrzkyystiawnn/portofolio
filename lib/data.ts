import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects')

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
  image?: string | null
  link?: string | null
  github?: string | null
  challenge?: string | null
  solution?: string | null
  highlights?: string[]
  created_at: string
}

export type ProjectMeta = Pick<
  ProjectRow,
  'slug' | 'title' | 'year' | 'type' | 'status' | 'featured' | 'stack' | 'description' | 'image' | 'link' | 'github'
>

export type ProjectFull = ProjectMeta & {
  challenge?: string | null
  solution?: string | null
  highlights?: string[]
  link?: string | null
  github?: string | null
}

function readProjectFile(filename: string): ProjectRow | null {
  const filepath = path.join(PROJECTS_DIR, filename)
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(content) as ProjectRow
  } catch (err) {
    console.error(`[data.ts] Gagal membaca ${filepath}:`, err)
    return null
  }
}

function getAllProjectFiles(): string[] {
  try {
    return fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'))
  } catch (err) {
    console.error(`[data.ts] Gagal membaca direktori ${PROJECTS_DIR}:`, err)
    return []
  }
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  const files = getAllProjectFiles()
  const projects = files
    .map(readProjectFile)
    .filter((p): p is ProjectRow => p !== null)
    .sort((a, b) => {
      const yearDiff = Number(b.year) - Number(a.year)
      if (yearDiff !== 0) return yearDiff
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  return projects
}

export async function getProjectBySlug(slug: string): Promise<ProjectFull | null> {
  const projects = await getAllProjects()
  const project = projects.find(p => p.slug === slug)
  return project ?? null
}

export async function getProjectMetaBySlug(slug: string): Promise<ProjectMeta | null> {
  const project = await getProjectBySlug(slug)
  if (!project) return null
  const { challenge, solution, highlights, ...meta } = project
  return meta
}