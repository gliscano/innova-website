'use client'

import { motion } from 'framer-motion'
import WhatsAppDropdown from '@/app/components/WhatsAppDropdown'
import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { HeroCollageImage } from './HeroCollageImage'

const HERO_WA_MESSAGE = 'Hola, vi el catálogo Navidad 2026 y quiero consultar'

// Video para la primera celda del collage (categoría Tendencia). Pendiente de recibir el asset —
// mientras sea null, esa celda sigue mostrando la imagen de Cloudinary como hoy.
const HERO_VIDEO_SRC: string | null = null

export function HeroSection() {
  return (
    <section className="nv-hero" aria-label="Catálogo Navidad 2026">
      <div className="nv-hero-grid" aria-hidden="true">
        {navidadCategories.map((category, i) => (
          <HeroCollageImage
            key={category.id}
            category={category}
            delay={0.1 + i * 0.15}
            priority={i < 2}
            videoSrc={i === 0 ? HERO_VIDEO_SRC : undefined}
          />
        ))}
      </div>
      <div className="nv-hero-overlay" aria-hidden="true" />
      <div className="nv-hero-content">
        <motion.p
          className="nv-hero-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
        >
          Catálogo · Navidad 2026
        </motion.p>
        <motion.h1
          className="nv-hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          Seis mundos
          <br />
          para tu sesión
          <br />
          <strong>perfecta</strong>
        </motion.h1>
        <motion.p
          className="nv-hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
        >
          Fondos fotográficos de alta definición.
          <br />
          Cada escena, una historia.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        >
          <WhatsAppDropdown
            message={HERO_WA_MESSAGE}
            buttonText="Consultar por WhatsApp"
            className="nv-hero-cta"
            iconClassName="w-4 h-4"
          />
        </motion.div>
      </div>
    </section>
  )
}
