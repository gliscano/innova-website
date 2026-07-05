'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface CharRevealProps {
  text: string
  delay?: number
  className?: string
}

const charVariants = {
  hidden: { y: '110%' },
  visible: ({ i, delay }: { i: number; delay: number }) => ({
    y: '0%',
    transition: {
      delay: delay + i * 0.04,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export function CharReveal({ text, delay = 0, className }: CharRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }} aria-hidden="true">
          <motion.span
            style={{ display: 'inline-block' }}
            custom={{ i, delay }}
            initial="hidden"
            animate="visible"
            variants={charVariants}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
