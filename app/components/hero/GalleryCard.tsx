"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
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

export function GalleryCard({ image, delay = 0 }: GalleryCardProps) {
  const Icon = image.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        ...floatAnimation 
      }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut" 
      }}
      whileHover={{ scale: 1.03, y: -5 }}
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

      {/* Icon badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.3 }}
        className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg"
      >
        <Icon className="w-4 h-4 text-gray-700" />
      </motion.div>

      {/* Hover overlay with title */}
      <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-medium drop-shadow-lg">
          {image.alt}
        </p>
      </div>
    </motion.div>
  )
}
