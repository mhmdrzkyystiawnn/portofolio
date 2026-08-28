'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useSpring, useMotionValueEvent,
} from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',         label: 'home',    num: '00' },
  { href: '/about',    label: 'tentang', num: '01' },
  { href: '/projects', label: 'project', num: '02' },
  { href: '/contact',  label: 'kontak',  num: '03' },
]

// Spring config — lembut, sedikit overshoot
const SPRING = { stiffness: 60, damping: 20, mass: 1.2 }

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [shift, setShift]       = useState(0)

  const navRef   = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()

  // Hitung jarak pergeseran saat mount & resize
  useEffect(() => {
    function calc() {
      if (!navRef.current || !linksRef.current) return
      const navW    = navRef.current.offsetWidth
      const linksW  = linksRef.current.offsetWidth
      const padX    = 32 * 2     // padding-inline navbar kiri + kanan
      const ctaW    = 90         // perkiraan lebar tombol hire me + margin

      // Posisi kiri links saat ini (di kanan setelah logo+auto margin)
      const currentX = navW - padX - ctaW - linksW

      // Posisi X saat di tengah
      const centerX  = (navW - linksW) / 2 - padX / 2

      // Berapa px harus bergeser ke kiri (nilai positif = geser kiri)
      setShift(Math.max(0, currentX - centerX))
    }

    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // Raw transform dari scroll — range lebih panjang = lebih gradual
  const rawX = useTransform(scrollY, [0, 300], [0, -shift])

  // Bungkus dengan spring supaya ada momentum & kelembutan
  const x = useSpring(rawX, SPRING)

  // Tinggi navbar — spring juga
  const rawHeight = useTransform(scrollY, [0, 200], [64, 52])
  const height    = useSpring(rawHeight, SPRING)

  // Opacity CTA — fade out pelan
  const rawCtaOpacity = useTransform(scrollY, [0, 180], [1, 0])
  const ctaOpacity    = useSpring(rawCtaOpacity, { stiffness: 80, damping: 20 })

  // Opacity label — pelan naik jadi lebih terang
  const rawLabelOpacity = useTransform(scrollY, [0, 250], [0.45, 1])
  const labelOpacity    = useSpring(rawLabelOpacity, SPRING)

  // Background blur muncul pelan
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 60))

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        ref={navRef}
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        style={{ height }}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
      >
        {/* Logo */}
        <Link href="/" className="navbar__logo" aria-label="kembali ke homepage">
          <motion.span
            className="navbar__logo-serif"
            whileHover={{ skewX: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            R
          </motion.span>
          <span className="navbar__logo-dot" aria-hidden="true" />
        </Link>

        {/* Links wrapper — spring translateX */}
        <motion.div
          ref={linksRef}
          className="navbar__links-wrap"
          style={{ x }}
        >
          <nav className="navbar__links" aria-label="navigasi utama">
            {NAV_LINKS.map(({ href, label, num }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`navbar__link${active ? ' navbar__link--active' : ''}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-top-line"
                      className="navbar__link-top-line"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                    />
                  )}
                  <span className="navbar__link-num">{num}</span>
                  <motion.span
                    className="navbar__link-label"
                    style={{ opacity: active ? 1 : labelOpacity }}
                  >
                    {label}
                  </motion.span>
                </Link>
              )
            })}
          </nav>
        </motion.div>

        {/* CTA */}
        <motion.a
          href="/contact"
          className="navbar__cta label"
          style={{
            opacity: ctaOpacity,
            pointerEvents: scrolled ? 'none' : 'auto',
          }}
        >
          kontak saya
          <span className="navbar__cta-dot" aria-hidden="true" />
        </motion.a>

        {/* Hamburger */}
        <button
          className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'tutup menu' : 'buka menu'}
          aria-expanded={menuOpen}
        >
          <span className="navbar__burger-line" />
          <span className="navbar__burger-line" />
        </button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-menu__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="mobile-menu__header">
                <span className="label" style={{ color: 'var(--color-ink-600)' }}>menu</span>
                <button
                  className="mobile-menu__close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="tutup menu"
                >
                  <span /><span />
                </button>
              </div>

              <nav className="mobile-menu__nav" aria-label="navigasi mobile">
                {NAV_LINKS.map(({ href, label, num }, i) => {
                  const active = pathname === href
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.06 * i + 0.12,
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                    >
                      <Link
                        href={href}
                        className={`mobile-menu__link${active ? ' mobile-menu__link--active' : ''}`}
                      >
                        <span className="mobile-menu__num label">{num}</span>
                        <span className="mobile-menu__label display-italic">{label}</span>
                        {active && (
                          <span className="mobile-menu__active-dot" aria-hidden="true" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mobile-menu__footer">
                <div className="divider-short" />
                <p className="label" style={{ color: 'var(--color-ink-600)', marginTop: '1rem' }}>
                  portofolio — {new Date().getFullYear()}
                </p>
                <a href="mailto:mhmdddrzkyyyy@gmail.com" className="mobile-menu__email label">
                  mhmdddrzkyyyy@gmail.com
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}