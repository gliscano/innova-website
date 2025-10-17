'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { GalleryItemProps } from '../../types/gallery'

export default function GalleryItem({ image, onClick, index }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Cargar cuando esté a 50px de entrar en viewport
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  const handleClick = () => {
    // Trackear clic en imagen en Google Analytics
    /* if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_image_click', {
        event_category: 'gallery',
        event_label: `image_${index}`,
        value: index,
      })
    } */
    onClick()
  }

  return (
    <div
      ref={imgRef}
      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Contenedor de imagen con aspect ratio */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {isInView && (
          <Image
            src={image.url}
            alt={`Imagen ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 768px) 50vw, 25vw"
            onLoad={handleImageLoad}
            priority={index < 8} // Prioridad para las primeras 8 imágenes
          />
        )}
        
        {/* Skeleton mientras carga */}
        {!isLoaded && isInView && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Overlay con información */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-white bg-opacity-90 text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Ver imagen
            </div>
          </div>
        </div>
      </div>

      {/* Información de la imagen */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            {image.display_name}
          </span>
        </div>
        
        {/* Tags */}
        {image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {image.tags.length > 2 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{image.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
