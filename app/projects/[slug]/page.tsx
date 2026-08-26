import { getProjectBySlug, getAllProjects } from '@/lib/data'
import ProjectDetailClient from './ProjectDetailClient'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  return <ProjectDetailClient project={project} />
}