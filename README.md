# Portofolio — Rizky Setiawan

Portofolio pribadi berbasis Next.js 16 (App Router) + Supabase. Fokus pada profil
dan project web — tidak ada konten puisi. Project bisa ditambah/diedit/dihapus,
dan foto profil bisa diganti, semua lewat panel admin (`/admin`) tanpa perlu
sentuh kode.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** untuk utility, dipadukan dengan CSS custom bertema editorial
- **Framer Motion** untuk animasi
- **Supabase** — Postgres (data project & settings) + Storage (gambar) sebagai backend
- Auth admin sederhana: satu password, session cookie ditandatangani (tanpa dependency auth eksternal)

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → jalankan isi `supabase/schema.sql` (bikin tabel `projects`,
   `site_settings`, RLS read-only publik, dan storage bucket `project-images` & `profile`).
3. (Opsional, tapi disarankan) Jalankan `supabase/seed.sql` untuk mengisi ulang
   4 project lama (Cuaca, Jadwal Shalat, LibraryConnect, One Spirit) yang tadinya
   ada di `content/projects/*.mdx`. Gambar masih menunjuk ke `/projects/*.png`
   (file statis di `public/`) — bisa diganti kapan saja lewat panel admin.
4. Ambil kredensial di **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, jangan expose ke browser)

## 2. Environment variables

Salin `.env.example` ke `.env.local`, lalu isi:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — dari langkah di atas
- `ADMIN_PASSWORD` — password untuk login ke `/admin`
- `SESSION_SECRET` — string acak panjang untuk menandatangani session, contoh generate:
  ```bash
  openssl rand -hex 32
  ```

## 3. Install & jalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk situs publik, dan
[http://localhost:3000/admin](http://localhost:3000/admin) untuk panel admin
(akan redirect ke halaman login kalau belum masuk).

## 4. Panel admin (`/admin`)

- **Dashboard** (`/admin`) — daftar semua project, tombol edit & hapus.
- **Tambah project** (`/admin/projects/new`) — form lengkap: judul, slug (auto dari judul
  kalau dikosongkan), tahun, tipe, status (live/archived), stack, deskripsi, upload
  screenshot, link live, link GitHub, tantangan/solusi, dan highlights.
- **Edit project** (`/admin/projects/[id]/edit`) — form yang sama, terisi data lama.
- **Foto & bio** (`/admin/settings`) — ganti foto profil yang tampil di halaman depan.

Semua endpoint di `/api/admin/*` dan halaman `/admin/*` (kecuali `/admin/login`)
dilindungi lewat `proxy.ts` (dulu bernama `middleware.ts` — di Next.js 16 file
convention ini diganti nama jadi "proxy") — request tanpa session valid otomatis
di-redirect ke halaman login / dibalas `401`.

## 5. Struktur data

**`projects`** (Postgres, dibaca publik lewat RLS `select`, ditulis lewat API
admin dengan `service_role` key):

| kolom | tipe | keterangan |
|---|---|---|
| slug | text, unique | dipakai di URL `/projects/[slug]` |
| title, description | text | |
| year, type, status | text | status: `live` \| `archived` |
| stack, highlights | text[] | |
| featured | boolean | tampil di bagian "pilihan utama" |
| image, link, github | text (nullable) | image = URL Supabase Storage |
| challenge, solution | text (nullable) | detail di halaman project |

**`site_settings`** — baris tunggal (`id = 1`) berisi `photo_url` (foto profil di hero)
dan `bio` (cadangan, belum dipakai di UI publik — siap dipakai kalau mau ditambah nanti).

**Storage buckets** (publik, read-only untuk umum):
- `project-images` — screenshot project
- `profile` — foto profil

## 6. Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import ke Vercel.
3. Tambahkan environment variables yang sama seperti `.env.local` di
   **Project Settings → Environment Variables**.
4. Deploy. Halaman publik pakai `revalidate = 0` (selalu ambil data terbaru dari
   Supabase), jadi perubahan lewat admin langsung terlihat tanpa perlu redeploy.

## Catatan struktur project

```
app/
  page.tsx                 → homepage (hero + foto, preview project, about teaser)
  about/                   → halaman tentang (tanpa unsur puisi)
  projects/                → daftar & detail project (baca dari Supabase)
  contact/                 → form kontak
  admin/                   → panel admin (login, dashboard, form project, settings)
  api/admin/                → API routes admin (login, logout, CRUD project, upload, settings)
components/
  sections/                → HeroSection, HomeProjectsPreview, HomeAboutTeaser
  ui/                      → Navbar, CustomCursor
  admin/                   → ProjectForm, ImageUploadField
lib/
  supabase.ts              → client publik + client admin (service role)
  data.ts                  → baca data project (publik)
  settings.ts              → baca site_settings (publik)
  auth.ts                  → session admin (HMAC, tanpa dependency eksternal)
  slug.ts                  → helper slugify
supabase/
  schema.sql                → definisi tabel, RLS, storage bucket
  seed.sql                  → migrasi 4 project lama
proxy.ts                    → lindungi /admin & /api/admin (dulu middleware.ts)
```
