'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectFull } from '@/lib/data'

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  )
}

export default function ProjectDetailClient({ project }: { project: ProjectFull }) {
  return (
    <div className="project-detail">

      {/* Back */}
      <div className="container project-detail__back">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Link href="/projects" className="project-detail__back-link label">← semua project</Link>
        </motion.div>
      </div>

      {/* Header */}
      <header className="project-detail__header">
        <div className="container">
          <motion.div
            className="project-detail__header-line"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ transformOrigin: 'left' }}
          />

          <div className="project-detail__header-inner">
            <div>
              <div className="project-detail__meta">
                <span className="label">{project.year}</span>
                <span className="label" style={{ color: 'var(--color-ink-600)' }}>·</span>
                <span className="label">{project.type}</span>
                {project.status === 'live' ? (
                  <span className="project-featured__live">
                    <span className="project-featured__live-dot" aria-hidden="true" />
                    <span className="label">live</span>
                  </span>
                ) : (
                  <span className="label project-featured__archived-badge">local</span>
                )}
              </div>
              <motion.h1
                className="display project-detail__title"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              >
                {project.title}
              </motion.h1>
            </div>

            <motion.div className="project-detail__links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.7 }}>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn">
                  buka site →
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  github →
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Screenshot */}
      {project.image && (
        <section className="project-detail__screenshot-section">
          <div className="container">
            <Reveal>
              <div className="project-detail__screenshot-wrap">
                <div className="project-featured__screen-bar" style={{ background: 'var(--color-ink-800)', padding: '10px 16px', borderRadius: '8px 8px 0 0', borderBottom: '1px solid rgba(201,169,110,0.08)' }} aria-hidden="true">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(201,169,110,0.15)', display: 'inline-block', marginRight: 5 }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(201,169,110,0.15)', display: 'inline-block', marginRight: 5 }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(201,169,110,0.15)', display: 'inline-block' }} />
                </div>
                <div className="project-detail__screenshot-img-wrap">
                  <Image
                    src={project.image}
                    alt={`Screenshot ${project.title}`}
                    width={1200}
                    height={700}
                    className="project-detail__screenshot-img"
                    style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Stack */}
      <section className="project-detail__stack-section">
        <div className="container">
          <Reveal>
            <div className="project-detail__stack">
              {project.stack.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Konten */}
      <section className="project-detail__content">
        <div className="container">
          <div className="project-detail__grid">
            <div>
              <Reveal>
                <p className="label" style={{ marginBottom: '1rem', color: 'var(--color-ink-500)' }}>— tentang project</p>
                <p className="project-detail__body">{project.description}</p>
              </Reveal>
              {project.challenge && (
                <Reveal delay={0.1}>
                  <div className="project-detail__qa">
                    <p className="label project-detail__qa-label">tantangan</p>
                    <p className="project-detail__body">{project.challenge}</p>
                  </div>
                </Reveal>
              )}
              {project.solution && (
                <Reveal delay={0.15}>
                  <div className="project-detail__qa">
                    <p className="label project-detail__qa-label">solusi</p>
                    <p className="project-detail__body">{project.solution}</p>
                  </div>
                </Reveal>
              )}
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <div>
                <Reveal delay={0.2}>
                  <p className="label" style={{ marginBottom: '1rem', color: 'var(--color-ink-500)' }}>— highlights</p>
                  <ul className="project-detail__highlights">
                    {project.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        className="project-detail__highlight-item"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                      >
                        <span className="project-detail__highlight-dot" aria-hidden="true" />
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="project-detail__footer">
        <div className="container">
          <div className="divider" />
          <div className="project-detail__footer-links">
            <Link href="/projects" className="btn btn-ghost">← semua project</Link>
            <Link href="/contact" className="btn">kerja sama? →</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}