'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

export default function HomeAboutTeaser() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="home-about" ref={ref}>
      <div className="container">
        <div className="home-about__inner">

          {/* Kiri — nomor & label */}
          <motion.div
            className="home-about__left"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <p className="label home-section__num">04</p>
            <div className="home-about__ruled" aria-hidden="true" />
          </motion.div>

          {/* Tengah — teks utama */}
          <div className="home-about__content">
            <motion.p
              className="label"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              tentang
            </motion.p>

            <motion.h2
              className="display home-about__title"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            >
              belajar lewat<br />
              <em className="display-italic">membangun.</em>
            </motion.h2>

            <motion.p
              className="home-about__body"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
            >
              Fokus membangun website dan aplikasi web yang cepat,
              terstruktur, dan mudah dikembangkan — dari frontend
              sampai integrasi backend.
            </motion.p>

            <motion.div
              className="home-about__actions"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Link href="/about" className="btn">tentang saya</Link>
              <Link href="/contact" className="btn btn-ghost">hubungi saya →</Link>
            </motion.div>
          </div>

          {/* Kanan — stats */}
          <motion.div
            className="home-about__stats"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {[
              { num: '5',      label: 'project dibangun' },
              { num: '3',      label: 'bahasa utama: TS, JS, Python' },
              { num: '2026',   label: 'sedang menjalani PKL' },
            ].map(({ num, label }) => (
              <div key={label} className="home-about__stat">
                <span className="home-about__stat-num display-italic">{num}</span>
                <span className="label home-about__stat-label">{label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Footer kecil */}
      <div className="container">
        <div className="home-about__footer">
          <div className="divider" />
          <p className="label home-about__footer-text">
            portofolio — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  )
}
