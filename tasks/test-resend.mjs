// Tes kirim langsung via Resend — jalankan: node --env-file=.env.local tasks/test-resend.mjs
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: process.env.CONTACT_FROM_EMAIL,
  to: [process.env.CONTACT_TO_EMAIL],
  subject: 'Tes integrasi form kontak',
  html: '<p>Kalau email ini masuk, integrasi <strong>Resend</strong> sudah jalan.</p>',
})

if (error) {
  console.error('GAGAL:', JSON.stringify(error, null, 2))
  process.exit(1)
}
console.log('TERKIRIM, id:', data.id)
