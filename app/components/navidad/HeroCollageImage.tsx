'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useGalleryImages } from '@/app/hooks/useGalleryImages'
import { getNavidadFolderPath, type NavidadCategory } from '@/app/data/navidadCategoriesData'

interface HeroCollageImageProps {
  category: NavidadCategory
  delay: number
  priority?: boolean
  /** Si viene seteado, esta celda muestra un video en loop en vez de la imagen de Cloudinary. */
  videoSrc?: string | null
}

export function HeroCollageImage({ category, delay, priority, videoSrc }: HeroCollageImageProps) {
  const { images } = useGalleryImages({ folder: getNavidadFolderPath(category), itemsPerPage: 1 })
  const image = images[0]
  const ready = Boolean(videoSrc) || Boolean(image)

  return (
    <motion.div
      className="nv-hero-img"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.7, delay }}
    >
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="nv-hero-video"
          aria-label={category.title}
        />
      ) : (
        image && (
          <Image
            src={image.url}
            alt={category.title}
            fill
            sizes="(max-width: 1023px) 50vw, 33vw"
            priority={priority}
          />
        )
      )}
    </motion.div>
  )
}
