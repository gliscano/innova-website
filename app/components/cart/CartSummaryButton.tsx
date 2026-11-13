'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart, formatArs } from '@/app/context/CartContext'

/**
 * Acceso a "Mi pedido" con cantidad, total y botón "Ver pedido". Es el mismo en la barra fija de la
 * página (`CartBar`) y en el pie del modal del diseño, para que el carrito se vea igual en todos
 * lados y siempre muestre el gasto acumulado.
 */
export default function CartSummaryButton({ className = '' }: { className?: string }) {
  const { count, total, hasUnpricedItems, openDrawer } = useCart()
  const products = `${count} ${count === 1 ? 'producto' : 'productos'}`

  return (
    <button
      onClick={openDrawer}
      className={`w-full flex items-center gap-3 rounded-2xl bg-[#1F1A14] text-white pl-4 pr-2 py-2 ${className}`}
      aria-label={`Ver Mi pedido: ${products}`}
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
          {products}
          {total > 0 && ` · ${formatArs(total)}`}
          {hasUnpricedItems && (total > 0 ? ' + a confirmar' : ' · a confirmar')}
        </span>
      </span>
      <span className="shrink-0 rounded-xl bg-amber-400 text-[#1F1A14] text-sm font-bold px-4 py-2.5">
        Ver pedido
      </span>
    </button>
  )
}
