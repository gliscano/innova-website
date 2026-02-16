'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { SizeCard } from './SizeCard'
import { sizeIdToUrlParam } from '../recommendation'
import type { SizeOption } from '../types'
import type { RouteBuilders } from '../types'

interface SizeCarouselProps {
  sizes: SizeOption[]
  routes: RouteBuilders
}

/**
 * Carrusel horizontal en mobile (snap scroll), grid en desktop.
 */
export function SizeCarousel({ sizes, routes }: SizeCarouselProps) {
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
              designCatalogUrl={routes.designCatalog(sizeIdToUrlParam(size.id, sizes))}
              studioUrl={routes.studio(sizeIdToUrlParam(size.id, sizes))}
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
            designCatalogUrl={routes.designCatalog(sizeIdToUrlParam(size.id, sizes))}
            studioUrl={routes.studio(sizeIdToUrlParam(size.id, sizes))}
            primaryBadge={i === 0 ? primaryBadgeForFirst : undefined}
          />
        ))}
      </div>

      <p className="mt-4 text-center">
        <Link
          href={routes.prices()}
          className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
        >
          Ver precios completos
        </Link>
      </p>
    </div>
  )
}
