import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const password = body?.password

  if (typeof password !== 'string' || !password) {
    return NextResponse.json({ error: 'Password wajib diisi.' }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD belum diset di server.' },
      { status: 500 }
    )
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Password salah.' }, { status: 401 })
  }

  const token = await createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
