'use client'

import { usePathname } from 'next/navigation'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart, formatArs } from '@/app/context/CartContext'
import { useSelectedSize } from '@/app/context/SelectedSizeContext'

/**
 * Barra fija "Mi pedido" (visible cuando hay algo en el pedido) y aviso de "Pedido enviado ·
 * Deshacer". Ocupa el lugar del botón flotante de WhatsApp, que se oculta con el pedido lleno.
 * No se muestra dentro del modal de la galería (allí hay su propio acceso) ni en `/pedido/<clave>`.
 */
export default function CartBar() {
  const pathname = usePathname()
  const { count, total, hasUnpricedItems, openDrawer, isDrawerOpen, canUndoSent, undoSent, dismissUndo } = useCart()
  const { isModalOpen } = useSelectedSize()

  if (pathname?.startsWith('/pedido/')) return null

  const showBar = count > 0 && !isModalOpen && !isDrawerOpen
  const showUndo = canUndoSent && count === 0 && !isDrawerOpen

  if (!showBar && !showUndo) return null

  return (
    <>
      {/* Espacio para que la barra no tape el final de la página */}
      {showBar && <div aria-hidden className="h-20" />}

      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
        {showUndo ? (
          <div
            role="status"
            className="pointer-events-auto mx-auto max-w-md flex items-center gap-3 rounded-2xl bg-[#1F1A14] text-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200"
          >
            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </span>
            <span className="text-sm flex-1">Pedido enviado por WhatsApp</span>
            <button onClick={undoSent} className="text-sm font-semibold text-amber-300 hover:text-amber-200">
              Deshacer
            </button>
            <button onClick={dismissUndo} className="text-white/50 hover:text-white text-lg leading-none px-1" aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={openDrawer}
            className="pointer-events-auto mx-auto w-full max-w-md flex items-center gap-3 rounded-2xl bg-[#1F1A14] text-white pl-4 pr-2 py-2 shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200"
            aria-label={`Ver Mi pedido: ${count} ${count === 1 ? 'producto' : 'productos'}`}
          >
            <span className="relative shrink-0">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[#1F1A14] text-[11px] font-bold flex items-center justify-center tabular-nums">
                {count}
              </span>
            </span>
            <span className="flex-1 text-left leading-tight ml-1">
              <span className="block text-sm font-semibold">Mi pedido</span>
              <span className="block text-xs text-white/70 tabular-nums">
                {count} {count === 1 ? 'producto' : 'productos'}
                {total > 0 && ` · ${formatArs(total)}`}
                {hasUnpricedItems && (total > 0 ? ' + a confirmar' : ' · a confirmar')}
              </span>
            </span>
            <span className="shrink-0 rounded-xl bg-amber-400 text-[#1F1A14] text-sm font-bold px-4 py-2.5">
              Ver pedido
            </span>
          </button>
        )}
      </div>
    </>
  )
}
