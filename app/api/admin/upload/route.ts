import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

// bucket: 'project-images' atau 'profile' — dikirim lewat form field "bucket"
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Form tidak valid.' }, { status: 400 })

  const file = form.get('file')
  const bucket = (form.get('bucket') as string) || 'project-images'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Format file harus PNG, JPG, WEBP, atau GIF.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ukuran file maksimal 5MB.' }, { status: 400 })
  }
  if (!['project-images', 'profile'].includes(bucket)) {
    return NextResponse.json({ error: 'Bucket tidak valid.' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const ext = file.name.split('.').pop() || 'png'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(fileName)
  return NextResponse.json({ url: data.publicUrl })
}
