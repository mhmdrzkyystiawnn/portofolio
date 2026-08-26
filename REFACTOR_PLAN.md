# Refactor Plan: Supabase → Static Site

## Executive Summary

Transform the portfolio from a dynamic Supabase-backed Next.js app to a fully static site with local file-based content management. Remove all Supabase dependencies, replace the admin panel with a simpler local-file approach, and optimize for static export.

---

## Current Architecture Analysis

### Supabase Dependencies
| Component | Purpose | Files Affected |
|-----------|---------|----------------|
| `@supabase/supabase-js` | Database client, Storage, Auth | `package.json` |
| `getSupabaseAdmin()` | Server-side admin client | 6 API routes, 2 admin pages |
| `projects` table | Project CRUD | All project-related code |
| `site_settings` table | Profile photo, bio | Home page, admin settings |
| Supabase Storage | Image uploads | `/api/admin/upload`, `ImageUploadField` |
| Custom session auth | Admin panel protection | `proxy.ts`, login/logout routes |

### Data Layer (`@/lib/`)
| Module | Exports | Used By |
|--------|---------|---------|
| `data.ts` | `ProjectRow`, `ProjectMeta`, `ProjectFull`, `getAllProjects()`, `getProjectBySlug()` | 8 files (pages + components) |
| `supabase.ts` | `getSupabaseAdmin()` | 8 files (API routes + admin pages) |
| `settings.ts` | `getSiteSettings()` | Home page |
| `auth.ts` | `createSessionToken()`, `verifySessionToken()`, `SESSION_COOKIE`, `SESSION_MAX_AGE` | `proxy.ts`, login/logout routes |
| `slug.ts` | `slugify()` | API routes, ProjectForm |

### Admin Panel Features
- Dashboard: List all projects with delete action
- Create project: Form with image upload
- Edit project: Pre-filled form with image upload
- Login: Password-based session (cookie)
- Settings: Update profile photo & bio

### Public Pages
- `/` — Hero + 3 featured projects + about teaser
- `/projects` — Filterable list with featured section
- `/projects/[slug]` — Full project detail
- `/about`, `/contact` — Static content

---

## Refactor Strategy

### Phase 1: Data Layer Replacement (Foundation)
**Goal**: Replace Supabase data access with local JSON/MDX files

#### 1.1 Create Content Structure
```
content/
├── projects/
│   ├── project-1.json
│   ├── project-2.json
│   └── ...
├── settings.json          # photo_url, bio
└── index.json             # Optional: project list index for fast reads
```

#### 1.2 New Data Module (`lib/data.ts`)
- Remove Supabase imports
- Read from `content/projects/*.json` at build time (for static generation)
- Export same types: `ProjectRow`, `ProjectMeta`, `ProjectFull`
- Export same functions: `getAllProjects()`, `getProjectBySlug()`
- Add `getSiteSettings()` reading from `content/settings.json`

#### 1.3 Type Definitions
Keep existing types in `lib/data.ts`:
```typescript
// ProjectRow = full DB row (id, created_at, etc.)
// ProjectMeta = list view (slug, title, year, type, status, featured, stack[], description, image?)
// ProjectFull = ProjectMeta + challenge, solution, highlights[], link?, github?
```

### Phase 2: Remove Supabase & API Routes
**Goal**: Eliminate all server-side Supabase calls

#### 2.1 Remove Files
- `lib/supabase.ts` → DELETE
- `app/api/admin/projects/route.ts` → DELETE
- `app/api/admin/projects/[id]/route.ts` → DELETE
- `app/api/admin/upload/route.ts` → DELETE
- `app/api/admin/settings/route.ts` → DELETE
- `app/api/admin/login/route.ts` → DELETE (if removing admin)
- `app/api/admin/logout/route.ts` → DELETE (if removing admin)

#### 2.2 Update `package.json`
- Remove `@supabase/supabase-js` dependency
- Run `npm install` to update lockfile

#### 2.3 Update `next.config.ts`
- Remove `images.domains` (if using local images)
- Add `output: 'export'` for static export
- Configure `images.unoptimized: true` (already set)

### Phase 3: Admin Panel Decision Point
**Choose one approach:**

#### Option A: Remove Admin Panel Entirely (Recommended for Pure Static)
- Delete `app/admin/` directory entirely
- Delete `components/admin/` directory
- Delete `proxy.ts` (middleware)
- Delete `lib/auth.ts`, `lib/slug.ts` (if unused elsewhere)
- Content managed by editing JSON files directly in `content/`
- Deploy: commit content changes → auto-deploy

#### Option B: Keep Admin with Local File Persistence
- Replace API routes with file-based operations (Node.js `fs`)
- Use `next build` script to regenerate static pages after edits
- Requires server (not pure static export) or Git-based CMS workflow
- More complex, defeats "static" goal

> **Recommendation: Option A** — Simpler, truly static, version-controlled content.

### Phase 4: Image Handling
**Current**: Supabase Storage buckets (`project-images`, `profile`)
**New**: Local `public/images/` or `content/images/`

#### 4.1 Migration
- Download existing images from Supabase
- Place in `public/images/projects/` and `public/images/profile/`
- Update JSON references to `/images/projects/xxx.png`

#### 4.2 ImageUploadField Component
- Replace with local file input (preview only)
- Store path in JSON manually
- Or: Remove upload UI, document manual process

### Phase 5: Static Generation & Build
**Goal**: Generate fully static HTML at build time

#### 5.1 Configure Static Export
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true, // optional, for hosting compatibility
};
```

#### 5.2 Update Page Components
- Remove `export const revalidate = 0` (not needed for static export)
- Ensure `generateStaticParams` for dynamic routes:
```typescript
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map(p => ({ slug: p.slug }));
}
```

#### 5.3 Build Command
```bash
npm run build  # Outputs to /out directory
```

### Phase 6: Deployment
- Deploy `/out` folder to Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.
- No server, no database, no environment variables needed (except maybe `ADMIN_PASSWORD` if keeping minimal auth)

---

## Detailed Task Breakdown

### Phase 1: Data Layer (3-4 hours)
| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | Create `content/projects/` with sample JSON files | 30 min |
| 1.2 | Create `content/settings.json` | 15 min |
| 1.3 | Rewrite `lib/data.ts` to read from filesystem | 1.5 hrs |
| 1.4 | Rewrite `lib/settings.ts` to read from filesystem | 30 min |
| 1.5 | Update type exports if needed | 15 min |
| 1.6 | Test `getAllProjects()` and `getProjectBySlug()` in dev | 30 min |

### Phase 2: Cleanup Supabase (1-2 hours)
| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | Delete `lib/supabase.ts` | 5 min |
| 2.2 | Delete all `/api/admin/` routes | 15 min |
| 2.3 | Remove `@supabase/supabase-js` from package.json | 5 min |
| 2.4 | Run `npm install` | 30 min |
| 2.5 | Fix any broken imports | 30 min |

### Phase 3: Admin Panel Removal (1 hour)
| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | Delete `app/admin/` directory | 5 min |
| 3.2 | Delete `components/admin/` directory | 5 min |
| 3.3 | Delete `proxy.ts` | 5 min |
| 3.4 | Delete `lib/auth.ts` | 5 min |
| 3.5 | Delete `lib/slug.ts` (if unused) | 5 min |
| 3.6 | Remove admin-related CSS (`admin.css`, `navbar-cursor.css`?) | 15 min |
| 3.7 | Verify no remaining imports of deleted modules | 20 min |

### Phase 4: Images & Static Export (1-2 hours)
| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | Download/migrate images from Supabase to `public/images/` | 30 min |
| 4.2 | Update project JSON files with local image paths | 30 min |
| 4.3 | Add `output: 'export'` to `next.config.ts` | 5 min |
| 4.4 | Add `generateStaticParams` to dynamic routes | 30 min |
| 4.5 | Remove `revalidate = 0` from pages | 15 min |
| 4.6 | Test `npm run build` produces `/out` | 30 min |

### Phase 5: Testing & Polish (1-2 hours)
| Task | Description | Effort |
|------|-------------|--------|
| 5.1 | Verify all pages render correctly in `/out` | 30 min |
| 5.2 | Test navigation, images, links | 30 min |
| 5.3 | Verify no console errors | 15 min |
| 5.4 | Test deployment to staging (Vercel/Netlify) | 30 min |

---

## Migration Checklist

### Pre-Refactor
- [ ] Backup Supabase data (export projects & settings tables)
- [ ] Download all images from Supabase Storage
- [ ] Document current project data structure

### During Refactor
- [ ] Create `content/` directory structure
- [ ] Write JSON files for each project (use exported data)
- [ ] Write `settings.json`
- [ ] Implement new `lib/data.ts`
- [ ] Delete Supabase-dependent files
- [ ] Update `package.json`
- [ ] Configure static export
- [ ] Add `generateStaticParams`

### Post-Refactor
- [ ] `npm run build` succeeds
- [ ] `/out` directory contains all pages
- [ ] Local preview: `npx serve out`
- [ ] Deploy to staging
- [ ] Verify production deployment

---

## File Structure After Refactor

```
portofolio-refactor/
├── content/
│   ├── projects/
│   │   ├── cuaca-realtime.json
│   │   ├── portfolio-v2.json
│   │   └── ...
│   └── settings.json
├── public/
│   └── images/
│       ├── projects/
│       │   ├── cuaca-realtime.png
│       │   └── ...
│       └── profile/
│           └── avatar.jpg
├── lib/
│   ├── data.ts          # ← Rewritten (no Supabase)
│   └── settings.ts      # ← Rewritten (no Supabase)
├── app/
│   ├── page.tsx         # Home (uses lib/data, lib/settings)
│   ├── projects/
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   │   ├── page.tsx  # + generateStaticParams
│   │   │   └── ProjectDetailClient.tsx
│   │   └── ProjectsListClient.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── HomeProjectsPreview.tsx
│   │   └── HomeAboutTeaser.tsx
│   └── ui/
│       ├── Navbar.tsx
│       └── CustomCursor.tsx
├── next.config.ts       # + output: 'export'
├── package.json         # - @supabase/supabase-js
└── tsconfig.json
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Build fails due to dynamic imports | Medium | High | Audit all `fetch()` and dynamic `import()` calls |
| Missing `generateStaticParams` for dynamic routes | High | High | Add to all `[slug]` pages |
| Image optimization errors | Medium | Medium | `images.unoptimized: true` |
| Content editing workflow unclear | Medium | Medium | Document JSON editing process in README |
| Loss of admin convenience | Low | Low | Accept trade-off for static simplicity |

---

## Effort Estimate

| Phase | Hours |
|-------|-------|
| Phase 1: Data Layer | 3-4 |
| Phase 2: Cleanup | 1-2 |
| Phase 3: Admin Removal | 1 |
| Phase 4: Images & Static Export | 1-2 |
| Phase 5: Testing | 1-2 |
| **Total** | **7-11 hours** |

---

## Next Steps

1. **Confirm approach**: Option A (remove admin) vs Option B (keep with file persistence)
2. **Export Supabase data**: Run SQL to get all projects + settings as JSON
3. **Start Phase 1**: Create content structure and rewrite `lib/data.ts`
4. **Iterate**: Build and test incrementally

---

## Appendix: Sample Content JSON

### `content/projects/cuaca-realtime.json`
```json
{
  "id": "uuid-here",
  "slug": "cuaca-realtime",
  "title": "Cuaca Real-time",
  "year": "2024",
  "type": "web app",
  "status": "live",
  "stack": ["Next.js", "TypeScript", "OpenWeather API"],
  "description": "Aplikasi cuaca real-time dengan geolokasi dan prediksi 7 hari.",
  "featured": true,
  "image": "/images/projects/cuaca-realtime.png",
  "link": "https://cuaca.example.com",
  "github": "https://github.com/user/cuaca-realtime",
  "challenge": "Mengintegrasikan API cuaca gratis dengan rate limit ketat.",
  "solution": "Caching di edge dengan SWR dan fallback ke data lokal.",
  "highlights": [
    "Geolokasi browser + fallback manual",
    "PWA support untuk offline viewing",
    "Animasi cuaca dengan Framer Motion"
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

### `content/settings.json`
```json
{
  "photo_url": "/images/profile/avatar.jpg",
  "bio": "Full-stack developer yang suka bikin hal-hal kecil jadi berguna."
}
```