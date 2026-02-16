'use client'

import Link from 'next/link'
import { memo } from 'react'
import { Check, Zap, Layers } from 'lucide-react'
import type { SizeOption } from '../types'

interface SizeCardProps {
  size: SizeOption
  designCatalogUrl: string
  studioUrl: string
  primaryBadge?: string
}

/** Card de tamaño: premium, limpia, con bullets y CTAs. */
export const SizeCard = memo(function SizeCard({
  size,
  designCatalogUrl,
  studioUrl,
  primaryBadge,
}: SizeCardProps) {
  const badge = primaryBadge ?? size.badges[0]
  const fitsSmallStudio = size.depthLevel === 'Baja' || size.depthLevel === 'Media'
  const bullets = [
    `Estudio chico: ${fitsSmallStudio ? '✅' : '⚠️'}`,
    size.depthLevel ? `Profundidad: ${size.depthLevel}` : null,
    size.lightingHint ? `Luz: ${size.lightingHint}` : null,
  ].filter(Boolean) as string[]

  return (
    <article
      className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-200 overflow-hidden"
      style={{ minHeight: 280 }}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{size.label}</h3>
          {badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shrink-0">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          Ideal para {size.bestFor.slice(0, 2).join(' / ')}
        </p>
        <div className="mb-4">
          {size.fromPrice ? (
            <p className="text-sm font-medium text-gray-900">
              Precio desde ${size.fromPrice.toLocaleString('es-AR')}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Consultar precio</p>
          )}
        </div>
        <ul className="space-y-1.5 mb-4 flex-1" aria-label={`Características de ${size.label}`}>
          {bullets.slice(0, 3).map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              {b.includes('✅') ? (
                <Check className="w-4 h-4 text-green-600 shrink-0" aria-hidden />
              ) : b.toLowerCase().includes('luz') ? (
                <Zap className="w-4 h-4 text-amber-500 shrink-0" aria-hidden />
              ) : (
                <Layers className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
              )}
              <span className="truncate max-w-[140px]">{b.replace('✅', '').replace('⚠️', '').trim()}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <Link
            href={designCatalogUrl}
            className="min-h-[44px] flex items-center justify-center rounded-xl font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Ver diseños
          </Link>
          <Link
            href={studioUrl}
            className="min-h-[44px] flex items-center justify-center rounded-xl font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Ver escena
          </Link>
        </div>
      </div>
    </article>
  )
})
