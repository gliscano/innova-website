"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

// Paleta mundialista albiceleste + dorado de la copa
const COLORS = ["#75aadb", "#ffffff", "#f2b705", "#0b2e63", "#aacbe8", "#e0b000"]

interface ConfettiProps {
  count?: number
}

// Confeti de celebración que cae una sola vez al cargar el hero,
// sincronizado con el rebote del logo-pelota.
export function Confetti({ count = 70 }: ConfettiProps) {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.8,
        duration: 2.6 + Math.random() * 1.8,
        spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
        size: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 140,
        rounded: i % 3 === 0,
      })),
    [count]
  )

  if (!mounted || prefersReducedMotion) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-20"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
          }}
          initial={{ y: "-10%", x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: "115vh",
            x: p.drift,
            opacity: [0, 1, 1, 0.9, 0],
            rotate: p.spin,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  )
}
