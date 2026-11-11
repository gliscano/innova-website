'use client'

import { createContext, useContext, useState } from 'react'

export interface SelectedSize {
  id: string
  label: string
  widthM: number
  heightM: number
  fromPrice?: number
  isExactPrice?: boolean
  /** Terminación que cambia el precio (hoy solo Neón); sin valor es la tela estándar HD. */
  finishLabel?: string
  /**
   * Producto tal como figura en la pestaña Precios de la planilla ("Fondo 2.90m Color Vivo HD",
   * "Híbrido", "Piso Neoprene", "Fundas para Paneles"). Sin valor es un fondo de tela: lo
   * deducen el ancho y la terminación (selector compacto y tarjetas de la home).
   */
  productName?: string
}

interface SelectedSizeContextValue {
  selectedSize: SelectedSize | null
  setSelectedSize: (size: SelectedSize | null) => void
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
}

const SelectedSizeContext = createContext<SelectedSizeContextValue>({
  selectedSize: null,
  setSelectedSize: () => {},
  isModalOpen: false,
  setModalOpen: () => {},
})

export function SelectedSizeProvider({ children }: { children: React.ReactNode }) {
  const [selectedSize, setSelectedSize] = useState<SelectedSize | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <SelectedSizeContext.Provider value={{ selectedSize, setSelectedSize, isModalOpen, setModalOpen }}>
      {children}
    </SelectedSizeContext.Provider>
  )
}

export function useSelectedSize() {
  return useContext(SelectedSizeContext)
}
