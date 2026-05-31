"use client"

import React from "react"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star } from "lucide-react"
import { contentSets, imageSets, type ImageSet } from "@/app/data/heroGalleryData"
import { GalleryCard } from "./GalleryCard"
import { Confetti } from "./Confetti"
import { SolDeMayo } from "./SolDeMayo"

// Función para seleccionar 9 imágenes aleatorias sin repetir
const getRandomImages = (allImages: ImageSet[], count: number = 9): ImageSet[] => {
  const shuffled = [...allImages].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function HeroGallery() {
  const secondsToChangeSet = 12000
  const [currentSet, setCurrentSet] = useState(0)
  
  const allImages = useMemo(() => imageSets.flat(), [])
  
  const [selectedImages, setSelectedImages] = useState(() => allImages.slice(0, 9))

  const handleViewDesigns = () => {
    const catalogSection = document.getElementById('catalog')
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
  useEffect(() => {
    setSelectedImages(getRandomImages(allImages, 9))
  }, [allImages])
  
  // Distribuir en 3 columnas de 3 imágenes cada una
  const column1 = selectedImages.slice(0, 3)
  const column2 = selectedImages.slice(3, 6)
  const column3 = selectedImages.slice(6, 9)

  useEffect(() => {
    if (contentSets.length > 1) {
      const interval = setInterval(() => {
        setCurrentSet((prev) => (prev + 1) % 2)
      }, secondsToChangeSet)

      return () => clearInterval(interval)
    }
  }, [])

  const content = contentSets[currentSet]

  return (
    <section className="relative min-h-screen hero-background overflow-hidden">
      {/* Sol de Mayo — marca de agua tenue de fondo */}
      <SolDeMayo className="pointer-events-none absolute -right-24 -top-24 z-0 w-[400px] h-[400px] lg:w-[560px] lg:h-[560px] opacity-[0.08]" />

      {/* Confeti de celebración (cae una sola vez al cargar) */}
      <Confetti />

      {/* Glassmorphism overlay container */}
      <div className="relative z-10 container mx-auto px-4 py-1 lg:py-10">
        <div className="p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="sticky top-10 pt-4 lg:pt-16">
            <motion.div
              className="py-1"
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
                src="/images/innova-backdrops-mundial.png"
                alt="Innova Backdrops Mundial"
                width={150}
                height={150}
                priority
                style={{ height: "auto" }}
              />
            </motion.div>
            {/* 3 estrellas doradas — campeón del mundo */}
            <div className="flex gap-1.5 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + i * 0.15, type: "spring", stiffness: 400, damping: 12 }}
                >
                  <Star className="w-5 h-5 text-[#f2b705] fill-[#f2b705] drop-shadow-[0_1px_1px_rgba(11,46,99,0.4)]" />
                </motion.span>
              ))}
            </div>
            {/* Animated Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSet}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="copperplate-bold-font text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b2e63] leading-tight mb-6 text-balance"
              >
                <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#0b2e63] leading-tight mb-6 text-balance">
                  {content.title}
                </span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(123deg, rgba(2, 40, 115, 1) 0%, rgb(45, 109, 166) 22%, rgba(22, 135, 45, 1) 55%, rgba(200, 18, 18, 1) 95%)",
                  }}
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
                className="text-[#1f3a5f] text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
              >
                {content.description}
              </motion.p>
            </AnimatePresence>

            {/* Process explanation */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-[#2c4a73] mb-6 flex-wrap">
              <span className="font-medium">Elegís el diseño</span>
              <span className="text-[#75aadb]">→</span>
              <span className="font-medium">Lo producimos con calidad premium</span>
              <span className="text-[#75aadb]">→</span>
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
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  onClick={handleViewDesigns}
                  aria-label={content.buttonText}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full btn-cta-style"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#2d6da6",
                    backgroundImage:
                      "linear-gradient(123deg, rgba(2, 40, 115, 1) 0%, rgb(45, 109, 166) 22%, rgba(22, 135, 45, 1) 55%, rgba(200, 18, 18, 1) 95%)",
                    boxShadow: "0 4px 12px rgba(2, 40, 115, 0.35)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {content.buttonText}
                </motion.button>

                {content.secondaryButtonText && content.secondaryButtonUrl && (
                  <motion.a
                    href={content.secondaryButtonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={content.secondaryButtonText}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#0b2e63] text-[#0b2e63] hover:bg-[#75aadb]/20 transition-colors"
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
                className="flex gap-8 mt-6 pt-4 border-t border-[#75aadb]/40"
              >
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-[#0b2e63]">{stat.value}</p>
                    <p className="text-[#2c4a73] text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Gallery Grid with Animated Images */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
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
