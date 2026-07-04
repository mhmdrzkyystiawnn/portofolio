'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="admin">
      <div className="container">
        <header className="admin__header">
          <nav className="admin__nav">
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
              dashboard
            </Link>
            <Link href="/admin/settings" className={pathname === '/admin/settings' ? 'active' : ''}>
              foto & bio
            </Link>
            <Link href="/" target="_blank">lihat situs →</Link>
          </nav>
          <button className="admin__logout-btn" onClick={handleLogout}>
            keluar
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
