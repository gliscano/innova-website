'use client'

import { useEffect } from 'react'
import { flush, handleStorageEvent, hydrate } from '../../lib/favoritesStore'

/**
 * Arranque del store de favoritos. Renderiza null.
 *
 * Se monta una sola vez en layout.tsx. El boot es explícito y está en un solo
 * lugar; hacer lazy-init en el primer subscribe obligaría a notificar de forma
 * síncrona dentro de subscribe, que es legal pero frágil.
 *
 * Corre en un efecto, o sea DESPUÉS de la hidratación: el server y el primer
 * render del cliente ven ambos el snapshot EMPTY y producen markup idéntico.
 */
export default function FavoritesInit() {
  useEffect(() => {
    hydrate()

    window.addEventListener('storage', handleStorageEvent)

    // Sin este flush, cerrar la pestaña dentro de la ventana de debounce (400ms)
    // pierde el último ♥. `pagehide` es el único evento confiable en iOS Safari.
    const onHide = () => flush()
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', onHide)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('storage', handleStorageEvent)
      window.removeEventListener('pagehide', onHide)
      document.removeEventListener('visibilitychange', onVisibility)
      flush()
    }
  }, [])

  return null
}
