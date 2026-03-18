'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { CldImage } from 'next-cloudinary'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryModalProps } from '../../types/gallery'
import WhatsAppDropdown from '../WhatsAppDropdown'

function parseDescription(raw?: string) {
  if (!raw?.trim()) return null

  const coloresRegex = /\n*\s*colores\s*:\s*/i
  const match = raw.search(coloresRegex)

  if (match === -1) {
    return { text: raw.trim(), colors: null }
  }

  const text = raw.slice(0, match).trim()
  const colorsRaw = raw.slice(match).replace(coloresRegex, '').trim()
  const colors = colorsRaw
    .split(/,\s*/)
    .map(c => c.replace(/\.$/, '').trim())
    .filter(Boolean)

  return { text: text || null, colors: colors.length > 0 ? colors : null }
}

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
  const [showDescription, setShowDescription] = useState(false)

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

  useEffect(() => {
    if (isOpen && images[initialIndex]) {
      setHasError(false)
      setShowDescription(false)
    }
  }, [initialIndex, isOpen, images])

  const handleImageError = () => {
    setHasError(true)
  }

  const currentImage = images[initialIndex] ?? null
  const description = useMemo(() => parseDescription(currentImage?.description), [currentImage?.description])

  if (!isOpen || !currentImage) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      >
        <div
          ref={modalRef}
          className="relative w-full h-full max-w-7xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white mb-4 flex-shrink-0">
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
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenedor principal de la imagen */}
          <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-hidden">
            <button
              onClick={() => goToPrevious()}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <motion.div
              key={initialIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex items-center justify-center p-4"
            >
              {!hasError ? (
                <CldImage
                  src={currentImage.id}
                  alt={description?.text || `Imagen ${initialIndex + 1}`}
                  width={1600}
                  height={1200}
                  className="object-contain w-auto h-auto max-w-full max-h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"
                  crop="limit"
                  format="webp"
                  quality="auto:good"
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

            <button
              onClick={() => goToNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Descripción y colores */}
          {description && (
            <div className="flex-shrink-0 px-2 sm:px-6 mt-2 mb-8 space-y-2">
              {/* Colores siempre visibles */}
              {description.colors && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mr-1">Colores</span>
                  {description.colors.map((color) => (
                    <span
                      key={color}
                      className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              )}

              {/* Descripción: 2 líneas visibles + expandible */}
              {description.text && (
                <div>
                  <p
                    className={`text-gray-300 text-sm leading-relaxed transition-all duration-200 ${
                      showDescription ? '' : 'line-clamp-2'
                    }`}
                  >
                    {description.text}
                  </p>
                  <button
                    onClick={() => setShowDescription(prev => !prev)}
                    className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors text-xs mt-1"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${showDescription ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {showDescription ? 'Ver menos' : 'Ver más'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-center pb-4 flex-shrink-0">
            <WhatsAppDropdown
              buttonText="Quiero comprar o consultar"
              message={`Hola, Quiero comprar o consultar sobre\nCategoría: ${category || 'diseño'}\nDiseño: ${currentImage.display_name}\nVer imagen: ${currentImage.url}`}
              className="px-2 py-1 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 hover:scale-105 transform flex items-center gap-2"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
