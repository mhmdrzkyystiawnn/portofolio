# Implementation Plan: Form Kontak → Email (Resend + Anti-Spam)

## Overview

Menghubungkan form kontak `/contact` yang sudah ada (UI lengkap, submit masih
simulasi di `app/contact/page.tsx:69-87`) ke pengiriman email nyata ke inbox
pemilik situs, dengan lapisan anti-spam berlapis. Target deploy: Vercel.

## Architecture Decisions

### D1: Hilangkan `output: 'export'` (perlu persetujuan)

Dengan pilihan "function sendiri + Vercel", cara paling bersih adalah deploy
sebagai Next.js standar di Vercel:

- **Semua halaman tetap 100% statis** — data tetap dibaca dari `content/*.json`
  saat build (`getAllProjects` dll. jalan saat SSG), tidak ada database.
  Yang berubah cuma: endpoint `/api/contact` jalan sebagai Vercel Function.
- Dengan `output: 'export'`, Route Handler Next.js **tidak bisa dipakai**
  (Next me-skip semua fitur server) — kita terpaksa bikin project kedua khusus
  API + urus CORS. Tidak sepadan untuk satu endpoint.
- Keuntungan inti refactor (buang Supabase/admin/DB) tetap utuh.

### D2: Stack pengiriman & proteksi

| Lapisan | Teknologi | Biaya |
|---|---|---|
| Email delivery | Resend | gratis 3.000 email/bln, 100/hari |
| Rate limit per-IP | Upstash Redis + `@upstash/ratelimit` | free tier |
| Bot check | Cloudflare Turnstile (opsional — lihat Open Questions) | gratis |
| Honeypot | field tersembunyi di form | — |
| Validasi server | manual, tanpa dependency baru | — |

### D3: Rate limit fail-closed

Kalau Upstash tidak reachable, request **ditolak** (bukan diteruskan).
Tujuan utamanya mencegah spam — lebih baik form gagal sementara daripada
jalur kirim terbuka tanpa limit.

### D4: Limit yang diusulkan

- 3 email / 10 menit / IP, dan 5 email / hari / IP (sliding window).
- Pesan 429 dikembalikan dengan pesan ramah di UI.

## Alur Request

```
Browser (form)                       Vercel Function
┌──────────────────────────┐   POST   ┌─────────────────────────────┐
│ honeypot kosong?         │ ───────► │ 1. honeypot terisi? → 200 ✻ │
│ Turnstile token (ops.)   │          │ 2. rate limit per-IP → 429  │
│ validasi panjang/format  │          │ 3. verifikasi Turnstile     │
│                          │          │ 4. validasi input → 400     │
│                          │          │ 5. Resend send → 500 jika   │
│                          │          │    gagal                    │
└──────────────────────────┘ ◄─────── └─────────────────────────────┘
                                                        │
                                              reply_to = email pengirim
                                              to = CONTACT_TO_EMAIL
```
✻ honeypot terisi = bot → balas 200 palsu agar bot tidak belajar.

## Task List

### Phase 0: Setup akun (dikerjakan manual oleh kamu)

- [ ] Task 0.1: Buat akun Resend + API key. Catatan: tanpa domain
      terverifikasi, Resend hanya bisa kirim **ke email akun** — daftar
      pakai `mhmdddrzkyyyy@gmail.com` supaya test jalan. Verifikasi domain
      custom disarankan untuk produksi.
- [ ] Task 0.2: Buat database Upstash Redis (paling gampang lewat
      **Vercel Marketplace** → integrasi otomatis isi env var).

**Estimasi:** ±30 menit, mayoritas klik-klik.

### Phase 1: Fondasi backend

- [ ] **Task 1:** Hilangkan `output: 'export'` dari `next.config.ts`.
      - Acceptance: `npm run build` sukses; tabel route menunjukkan semua
        halaman tetap `(Static)`/`(SSG)` sama seperti sebelumnya; HTML
        `/projects/cuaca-realtime` masih berisi data.
      - Files: `next.config.ts`. **Scope: XS**

- [ ] **Task 2:** Modul validasi `lib/contact-validation.ts` — tipe payload,
      parser + validator manual (tanpa dep baru): nama 1–100 char, email
      format + ≤200 char, pesan 10–2000 char (selaras char-count UI),
      honeypot string opsional.
      - Acceptance: return `{ ok: true, data }` atau `{ ok: false, errors }`;
        input kosong/kelebihan panjang ditolak.
      - Files: `lib/contact-validation.ts`. **Scope: S**

- [ ] **Task 3:** Rate limiter `lib/rate-limit.ts` (`@upstash/ratelimit`,
      `@upstash/redis`) — dua window: 3/10 mnt & 5/hari per IP;
      fail-closed (D3) + log error.
      - Acceptance: request ke-4 dalam 10 menit ditolak; env hilang →
        semua request ditolak dengan log jelas.
      - Files: `lib/rate-limit.ts`, `package.json`. **Scope: S**

- [ ] **Task 4:** Route handler `app/api/contact/route.ts` sesuai alur di
      atas. Template email HTML inline sederhana; header `reply_to` = email
      pengirim; `to` dari `CONTACT_TO_EMAIL`; error response generik
      (tidak membocorkan detail internal); hanya POST.
      - Acceptance: curl POST valid → 200 & email masuk; payload invalid →
        400; spam cepat → 429; GET → 405.
      - Files: `app/api/contact/route.ts`, `.env.example` (daftar var baru).
      - Dependencies: Task 2, 3. **Scope: M**

### Checkpoint 1
- [ ] Build sukses, semua halaman tetap statis
- [ ] Curl test: happy path + 400 + 429 + 405 sesuai acceptance Task 4

### Phase 2: Frontend

- [ ] **Task 5:** Wire `handleSubmit` di `app/contact/page.tsx`: fetch JSON
      ke `/api/contact`, mapping status (200 → `sent`, 400/429/500 → pesan
      spesifik termasuk info cooldown untuk 429), field honeypot
      tersembunyi (CSS clip + `tabIndex={-1}` + `autoComplete="off"`),
      disable submit saat `sending`.
      - Acceptance: kirim sukses → kartu sukses muncul; matikan function/
        mock error → state `error` tampil; honeypot tidak terlihat user &
        screen reader.
      - Dependencies: Task 4. **Scope: M** (1–2 file)

### Phase 3: Verifikasi & dokumentasi

- [ ] **Task 6:** E2E test lokal (`npm run dev`): kirim email nyata sekali,
      tembak limit sampai 429, cek pesan errornya.
- [ ] **Task 7:** Deploy preview Vercel + set env vars
      (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`,
      `UPSTASH_REDIS_REST_TOKEN`, + `TURNSTILE_SECRET_KEY` jika aktif);
      test form di URL preview; update README (bagian env vars & deploy —
      bukan lagi pure static export).
      - Acceptance: form jalan di preview Vercel, email masuk, README akurat.

**Estimasi total kode: ±3–4 jam** (+30 menit setup akun).

## Risks and Mitigations

| Risk | Impact | Mitigasi |
|------|--------|----------|
| Tanpa domain terverifikasi, Resend membatasi penerima | Low | Daftar pakai gmail tujuan untuk test; verifikasi domain untuk produksi |
| Spammer panggil function langsung (lewati UI) | Medium | Validasi + rate limit + honeypot semua di server-side; Turnstile sebagai layer ekstra |
| `x-forwarded-for` dipalsukan | Low | Di Vercel, header ini diset platform di edge — tidak bisa dioverride klien |
| Upstash cold start menambah latensi | Low | Free tier cukup untuk trafik portofolio; latency <100ms typical |
| Kehilangan kemampuan deploy ke hosting statis lain | Low | Keputusan D1 sadar-mengorbankan ini; revert mudah kalau nanti berubah pikiran |

## Open Questions (perlu jawaban sebelum implementasi)

1. **Setuju hapus `output: 'export'`?** (rekomendasi: ya — halaman tetap
   statis penuh, hanya /api/contact yang dinamis)
2. **Turnstile diikutkan sekarang atau nanti?** Rate limit + honeypot sudah
   cukup untuk memulai; Turnstile bisa ditambah belakangan tanpa ubah kontrak API.
3. **Email tujuan** konfirmasi: `mhmdddrzkyyyy@gmail.com` (yang sudah ada di
   halaman contact)?
