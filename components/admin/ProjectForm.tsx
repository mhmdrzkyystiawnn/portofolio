'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploadField from './ImageUploadField'
import type { ProjectRow } from '@/lib/data'

export type ProjectFormValues = {
  title: string
  slug: string
  year: string
  type: string
  status: 'live' | 'archived'
  stack: string
  description: string
  featured: boolean
  image: string
  link: string
  github: string
  challenge: string
  solution: string
  highlights: string
}

function toFormValues(p?: ProjectRow | null): ProjectFormValues {
  return {
    title: p?.title ?? '',
    slug: p?.slug ?? '',
    year: p?.year ?? String(new Date().getFullYear()),
    type: p?.type ?? 'web app',
    status: p?.status ?? 'live',
    stack: p?.stack?.join(', ') ?? '',
    description: p?.description ?? '',
    featured: p?.featured ?? false,
    image: p?.image ?? '',
    link: p?.link ?? '',
    github: p?.github ?? '',
    challenge: p?.challenge ?? '',
    solution: p?.solution ?? '',
    highlights: p?.highlights?.join('\n') ?? '',
  }
}

export default function ProjectForm({
  initial,
  projectId,
}: {
  initial?: ProjectRow | null
  projectId?: string
}) {
  const router = useRouter()
  const [values, setValues] = useState<ProjectFormValues>(toFormValues(initial))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(projectId)

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues(v => ({ ...v, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: values.title,
      slug: values.slug,
      year: values.year,
      type: values.type,
      status: values.status,
      stack: values.stack.split(',').map(s => s.trim()).filter(Boolean),
      description: values.description,
      featured: values.featured,
      image: values.image || null,
      link: values.link || null,
      github: values.github || null,
      challenge: values.challenge || null,
      solution: values.solution || null,
      highlights: values.highlights.split('\n').map(s => s.trim()).filter(Boolean),
    }

    try {
      const res = await fetch(isEdit ? `/api/admin/projects/${projectId}` : '/api/admin/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan project.')
        setSaving(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan jaringan.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && <p className="admin-form__error">{error}</p>}

      <div className="admin-field">
        <label htmlFor="title">judul project *</label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={e => update('title', e.target.value)}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="slug">slug (kosongkan untuk auto dari judul)</label>
        <input
          id="slug"
          type="text"
          value={values.slug}
          onChange={e => update('slug', e.target.value)}
          placeholder="mis. cuaca-realtime"
        />
      </div>

      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor="year">tahun</label>
          <input id="year" type="text" value={values.year} onChange={e => update('year', e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="type">tipe</label>
          <input id="type" type="text" value={values.type} onChange={e => update('type', e.target.value)} placeholder="web app, tool, dll" />
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor="status">status</label>
          <select id="status" value={values.status} onChange={e => update('status', e.target.value as 'live' | 'archived')}>
            <option value="live">live</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div className="admin-field admin-field--checkbox">
          <input
            id="featured"
            type="checkbox"
            checked={values.featured}
            onChange={e => update('featured', e.target.checked)}
          />
          <label htmlFor="featured" style={{ textTransform: 'none' }}>tampilkan sebagai featured</label>
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="stack">stack (pisahkan dengan koma)</label>
        <input
          id="stack"
          type="text"
          value={values.stack}
          onChange={e => update('stack', e.target.value)}
          placeholder="Next.js, TypeScript, Supabase"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="description">deskripsi singkat *</label>
        <textarea
          id="description"
          value={values.description}
          onChange={e => update('description', e.target.value)}
          required
        />
      </div>

      <ImageUploadField
        label="screenshot project"
        bucket="project-images"
        value={values.image}
        onChange={url => update('image', url)}
      />

      <div className="admin-form__row">
        <div className="admin-field">
          <label htmlFor="link">link live (opsional)</label>
          <input id="link" type="url" value={values.link} onChange={e => update('link', e.target.value)} placeholder="https://…" />
        </div>
        <div className="admin-field">
          <label htmlFor="github">link github (opsional)</label>
          <input id="github" type="url" value={values.github} onChange={e => update('github', e.target.value)} placeholder="https://github.com/…" />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="challenge">tantangan (opsional)</label>
        <textarea id="challenge" value={values.challenge} onChange={e => update('challenge', e.target.value)} />
      </div>

      <div className="admin-field">
        <label htmlFor="solution">solusi (opsional)</label>
        <textarea id="solution" value={values.solution} onChange={e => update('solution', e.target.value)} />
      </div>

      <div className="admin-field">
        <label htmlFor="highlights">highlights (satu baris satu poin)</label>
        <textarea
          id="highlights"
          value={values.highlights}
          onChange={e => update('highlights', e.target.value)}
          placeholder={'Integrasi API real-time\nResponsive di semua device'}
        />
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'menyimpan…' : isEdit ? 'simpan perubahan' : 'tambah project'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.push('/admin')}>
          batal
        </button>
      </div>
    </form>
  )
}
