'use client'

import { useCallback, useState } from 'react'
import { Heart } from 'lucide-react'
import type { GalleryImage } from '../../types/gallery'
import { useFavoritesHydrated, useIsFavorite } from '../../hooks/useFavorites'
import { toggleFavorite } from '../../lib/favoritesStore'
import { trackFavoriteAdd, trackFavoriteRemove } from '../../utils/tracking'
import { MAX_FAVORITES } from '../../types/favorites'

interface FavoriteButtonProps {
  image: GalleryImage
  /** Carpeta de la galería contenedora. Más confiable que image.folder, que
   *  depende del fix de asset_folder en la ruta de búsqueda. */
  folderHint?: string
  variant?: 'tile' | 'modal'
  /** Muestra "Guardar"/"Guardado" al lado del ícono. El ícono solo es ambiguo
   *  para un público no técnico; en el modal hay espacio de sobra. */
  showLabel?: boolean
  /** Se aplica al wrapper posicionado, no al botón. */
  className?: string
}

export default function FavoriteButton({
  image,
  folderHint,
  variant = 'tile',
  showLabel = false,
  className = 'relative',
}: FavoriteButtonProps) {
  const isFav = useIsFavorite(image.id)
  const hydrated = useFavoritesHydrated()
  const [rejected, setRejected] = useState(false)

  const handleToggle = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      // El root de GalleryItem es role="button" con onClick y onKeyDown: sin
      // esto, marcar abriría el modal.
      e.stopPropagation()
      e.preventDefault()

      const result = toggleFavorite(image, folderHint)

      if (result === null) {
        setRejected(true)
        setTimeout(() => setRejected(false), 2600)
        return
      }

      if (result) trackFavoriteAdd(image.display_name, image.folder ?? folderHint)
      else trackFavoriteRemove(image.display_name)
    },
    [image, folderHint]
  )

  const isModal = variant === 'modal'

  return (
    // El wrapper es el contexto de posicionamiento del toast, que así se ancla
    // al botón y no al tile (que es overflow-hidden y lo recortaría).
    // ⚠️ No anteponer `relative` acá: los call sites pasan `absolute`, y
    // Tailwind emite `.relative` después de `.absolute`, con lo cual ganaría
    // `relative` y el corazón caería al flujo normal (arriba a la izquierda).
    <div className={className}>
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={(e) => {
          // El root de GalleryItem captura Enter/Space; hay que frenarlos acá.
          if (e.key === 'Enter' || e.key === ' ') handleToggle(e)
        }}
        aria-pressed={isFav}
        aria-label={isFav ? `Quitar ${image.display_name} de favoritos` : `Guardar ${image.display_name} en favoritos`}
        title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        className={`
          rounded-full backdrop-blur-sm
          transition-[background-color,transform] duration-200
          active:scale-90
          ${showLabel ? 'flex items-center gap-2 h-10 px-3.5' : 'grid place-items-center'}
          ${isModal
            ? 'bg-black/40 hover:bg-black/60'
            : 'bg-white/75 hover:bg-white shadow-sm'}
          ${showLabel ? '' : isModal ? 'w-10 h-10' : 'w-8 h-8'}
        `}
      >
        <Heart
          className={`
            shrink-0 transition-[color,fill,transform] duration-200
            ${isModal ? 'w-5 h-5' : 'w-[18px] h-[18px]'}
            ${isFav
              ? 'fill-[#c19d83] text-[#c19d83] scale-110'
              : isModal
                ? 'fill-transparent text-white'
                : 'fill-transparent text-stone-600'}
          `}
          strokeWidth={2}
          aria-hidden
        />
        {showLabel && (
          <span className={`text-sm font-medium ${isModal ? 'text-white' : 'text-stone-700'}`}>
            {isFav ? 'Guardado' : 'Guardar'}
          </span>
        )}
      </button>

      {/* Tope alcanzado: se rechaza el alta, nunca se descarta algo en silencio.
          Ancho fijo y texto que envuelve porque el tile es overflow-hidden y un
          toast ancho se recortaría en las columnas angostas del masonry. */}
      {rejected && hydrated && (
        <span
          role="status"
          className="absolute top-full right-0 mt-1 z-30 w-[140px] rounded-md bg-stone-900/90 px-2 py-1 text-[11px] leading-tight text-white shadow-lg"
        >
          Llegaste al máximo de {MAX_FAVORITES} favoritos
        </span>
      )}
    </div>
  )
}
