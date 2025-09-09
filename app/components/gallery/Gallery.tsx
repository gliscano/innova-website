'use client'

import { GalleryProps } from '../../types/gallery'
import { useGalleryImages } from '../../hooks/useGalleryImages'
import { useGalleryModal } from '../../hooks/useGalleryModal'
import GalleryGrid from './GalleryGrid'
import GalleryModal from './GalleryModal'
import GallerySkeleton from './GallerySkeleton'
import GalleryError from './GalleryError'

export default function Gallery(props: GalleryProps) {
  const {
    images,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
  } = useGalleryImages(props)

  const {
    isOpen: isModalOpen,
    currentIndex: modalIndex,
    currentImage: modalImage,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
    goToImage,
  } = useGalleryModal(images)

  const handleImageClick = (index: number) => {
    openModal(index)
  }

  const handleModalClose = () => {
    closeModal()
  }

  if (process.env.NODE_ENV !== 'production') {
    // Debug solo en desarrollo
    console.log('gallery images count', images.length)
  }

  // Mostrar skeleton durante la carga inicial
  if (isLoading && images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Galería de Imágenes
            </h1>
            <p className="text-gray-600">
              Cargando imágenes...
            </p>
          </div>
          <GallerySkeleton count={8} />
        </div>
      </div>
    )
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Galería de Imágenes
            </h1>
          </div>
          <GalleryError message={error} onRetry={refresh} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Galería de Imágenes
          </h1>
          
          {/* Información de búsqueda */}
          {
            props.showTags && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {props.searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    Búsqueda: {props.searchTerm}
                  </span>
                )}
                
                {props.tags && props.tags.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                    Tags: {props.tags.join(', ')}
                  </span>
                )}
                
                {props.folder && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                    Carpeta: {props.folder}
                  </span>
                )}
                
                {props.collection && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                    Colección: {props.collection}
                  </span>
                )}
              </div>
          )}

          {/* Contador de resultados */}
          {totalCount > 0 && (
            <p className="text-gray-600 mt-2">
              {totalCount} imagen{totalCount !== 1 ? 'es' : ''} encontrada{totalCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grid de imágenes */}
        <GalleryGrid
          images={images}
          onImageClick={handleImageClick}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />

        {/* Modal */}
        {modalImage && (
          <GalleryModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            images={images}
            initialIndex={modalIndex}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            goToImage={goToImage}
          />
        )}
      </div>
    </div>
  )
}
