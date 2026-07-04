'use client'

import Image from "next/image";
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

// ── Reveal wrapper — muncul saat masuk viewport ───────────────
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Garis pemisah antar chapter ───────────────────────────────
function ChapterDivider({ num, title }: { num: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="about__chapter">
      <motion.span
        className="label about__chapter-num"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {num}
      </motion.span>
      <motion.div
        className="about__chapter-line"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ transformOrigin: 'left' }}
      />
      <motion.span
        className="label about__chapter-title"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {title}
      </motion.span>
    </div>
  )
}

// ── Skill item ────────────────────────────────────────────────
function SkillItem({ label, level }: { label: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="about__skill">
      <div className="about__skill-header">
        <span className="about__skill-label label">{label}</span>
        <span className="about__skill-pct label">{level}%</span>
      </div>
      <div className="about__skill-track">
        <motion.div
          className="about__skill-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        />
      </div>
    </div>
  )
}

// ── Halaman utama ─────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="about">

      {/* ── HERO ABOUT ── */}
      <section className="about__hero">
        <div className="container-narrow">
          <motion.p
            className="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            tentang — who am i
          </motion.p>

          <motion.div
            className="about__hero-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ transformOrigin: 'left' }}
          />

          <motion.h1
            className="display about__hero-title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          >
            Siapa<br />
            <em className="display-italic">Diriku ini?</em>
          </motion.h1>

          <motion.p
            className="about__hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          >
            Muhamad Rizky Setiawan.
          </motion.p>
        </div>
      </section>

      {/* ── CHAPTER 01 — ASAL MUASAL ── */}
      <section className="about__section">
        <div className="container-narrow">
          <ChapterDivider num="01" title="asal muasal" />

          <Reveal delay={0.1}>
            <p className="about__body">
              Muhamad Rizky Setiawan. Lahir dan tumbuh di Bogor. <br />
              Web developer yang fokus membangun aplikasi web dari sisi
              frontend sampai integrasi backend.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="about__body">
              Tertarik pada detail kecil — struktur kode yang rapi,
              performa yang cepat, dan antarmuka yang nyaman dipakai.
              Senang belajar teknologi baru dan menerapkannya langsung
              lewat project nyata.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CHAPTER 02 — PERJALANAN ── */}
      <section className="about__section">
        <div className="container-narrow">
          <ChapterDivider num="02" title="perjalanan" />

          <div className="about__timeline">
            {[
              {
                year: '2024',
                event: 'Mulai belajar HTML dari sekolah SMK AMALIAH.',
                accent: false,
              },
              {
                year: '2024',
                event: 'Project pertama — website sederhana untuk project sekolah.',
                accent: false,
              },
              {
                year: '2025',
                event: 'Mulai menekuni JavaScript dan jatuh cinta dengan Next.js.',
                accent: true,
              },
              {
                year: '2026',
                event: 'Mempelajari Laravel dan membangun beberapa project backend.',
                accent: false,
              },
              {
                year: 'kini',
                event: 'Membangun portofolio ini — yang juga adalah tujuan sejak lama.',
                accent: true,
              },
            ].map(({ year, event, accent }, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className={`about__timeline-item${accent ? ' about__timeline-item--accent' : ''}`}>
                  <span className="about__timeline-year label">{year}</span>
                  <div className="about__timeline-dot" aria-hidden="true" />
                  <p className="about__timeline-event">{event}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAPTER 03 — KEAHLIAN ── */}
      <section className="about__section">
        <div className="container-narrow">
          <ChapterDivider num="03" title="keahlian" />

          <div className="about__skills-grid">
            <div>
              <Reveal>
                <p className="label" style={{ marginBottom: '1.5rem', color: 'var(--color-ink-500)' }}>
                  — teknologi
                </p>
              </Reveal>
              {[
                { label: 'React / Next.js', level: 60 },
                { label: 'TypeScript', level: 30 },
                { label: 'CSS / Tailwind / Bootstrap', level: 60 },
                { label: 'Node.js', level: 52 },
                { label: 'Framer Motion', level: 48 },
                { label: 'Laravel', level: 68 },
                { label: 'Git & Version Control', level: 75 },
              ].map((s) => (
                <SkillItem key={s.label} {...s} />
              ))}
            </div>

            <div>
              <Reveal>
                <p className="label" style={{ marginBottom: '1.5rem', color: 'var(--color-ink-500)' }}>
                  — kreativitas
                </p>
              </Reveal>
              {[
                { label: 'UI / UX Design', level: 65 },
                { label: 'REST API', level: 70 },
                { label: 'Database Design', level: 60 },
                { label: 'Problem Solving', level: 75 },
              ].map((s) => (
                <SkillItem key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PENUTUP ── */}
      <section className="about__closing">
        <div className="container-narrow">
          <Reveal>
            <div className="about__closing-inner">
              <div className="divider-short" />
              <p className="display-italic about__closing-text">
                Tertarik kolaborasi atau punya project yang ingin dibangun?
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link href="/contact" className="btn">hubungi aku</Link>
                <Link href="/projects" className="btn btn-ghost">lihat project →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}