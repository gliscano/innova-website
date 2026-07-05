'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { HeroSlide } from './HeroSlide'
import { HeroContent } from './HeroContent'
import { HeroDots } from './HeroDots'
import { HeroProgress } from './HeroProgress'
import { LottiePlayer } from './LottiePlayer'

const SLIDE_DURATION = 5000
const RESUME_DELAY = 3000
const SWIPE_THRESHOLD = 50

export function HeroSection() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const total = navidadCategories.length
  const category = navidadCategories[index]

  const goTo = useCallback((i: number) => setIndex(((i % total) + total) % total), [total])
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return
    const timer = setTimeout(next, SLIDE_DURATION)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isPaused, shouldReduceMotion])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  const handleDotChange = (i: number) => {
    goTo(i)
    setIsPaused(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY)
  }

  const handleDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) next()
    else if (info.offset.x > SWIPE_THRESHOLD) prev()
  }

  return (
    <section
      className="nv-hero"
      aria-label="Catálogo de fondos Navidad 2026 — 6 colecciones disponibles"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link href="/" className="nv-hero-logo" aria-label="Innova">
        <Image
          src="/images/innova/logo-navidad.png"
          alt="Innova"
          width={60}
          height={60}
          className="w-auto h-auto"
          priority
        />
      </Link>

      <motion.div
        className="nv-hero-track"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <div className="nv-hero-videoLayer" aria-hidden="true">
          <AnimatePresence mode={shouldReduceMotion ? 'wait' : 'sync'}>
            <HeroSlide
              key={category.id}
              category={category}
              priority={index === 0}
              reduceMotion={!!shouldReduceMotion}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="nv-hero-overlay" aria-hidden="true" />

      <div className="nv-hero-contentWrap">
        <HeroContent
          key={category.id}
          category={category}
          index={index}
          total={total}
          reduceMotion={!!shouldReduceMotion}
        />
      </div>

      <HeroProgress
        key={category.id}
        duration={SLIDE_DURATION}
        color={category.accentColor}
        paused={isPaused || !!shouldReduceMotion}
      />

      <HeroDots categories={navidadCategories} current={index} onChange={handleDotChange} />

      <LottiePlayer src="/animations/scroll-down.json" className="nv-hero-scrollDown" active />
    </section>
  )
}
