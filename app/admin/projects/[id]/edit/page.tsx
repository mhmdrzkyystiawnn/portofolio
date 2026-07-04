import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import ProjectForm from '@/components/admin/ProjectForm'
import type { ProjectRow } from '@/lib/data'

export const revalidate = 0

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = getSupabaseAdmin()
  const { data } = await admin.from('projects').select('*').eq('id', id).maybeSingle()

  if (!data) notFound()

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">edit project</h2>
      <ProjectForm initial={data as ProjectRow} projectId={id} />
    </section>
  )
}
