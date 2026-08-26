import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const SHORT_WINDOW_LIMIT = 3
const SHORT_WINDOW_DURATION = '10 m'
const DAILY_LIMIT = 5
const DAILY_DURATION = '1 d'

type Limiters = {
  shortWindow: Ratelimit
  daily: Ratelimit
}

let limiters: Limiters | null = null

function getLimiters(): Limiters | null {
  if (limiters) return limiters

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const redis = new Redis({ url, token })
  limiters = {
    shortWindow: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(SHORT_WINDOW_LIMIT, SHORT_WINDOW_DURATION),
      prefix: 'contact:short',
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_LIMIT, DAILY_DURATION),
      prefix: 'contact:daily',
    }),
  }
  return limiters
}

/**
 * Cek batas kirim per-IP. Fail-closed: kalau Redis tidak bisa dijangkau
 * atau env tidak lengkap, request ditolak — jalur email tidak boleh
 * terbuka tanpa proteksi.
 */
export async function checkContactRateLimit(
  identifier: string,
): Promise<{ allowed: boolean; retryAfterSec?: number }> {
  const lm = getLimiters()
  if (!lm) {
    console.error('[rate-limit] Env Upstash tidak lengkap — request ditolak (fail-closed)')
    return { allowed: false }
  }

  try {
    const [shortResult, dailyResult] = await Promise.all([
      lm.shortWindow.limit(identifier),
      lm.daily.limit(identifier),
    ])

    if (!shortResult.success || !dailyResult.success) {
      // Ambil reset dari window yang menolak
      const resetMs = !shortResult.success ? shortResult.reset : dailyResult.reset
      const retryAfterSec = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000))
      return { allowed: false, retryAfterSec }
    }
    return { allowed: true }
  } catch (err) {
    console.error('[rate-limit] Gagal menghubungi Upstash:', err)
    return { allowed: false }
  }
}
