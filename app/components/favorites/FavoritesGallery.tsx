'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import type { GalleryImage } from '../../types/gallery'
import { useFavoriteItems, useFavoritesHydrated } from '../../hooks/useFavorites'
import { toGalleryImage } from '../../lib/favoritesStore'
import { useGalleryModal } from '../../hooks/useGalleryModal'
import { useSelectedSize } from '../../context/SelectedSizeContext'
import { buildFavoritesWhatsAppMessage } from '../../utils/favoritesMessage'
import { trackFavoritesView, trackFavoritesWhatsApp } from '../../utils/tracking'
import GalleryGrid from '../gallery/GalleryGrid'
import GalleryModal from '../gallery/GalleryModal'
import GallerySkeleton from '../gallery/GallerySkeleton'
import WhatsAppDropdown from '../WhatsAppDropdown'
import SelectedSizeBanner from '../SelectedSizeBanner'

/**
 * Grilla de favoritos + modal + barra de consulta por WhatsApp.
 *
 * Reutiliza GalleryGrid y useGalleryModal tal cual: toman un GalleryImage[]
 * plano, que es exactamente lo que produce toGalleryImage(). Así el modal trae
 * gratis el selector de tamaño y el WhatsApp por diseño.
 *
 * ⚠️ No montar dos instancias en la misma página: useGalleryModal escribe
 * document.body.style.overflow de forma global y pelearían entre sí.
 */
export default function FavoritesGallery() {
  const hydrated = useFavoritesHydrated()
  const items = useFavoriteItems()
  // Solo lectura: el control de la medida es SelectedSizeBanner, que maneja su
  // propio setSelectedSize. Acá `selectedSize` alimenta el mensaje de WhatsApp.
  const { selectedSize } = useSelectedSize()
  const trackedRef = useRef(false)

  // Más reciente primero: la lista de favoritos es una pila, y lo recién
  // guardado tiene que verse sin scrollear.
  const images = useMemo<GalleryImage[]>(
    () => [...items].sort((a, b) => b.addedAt - a.addedAt).map(toGalleryImage),
    [items]
  )

  // El modal trabaja sobre un snapshot tomado al abrirlo: quitar un favorito
  // desde adentro encogería el array debajo y, como initialIndex es posicional,
  // saltaría a otra imagen o desmontaría el modal a mitad de uso. La grilla sigue
  // con el array vivo, así que el tile desaparece por detrás.
  const [modalImages, setModalImages] = useState<GalleryImage[]>(images)

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
    setModalImages(images)
    openModal(index)
  }

  useEffect(() => {
    if (hydrated && !trackedRef.current) {
      trackedRef.current = true
      trackFavoritesView('page', items.length)
    }
  }, [hydrated, items.length])

  const whatsapp = useMemo(
    () => buildFavoritesWhatsAppMessage(
      [...items].sort((a, b) => b.addedAt - a.addedAt),
      selectedSize
    ),
    [items, selectedSize]
  )

  // Server y primer render del cliente producen ambos el skeleton: markup
  // idéntico, sin mismatch de hidratación.
  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GallerySkeleton count={8} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="border border-dashed border-[#D9CEBC] rounded-[18px] bg-white py-[60px] px-5 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F6F1E8] grid place-items-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-[#c19d83]" aria-hidden />
          </div>
          <h2 className="text-lg font-medium text-[#1F1A14] mb-2">
            Todavía no guardaste ningún diseño
          </h2>
          <p className="text-[14px] text-[#6B5F52] max-w-sm mx-auto mb-6">
            Tocá el ♥ en cualquier diseño para guardarlo acá y después
            consultarlos todos juntos por WhatsApp.
          </p>
          <Link
            href="/#catalog"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#c19d83] text-white text-sm font-medium hover:bg-[#ab866c] transition-colors"
          >
            Ver catálogos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <h1 className="text-2xl text-[#1F1A14] font-medium">Mis diseños favoritos</h1>
          <p className="text-[13px] text-[#6B5F52] mt-1">
            <strong className="text-[#1F1A14] font-semibold">{items.length}</strong>{' '}
            {items.length === 1 ? 'diseño guardado' : 'diseños guardados'}
          </p>
        </div>

        {/* Mismo control que /design-catalog/[id], con su mismo wrapper: ya cubre
            los dos estados (medida elegida → banner ámbar; sin medida → acordeón
            abierto), así que se muestra siempre sin lógica extra acá. */}
        <div className="lg:max-w-[580px]">
          <SelectedSizeBanner />
        </div>

        <GalleryGrid
          images={images}
          onImageClick={handleImageClick}
          isLoading={false}
          isLoadingMore={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      </div>


      {/* Barra de consulta: mismo lenguaje visual que el footer del modal. */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div onClick={() => trackFavoritesWhatsApp(whatsapp.included, whatsapp.dropped > 0)}>
            <WhatsAppDropdown
              buttonText={`Consultar mis ${items.length} ${items.length === 1 ? 'diseño' : 'diseños'} por WhatsApp`}
              message={whatsapp.message}
              className="w-full px-5 h-11 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              iconClassName="brightness-0 invert"
            />
          </div>

          {whatsapp.dropped > 0 && (
            <p className="text-[11px] text-stone-500 text-center mt-1.5">
              El mensaje incluye {whatsapp.included} diseños; los {whatsapp.dropped}{' '}
              restantes se los pasás por el chat.
            </p>
          )}
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
    </>
  )
}
