'use client'

import { createContext, useContext, useState } from 'react'

export interface SelectedSize {
  id: string
  label: string
  widthM: number
  heightM: number
  fromPrice?: number
  isExactPrice?: boolean
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
