'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryModalProps } from '../../types/gallery'

export default function GalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  goToNext,
  goToPrevious,
  goToImage,
  category,
}: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Resetear error cuando cambia la imagen
  useEffect(() => {
    if (isOpen && images[initialIndex]) {
      setHasError(false)
    }
  }, [initialIndex, isOpen, images])

  const handleImageError = () => {
    setHasError(true)
  }

  if (!isOpen || !images[initialIndex]) return null

  const currentImage = images[initialIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      >
        <div
          ref={modalRef}
          className="relative w-full h-full max-w-7xl max-h-full flex flex-col"
        >
          {/* Header con información */}
          <div className="flex items-center justify-between text-white mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium">
                {currentImage.display_name}
              </h2>
              <span className="text-sm text-gray-300">
                Imagen {initialIndex + 1} de {images.length}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenedor principal de la imagen */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* Botón anterior */}
            <button
              onClick={() => goToPrevious()}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Imagen principal */}
            <motion.div
              key={initialIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {!hasError ? (
                <CldImage
                  src={currentImage.id}
                  alt={`Imagen ${initialIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  crop="limit"
                  format="auto"
                  quality="auto:best"
                  priority
                  onError={handleImageError}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <svg className="w-24 h-24 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Imagen no disponible</p>
                  <p className="text-sm text-gray-400 mt-2">Esta imagen ya no existe en Cloudinary</p>
                </div>
              )}
            </motion.div>

            {/* Botón siguiente */}
            <button
              onClick={() => goToNext()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer con navegación */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === initialIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Footer con botón de acción */}
          <div className="mt-6 flex items-center justify-center pb-4">
            <Link
              href={`https://wa.me/5491171142152?text=${encodeURIComponent(`Hola, Quiero comprar o consultar sobre\nCategoría: ${category || 'diseño'}\nDiseño: ${currentImage.display_name}\nVer imagen: ${currentImage.url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 hover:scale-105 transform"
              aria-label="Solicitar información o comprar"
            >
              Solicitar información / Comprar
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
