// Server component — baca data di sini, pass ke client component
import { getAllProjects } from '@/lib/data'
import { getSiteSettings } from '@/lib/settings'
import HeroSection from '@/components/sections/HeroSection'
import HomeProjectsPreview from '@/components/sections/HomeProjectsPreview'
import HomeAboutTeaser from '@/components/sections/HomeAboutTeaser'

export const revalidate = 0

export default async function HomePage() {
  // Data dibaca di server — tidak menyentuh browser
  const [projects, settings] = await Promise.all([
    getAllProjects(),
    getSiteSettings(),
  ])

  return (
    <>
      <HeroSection photoUrl={settings.photo_url} />
      <HomeProjectsPreview projects={projects.slice(0, 3)} />
      <HomeAboutTeaser />
  
    </>
  )
}