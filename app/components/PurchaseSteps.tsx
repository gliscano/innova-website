'use client'

import React from 'react'
import { useSelectedSize } from '@/app/context/SelectedSizeContext'
import { useCart } from '@/app/context/CartContext'

const PURCHASE_STEPS = [
  { mobile: 'Medida',   desktop: 'Elegí la medida'  },
  { mobile: 'Diseños',  desktop: 'Agregá diseños'   },
  { mobile: 'Enviá tu pedido', desktop: 'Enviá Mi pedido'  },
  { mobile: '¡Listo!',  desktop: '¡Tu fondo listo!' },
] as const

export function PurchaseSteps() {
  const { selectedSize } = useSelectedSize()
  const { count } = useCart()
  // Paso real: con algo en el pedido ya toca enviarlo, aunque se haya cambiado la medida.
  const activeStep = count > 0 ? 3 : !selectedSize ? 1 : 2

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
