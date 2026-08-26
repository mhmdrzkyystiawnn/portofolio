import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { isHoneypotFilled, validateContactInput } from '@/lib/contact-validation'
import { checkContactRateLimit } from '@/lib/rate-limit'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, code: 'invalid' },
      { status: 400 },
    )
  }

  // Honeypot terisi = bot → balas sukses palsu tanpa menyentuh Redis/email
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ ok: true })
  }

  const ip = getClientIp(request)
  const rateLimit = await checkContactRateLimit(ip)
  if (!rateLimit.allowed) {
    const headers: Record<string, string> = {}
    if (rateLimit.retryAfterSec) headers['Retry-After'] = String(rateLimit.retryAfterSec)
    return NextResponse.json(
      { ok: false, code: 'rate_limited' },
      { status: 429, headers },
    )
  }

  const parsed = validateContactInput(body)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!toEmail || !apiKey) {
    console.error('[contact] Env tidak lengkap: CONTACT_TO_EMAIL / RESEND_API_KEY hilang')
    return NextResponse.json({ ok: false, code: 'server_error' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const { name, email, message } = parsed.data

  const html = `
    <p><strong>Nama:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <hr />
    <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
  `

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Portofolio <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `Pesan baru dari ${name} — portofolio`,
      html,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return NextResponse.json({ ok: false, code: 'server_error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Gagal mengirim email:', err)
    return NextResponse.json({ ok: false, code: 'server_error' }, { status: 500 })
  }
}
