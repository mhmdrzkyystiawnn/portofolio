// Session admin sederhana — satu password (ADMIN_PASSWORD), token ditandatangani
// dengan HMAC-SHA256 (SESSION_SECRET) dan disimpan di cookie httpOnly.
// Memakai Web Crypto API supaya jalan di Node.js maupun Edge runtime (middleware).

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 hari, dalam detik

const encoder = new TextEncoder()

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET belum diset di environment.')

  const expires = Date.now() + SESSION_MAX_AGE * 1000
  const payload = `admin.${expires}`
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return `${payload}.${toHex(sig)}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expiresStr, sigHex] = parts
  if (role !== 'admin') return false

  const expires = Number(expiresStr)
  if (!expires || Number.isNaN(expires) || Date.now() > expires) return false

  const payload = `${role}.${expiresStr}`
  const key = await getKey(secret)
  const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return timingSafeEqual(toHex(expectedSig), sigHex)
}
