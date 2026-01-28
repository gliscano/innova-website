"use client"

import React from "react"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { contentSets, imageSets, type ImageSet } from "@/app/data/heroGalleryData"
import { GalleryCard } from "./GalleryCard"

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
  
  useEffect(() => {
    setSelectedImages(getRandomImages(allImages, 9))
  }, [allImages])
  
  // Distribuir en 3 columnas de 3 imágenes cada una
  const column1 = selectedImages.slice(0, 3)
  const column2 = selectedImages.slice(3, 6)
  const column3 = selectedImages.slice(6, 9)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % 2)
    }, secondsToChangeSet)

    return () => clearInterval(interval)
  }, [])

  const content = contentSets[currentSet]

  return (
    <section className="relative min-h-screen hero-background overflow-hidden">
      {/* Glassmorphism overlay container */}
      <div className="relative z-10 container mx-auto px-4 py-1 lg:py-10">
        <div className="p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="sticky top-10 pt-4 lg:pt-16">
            <div className="py-1 mb-4">
              <Image src="/svg/innova-logo.svg" alt="Innova Logo" width={128} height={0} style={{ height: 'auto' }} />
            </div>
            {/* Animated Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSet}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a3a2a] leading-tight mb-6 text-balance"
              >
                {content.title}
                <br />
                <span className={`bg-gradient-to-r ${content.gradientFrom} ${content.gradientVia} ${content.gradientTo} bg-clip-text text-transparent`}>
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
                className="text-[#6b5d52] text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
              >
                {content.description}
              </motion.p>
            </AnimatePresence>

            {/* CTA Button */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`btn-${currentSet}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  className="inline-flex items-center justify-center px-6 py-4 rounded-full btn-cta-style"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {content.buttonText}
                </button>
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
                className="flex gap-8 mt-12 pt-8 border-t border-[#cab896]/40"
              >
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-[#4a3a2a]">{stat.value}</p>
                    <p className="text-[#8b7355] text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSet(index)}
                  className="relative h-1 w-12 rounded-full overflow-hidden bg-[#cab896]/40 transition-all duration-300"
                  aria-label={`Ir a slide ${index + 1}`}
                >
                  {currentSet === index && (
                    <motion.div
                      className="absolute inset-0 bg-[#c19d83] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: "linear" }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Gallery Grid with Animated Images */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {/* Column 1 */}
            <div className="flex flex-col gap-3 lg:gap-4 pt-16">
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
            <div className="flex flex-col gap-3 lg:gap-4 pt-24">
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
