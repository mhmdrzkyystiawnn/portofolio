import { getAllProjects } from '@/lib/data'
import ProjectsListClient from './ProjectsListClient'

export const revalidate = 0

export const metadata = {
  title: 'Project',
  description: 'Hal-hal yang pernah kubangun — dari yang serius sampai yang iseng.',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  return <ProjectsListClient projects={projects} />
}
