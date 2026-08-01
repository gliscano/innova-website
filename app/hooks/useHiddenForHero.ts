'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * true mientras el hero de Navidad (`.nv-hero`) esté visible en pantalla.
 *
 * Extraído de WhatsAppFloat para que los elementos flotantes compartan la misma
 * condición de ocultamiento en vez de duplicar el IntersectionObserver.
 */
export function useHiddenForHero(): boolean {
  const pathname = usePathname()

  // El valor se guarda junto a la ruta en la que se midió. Así el reset al
  // navegar sale de la derivación —una ruta sin `.nv-hero` nunca coincide— en
  // vez de un setState sincrónico dentro del efecto.
  const [seen, setSeen] = useState({ path: '', intersecting: false })

  useEffect(() => {
    const heroEl = document.querySelector('.nv-hero')
    if (!heroEl) return

    const observer = new IntersectionObserver(
      ([entry]) => setSeen({ path: pathname, intersecting: entry.isIntersecting }),
      { threshold: 0 }
    )
    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [pathname])

  return seen.path === pathname && seen.intersecting
}
