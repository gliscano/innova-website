'use client'

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface HeroProgressProps {
  duration: number // ms
  color: string
  paused: boolean
}

export function HeroProgress({ duration, color, paused }: HeroProgressProps) {
  const controls = useAnimation()

  useEffect(() => {
    if (paused) {
      controls.stop()
    } else {
      controls.start({ scaleX: 1, transition: { duration: duration / 1000, ease: 'linear' } })
    }
  }, [paused, duration, controls])

  return (
    <div className="nv-hero-progressBar" aria-hidden="true">
      <motion.div
        className="nv-hero-progressFill"
        style={{ backgroundColor: color, transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        animate={controls}
      />
    </div>
  )
}
