'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ProjectRow } from '@/lib/data'

export default function AdminDashboard() {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadProjects() {
    setError(null)
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Gagal memuat project.')
      return
    }
    setProjects(data.projects)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus project "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Gagal menghapus project.')
      return
    }
    setProjects(prev => prev?.filter(p => p.id !== id) ?? null)
  }

  return (
    <section className="admin__section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 className="admin__section-title">project</h2>
        <Link href="/admin/projects/new" className="btn">+ tambah project</Link>
      </div>

      {error && <p className="admin-form__error">{error}</p>}

      {!projects && !error && (
        <p className="label" style={{ color: 'var(--color-ink-500)' }}>memuat…</p>
      )}

      {projects && projects.length === 0 && (
        <div className="admin-empty">Belum ada project. Klik &ldquo;tambah project&rdquo; untuk mulai.</div>
      )}

      {projects && projects.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>judul</th>
                <th>tahun</th>
                <th>tipe</th>
                <th>status</th>
                <th>featured</th>
                <th>aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.year}</td>
                  <td>{p.type}</td>
                  <td>{p.status === 'live' ? 'live' : 'archived'}</td>
                  <td>{p.featured ? 'ya' : '—'}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Link href={`/admin/projects/${p.id}/edit`} className="admin-table__link">
                        edit
                      </Link>
                      <button className="admin-table__delete" onClick={() => handleDelete(p.id, p.title)}>
                        hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
