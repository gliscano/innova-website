'use client'

import React from 'react'
import { useSelectedSize } from '@/app/context/SelectedSizeContext'

const PURCHASE_STEPS = [
  { mobile: 'Elegí medida', desktop: 'Elegí medida'     },
  { mobile: 'Elegí Diseño',       desktop: 'Elegí diseño'     },
  { mobile: 'WhatsApp',           desktop: 'WhatsApp'         },
  { mobile: 'Listo!',        desktop: '¡Tu fondo listo!' },
] as const

export function PurchaseSteps() {
  const { selectedSize, isModalOpen } = useSelectedSize()
  const activeStep = !selectedSize ? 1 : isModalOpen ? 3 : 2

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-sm select-none">
      {PURCHASE_STEPS.map(({ mobile, desktop }, i, arr) => (
        <React.Fragment key={desktop}>
          <span className={`font-semibold whitespace-nowrap ${activeStep === i + 1 ? 'text-[#4a3a2a]' : 'text-[#9B8E82]'}`}>
            <span className="sm:hidden">{mobile}</span>
            <span className="hidden sm:inline">{desktop}</span>
          </span>
          {i < arr.length - 1 && (
            <span className="text-[#C4B5A8]">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
