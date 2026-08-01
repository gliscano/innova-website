'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { GalleryImage } from '../../types/gallery'
import { useFavoriteItems, useFavoritesHydrated } from '../../hooks/useFavorites'
import { toGalleryImage } from '../../lib/favoritesStore'
import { useGalleryModal } from '../../hooks/useGalleryModal'
import { trackFavoritesView } from '../../utils/tracking'
import GalleryItem from '../gallery/GalleryItem'
import GalleryModal from '../gallery/GalleryModal'

const STRIP_LIMIT = 12

/**
 * Ratio fijo para toda la tira: el alto por imagen queda bien en un masonry,
 * pero en una fila horizontal deja el borde inferior irregular.
 * 0,75 está dentro del rango [MIN_RATIO, MAX_RATIO] de utils/masonry, y como
 * GalleryItem usa crop="fill" gravity="auto", Cloudinary recorta hacia el
 * sujeto en vez de deformar.
 */
const STRIP_RATIO = 3 / 4

/**
 * Tira horizontal de favoritos en la Home.
 *
 * Server y primer render del cliente devuelven `null` (markup idéntico, sin
 * mismatch). Post-hidratación, si no hay favoritos sigue en null: un bloque
 * vacío "Tus favoritos" en una home comercial es ruido.
 *
 * No se reserva altura fija a propósito — sería espacio muerto permanente para
 * la mayoría que no tiene favoritos. Va entre NavidadBanner y DesignCatalog:
 * todo lo de arriba ya está pintado y lo que se desplaza está bajo el fold.
 */
export default function FavoritesHomeSection() {
  const hydrated = useFavoritesHydrated()
  const items = useFavoriteItems()
  const trackedRef = useRef(false)

  const stripImages = useMemo<GalleryImage[]>(
    () =>
      [...items]
        .sort((a, b) => b.addedAt - a.addedAt)
        .slice(0, STRIP_LIMIT)
        .map(toGalleryImage),
    [items]
  )

  // Snapshot al abrir: quitar un favorito desde el modal encogería el array y,
  // como initialIndex es posicional, saltaría de imagen. La tira sigue viva.
  const [modalImages, setModalImages] = useState<GalleryImage[]>(stripImages)

  const {
    isOpen: isModalOpen,
    currentIndex,
    currentImage,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
  } = useGalleryModal(modalImages)

  const handleImageClick = (index: number) => {
    setModalImages(stripImages)
    openModal(index)
  }

  useEffect(() => {
    if (hydrated && items.length > 0 && !trackedRef.current) {
      trackedRef.current = true
      trackFavoritesView('home', items.length)
    }
  }, [hydrated, items.length])

  if (!hydrated || items.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="py-10 bg-[#FBF8F3]"
      aria-labelledby="favoritos-home-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 id="favoritos-home-title" className="text-xl sm:text-2xl text-[#1F1A14] font-medium">
              Mis diseños favoritos
            </h2>
          </div>
          <Link
            href="/favoritos"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[#c19d83] hover:text-[#ab866c] transition-colors"
          >
            Ver {items.length > STRIP_LIMIT ? `todos (${items.length})` : 'todos'}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {/* Tira con scroll horizontal: reutiliza GalleryItem (trae el ♥, el
            tracking y el click→modal) dentro de un wrapper de ancho fijo. */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {stripImages.map((image, index) => (
            <div key={image.id} className="w-40 sm:w-44 shrink-0 snap-start">
              <GalleryItem
                image={image}
                onClick={() => handleImageClick(index)}
                index={index}
                ratio={STRIP_RATIO}
                folderHint={image.folder}
              />
            </div>
          ))}
        </div>
      </div>

      {currentImage && (
        <GalleryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          images={modalImages}
          initialIndex={currentIndex}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          category="favoritos"
        />
      )}
    </motion.section>
  )
}
