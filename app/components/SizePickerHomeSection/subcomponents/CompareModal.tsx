'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { SizeOption } from '../types'

interface CompareModalProps {
  sizes: SizeOption[]
  onClose: () => void
}

/**
 * Modal/Drawer full-width en mobile para comparar tamaños.
 * Carga diferida desde el padre.
 */
export function CompareModal({ sizes, onClose }: CompareModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const displaySizes = sizes.slice(0, 4)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white z-10">
          <h2 id="compare-modal-title" className="text-lg font-semibold">
            Comparar tamaños
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {displaySizes.map((size) => (
            <div
              key={size.id}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{size.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {size.bestFor.join(' · ')}
                  </p>
                  {size.fromPrice && (
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      Desde ${size.fromPrice.toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {size.badges.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
