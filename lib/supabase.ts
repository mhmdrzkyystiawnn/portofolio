import { createClient } from '@supabase/supabase-js'

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diset. ' +
    'Lihat .env.example untuk konfigurasi.'
  )
}

// Client publik — dipakai untuk baca data (projects, site settings).
// Aman dipakai di server maupun client component, dibatasi oleh Row Level Security.
export const supabase = createClient(url ?? '', anonKey ?? '')

// Client admin — HANYA dipakai di server (route handler / server action).
// Memakai service role key sehingga bisa bypass RLS untuk insert/update/delete.
// JANGAN pernah import file ini dari client component.
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL belum diset di environment.'
    )
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
