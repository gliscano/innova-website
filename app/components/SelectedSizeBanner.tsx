'use client'

import { useState } from 'react'
import { useSelectedSize } from '@/app/context/SelectedSizeContext'
import { SizeSelectorCompact } from '@/app/components/SizeSelectorCompact'

export default function SelectedSizeBanner() {
  const { selectedSize, setSelectedSize } = useSelectedSize()
  const [expanded, setExpanded] = useState(true)

  if (selectedSize) {
    return (
      <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-amber-700 font-medium leading-none mb-0.5">Tamaño elegido</p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {selectedSize.label}
              {selectedSize.fromPrice && (
                <span className="ml-2 font-normal text-amber-700">
                  ${selectedSize.fromPrice.toLocaleString('es-AR')}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedSize(null); setExpanded(true) }}
          className="text-xs text-amber-600 hover:text-amber-800 underline underline-offset-2 shrink-0 transition-colors"
        >
          Cambiar
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm text-[#4a3a2a] font-semibold">Elegí la medida de tu fondo</span>
          <span className="text-xs text-[#9B8E82] leading-none mt-0.5">Te mostramos el precio al instante</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 py-4 bg-white">
          <SizeSelectorCompact onSelect={(size) => { setSelectedSize(size); setExpanded(false) }} variant="light" />
        </div>
      )}
    </div>
  )
}
