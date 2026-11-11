'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CldImage } from 'next-cloudinary'
import { Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react'
import WhatsAppDropdown from '../WhatsAppDropdown'
import {
  useCart,
  buildCartMessage,
  cartSizeLabel,
  cartProductTag,
  formatArs,
} from '@/app/context/CartContext'
import { trackBeginCheckout } from '@/app/utils/tracking'
import { useBodyScrollLock } from '@/app/hooks/useBodyScrollLock'

/**
 * Panel "Mi pedido". Hoja inferior en el celular y columna derecha en la compu. Se abre también
 * por encima del modal de la galería: lleva `data-cart-drawer` para que el modal no lo tome como
 * un clic afuera y se cierre.
 */
export default function CartDrawer() {
  const pathname = usePathname()
  const { isDrawerOpen } = useCart()
  // Montado solo mientras está abierto: el estado interno (confirmar vaciado) arranca limpio cada vez.
  if (!isDrawerOpen || pathname?.startsWith('/pedido/')) return null
  return <CartDrawerPanel />
}

function CartDrawerPanel() {
  const {
    items, count, total, hasUnpricedItems,
    setQty, removeItem, clear, markSent,
    closeDrawer,
  } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Escape cierra solo el panel (en captura, para que el modal de la galería no lo reciba también).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopImmediatePropagation()
      closeDrawer()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [closeDrawer])

  // Bloquea el scroll de fondo (se suma al del modal si el panel se abrió desde ahí).
  useBodyScrollLock()

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const message = buildCartMessage(items, total, hasUnpricedItems)

  const handleSent = (seller: string) => {
    trackBeginCheckout(total, count, seller)
    markSent()
  }

  return (
    <div className="fixed inset-0 z-[60]" data-cart-drawer role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={closeDrawer} />

      <div
        className="absolute inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none flex flex-col bg-[var(--surface)] text-[var(--ink)] shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--line)]">
          <div>
            <h2 id="cart-title" className="copperplate-bold-font text-xl font-bold text-[#4a3a2a] leading-tight">
              Mi pedido
            </h2>
            <p className="text-xs text-[var(--ink-soft)]">
              {count === 0 ? 'Todavía no agregaste diseños' : `${count} ${count === 1 ? 'fondo' : 'fondos'}`}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={closeDrawer}
            className="p-2 -mr-2 rounded-full hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Cerrar Mi pedido"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Líneas */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-3">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-amber-600" />
              </div>
              <p className="font-semibold text-[#4a3a2a]">Tu pedido está vacío</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)] max-w-[260px] mx-auto">
                Elegí una medida y tocá <strong>Agregar a Mi pedido</strong> en cada diseño que te guste.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              {items.map(item => {
                const { size } = item
                const linePrice = size.fromPrice && size.isExactPrice ? size.fromPrice * item.qty : null
                return (
                  <li key={item.key} className="flex gap-3 py-3">
                    <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-lg bg-black/5">
                      <CldImage
                        src={item.imageId}
                        width={128}
                        height={128}
                        crop="fill"
                        gravity="auto"
                        quality="auto"
                        alt={`Diseño ${item.category ?? ''}`.trim()}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight truncate">{item.category ?? 'Diseño'}</p>
                          <p className="text-[11px] text-[var(--ink-faint)] truncate" title={item.designCode}>
                            Cód. {item.designCode}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="p-1.5 -mr-1.5 -mt-1 rounded-full text-[var(--ink-faint)] hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Quitar del pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-[var(--ink-soft)]">
                        <strong className="text-[var(--ink)]">{cartSizeLabel(size)}</strong>
                        {' · '}{cartProductTag(size)}
                        {!size.isExactPrice && ' · Medida especial'}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-[var(--line-strong)]">
                          <button
                            onClick={() => setQty(item.key, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-2)]"
                            aria-label="Restar uno"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-2)]"
                            aria-label="Sumar uno"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          {linePrice ? formatArs(linePrice) : <span className="text-xs font-normal text-amber-700">A confirmar</span>}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Total + envío */}
        {items.length > 0 && (
          <div className="border-t border-[var(--line)] px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3 bg-[var(--surface)]">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[var(--ink-soft)]">Total estimado</span>
              <span className="text-xl font-bold tabular-nums">
                {total > 0 ? formatArs(total) : '—'}
              </span>
            </div>
            <p className="text-[11px] leading-snug text-[var(--ink-soft)] -mt-1">
              {hasUnpricedItems ? 'Las medidas especiales se cotizan por WhatsApp. ' : ''}
              Por WhatsApp confirmamos el pedido y las opciones de piso (sin costo).
            </p>

            <WhatsAppDropdown
              buttonText="Enviar pedido por WhatsApp"
              message={message}
              onSelect={handleSent}
              className="w-full h-12 px-5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              iconClassName="brightness-0 invert"
            />

            <div className="text-center">
              {confirmClear ? (
                <span className="text-xs text-[var(--ink-soft)]">
                  ¿Vaciar el pedido?{' '}
                  <button onClick={() => { clear(); setConfirmClear(false) }} className="font-semibold text-red-600 underline underline-offset-2">
                    Sí, vaciar
                  </button>
                  {' · '}
                  <button onClick={() => setConfirmClear(false)} className="underline underline-offset-2">
                    No
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-[var(--ink-faint)] hover:text-[var(--ink)] underline underline-offset-2"
                >
                  Vaciar pedido
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
