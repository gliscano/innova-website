'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavoritesNotice } from '../../hooks/useFavorites'
import { dismissNotice } from '../../lib/favoritesStore'

/** 4 s y no menos: el usuario tiene que llegar a leer y tocar la acción. */
const AUTO_DISMISS_MS = 4000

/**
 * Snackbar global de "guardado en favoritos".
 *
 * Es global y no un toast por botón a propósito: el root de GalleryItem es
 * `overflow-hidden` y las columnas del masonry son angostas, así que un aviso
 * anclado al tile se recorta.
 *
 * Solo se emite al AGREGAR. Quitar no lo dispara —el corazón vacío ya es el
 * feedback— y el aviso de tope alcanzado sigue anclado al botón.
 */
export default function FavoritesToast() {
  const notice = useFavoritesNotice()
  const pathname = usePathname()

  // El efecto depende de `seq`, no del objeto: así guardar dos diseños seguidos
  // reinicia el timer en vez de dejar vivo el de la primera alta.
  const seq = notice?.seq ?? 0

  useEffect(() => {
    if (!seq) return
    const t = setTimeout(dismissNotice, AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [seq])

  // En /favoritos no aporta nada: ya estás mirando la lista.
  const hidden = pathname === '/favoritos'

  return (
    <AnimatePresence>
      {notice && !hidden && (
        <motion.div
          key={notice.seq}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22 }}
          // z-[60]: por encima del FAB y del modal (ambos z-50) y de la barra de
          // /favoritos (z-40) — se puede guardar desde adentro del modal.
          // Abajo a la izquierda para no chocar con WhatsAppFloat (bottom-6
          // right-6) ni con el FAB (bottom-24 right-6).
          className="fixed z-[60] bottom-6 inset-x-4 sm:inset-x-6"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-stone-900/95 backdrop-blur px-4 py-3 shadow-xl text-left">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[#c19d83] shrink-0">
              <Heart className="w-4 h-4 fill-white text-white" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white leading-tight">
                Guardado en favoritos
              </p>
              <p className="text-xs text-stone-300 truncate">{notice.name}</p>
            </div>

            <Link
              href="/favoritos"
              onClick={dismissNotice}
              className="shrink-0 text-xs font-semibold text-[#e0c3ac] hover:text-white transition-colors underline underline-offset-2"
            >
              Ver todos mis favoritos
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
