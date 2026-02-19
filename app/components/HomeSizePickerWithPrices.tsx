'use client'

import { useState, useEffect } from 'react'
import PriceList from './PriceList'
import { SizePickerHomeSection } from './SizePickerHomeSection'

interface HomeSizePickerWithPricesProps {
  /** ID de la sección para scroll (ej: "prices" en design-catalog) */
  sectionId?: string
}

/**
 * Wrapper que muestra SizePickerHomeSection y PriceList solo cuando
 * el usuario hace clic en "Ver precios completos".
 */
export function HomeSizePickerWithPrices({ sectionId }: HomeSizePickerWithPricesProps) {
  const [showPriceList, setShowPriceList] = useState(false)

  useEffect(() => {
    if (showPriceList) {
      const timer = setTimeout(() => {
        document.getElementById('prices')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [showPriceList])

  const effectiveSectionId = showPriceList ? 'size-picker' : sectionId

  return (
    <>
      <SizePickerHomeSection
        onShowPrices={() => setShowPriceList(true)}
        sectionId={effectiveSectionId}
      />
      {showPriceList && <PriceList />}
    </>
  )
}
