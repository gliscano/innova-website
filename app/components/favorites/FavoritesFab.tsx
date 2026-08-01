'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavoritesCount, useFavoritesHydrated } from '../../hooks/useFavorites'
import { useHiddenForHero } from '../../hooks/useHiddenForHero'
import { useSelectedSize } from '../../context/SelectedSizeContext'
import { trackFavoritesView } from '../../utils/tracking'

/**
 * Contador flotante de favoritos.
 *
 * Va en layout.tsx y no en el Header por dos razones: el Header no está en la
 * Home, y en la página de producto el StickyProductBar (fixed top-0 z-50) tapa
 * el área del header al scrollear — o sea, el badge desaparecería justo cuando
 * el usuario está marcando diseños.
 *
 * Renderiza null salvo `hydrated && count > 0`: nunca aparece para quien entra
 * por primera vez, y server + primer render del cliente coinciden.
 */
export default function FavoritesFab() {
  const hydrated = useFavoritesHydrated()
  const count = useFavoritesCount()
  const hiddenForHero = useHiddenForHero()
  const { isModalOpen } = useSelectedSize()
  const pathname = usePathname()

  if (!hydrated || count === 0) return null
  if (isModalOpen || hiddenForHero) return null
  // En /favoritos no aporta nada y taparía la barra sticky de consulta.
  if (pathname === '/favoritos') return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <Link
        href="/favoritos"
        onClick={() => trackFavoritesView('fab', count)}
        aria-label={`Mis favoritos, ${count} ${count === 1 ? 'diseño' : 'diseños'}`}
        className="relative grid place-items-center w-[46px] h-[46px] rounded-full bg-white shadow-lg hover:shadow-xl border border-stone-200 transition-all active:scale-95"
      >
        <Heart className="w-[22px] h-[22px] fill-[#c19d83] text-[#c19d83]" aria-hidden />
        <motion.span
          key={count}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          aria-live="polite"
          className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 grid place-items-center rounded-full bg-[#c19d83] text-white text-[11px] font-semibold leading-none"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      </Link>
    </motion.div>
  )
}
