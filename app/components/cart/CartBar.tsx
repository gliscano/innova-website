'use client'

import { usePathname } from 'next/navigation'
import { Check } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import CartSummaryButton from './CartSummaryButton'
import { useSelectedSize } from '@/app/context/SelectedSizeContext'

/**
 * Barra fija "Mi pedido" (visible cuando hay algo en el pedido) y aviso de "Pedido enviado ·
 * Deshacer". Ocupa el lugar del botón flotante de WhatsApp, que se oculta con el pedido lleno.
 * No se muestra dentro del modal de la galería (allí va el mismo `CartSummaryButton` en el pie) ni en `/pedido/<clave>`.
 */
export default function CartBar() {
  const pathname = usePathname()
  const { count, isDrawerOpen, canUndoSent, undoSent, dismissUndo } = useCart()
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
          <CartSummaryButton className="pointer-events-auto mx-auto max-w-md shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200" />
        )}
      </div>
    </>
  )
}
