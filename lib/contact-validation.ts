export type ContactPayload = {
  name: string
  email: string
  message: string
  honeypot?: string
}

export type ContactInput =
  | { ok: true; data: { name: string; email: string; message: string } }
  | { ok: false }

const NAME_MAX = 100
const EMAIL_MAX = 200
const MESSAGE_MIN = 10
const MESSAGE_MAX = 2000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateContactInput(
  body: unknown,
): { ok: true; data: { name: string; email: string; message: string } } | { ok: false } {
  if (typeof body !== 'object' || body === null) return { ok: false }
  const raw = body as Record<string, unknown>

  // Honeypot terisi = bot — ditolak diam-diam (route yang memutuskan responsnya)
  const honeypot = cleanString(raw.honeypot)

  const name = cleanString(raw.name)
  const email = cleanString(raw.email)
  const message = cleanString(raw.message).replace(/\r\n/g, '\n')

  if (honeypot.length > 0) return { ok: false }
  if (!name || name.length > NAME_MAX) return { ok: false }
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) return { ok: false }
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) return { ok: false }

  return { ok: true, data: { name, email, message } }
}

export function isHoneypotFilled(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false
  return cleanString((body as Record<string, unknown>).honeypot).length > 0
}
