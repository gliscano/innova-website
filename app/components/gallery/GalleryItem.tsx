'use client'

import { useCallback, useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { GalleryItemProps } from '../../types/gallery'

export default function GalleryItem({ image, onClick, index }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

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

  const isPriority = index < 4

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 md:hover:shadow-lg md:hover:scale-[1.02]"
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
      {/* Contenedor de imagen con ratio 3:2 */}
      <div className="aspect-[3/2] relative overflow-hidden bg-gray-100">
        {!hasError && (
          <CldImage
            src={image.id}
            width={640}
            height={426} // 3:2
            alt={`Imagen ${index + 1}`}
            crop="fill"
            gravity="auto"
            format="auto"
            quality="auto"
            sizes="(max-width: 639px) 50vw, 25vw"
            priority={isPriority}
            loading={isPriority ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Skeleton mientras carga */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Mensaje de error cuando la imagen no existe */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center px-4">
              <p className="text-sm text-gray-500">Imagen no disponible</p>
            </div>
          </div>
        )}

        {/* Overlay CTA (solo desktop hover) */}
        <div className="absolute inset-0 bg-black bg-opacity-0 md:group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 md:group-hover:translate-y-0">
            <div className="bg-white bg-opacity-90 text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Ver imagen
            </div>
          </div>
        </div>
      </div>

      {/* Información de la imagen */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 truncate max-w-full">
            {image.display_name}
          </span>
        </div>

        {/* Tags */}
        {image.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={`${tag}-${tagIndex}`}
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