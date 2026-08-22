"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { contentSets, imageSets } from "@/app/data/heroGalleryData"
import { trackHeroCta } from "@/app/utils/tracking"
import { GalleryCard } from "./GalleryCard"

const MotionLink = motion.create(Link)

export function HeroGallery() {
  // Sólo existe un contentSet; el `setInterval` de rotación que había acá nunca llegaba a
  // dispararse (su guard era `contentSets.length > 1`) y arrastraba estado sin uso.
  const currentSet = 0

  // `imageSets` tiene exactamente 9 imágenes y la grilla muestra 9, así que el shuffle que había
  // acá no elegía un subconjunto: sólo permutaba el orden. Corría en un useEffect post-montaje, de
  // modo que las imágenes se reacomodaban después de la hidratación y el elemento LCP del desktop
  // cambiaba en cada carga. Orden fijo: mismo contenido, LCP estable.
  const images = useMemo(() => imageSets.flat(), [])

  const column1 = images.slice(0, 3)
  const column2 = images.slice(3, 6)
  const column3 = images.slice(6, 9)

  // El CTA primario ahora es un <Link> real (rastreable). En la home, donde la sección #catalog
  // está en la misma página, se intercepta para conservar el scroll suave.
  const handleViewDesigns = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackHeroCta('catalog')
    const catalogSection = document.getElementById('catalog')
    if (catalogSection) {
      e.preventDefault()
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const content = contentSets[currentSet]

  return (
    <section className="relative lg:min-h-[50vh] overflow-hidden">
      {/* Glassmorphism overlay container */}
      <div className="relative z-10 container mx-auto px-4 py-1 lg:py-10">
        <div className="p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="sticky top-10 pt-4 lg:pt-16">
            <motion.div
              className="py-1 mb-6"
              initial={{ y: -520, opacity: 0 }}
              animate={{
                y: [-520, 0, -120, 0, -52, 0, -18, 0],
                opacity: [0, 1, 1, 1, 1, 1, 1, 1],
                scaleX: [1, 1.22, 1, 1.12, 1, 1.06, 1, 1],
                scaleY: [1, 0.78, 1, 0.88, 1, 0.94, 1, 1],
              }}
              transition={{
                duration: 1.6,
                times: [0, 0.34, 0.54, 0.68, 0.8, 0.88, 0.95, 1],
                ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
              }}
              style={{ transformOrigin: "bottom center", width: "fit-content" }}
            >
              <Image
                src="/svg/innova-logo.svg"
                alt="Innova Logo"
                width={150}
                height={37}
                priority
                style={{ height: "auto" }}
              />
            </motion.div>
            {/* Animated Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSet}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="copperplate-bold-font text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance"
              >
                <span className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
                  {content.title}
                </span>
                <br />
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${content.gradientFrom} ${content.gradientVia} ${content.gradientTo}`}
                >
                  {content.highlight}
                </span>
                <br />
                {content.subtitle}
              </motion.h1>
            </AnimatePresence>

            {/* Animated Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentSet}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="sm:block text-[var(--ink-soft)] text-base md:text-xl max-w-xl mb-4 leading-relaxed"
              >
                {content.description}
              </motion.p>
            </AnimatePresence>

            {/* Process explanation */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-[var(--ink-soft)] mb-6 flex-wrap">
              <span className="font-medium">Elegís el diseño</span>
              <span className="text-[var(--accent)]">→</span>
              <span className="font-medium">Lo producimos con calidad premium</span>
              <span className="text-[var(--accent)]">→</span>
              <span className="font-medium">Lo recibís en tu estudio o evento</span>
            </div>

            {/* CTA Buttons */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`btn-${currentSet}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                /* Estaba en `hidden sm:flex`: los dos CTA del hero eran invisibles en mobile. */
                className="flex flex-wrap gap-3"
              >
                <MotionLink
                  href="/design-catalog"
                  onClick={handleViewDesigns}
                  aria-label={content.buttonText}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full btn-cta-style"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {content.buttonText}
                </MotionLink>

                {content.secondaryButtonText && content.secondaryButtonUrl && (
                  <motion.a
                    href={content.secondaryButtonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={content.secondaryButtonText}
                    onClick={() => trackHeroCta('stock')}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {content.secondaryButtonText}
                  </motion.a>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Animated Stats */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`stats-${currentSet}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden sm:flex gap-8 mt-6 pt-4 border-t border-[var(--line)]"
              >
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-[var(--ink)]">{stat.value}</p>
                    <p className="text-[var(--ink-soft)] text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Gallery Grid with Animated Images */}
          <div id="hero-gallery-grid" className="hidden lg:grid grid-cols-3 gap-3 lg:gap-4">
            {/* Column 1 */}
            <div className="flex flex-col gap-3 lg:gap-4 pt-12">
              {column1.map((image, index) => (
                <GalleryCard
                  key={image.src}
                  image={image}
                  delay={index * 0.1}
                />
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3 lg:gap-4 pt-4">
              {column2.map((image, index) => (
                <GalleryCard
                  key={image.src}
                  image={image}
                  delay={index * 0.1 + 0.1}
                />
              ))}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3 lg:gap-4 pt-16">
              {column3.map((image, index) => (
                <GalleryCard
                  key={image.src}
                  image={image}
                  delay={index * 0.1 + 0.2}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
