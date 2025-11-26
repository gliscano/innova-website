'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CldImage } from 'next-cloudinary'
import { GalleryItemProps } from '../../types/gallery'

export default function GalleryItem({ image, onClick, index }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hasStartedLoadingRef = useRef(false)

  // Intersection Observer para lazy loading
  useEffect(() => {
    // Evitar crear múltiples observers
    if (hasStartedLoadingRef.current || isInView) {
      return
    }

    // Limpiar observer anterior si existe
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedLoadingRef.current) {
          hasStartedLoadingRef.current = true
          setIsInView(true)
          if (observerRef.current) {
            observerRef.current.disconnect()
            observerRef.current = null
          }
        }
      },
      {
        rootMargin: '100px', // Cargar cuando esté a 100px de entrar en viewport
        threshold: 0.01, // Cargar tan pronto como sea visible
      }
    )

    if (imgRef.current && observerRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [isInView])

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setHasError(true)
    setIsLoaded(false)
  }, [])

  const handleClick = useCallback(() => {
    // Trackear clic en imagen en Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gallery_image_click', {
        event_category: 'gallery',
        event_label: 'galleryselected',
        value: image.display_name || 'unknown',
      })
    }
    onClick()
  }, [image.display_name, onClick])

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
        {isInView && !hasError && (
          <CldImage
            src={image.id}
            alt={`Imagen ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            crop="fill"
            format="auto"
            quality="auto:good"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={index < 8} // Prioridad para las primeras 8 imágenes
          />
        )}

        {/* Mensaje de error cuando la imagen no existe */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center px-4">
              <p className="text-sm text-gray-500">Imagen no disponible</p>
            </div>
          </div>
        )}

        {/* Skeleton mientras carga */}
        {!isLoaded && !hasError && isInView && (
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
