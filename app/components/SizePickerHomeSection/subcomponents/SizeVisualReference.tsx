'use client'

import { useState } from 'react'
import Image from 'next/image'

const SIZE_GUIDES = [
  {
    title: 'Retratos Individuales',
    size: '1.5m × 2.0m',
    description:
      'Ideal para fotografía de bebés, retratos individuales y decoración de espacios pequeños',
    image: '/images/innova/child-size.png',
  },
  {
    title: 'Parejas',
    size: '2.0m × 2.9m',
    description:
      'Perfecto para sesiones de pareja, fotos de pie o retratos de dos personas con encuadres de cuerpo completo',
    image: '/images/innova/backdrops-couples-size.png',
  },
  {
    title: 'Grupos Pequeños',
    size: '2.9m × 3.0m',
    description:
      'Recomendado para familias pequeñas o grupos de 3-4 personas, con mayor profundidad de escena',
    image: '/images/innova/backdrops-small-size.png',
  },
  {
    title: 'Grupos Grandes',
    size: '2.9m × 5.0m',
    description:
      'Recomendado para familias grandes o grupos numerosos y decoración de eventos permitiendo encuadres amplios y mayor separación del fondo',
    image: '/images/innova/backdrops-large-size.png',
  },
] as const

/**
 * Sección colapsable "Referencia visual" - mobile-first.
 * Muestra guía de tamaños con imágenes ilustrativas bajo demanda.
 */
export function SizeVisualReference() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors touch-manipulation min-h-[48px]"
        aria-expanded={isExpanded}
        aria-controls="size-visual-reference-content"
        id="size-visual-reference-trigger"
      >
        <span className="text-base font-medium text-gray-900">
          Referencia visual de tamaños
        </span>
        <span
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-600"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        id="size-visual-reference-content"
        role="region"
        aria-labelledby="size-visual-reference-trigger"
        className="overflow-hidden"
      >
        {isExpanded && (
          <div className="px-4 pb-4 pt-0 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {SIZE_GUIDES.map((guide, index) => (
                <div
                  key={guide.title}
                  className={`rounded-xl shadow-sm p-4 flex flex-col items-center text-center ${
                    index > 1 ? 'bg-rose-gold/50' : 'bg-yellow-gold-light/50'
                  }`}
                >
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg mb-3 flex items-center justify-center shrink-0">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      className="object-contain"
                      width={144}
                      height={144}
                    />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                    {guide.title}
                  </h4>
                  <p className="text-rose-800 font-medium text-xs sm:text-sm py-1 px-2 mb-1 bg-white rounded-xl">
                    {guide.size}
                  </p>
                  <p className="text-gray-700 text-xs leading-snug">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
