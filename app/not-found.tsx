'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const LINES = [
  'halaman ini tidak ditemukan.',
  'kemungkinan tautannya salah,',
  'atau halamannya sudah dipindah.',
  'silakan kembali ke halaman utama',
  'atau lihat daftar project.',
]

export default function NotFound() {
  const [visibleLines, setVisibleLines] = useState(0)

  // Munculkan baris satu per satu
  useEffect(() => {
    if (visibleLines >= LINES.length) return
    const t = setTimeout(() => {
      setVisibleLines(v => v + 1)
    }, 600)
    return () => clearTimeout(t)
  }, [visibleLines])

  return (
    <div className="not-found">

      {/* Margin line */}
      <div className="hero__margin-line" aria-hidden="true" />

      <div className="container-narrow not-found__inner">

        {/* 404 besar di background */}
        <motion.span
          className="not-found__bg-num"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          aria-hidden="true"
        >
          404
        </motion.span>

        {/* Label */}
        <motion.p
          className="label not-found__label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          halaman tidak ditemukan
        </motion.p>

        {/* Garis dekoratif */}
        <motion.div
          className="not-found__line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ transformOrigin: 'left' }}
        />

        {/* Baris pesan — muncul satu per satu */}
        <div className="not-found__lines" aria-live="polite">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              className={`not-found__line-text display-italic${i >= 3 ? ' not-found__line-text--accent' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={visibleLines > i ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Garis penutup */}
        <motion.div
          className="not-found__end-mark"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={visibleLines >= LINES.length ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ transformOrigin: 'left' }}
        />

        {/* Navigasi */}
        <motion.div
          className="not-found__actions"
          initial={{ opacity: 0 }}
          animate={visibleLines >= LINES.length ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link href="/" className="btn">← kembali ke home</Link>
          <Link href="/projects" className="btn btn-ghost">lihat project →</Link>
        </motion.div>

      </div>
    </div>
  )
}
