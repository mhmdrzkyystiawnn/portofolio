# Todo: Form Kontak → Email (Resend + Anti-Spam)

## Phase 0 — Setup akun (manual, oleh pemilik)
- [ ] 0.1 Akun Resend + API key (daftar pakai gmail tujuan)
- [ ] 0.2 Upstash Redis via Vercel Marketplace

## Phase 1 — Fondasi backend
- [ ] 1. Hapus `output: 'export'`, verifikasi semua halaman tetap SSG
- [ ] 2. `lib/contact-validation.ts` — validasi manual, tanpa dep baru
- [ ] 3. `lib/rate-limit.ts` — Upstash sliding window 3/10mnt + 5/hari per IP
- [ ] 4. `app/api/contact/route.ts` — honeypot → rate limit → validasi → Resend

## Checkpoint 1
- [ ] Build sukses, halaman statis tak berubah
- [ ] Curl test: 200 / 400 / 429 / 405

## Phase 2 — Frontend
- [ ] 5. Wire `handleSubmit` + honeypot + mapping error 429/400/500

## Phase 3 — Verifikasi & dokumentasi
- [x] 6. E2E lokal: email nyata masuk (x3) + limit 429 terpicu (`Retry-After` ada)
- [ ] 7. Deploy Vercel + env vars (RESEND/CONTACT/UPSTASH) + domain subdomain

## Keputusan (final)
- [x] Hapus `output: 'export'` — disetujui
- [x] Turnstile: nanti (kontrak API tetap siapkan slot token)
- [x] Email tujuan: mhmdddrzkyyyy@gmail.com
