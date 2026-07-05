'use client'

import { useEffect, useState } from 'react'

interface MasonryColumnsOptions {
  mobile?: number
  tablet?: number
  desktop?: number
  tabletBp?: number
  desktopBp?: number
}

/**
 * Cantidad de columnas para una grilla masonry, según breakpoint.
 * Se usa para repartir los items entre N columnas fijas (por menor altura acumulada)
 * en vez de dejar que CSS `columns` los mueva — así los items no cambian de columna
 * cuando se agregan más al final (paginación / "ver más").
 *
 * 3 tiers: mobile (<tabletBp) / tablet (>=tabletBp) / desktop (>=desktopBp).
 */
export function useMasonryColumns({
  mobile = 2,
  tablet = 3,
  desktop = 4,
  tabletBp = 768,
  desktopBp = 1024,
}: MasonryColumnsOptions = {}): number {
  const [columns, setColumns] = useState(mobile)

  useEffect(() => {
    const desktopMq = window.matchMedia(`(min-width: ${desktopBp}px)`)
    const tabletMq = window.matchMedia(`(min-width: ${tabletBp}px)`)
    const update = () => {
      if (desktopMq.matches) setColumns(desktop)
      else if (tabletMq.matches) setColumns(tablet)
      else setColumns(mobile)
    }
    update()
    desktopMq.addEventListener('change', update)
    tabletMq.addEventListener('change', update)
    return () => {
      desktopMq.removeEventListener('change', update)
      tabletMq.removeEventListener('change', update)
    }
  }, [mobile, tablet, desktop, tabletBp, desktopBp])

  return columns
}
