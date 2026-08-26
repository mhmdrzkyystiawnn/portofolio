# Portofolio — Rizky Setiawan

Portofolio pribadi berbasis **Next.js 16**. Semua halaman dirender statis
saat build (data dari `content/*.json`, tanpa database); satu-satunya bagian
dinamis adalah `/api/contact` yang mengirim pesan form ke email via Resend,
dengan rate limit anti-spam. Konten project dikelola lewat file JSON di
`content/` — tambah/edit/hapus project cukup edit file, commit, lalu deploy.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** untuk utility, dipadukan dengan CSS custom bertema editorial
- **Framer Motion** untuk animasi
- **Resend** — pengiriman email form kontak
- **Upstash Redis** — rate limit per-IP (anti-spam)
- Konten: file JSON di `content/`, dibaca di build time

## 1. Install & jalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

## 2. Kelola konten

Semua data ada di folder `content/`:

```
content/
├── projects/
│   ├── cuaca-realtime.json     # satu file = satu project
│   ├── portfolio-v2.json
│   └── ...
└── settings.json               # foto profil & bio
```

### Menambah project baru

1. Duplikat salah satu file JSON di `content/projects/`, ganti nama filenya.
2. Isi field sesuai tabel di bawah — `slug` harus unik karena dipakai di URL `/projects/<slug>`.
3. Letakkan gambar screenshot di `public/images/projects/` lalu tulis path-nya di field `image`.
4. Commit → deploy. Halaman detail otomatis tergenerate (`generateStaticParams`).

### Struktur data project

| field | tipe | keterangan |
|---|---|---|
| id | string | bebas, cukup unik (dipakai sebagai key) |
| slug | text, unik | dipakai di URL `/projects/[slug]` |
| title, description | text | |
| year, type, status | text | status: `live` \| `archived` |
| stack, highlights | text[] | |
| featured | boolean | tampil di bagian "pilihan utama" |
| image, link, github | text (boleh null) | image = path lokal `/images/projects/...` |
| challenge, solution | text (boleh null) | detail di halaman project |
| created_at | ISO date | untuk sorting |

Urutan tampil: tahun terbaru dulu, lalu `created_at` terbaru.

### Foto profil & bio

Edit `content/settings.json`:

```json
{
  "photo_url": "/images/profile/avatar.jpg",
  "bio": "..."
}
```

Letakkan fotonya di `public/images/profile/`.

## 3. Form kontak & environment variables

Form di `/contact` mengirim email via [Resend](https://resend.com), dengan
proteksi spam berlapis: honeypot, rate limit per-IP (`3 pesan/10 menit`,
`5 pesan/hari` via Upstash Redis, fail-closed), dan validasi server-side.

Salin `.env.example` ke `.env.local` dan isi:

```bash
cp .env.example .env.local
```

| variable | sumber |
|---|---|
| `RESEND_API_KEY` | Resend → API Keys |
| `CONTACT_TO_EMAIL` | email tujuan penerima pesan |
| `CONTACT_FROM_EMAIL` | opsional; default `onboarding@resend.dev` |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Upstash Console (atau otomatis via Vercel Marketplace) |

> Tanpa domain terverifikasi di Resend, email hanya bisa dikirim ke alamat
> yang dipakai daftar akun Resend — jadi daftar pakai email tujuanmu.

## 4. Build & deploy

```bash
npm run build    # verifikasi produksi
npm run start    # preview hasil build
```

Deploy ke Vercel: import repo, lalu set semua env vars dari tabel di atas di
**Project Settings → Environment Variables**. Halaman tetap dirender statis
saat build; hanya `/api/contact` yang jalan sebagai serverless function.

## Catatan struktur project

```
app/
  page.tsx                 → homepage (hero + foto, preview project, about teaser)
  about/                   → halaman tentang
  projects/                → daftar & detail project (baca dari content/)
  contact/                 → halaman kontak + form kirim email
  api/contact/route.ts     → serverless function: honeypot → rate limit → Resend
components/
  sections/                → HeroSection, HomeProjectsPreview, HomeAboutTeaser
  ui/                      → Navbar, CustomCursor
lib/
  data.ts                  → baca content/projects/*.json + tipe data
  settings.ts              → baca content/settings.json
  contact-validation.ts    → validasi payload form (tanpa dependency)
  rate-limit.ts            → Upstash sliding window per-IP (fail-closed)
content/
  projects/*.json          → data project
  settings.json            → foto profil & bio
public/
  images/                  → screenshot project & foto profil
  fonts/                   → font lokal
```
