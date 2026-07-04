'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// ── Custom easing — pakai string biar TS happy ───────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// ── Typewriter hook ──────────────────────────────────────────
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay]   = useState('')
  const [wordIdx, setWordIdx]   = useState(0)
  const [charIdx, setCharIdx]   = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx((c) => c + 1)
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx((w) => (w + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx((c) => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

// ── Animation variants ───────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
    },
  },
}

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1,
      delay: 0.6,
      ease: EASE_OUT_EXPO,
    },
  },
}

// ── Komponen utama ────────────────────────────────────────────
export default function HeroSection({ photoUrl }: { photoUrl?: string | null }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const typewriterText = useTypewriter(
    ['web developer.', 'frontend engineer.', 'desainer interface.', 'pembuat produk digital.'],
    75,
    2200
  )

  return (
    <section
      ref={ref}
      className="hero"
      style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Texture — margin line kiri */}
      <div className="hero__margin-line" aria-hidden="true" />

      {/* Texture — ruled lines */}
      <div className="hero__ruled" aria-hidden="true" />

      {/* Konten utama dengan parallax */}
      <motion.div style={{ y, opacity }} className="container hero__inner">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero__content"
        >
          {/* Label atas */}
          <motion.p variants={fadeUpVariants} className="label hero__label">
            portofolio — {new Date().getFullYear()}
          </motion.p>

          {/* Garis dekoratif */}
          <motion.div
            variants={lineVariants}
            className="hero__line-short"
            style={{ transformOrigin: 'left' }}
            aria-hidden="true"
          />

          {/* Nama — serif besar. Ganti "Nama" & "Kamu" dengan namamu */}
          <motion.h1 variants={fadeUpVariants} className="hero__name display">
            Rizky<br />
            <em className="display-italic">Setiawan</em>
          </motion.h1>

          {/* Typewriter */}
          <motion.div variants={fadeUpVariants} className="hero__tagline">
            <span
              className="label"
              style={{ color: 'var(--color-ink-500)', marginRight: '0.5rem' }}
            >
              aku adalah
            </span>
            <span className="hero__typewriter">
              {typewriterText}
              <span className="hero__cursor" aria-hidden="true">|</span>
            </span>
          </motion.div>

          {/* Deskripsi singkat */}
          <motion.p variants={fadeUpVariants} className="hero__desc">
            Membangun website yang cepat, rapi, dan enak dipakai &mdash;<br />
            dari sisi tampilan sampai ke urusan backend.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUpVariants} className="hero__actions">
            <Link href="/projects" className="btn">lihat project</Link>
            <Link href="/about" className="btn btn-ghost">tentang aku →</Link>
          </motion.div>

          {/* Ink drop dekoratif */}
          <motion.div
            variants={fadeUpVariants}
            className="hero__ink-drop"
            aria-hidden="true"
          />
        </motion.div>

        {/* Foto profil — kanan */}
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: EASE_OUT_EXPO }}
          className="hero__photo-aside"
        >
          <div className="hero__photo-frame">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Foto profil"
                fill
                sizes="320px"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div className="hero__photo-placeholder" aria-hidden="true">
                <span className="label">foto belum diunggah</span>
              </div>
            )}
          </div>
          <span className="label" style={{ marginTop: '1rem', display: 'block' }}>
            — Bogor, Indonesia
          </span>
        </motion.aside>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="hero__scroll-indicator"
        aria-label="scroll ke bawah"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="hero__scroll-dot"
        />
        <span className="label">scroll</span>
      </motion.div>
    </section>
  )
}