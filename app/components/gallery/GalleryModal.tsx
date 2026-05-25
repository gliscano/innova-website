'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { CldImage } from 'next-cloudinary'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryModalProps } from '../../types/gallery'
import WhatsAppDropdown from '../WhatsAppDropdown'
import { useSelectedSize } from '../../context/SelectedSizeContext'
import { SizeSelectorCompact } from '../SizeSelectorCompact'

function parseDescription(img?: GalleryModalProps['images'][number]) {
  const raw = typeof img?.description === 'string' && img.description.trim() !== ''
    ? img.description
    : typeof img?.context?.Description === 'string'
    ? img.context.Description
    : ''

  if (!raw.trim()) return null

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
  category,
}: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const { selectedSize, setSelectedSize, setModalOpen } = useSelectedSize()

  useEffect(() => {
    setModalOpen(isOpen)
    return () => setModalOpen(false)
  }, [isOpen, setModalOpen])

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
  const description = useMemo(() => parseDescription(currentImage), [currentImage])

  const whatsappMessage = selectedSize
    ? `Hola! Me interesa este diseño:\nCategoría: ${category || 'diseño'}\nDiseño: ${currentImage?.display_name}\nTamaño elegido: ${selectedSize.label} — desde $${selectedSize.fromPrice?.toLocaleString('es-AR')}\nVer imagen: ${currentImage?.url}`
    : `Hola, Quiero comprar o consultar sobre\nCategoría: ${category || 'diseño'}\nDiseño: ${currentImage?.display_name}\nVer imagen: ${currentImage?.url}`

  if (!isOpen || !currentImage) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 mob-landscape:p-0"
      >
        <div
          ref={modalRef}
          className="relative w-full h-full max-w-7xl flex flex-col mob-landscape:flex-row overflow-hidden"
        >
          {/* Botón cerrar — siempre absoluto top-right */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── IMAGEN ──
              Portrait:  order-1 → siempre arriba (flex-1)
              Landscape: order-1 → columna izquierda, ocupa toda la altura */}
          <div className="flex-1 relative min-h-0 overflow-hidden order-1">

            {/* Header overlay — solo en portrait (título + contador sobre la imagen) */}
            <div className="absolute top-0 inset-x-0 z-10 flex items-end pb-2 px-4 pt-8 bg-gradient-to-b from-black/60 to-transparent mob-landscape:hidden">
              <div className="pr-10">
                <h2 className="text-sm font-medium text-white leading-tight truncate">
                  {currentImage.display_name}
                </h2>
                <span className="text-xs text-gray-300">
                  {initialIndex + 1} / {images.length}
                </span>
              </div>
            </div>
            <motion.div
              key={initialIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {!hasError ? (
                <CldImage
                  src={currentImage.id}
                  alt={description?.text || `Imagen ${initialIndex + 1}`}
                  width={1600}
                  height={1200}
                  className="object-contain w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"
                  crop="limit"
                  format="webp"
                  quality="auto:good"
                  loading="eager"
                  onError={handleImageError}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <svg className="w-24 h-24 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Imagen no disponible</p>
                  <p className="text-sm text-gray-400 mt-2">Esta imagen ya no está disponible</p>
                </div>
              )}
            </motion.div>

            {/* Controles de navegación encima de la imagen */}
            <button
              onClick={() => goToPrevious()}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => goToNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* ── PANEL INFO ──
              Portrait:  order-2 → siempre debajo de la imagen (descripción + footer)
              Landscape: order-2 → columna derecha fija (w-64), con scroll propio */}
          <div className="flex flex-col flex-shrink-0 order-2 mob-landscape:w-64 mob-landscape:h-full mob-landscape:overflow-y-auto mob-landscape:border-l mob-landscape:border-white/10 mob-landscape:bg-black/60">

            {/* Título + contador — solo visible en landscape (en portrait va como overlay sobre la imagen) */}
            <div className="hidden mob-landscape:flex items-start text-white px-4 py-3 pr-12 flex-shrink-0">
              <div>
                <h2 className="text-base font-medium leading-tight">
                  {currentImage.display_name}
                </h2>
                <span className="text-xs text-gray-400 mt-0.5 block">
                  {initialIndex + 1} / {images.length}
                </span>
              </div>
            </div>

            {/* Descripción y colores */}
            {description && (
              <div className="flex-shrink-0 px-4 pb-3 space-y-2">
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

            {/* Footer — size selector + WhatsApp */}
            <div className="flex-shrink-0 px-4 pb-4 pt-1">
              <p className="text-gray-400 text-xs mb-2">
                Elegí un tamaño para agilizar tu pedido o consulta
              </p>

              {/* Selector siempre visible */}
              <SizeSelectorCompact onSelect={setSelectedSize} variant="dark" />

              {/* Chip de confirmación — aparece debajo del selector cuando hay selección */}
              {selectedSize && (
                <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 rounded-xl px-4 h-11 w-full mt-3">
                  <svg className="w-4 h-4 text-amber-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-sm font-medium">{selectedSize.label}</span>
                  <span className="text-amber-300 text-sm">
                    {selectedSize.isExactPrice ? '' : 'desde '}${selectedSize.fromPrice?.toLocaleString('es-AR')}
                  </span>
                  <button
                    onClick={() => setSelectedSize(null)}
                    className="ml-auto text-gray-400 hover:text-white transition-colors text-xs underline shrink-0"
                  >
                    cambiar
                  </button>
                </div>
              )}

              {/* Botón WhatsApp */}
              <div className="mt-3">
                <WhatsAppDropdown
                  buttonText={selectedSize ? 'Quiero este diseño' : 'Consultar'}
                  message={whatsappMessage}
                  className={`w-full px-5 h-11 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
                    selectedSize
                      ? 'bg-green-500 hover:bg-green-400'
                      : 'bg-green-800 hover:bg-green-400'
                  }`}
                  iconClassName="brightness-0 invert"
                />
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
