'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryModalProps } from '../../types/gallery'

export default function GalleryModal({ isOpen, onClose, images, initialIndex }: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

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
                Imagen {initialIndex + 1} de {images.length}
              </h2>
              <span className="text-sm text-gray-300">
                {currentImage.width} × {currentImage.height}
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
              onClick={() => {
                const prevIndex = initialIndex === 0 ? images.length - 1 : initialIndex - 1
                // Aquí necesitarías actualizar el índice en el componente padre
                // Por ahora solo cerramos y reabrimos
                onClose()
              }}
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
              <Image
                src={currentImage.url}
                alt={`Imagen ${initialIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Botón siguiente */}
            <button
              onClick={() => {
                const nextIndex = (initialIndex + 1) % images.length
                // Aquí necesitarías actualizar el índice en el componente padre
                // Por ahora solo cerramos y reabrimos
                onClose()
              }}
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
                onClick={() => {
                  // Aquí necesitarías actualizar el índice en el componente padre
                  // Por ahora solo cerramos y reabrimos
                  onClose()
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === initialIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Indicadores de navegación */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            <p className="text-center">
              Usa las flechas del teclado para navegar o ESC para cerrar
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
