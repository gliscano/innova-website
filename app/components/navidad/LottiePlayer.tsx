'use client'

import { useEffect, useRef } from 'react'
import type { AnimationItem } from 'lottie-web'

interface LottiePlayerProps {
  src: string
  className?: string
  /** Si es false, la animación no se carga hasta que se vuelva true (lazy load). */
  active?: boolean
}

export function LottiePlayer({ src, className, active = true }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current || animationRef.current) return

    let cancelled = false
    import('lottie-web').then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        path: src,
        renderer: 'svg',
        loop: true,
        autoplay: true,
      })
    })

    return () => {
      cancelled = true
      animationRef.current?.destroy()
      animationRef.current = null
    }
  }, [active, src])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
