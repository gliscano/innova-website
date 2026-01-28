"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const floatAnimation = {
  y: [0, -8, 0],
}

interface GalleryCardProps {
  image: {
    src: string
    alt: string
    icon: React.ComponentType<{ className?: string }>
    column: number
    height: string
  }
  delay?: number
}

export const GalleryCard = React.memo(function GalleryCard({ image, delay = 0 }: GalleryCardProps) {
  const Icon = image.icon

  return (
    <motion.div
      animate={floatAnimation}
      transition={{ 
        y: { 
          duration: 3.5, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay 
        },
      }}
      whileHover={{ y: -5 }}
      className={`relative ${image.height} rounded-2xl overflow-hidden group cursor-pointer`}
    >
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-medium drop-shadow-lg">
          {image.alt}
        </p>
      </div>
    </motion.div>
  )
})
