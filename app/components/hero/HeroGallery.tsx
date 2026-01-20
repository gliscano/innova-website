"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { contentSets, imageSets } from "@/app/data/heroGalleryData"
import { GalleryCard } from "./GalleryCard"

export function HeroGallery() {
  const [currentSet, setCurrentSet] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % 3)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const content = contentSets[currentSet]
  const images = imageSets[currentSet]

  const column1 = images.filter((img) => img.column === 1)
  const column2 = images.filter((img) => img.column === 2)
  const column3 = images.filter((img) => img.column === 3)

  return (
    <section className="relative min-h-screen bg-[#c2a582] overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b59b7c] via-[#a89072] to-[#8b7355]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#cab896]/25 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#dedcda]/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-1 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="sticky top-10 pt-4 lg:pt-16">
            {/* Animated Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSet}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5ede4] leading-tight mb-6 text-balance"
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
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[#e8dcc9] text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
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
                  className="inline-flex items-center justify-center bg-[#dfac4f] hover:bg-[#e7b854] text-[#4a3a2a] px-8 py-6 text-lg font-semibold rounded-full shadow-xl shadow-[#dfac4f]/40 transition-all duration-300"
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
                className="flex gap-8 mt-12 pt-8 border-t border-[#c4b09a]/30"
              >
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-[#f5ede4]">{stat.value}</p>
                    <p className="text-[#c4b09a] text-sm">{stat.label}</p>
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
                  className="relative h-1 w-12 rounded-full overflow-hidden bg-[#c4b09a]/30 transition-all duration-300"
                  aria-label={`Ir a slide ${index + 1}`}
                >
                  {currentSet === index && (
                    <motion.div
                      className="absolute inset-0 bg-[#dfac4f] rounded-full"
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
              <AnimatePresence mode="wait">
                {column1.map((image, index) => (
                  <GalleryCard
                    key={`col1-${currentSet}-${index}`}
                    image={image}
                    delay={index * 0.1}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3 lg:gap-4 pt-4">
              <AnimatePresence mode="wait">
                {column2.map((image, index) => (
                  <GalleryCard
                    key={`col2-${currentSet}-${index}`}
                    image={image}
                    delay={index * 0.1 + 0.1}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3 lg:gap-4 pt-24">
              <AnimatePresence mode="wait">
                {column3.map((image, index) => (
                  <GalleryCard
                    key={`col3-${currentSet}-${index}`}
                    image={image}
                    delay={index * 0.1 + 0.2}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
