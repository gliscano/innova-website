'use client'

import Link from 'next/link'
import { motion, type Transition } from 'framer-motion'
import WhatsAppDropdown from '@/app/components/WhatsAppDropdown'
import type { NavidadCategory } from '@/app/data/navidadCategoriesData'
import { CharReveal } from './CharReveal'

interface HeroContentProps {
  category: NavidadCategory
  index: number
  total: number
  reduceMotion: boolean
}

export function HeroContent({ category, index, total, reduceMotion }: HeroContentProps) {
  const fadeProps = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay } as Transition,
        }

  return (
    <div className="nv-hero-content">
      <motion.p className="nv-hero-eyebrow" {...fadeProps(0)}>
        <span
          className="nv-hero-eyebrowAccent"
          style={{ backgroundColor: category.accentColor }}
          aria-hidden="true"
        />
        {category.eyebrow}
      </motion.p>

      <h1 className="nv-hero-headline">
        <span className="nv-hero-headlineLine">
          <CharReveal text={category.heroHeadline[0]} delay={reduceMotion ? 0 : 0.15} />
        </span>
        <span className="nv-hero-headlineLine">
          <CharReveal text={category.heroHeadline[1]} delay={reduceMotion ? 0 : 0.3} />
        </span>
      </h1>

      <motion.div className="nv-hero-ctaRow" {...fadeProps(0.6)}>
        <Link
          href={`#${category.id}`}
          className="nv-hero-ctaPrimary"
          style={{ borderLeftColor: category.accentColor, borderLeftWidth: '3px' }}
          aria-label={`Ver colección ${category.title}`}
        >
          Ver colección
        </Link>
        <WhatsAppDropdown
          message={category.waMessage}
          buttonText="Consultar por WhatsApp"
          className="nv-hero-ctaWA"
          iconClassName="w-4 h-4"
        />
      </motion.div>

      <p className="nv-hero-slideCounter">
        <span className="nv-hero-slideCounterCurrent">{String(index + 1).padStart(2, '0')}</span>
        {` / ${String(total).padStart(2, '0')}`}
      </p>
    </div>
  )
}
