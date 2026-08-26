import fs from 'fs'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'content', 'settings.json')

export type SiteSettings = {
  photo_url: string | null
  bio: string | null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const content = fs.readFileSync(SETTINGS_FILE, 'utf-8')
    return JSON.parse(content) as SiteSettings
  } catch (err) {
    console.error(`[settings.ts] Gagal membaca ${SETTINGS_FILE}:`, err)
    return { photo_url: null, bio: null }
  }
}