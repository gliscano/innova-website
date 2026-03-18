'use client'

import { useCallback, useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { GalleryImage } from '../../../types/gallery'

interface InspirationCardProps {
  image: GalleryImage
  onClick: () => void
  index: number
}

export function InspirationCard({ image, onClick, index }: InspirationCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isPriority = index < 8

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'inspiration_card_click', {
        event_category: 'inspiration',
        event_label: image.display_name || 'unknown',
      })
    }
    onClick()
  }, [image.display_name, onClick])

  return (
    <article
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-stone-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver creación: ${image.display_name || `Imagen ${index + 1}`}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {!hasError ? (
          <CldImage
            src={image.id}
            fill
            alt={image.display_name || `Creación ${index + 1}`}
            crop="fill"
            gravity="auto"
            format="webp"
            quality="auto"
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
            priority={isPriority}
            loading={isPriority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            onError={() => { setHasError(true); setIsLoaded(false) }}
            className={`object-cover transition-all duration-500 group-hover:scale-[1.04] ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-200">
            <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Skeleton placeholder */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
        )}

        {/* Overlay degradado inferior al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Info flotante al hacer hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          {image.display_name && (
            <p className="text-white text-xs font-medium truncate leading-snug drop-shadow">
              {image.display_name}
            </p>
          )}
          {image.tags?.[0] && (
            <p className="text-white/65 text-[10px] truncate mt-0.5 capitalize">
              {image.tags[0]}
            </p>
          )}
        </div>

        {/* Indicador "Ver" — solo desktop */}
        <div className="hidden md:flex absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-white/90 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            Ver
          </span>
        </div>
      </div>
    </article>
  )
}
