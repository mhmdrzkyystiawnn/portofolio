'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectMeta } from '@/lib/data'

// ── Featured card ─────────────────────────────────────────────
function FeaturedCard({ project, index }: { project: ProjectMeta; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="project-featured"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <span className="project-featured__bg-num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="project-featured__inner">
        {/* Kiri — info */}
        <div className="project-featured__info">
          <div className="project-featured__meta">
            <span className="label">{project.year}</span>
            <span className="label project-featured__type">{project.type}</span>
            {project.status === 'live' ? (
              <span className="project-featured__live">
                <span className="project-featured__live-dot" aria-hidden="true" />
                <span className="label">live</span>
              </span>
            ) : (
              <span className="label project-featured__archived-badge">local</span>
            )}
          </div>

          <h2 className="project-featured__title display-italic">
            {project.title}
          </h2>

          <p className="project-featured__desc">{project.description}</p>

          <div className="project-featured__stack">
            {project.stack.map(s => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>

          <div className="project-featured__actions">
            <Link href={`/projects/${project.slug}`} className="btn">
              lihat detail
            </Link>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                kunjungi situs →
              </a>
            )}
          </div>
        </div>

        {/* Kanan — screenshot atau mockup */}
        <div className="project-featured__preview">
          {project.image ? (
            <div className="project-featured__screenshot">
              <div className="project-featured__screen-bar" aria-hidden="true">
                <span /><span /><span />
              </div>
              <Image
                src={project.image}
                alt={`Screenshot ${project.title}`}
                width={400}
                height={260}
                className="project-featured__img"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          ) : (
            <div className="project-featured__screen">
              <div className="project-featured__screen-bar" aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className="project-featured__screen-content" aria-hidden="true">
                <div className="project-featured__screen-line project-featured__screen-line--wide" />
                <div className="project-featured__screen-line project-featured__screen-line--mid" />
                <div className="project-featured__screen-line project-featured__screen-line--short" />
                <div className="project-featured__screen-gap" />
                <div className="project-featured__screen-line project-featured__screen-line--mid" />
                <div className="project-featured__screen-line project-featured__screen-line--wide" />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Project card kecil ────────────────────────────────────────
function ProjectCard({ project, index }: { project: ProjectMeta; index: number }) {
  const ref    = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.a
      ref={ref}
      href={`/projects/${project.slug}`}
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {/* Thumbnail foto kalau ada */}
      {project.image && (
        <div className="project-card__thumb">
          <Image
            src={project.image}
            alt={`Screenshot ${project.title}`}
            fill
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>
      )}

      <div className="project-card__top">
        <span className="label project-card__year">{project.year}</span>
        <span className="label project-card__type">{project.type}</span>
        {project.status === 'archived' && (
          <span className="label project-card__archived">local</span>
        )}
      </div>

      <h3 className="project-card__title display-italic">{project.title}</h3>
      <p className="project-card__desc">{project.description}</p>

      <div className="project-card__stack">
        {project.stack.map(s => (
          <span key={s} className="tag">{s}</span>
        ))}
      </div>

      <span className="project-card__arrow" aria-hidden="true">→</span>
    </motion.a>
  )
}

// ── Halaman utama ─────────────────────────────────────────────
export default function ProjectsListClient({ projects }: { projects: ProjectMeta[] }) {
  const allTypes   = ['semua', ...Array.from(new Set(projects.map(p => p.type)))]
  const [filter, setFilter] = useState('semua')

  const featured    = projects.filter(p => p.featured)
  const nonFeatured = projects.filter(p => !p.featured)
  const filtered    = filter === 'semua'
    ? nonFeatured
    : nonFeatured.filter(p => p.type === filter)

  return (
    <div className="projects-page">

      <section className="projects-page__hero">
        <div className="container">
          <motion.p className="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            project — hasil belajar dan eksperimen
          </motion.p>
          <motion.div
            className="projects-page__hero-line"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ transformOrigin: 'left' }}
          />
          <div className="projects-page__hero-row">
            <motion.h1 className="display" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}>
              project &amp;<br /><em className="display-italic">eksperimen.</em>
            </motion.h1>
            <motion.p className="projects-page__hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}>
              {projects.length} project — website, REST API,<br />dan tooling untuk belajar serta menyelesaikan masalah nyata.
            </motion.p>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="projects-page__featured">
          <div className="container">
            <motion.p className="label projects-page__section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.8 }}>
              — pilihan utama
            </motion.p>
            <div className="projects-page__featured-list">
              {featured.map((p, i) => (
                <FeaturedCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {nonFeatured.length > 0 && (
        <section className="projects-page__all">
          <div className="container">
            <div className="projects-page__filter-row">
              <p className="label projects-page__section-label">— lainnya</p>
              <div className="projects-page__filters" role="group" aria-label="filter project">
                {allTypes.map(type => (
                  <button
                    key={type}
                    className={`projects-page__filter-btn${filter === type ? ' projects-page__filter-btn--active' : ''}`}
                    onClick={() => setFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="projects-page__grid">
              {filtered.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
              {filtered.length === 0 && (
                <p className="label" style={{ color: 'var(--color-ink-500)', padding: '2rem 0' }}>
                  tidak ada project dengan filter ini.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}