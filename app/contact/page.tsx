'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

// ── Reveal helper ─────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  )
}

// ── Social link item ──────────────────────────────────────────
function SocialLink({ href, label, handle, num }: {
  href: string
  label: string
  handle: string
  num: string
}) {
  const ref    = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="contact-social__item"
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <span className="contact-social__num label">{num}</span>
      <div className="contact-social__text">
        <span className="contact-social__label label">{label}</span>
        <span className="contact-social__handle">{handle}</span>
      </div>
      <span className="contact-social__arrow" aria-hidden="true">→</span>
    </motion.a>
  )
}

// ── Form state type ───────────────────────────────────────────
type FormState = 'idle' | 'sending' | 'sent' | 'error'

// ── Halaman utama ─────────────────────────────────────────────
export default function ContactPage() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setFormState('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, honeypot }),
      })

      if (res.ok) {
        setFormState('sent')
        return
      }

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('Retry-After')) || 0
        const menit = Math.ceil(retryAfter / 60)
        setErrorMessage(
          menit > 0
            ? `terlalu banyak pesan. coba lagi dalam ${menit} menit.`
            : 'terlalu banyak pesan. coba lagi nanti.',
        )
      } else if (res.status === 400) {
        setErrorMessage('pesan tidak valid — periksa kembali isianmu.')
      } else {
        setErrorMessage('gagal mengirim. coba lagi atau hubungi lewat email langsung.')
      }
      setFormState('error')
    } catch {
      setErrorMessage('gagal mengirim. coba lagi atau hubungi lewat email langsung.')
      setFormState('error')
    }
  }

  const resetForm = () => {
    setFormState('idle')
    setName(''); setEmail(''); setMessage('')
    setErrorMessage('')
  }

  return (
    <div className="contact-page">

      {/* ── HEADER ── */}
      <section className="contact-page__hero">
        <div className="container-narrow">
          <motion.p
            className="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            kontak — mari bicara
          </motion.p>

          <motion.div
            className="contact-page__hero-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ transformOrigin: 'left' }}
          />

          <motion.h1
            className="display contact-page__hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          >
            ada yang ingin<br />
            <em className="display-italic">kita buat bersama?</em>
          </motion.h1>

          <motion.p
            className="contact-page__hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Terbuka untuk kolaborasi, project freelance,<br />
            atau sekadar diskusi soal teknologi web.
          </motion.p>
        </div>
      </section>

      {/* ── KONTEN UTAMA ── */}
      <section className="contact-page__body">
        <div className="container">
          <div className="contact-page__grid">

            {/* ── FORM ── */}
            <div className="contact-form-wrap">
              <Reveal>
                <p className="label contact-section-label">— kirim pesan</p>
              </Reveal>

              {formState === 'sent' ? (
                <motion.div
                  className="contact-form__success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <div className="contact-form__success-mark" aria-hidden="true" />
                  <h2 className="display-italic contact-form__success-title">
                    pesanmu sudah sampai.
                  </h2>
                  <p className="contact-form__success-sub">
                    Aku akan membalas dalam 1–2 hari kerja.
                    Sementara itu, boleh lihat-lihat project lain dulu.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => resetForm()}
                    >
                      kirim pesan lain
                    </button>
                    <Link href="/projects" className="btn">lihat project →</Link>
                  </div>
                </motion.div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — tersembunyi dari manusia, hanya bot yang mengisinya */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <label htmlFor="website">jangan isi field ini</label>
                    <input
                      id="website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={e => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Nama */}
                  <Reveal delay={0.05}>
                    <div className="contact-form__field">
                      <label className="contact-form__label label" htmlFor="name">
                        namamu
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="contact-form__input"
                        placeholder="siapa yang menulis?"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </Reveal>

                  {/* Email */}
                  <Reveal delay={0.1}>
                    <div className="contact-form__field">
                      <label className="contact-form__label label" htmlFor="email">
                        email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="contact-form__input"
                        placeholder="ke mana aku membalas?"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </Reveal>

                  {/* Pesan */}
                  <Reveal delay={0.15}>
                    <div className="contact-form__field">
                      <label className="contact-form__label label" htmlFor="message">
                        pesanmu
                      </label>
                      <textarea
                        id="message"
                        className="contact-form__textarea"
                        placeholder="ceritakan apa yang ada di pikiranmu..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        rows={6}
                      />
                      <span className="contact-form__char-count label">
                        {message.length} karakter
                      </span>
                    </div>
                  </Reveal>

                  {/* Submit */}
                  <Reveal delay={0.2}>
                    <button
                      type="submit"
                      className={`btn contact-form__submit${formState === 'sending' ? ' contact-form__submit--sending' : ''}`}
                      disabled={formState === 'sending' || !name || !email || !message}
                    >
                      {formState === 'sending' ? (
                        <>
                          <span className="contact-form__spinner" aria-hidden="true" />
                          mengirim...
                        </>
                      ) : (
                        'kirim pesan →'
                      )}
                    </button>
                  </Reveal>

                  {formState === 'error' && errorMessage && (
                    <Reveal>
                      <p className="contact-form__error label" role="alert">
                        {errorMessage}
                      </p>
                    </Reveal>
                  )}
                </form>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <aside className="contact-sidebar">

              {/* Email langsung */}
              <Reveal delay={0.1}>
                <div className="contact-sidebar__section">
                  <p className="label contact-section-label">— atau email langsung</p>
                  <a
                    href="mailto:mhmdddrzkyyyy@gmail.com"
                    className="contact-email-link display-italic"
                  >
                    mhmdddrzkyyyy@gmail.com
                  </a>
                </div>
              </Reveal>

              <div className="divider" style={{ marginBlock: 'var(--space-lg)' }} />

              {/* Sosial media */}
              <div className="contact-sidebar__section">
                <Reveal>
                  <p className="label contact-section-label">— temukan aku di</p>
                </Reveal>

                <div className="contact-social">
                  <SocialLink
                    href="https://github.com/mhmdrzkyystiawnn"
                    label="github"
                    handle="mhmdrzkyystiawnn"
                    num="01"
                  />
                  <SocialLink
                    href="mailto:mhmdddrzkyyyy@gmail.com"
                    label="email"
                    handle="mhmdddrzkyyyy@gmail.com"
                    num="02"
                  />
                  <SocialLink
                    href="https://instagram.com/rizkyystiawann"
                    label="instagram"
                    handle="rizkyystiawann"
                    num="03"
                  />
                </div>
              </div>

              <div className="divider" style={{ marginBlock: 'var(--space-lg)' }} />

              {/* Ketersediaan */}
              <Reveal delay={0.2}>
                <div className="contact-availability">
                  <div className="contact-availability__dot" aria-hidden="true" />
                  <div>
                    <p className="label contact-availability__status">
                      tersedia untuk project baru
                    </p>
                    <p className="contact-availability__note">
                      Estimasi respons: 1–2 hari kerja
                    </p>
                  </div>
                </div>
              </Reveal>

            </aside>
          </div>
        </div>
      </section>

      {/* ── PENUTUP ── */}
      <section className="contact-page__closing">
        <div className="container-narrow">
          <Reveal>
            <blockquote className="contact-closing-quote">
              <p className="display-italic">
                &ldquo;setiap hubungan<br />
                dimulai dari satu kata.&rdquo;
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

    </div>
  )
}