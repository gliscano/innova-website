'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { useGalleryImages } from '@/app/hooks/useGalleryImages'
import { getNavidadFolderPath, type NavidadCategory } from '@/app/data/navidadCategoriesData'

interface HeroSlideProps {
  category: NavidadCategory
  priority?: boolean
  reduceMotion: boolean
}

const curtainVariants: Variants = {
  enter: { clipPath: 'inset(0 100% 0 0)' },
  center: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { clipPath: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
  },
  exit: {
    clipPath: 'inset(0 0 0 100%)',
    transition: { clipPath: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  },
}

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export function HeroSlide({ category, priority, reduceMotion }: HeroSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showFallback, setShowFallback] = useState(false)
  const { images } = useGalleryImages({ folder: getNavidadFolderPath(category), itemsPerPage: 1 })
  const fallbackImage = images[0]

  useEffect(() => {
    videoRef.current?.play().catch(() => setShowFallback(true))
  }, [])

  return (
    <motion.div
      className="nv-hero-slide"
      variants={reduceMotion ? fadeVariants : curtainVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <video
        ref={videoRef}
        src={category.heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload={priority ? 'auto' : 'none'}
        poster={fallbackImage?.url}
        onError={() => setShowFallback(true)}
        className="nv-hero-video"
        style={{ display: showFallback ? 'none' : 'block' }}
        aria-hidden="true"
      />
      {showFallback && fallbackImage && (
        <Image
          src={fallbackImage.url}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          className="nv-hero-fallback-img"
        />
      )}
    </motion.div>
  )
}
