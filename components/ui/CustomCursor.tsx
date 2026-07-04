'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorRef           = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  // Raw mouse position
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Spring — titik utama (lambat, seperti tinta mengalir)
  const springX = useSpring(rawX, { stiffness: 120, damping: 18, mass: 0.6 })
  const springY = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.6 })

  // Spring — trailing dot (lebih lambat lagi)
  const trailX = useSpring(rawX, { stiffness: 60, damping: 14, mass: 0.8 })
  const trailY = useSpring(rawY, { stiffness: 60, damping: 14, mass: 0.8 })

  useEffect(() => {
    // Sembunyikan di touch device
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onLeave  = () => setVisible(false)
    const onEnter  = () => setVisible(true)
    const onDown   = () => setClicking(true)
    const onUp     = () => setClicking(false)

    // Deteksi hover di atas elemen interaktif
    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, label')
      setHovering(!!interactive)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousemove', onHoverStart)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    // Sembunyikan cursor default
    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousemove', onHoverStart)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
    }
  }, [rawX, rawY, visible])

  if (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Titik utama — mengikuti mouse dengan spring cepat */}
      <motion.div
        className={[
          'cursor__dot',
          clicking  ? 'cursor__dot--click'  : '',
          hovering  ? 'cursor__dot--hover'  : '',
          !visible  ? 'cursor__dot--hidden' : '',
        ].join(' ')}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Trailing ring — lebih lambat, efek tinta melebar */}
      <motion.div
        className={[
          'cursor__ring',
          clicking  ? 'cursor__ring--click'  : '',
          hovering  ? 'cursor__ring--hover'  : '',
          !visible  ? 'cursor__ring--hidden' : '',
        ].join(' ')}
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  )
}