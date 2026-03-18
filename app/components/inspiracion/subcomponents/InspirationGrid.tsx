'use client'

import { GalleryImage } from '../../../types/gallery'
import { InspirationCard } from './InspirationCard'
import { InspirationCardSkeleton } from './InspirationCardSkeleton'
import { LoadMoreButton } from './LoadMoreButton'

interface InspirationGridProps {
  images: GalleryImage[]
  onImageClick: (index: number) => void
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
  isEmpty: boolean
}

export function InspirationGrid({
  images,
  onImageClick,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  isEmpty,
}: InspirationGridProps) {
  // Estado: carga inicial
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <InspirationCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // Estado: sin resultados (por filtro o vacío)
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-stone-500 text-sm font-medium">Sin resultados</p>
        <p className="text-stone-400 text-xs mt-1">Probá con otro término o categoría</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <InspirationCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(index)}
            index={index}
          />
        ))}

        {/* Skeletons inline al cargar más */}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, i) => (
            <InspirationCardSkeleton key={`more-skeleton-${i}`} />
          ))}
      </div>

      {/* Botón Ver más / spinner */}
      {(hasMore || isLoadingMore) && (
        <LoadMoreButton onClick={onLoadMore} isLoading={isLoadingMore} />
      )}

      {/* Fin del feed */}
      {!hasMore && images.length > 0 && (
        <p className="text-center text-stone-400 text-[11px] tracking-widest uppercase py-4 select-none">
          ✦ &nbsp; Todas las creaciones &nbsp; ✦
        </p>
      )}
    </div>
  )
}
