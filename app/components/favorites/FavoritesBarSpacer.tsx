'use client'

import { useFavoritesCount, useFavoritesHydrated } from '../../hooks/useFavorites'

/**
 * Reserva el alto de la barra de consulta `fixed bottom-0` de /favoritos.
 *
 * Va DESPUÉS del Footer: un spacer dentro de <main> empuja la galería pero deja
 * al footer igual al final del documento, o sea tapado por la barra.
 *
 * Es un componente aparte porque la página es Server Component y no puede saber
 * si hay favoritos; así el estado vacío —que no renderiza la barra— no queda con
 * un hueco muerto.
 */
export default function FavoritesBarSpacer() {
  const hydrated = useFavoritesHydrated()
  const count = useFavoritesCount()

  if (!hydrated || count === 0) return null

  // La barra quedó con un solo botón (h-11) + padding: ~70 px. El selector de
  // medida se mudó al contenido (SelectedSizeBanner).
  return <div className="h-24 sm:h-28 shrink-0" aria-hidden />
}
