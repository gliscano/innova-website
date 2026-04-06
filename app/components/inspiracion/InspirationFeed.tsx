'use client'

import { GalleryImage } from '../../types/gallery'
import { useInspirationFeed } from '../../hooks/useInspirationFeed'
import { useGalleryModal } from '../../hooks/useGalleryModal'
import { InspirationGrid } from './subcomponents/InspirationGrid'
import GalleryModal from '../gallery/GalleryModal'

interface InspirationFeedProps {
  folder?: string
  initialImages?: GalleryImage[]
  initialCursor?: string | null
}

export function InspirationFeed({ folder, initialImages, initialCursor }: InspirationFeedProps) {
  const {
    filteredImages,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    retry,
  } = useInspirationFeed({ folder, initialImages, initialCursor })

  const {
    isOpen: isModalOpen,
    currentIndex: modalIndex,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
  } = useGalleryModal(filteredImages)

  if (error && filteredImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-stone-500 text-sm">{error}</p>
        <button onClick={retry} className="btn-cta-style px-6 py-2 rounded-full text-sm">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Grid de creaciones */}
      <div className="px-3 sm:px-4 pt-4">
        <InspirationGrid
          images={filteredImages}
          onImageClick={openModal}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isEmpty={!isLoading && filteredImages.length === 0}
        />
      </div>

      {/* Modal unificado */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={filteredImages}
        initialIndex={modalIndex}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        category={undefined}
      />
    </div>
  )
}
