'use client'

import { useEffect, useState } from 'react'
import ImageUploadField from '@/components/admin/ImageUploadField'

export default function AdminSettingsPage() {
  const [photoUrl, setPhotoUrl] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setPhotoUrl(data.settings?.photo_url ?? '')
        setBio(data.settings?.bio ?? '')
      })
      .catch(() => setError('Gagal memuat pengaturan.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_url: photoUrl, bio }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan.')
        return
      }
      setSuccess(true)
    } catch {
      setError('Terjadi kesalahan jaringan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="label" style={{ color: 'var(--color-ink-500)' }}>memuat…</p>
  }

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">foto & bio</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <p className="admin-form__error">{error}</p>}
        {success && <p className="admin-form__success">Tersimpan.</p>}

        <ImageUploadField
          label="foto profil (tampil di halaman depan)"
          bucket="profile"
          value={photoUrl}
          onChange={setPhotoUrl}
        />

        <div className="admin-field">
          <label htmlFor="bio">bio singkat (opsional, cadangan untuk pemakaian lain)</label>
          <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} />
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'menyimpan…' : 'simpan'}
          </button>
        </div>
      </form>
    </section>
  )
}
