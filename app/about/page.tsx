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
            tentang — siapa saya
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
            <em className="display-italic">saya ini?</em>
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
              Saya Muhamad Rizky Setiawan, lahir dan tinggal di Bogor.
              Sekarang duduk di kelas jurusan Pengembangan Perangkat Lunak
              dan Gim, SMK Amaliah Ciawi, dengan fokus pada pengembangan
              aplikasi web modern.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="about__body">
              Yang paling saya sukai dari pekerjaan ini adalah melihat ide
              berubah menjadi produk yang benar-benar bisa dipakai orang.
              Karena itu saya tertarik pada frontend, backend, database,
              sekaligus pengalaman pengguna — ketiganya saling terhubung
              dalam satu produk utuh.
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
                event: 'Mengenal HTML, CSS, dan dasar pengembangan web melalui sekolah.',
                accent: false,
              },
              {
                year: '2024',
                event: 'Membangun website pertama untuk tugas dan project sekolah.',
                accent: false,
              },
              {
                year: '2025',
                event: 'Mulai mendalami JavaScript, React, dan Next.js.',
                accent: true,
              },
              {
                year: '2025',
                event: 'Mengembangkan berbagai project pribadi dan mempelajari full-stack development.',
                accent: false,
              },
              {
                year: '2026',
                event: 'Menjalani praktik kerja lapangan (PKL) dan terlibat dalam pengembangan aplikasi web nyata.',
                accent: true,
              },
              {
                year: 'kini',
                event: 'Terus belajar membangun produk digital yang lebih kompleks dan bermanfaat.',
                accent: false,
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
                { label: 'React / Next.js', level: 90 },
                { label: 'TypeScript', level: 80 },
                { label: 'CSS / Tailwind / Bootstrap', level: 60 },
                { label: 'Node.js', level: 52 },
                { label: 'NestJS', level: 60 },
                { label: 'Python', level: 60 },
                { label: 'Pandas', level: 50 },
                { label: 'NumPy', level: 50 },
                { label: 'LLM AI Engineering', level: 20 },
                { label: 'Flutter', level: 30 },
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
                  — rekayasa &amp; desain
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

      {/* ── CHAPTER 04 — FOKUS SAAT INI ── */}
      <section className="about__section">
        <div className="container-narrow">
          <ChapterDivider num="04" title="fokus saat ini" />

          <Reveal delay={0.1}>
            <p className="about__body">
              Saat ini saya fokus mempelajari Next.js, TypeScript, Node.js,
              Laravel, dan teknologi full-stack lainnya — sambil aktif
              membangun project pribadi sebagai sarana belajar paling
              efektif bagi saya.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="about__body">
              Di luar web, saya mulai menekuni AI, Python, dan pengolahan
              data. Prinsip yang saya pegang sederhana: teknologi baru
              berguna kalau ia menyelesaikan masalah nyata.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PENUTUP ── */}
      <section className="about__closing">
        <div className="container-narrow">
          <Reveal>
            <div className="about__closing-inner">
              <div className="divider-short" />
              <p className="display-italic about__closing-text">
                Terbuka untuk diskusi, kolaborasi,<br />
                dan peluang project baru.
              </p>
              <p className="about__body" style={{ marginTop: '1.25rem' }}>
                Kalau mau bertukar pengalaman seputar teknologi atau punya
                ide yang ingin dibangun, silakan hubungi saya.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link href="/contact" className="btn">hubungi saya</Link>
                <Link href="/projects" className="btn btn-ghost">lihat project →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}