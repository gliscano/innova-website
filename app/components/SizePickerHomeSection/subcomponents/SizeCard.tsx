'use client'

import { memo } from 'react'
import { Check, Zap, Layers } from 'lucide-react'
import type { SizeOption } from '../types'
import { useSelectedSize, type SelectedSize } from '../../../context/SelectedSizeContext'

interface SizeCardProps {
  size: SizeOption
  primaryBadge?: string
}

/** Card de tamaño: premium, limpia, con bullets y CTAs. */
export const SizeCard = memo(function SizeCard({
  size,
  primaryBadge,
}: SizeCardProps) {
  const { selectedSize, setSelectedSize } = useSelectedSize()
  const isSelected = selectedSize?.id === size.id

  const badge = primaryBadge ?? size.badges[0]
  const fitsSmallStudio = size.depthLevel === 'Baja' || size.depthLevel === 'Media'
  const bullets = [
    `Estudio chico: ${fitsSmallStudio ? '✅' : '⚠️'}`,
    size.depthLevel ? `Profundidad: ${size.depthLevel}` : null,
    size.lightingHint ? `Luz: ${size.lightingHint}` : null,
  ].filter(Boolean) as string[]

  const handleSelect = () => {
    if (isSelected) {
      setSelectedSize(null)
    } else {
      const selected: SelectedSize = {
        id: size.id,
        label: size.label,
        widthM: size.widthM,
        heightM: size.heightM,
        fromPrice: size.fromPrice,
      }
      setSelectedSize(selected)
    }
  }

  return (
    <article
      className={`group flex flex-col h-full rounded-2xl border-2 shadow-sm transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-amber-400 bg-amber-50 shadow-amber-200 shadow-md'
          : 'border-gray-200/80 bg-white hover:shadow-md hover:border-gray-300/80'
      }`}
      style={{ minHeight: 280 }}
      onClick={handleSelect}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deseleccionar' : 'Seleccionar'} tamaño ${size.label}`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{size.label}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {isSelected && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-white">
                <Check className="w-3 h-3" />
                Elegido
              </span>
            )}
            {!isSelected && badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {badge}
              </span>
            )}
          </div>
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

        <button
          onClick={(e) => { e.stopPropagation(); handleSelect() }}
          className={`w-full mt-auto py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isSelected
              ? 'bg-amber-400 text-white hover:bg-amber-500'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-800'
          }`}
        >
          {isSelected ? 'Seleccionado' : 'Elegir este tamaño'}
        </button>
      </div>
    </article>
  )
})
