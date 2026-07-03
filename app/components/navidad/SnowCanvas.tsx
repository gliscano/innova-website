'use client'

import { useEffect, useRef } from 'react'

interface Flake {
  x: number
  y: number
  r: number
  speed: number
  opacity: number
  drift: number
}

/** Nieve animada en canvas 2D. Se pausa fuera de viewport y respeta prefers-reduced-motion. */
export function SnowCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = canvas?.parentElement
    if (!canvas || !wrap) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas || !wrap) return
      canvas.width = wrap.offsetWidth
      canvas.height = wrap.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const flakes: Flake[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.5,
      speed: Math.random() * 0.7 + 0.3,
      opacity: Math.random() * 0.55 + 0.2,
      drift: (Math.random() - 0.5) * 0.35,
    }))

    let active = false
    let rafId: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        active = entries[0].isIntersecting
        if (active && rafId === null) animate()
      },
      { threshold: 0.1 },
    )
    observer.observe(wrap)

    function animate() {
      if (!active || !ctx || !canvas) {
        rafId = null
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      flakes.forEach((f) => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`
        ctx.fill()
        f.y += f.speed
        f.x += f.drift
        if (f.y > canvas.height) {
          f.y = -4
          f.x = Math.random() * canvas.width
        }
        if (f.x < 0 || f.x > canvas.width) f.x = Math.random() * canvas.width
      })
      rafId = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('resize', resize)
      observer.disconnect()
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
