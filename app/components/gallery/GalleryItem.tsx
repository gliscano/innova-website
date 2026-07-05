'use client'

import { useCallback, useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { GalleryItemProps } from '../../types/gallery'

export default function GalleryItem({ image, onClick, index, ratio }: GalleryItemProps) {
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
      className="group cursor-pointer relative overflow-hidden rounded-[14px] bg-black/[0.06] transition-transform duration-150 active:scale-[0.98]"
      style={{ aspectRatio: ratio }}
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
      {/* Contenedor de imagen con el aspect ratio natural del diseño */}
      <div className="absolute inset-0 overflow-hidden">
        {!hasError && (
          <CldImage
            src={image.id}
            width={640}
            height={Math.round(640 / ratio)}
            alt={`Imagen ${index + 1}`}
            crop="fill"
            gravity="auto"
            format="webp"
            quality="auto:good"
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            priority={isPriority}
            loading={isPriority ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`h-full w-full object-cover transition-[opacity,transform] duration-300 md:group-hover:scale-[1.03] ${
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

    </div>
  )
}