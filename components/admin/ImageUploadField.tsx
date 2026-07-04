'use client'

import { useState } from 'react'

type Props = {
  value: string
  onChange: (url: string) => void
  bucket: 'project-images' | 'profile'
  label: string
}

export default function ImageUploadField({ value, onChange, bucket, label }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const form = new FormData()
    form.append('file', file)
    form.append('bucket', bucket)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal mengunggah gambar.')
        return
      }
      onChange(data.url)
    } catch {
      setError('Terjadi kesalahan jaringan saat mengunggah.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-image-upload">
        <div className="admin-image-upload__preview">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" />
          ) : (
            <span className="label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', textAlign: 'center', padding: '0.5rem' }}>
              belum ada
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFile} disabled={uploading} />
          {uploading && <span className="admin-field__hint">mengunggah…</span>}
          {error && <span className="admin-field__hint" style={{ color: 'var(--color-crimson-light)' }}>{error}</span>}
        </div>
      </div>
    </div>
  )
}
