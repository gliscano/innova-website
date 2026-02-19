'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { SizeCard } from './SizeCard'
import type { SizeOption } from '../types'

interface SizeCarouselProps {
  sizes: SizeOption[]
  /** Si se provee, al hacer clic se expande PriceList in-place en lugar de ir a /prices */
  onShowPrices?: () => void
}

/**
 * Carrusel horizontal en mobile (snap scroll), grid en desktop.
 */
export function SizeCarousel({ sizes, onShowPrices }: SizeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const displaySizes = sizes.slice(0, 4)
  const primaryBadgeForFirst = 'Más elegido'

  return (
    <div className="w-full">
      {/* Mobile: carrusel horizontal con snap */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:hidden scrollbar-hide"
        role="region"
        aria-label="Tamaños populares"
      >
        {displaySizes.map((size, i) => (
          <div
            key={size.id}
            className="snap-center shrink-0 w-[min(280px,85vw)]"
          >
            <SizeCard
              size={size}
              primaryBadge={i === 0 ? primaryBadgeForFirst : undefined}
            />
          </div>
        ))}
      </div>

      {/* Desktop: grid 2-4 columnas */}
      <div
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        role="region"
        aria-label="Tamaños populares"
      >
        {displaySizes.map((size, i) => (
          <SizeCard
            key={size.id}
            size={size}
            primaryBadge={i === 0 ? primaryBadgeForFirst : undefined}
          />
        ))}
      </div>

      <p className="mt-4 text-center">
        {onShowPrices ? (
          <button
            type="button"
            onClick={onShowPrices}
            className="text-sm text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none font-inherit"
          >
            Ver medidas y precios completos
          </button>
        ) : (
          <Link
            href="/prices"
            className="text-sm text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors"
          >
            Ver medidas y precios
          </Link>
        )}
      </p>
    </div>
  )
}
