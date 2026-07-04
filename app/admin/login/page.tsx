'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal login.')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan jaringan.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="label" style={{ marginBottom: '0.5rem', color: 'var(--color-ink-400)' }}>
          admin
        </p>
        <h1 className="display" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          masuk ke panel
        </h1>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && <p className="admin-form__error">{error}</p>}

          <div className="admin-field">
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'memproses…' : 'masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
