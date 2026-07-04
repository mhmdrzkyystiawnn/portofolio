import { supabase } from './supabase'

export type SiteSettings = {
  photo_url: string | null
  bio: string | null
}

const DEFAULTS: SiteSettings = { photo_url: null, bio: null }

// Baris tunggal (id = 1) yang menyimpan konfigurasi situs: foto profil & bio singkat.
export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('photo_url, bio')
    .eq('id', 1)
    .maybeSingle()

  if (error || !data) return DEFAULTS
  return {
    photo_url: data.photo_url ?? null,
    bio: data.bio ?? null,
  }
}
