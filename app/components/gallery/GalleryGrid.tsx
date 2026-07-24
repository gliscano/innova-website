'use client'

import { GalleryGridProps } from '../../types/gallery'
import { useMasonryColumns } from '../../hooks/useMasonryColumns'
import { distributeIntoColumns } from '../../utils/masonry'
import GalleryItem from './GalleryItem'

// Aspect ratios variados para los placeholders de "cargar más" (espejo del skeleton de Navidad).
const SKELETON_RATIOS = [0.8, 1.25, 1]

export default function GalleryGrid({
  images,
  onImageClick,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: GalleryGridProps) {
  // Los hooks deben llamarse siempre, antes de cualquier return condicional
  // (si no, el componente pasa de 0 a 1 hooks llamados entre renders y rompe React).
  const columns = useMasonryColumns()

  if (images.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron imágenes
        </h3>
        <p className="text-gray-600">
          Intenta ajustar los parámetros de búsqueda
        </p>
      </div>
    )
  }

  const columnCells = distributeIntoColumns(images, columns)

  return (
    <div className="space-y-6">
      {/* Masonry de columnas balanceadas (mismo mecanismo que la sección Navidad) */}
      <div className="flex items-start gap-2">
        {columnCells.map((cells, col) => (
          <div key={col} className="flex-1 min-w-0 flex flex-col gap-2">
            {cells.map((cell) => (
              <GalleryItem
                key={cell.image.id}
                image={cell.image}
                onClick={() => onImageClick(cell.index)}
                index={cell.index}
                ratio={cell.ratio}
              />
            ))}

            {/* Skeletons mientras carga más: uno por columna, con alturas variadas */}
            {isLoadingMore && (
              <div
                className="w-full bg-black/[0.06] rounded-[14px] animate-pulse"
                style={{ aspectRatio: SKELETON_RATIOS[col % SKELETON_RATIOS.length] }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Botón "Ver más diseños" */}
      {(hasMore || isLoadingMore) && (
        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore || isLoading}
            className="group relative px-7 py-2.5 rounded-full bg-white border border-stone-300 text-stone-600 text-sm font-medium shadow-sm transition-all duration-200 hover:border-[#c19d83] hover:text-[#c19d83] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label={isLoadingMore ? 'Cargando más diseños' : 'Ver más diseños'}
          >
            {isLoadingMore ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-[#c19d83]"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Cargando…
              </>
            ) : (
              <>
                Ver más diseños
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Fin del catálogo */}
      {!hasMore && images.length > 0 && (
        <p className="text-center text-stone-400 text-[11px] tracking-widest uppercase py-4 select-none">
          ✦ &nbsp; Todos los diseños &nbsp; ✦
        </p>
      )}
    </div>
  )
}
