'use client'

import { createContext, useCallback, useContext, useState } from 'react'

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
  /** Última medida elegida (sigue ahí después de "cambiar"): el selector reabre con ese producto. */
  lastSelectedSize: SelectedSize | null
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
}

const SelectedSizeContext = createContext<SelectedSizeContextValue>({
  selectedSize: null,
  setSelectedSize: () => {},
  lastSelectedSize: null,
  isModalOpen: false,
  setModalOpen: () => {},
})

export function SelectedSizeProvider({ children }: { children: React.ReactNode }) {
  const [selectedSize, setSelectedSizeState] = useState<SelectedSize | null>(null)
  const [lastSelectedSize, setLastSelectedSize] = useState<SelectedSize | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const setSelectedSize = useCallback((size: SelectedSize | null) => {
    if (size) setLastSelectedSize(size)
    setSelectedSizeState(size)
  }, [])

  return (
    <SelectedSizeContext.Provider value={{ selectedSize, setSelectedSize, lastSelectedSize, isModalOpen, setModalOpen }}>
      {children}
    </SelectedSizeContext.Provider>
  )
}

export function useSelectedSize() {
  return useContext(SelectedSizeContext)
}
