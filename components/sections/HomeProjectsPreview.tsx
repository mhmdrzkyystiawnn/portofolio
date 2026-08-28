'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectMeta } from '@/lib/data'

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  )
}

export default function HomeProjectsPreview({ projects }: { projects: ProjectMeta[] }) {
  return (
    <section className="home-projects">
      <div className="container">

        <div className="home-section__header">
          <Reveal>
            <p className="label home-section__num">02</p>
            <h2 className="display home-section__title">
              project<br />
              <em className="display-italic">pilihan.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/projects" className="btn btn-ghost home-section__see-all">
              semua project →
            </Link>
          </Reveal>
        </div>

        <div className="home-projects__list">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={0.05 * i}>
              <Link href={`/projects/${project.slug}`} className="home-project-item">

                <span className="label home-project-item__num">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="home-project-item__info">
                  <div className="home-project-item__meta">
                    <span className="label">{project.year}</span>
                    <span className="label" style={{ color: 'var(--color-gold-400)' }}>
                      {project.type}
                    </span>
                    {project.status === 'live' && (
                      <span className="home-project-item__live">
                        <span className="project-featured__live-dot" aria-hidden="true" />
                        <span className="label">live</span>
                      </span>
                    )}
                  </div>
                  <h3 className="home-project-item__title display-italic">
                    {project.title}
                  </h3>
                  <p className="home-project-item__desc">
                    {project.description}
                  </p>
                  <div className="home-project-item__stack">
                    {project.stack.slice(0, 3).map(s => (
                      <span key={s} className="tag">{s}</span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="label" style={{ color: 'var(--color-ink-600)' }}>
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {project.image ? (
                  <div className="home-project-item__thumb">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                ) : (
                  <div className="home-project-item__thumb home-project-item__thumb--empty">
                    <div className="home-project-item__thumb-lines" aria-hidden="true">
                      <span /><span /><span />
                    </div>
                  </div>
                )}

                <span className="home-project-item__arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}