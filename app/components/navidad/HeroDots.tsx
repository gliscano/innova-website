'use client'

import { motion } from 'framer-motion'
import type { NavidadCategory } from '@/app/data/navidadCategoriesData'

interface HeroDotsProps {
  categories: NavidadCategory[]
  current: number
  onChange: (index: number) => void
}

export function HeroDots({ categories, current, onChange }: HeroDotsProps) {
  return (
    <div className="nv-hero-dots">
      {categories.map((category, i) => {
        const isActive = i === current
        return (
          <motion.button
            key={category.id}
            type="button"
            className="nv-hero-dot"
            aria-label={`Ir a ${category.title} (slide ${i + 1} de ${categories.length})`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onChange(i)}
            animate={{
              width: isActive ? 10 : 6,
              height: isActive ? 10 : 6,
              backgroundColor: isActive ? category.accentColor : 'rgba(0,0,0,0)',
              borderColor: isActive ? category.accentColor : 'rgba(255,255,255,0.5)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )
      })}
    </div>
  )
}
