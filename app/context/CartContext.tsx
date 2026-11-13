'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { SelectedSize } from './SelectedSizeContext'

/**
 * "Mi pedido": el borrador que arma el cliente en el catálogo (varios diseños × varias medidas) y
 * envía en un solo mensaje de WhatsApp. Con ese mensaje la vendedora crea el pedido real en la
 * planilla (`lib/orders.ts`, `/pedido/[clave]`); este carrito no se conecta con Sheets.
 *
 * Se llama Cart y no Order a propósito: `OrderItem` / `orders.ts` ya son el pedido de la planilla.
 */
export interface CartItem {
  /** imageId + medida + terminación: el mismo diseño en otra medida es otra línea. */
  key: string
  imageId: string
  /** Código del diseño (display_name de Cloudinary): es el "Modelo" que carga la vendedora. */
  designCode: string
  /** Nombre legible de la categoría ("Paredes"). */
  category?: string
  imageUrl: string
  size: SelectedSize
  qty: number
}

export type NewCartItem = Omit<CartItem, 'key' | 'qty'>

interface CartContextValue {
  items: CartItem[]
  /** Unidades totales (suma de cantidades). */
  count: number
  /** Total de las líneas con precio de tabla; las medidas especiales quedan a confirmar. */
  total: number
  hasUnpricedItems: boolean
  addItem: (item: NewCartItem) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
  /** Vacía el carrito después de enviarlo, guardando una copia para "Deshacer". */
  markSent: () => void
  /** true mientras se puede deshacer el último envío. */
  canUndoSent: boolean
  undoSent: () => void
  dismissUndo: () => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const STORAGE_KEY = 'innova-cart-v1'
const MAX_QTY = 20
const UNDO_MS = 8000

export function cartItemKey(imageId: string, size: SelectedSize): string {
  return `${imageId}|${size.productName ?? ''}|${size.widthM}x${size.heightM}|${size.finishLabel ?? ''}`
}

const CartContext = createContext<CartContextValue | null>(null)

function isCartItem(i: unknown): i is CartItem {
  if (!i || typeof i !== 'object') return false
  const c = i as Partial<CartItem>
  return (
    typeof c.key === 'string' &&
    typeof c.imageId === 'string' &&
    typeof c.designCode === 'string' &&
    typeof c.imageUrl === 'string' &&
    typeof c.qty === 'number' && c.qty > 0 &&
    !!c.size && typeof c.size.widthM === 'number' && typeof c.size.heightM === 'number'
  )
}

function readStoredItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [sentSnapshot, setSentSnapshot] = useState<CartItem[] | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Se lee después del montaje: en el servidor no hay localStorage y el HTML tiene que coincidir.
  useEffect(() => {
    setItems(readStoredItems())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Modo privado / almacenamiento bloqueado: el pedido sigue funcionando en memoria.
    }
  }, [items, hydrated])

  useEffect(() => () => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }, [])

  const addItem = useCallback((item: NewCartItem) => {
    const key = cartItemKey(item.imageId, item.size)
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => (i.key === key ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i))
      }
      return [...prev, { ...item, key, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems(prev => prev.filter(i => i.key !== key))
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.key !== key)
        : prev.map(i => (i.key === key ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const dismissUndo = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setSentSnapshot(null)
  }, [])

  const markSent = useCallback(() => {
    setSentSnapshot(items)
    setItems([])
    setDrawerOpen(false)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setSentSnapshot(null), UNDO_MS)
  }, [items])

  const undoSent = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    if (sentSnapshot) setItems(sentSnapshot)
    setSentSnapshot(null)
  }, [sentSnapshot])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    let count = 0
    let total = 0
    let hasUnpricedItems = false
    for (const i of items) {
      count += i.qty
      if (i.size.fromPrice && i.size.isExactPrice) total += i.size.fromPrice * i.qty
      else hasUnpricedItems = true
    }
    return {
      items, count, total, hasUnpricedItems,
      addItem, removeItem, setQty, clear,
      markSent, canUndoSent: sentSnapshot !== null, undoSent, dismissUndo,
      isDrawerOpen, openDrawer, closeDrawer,
    }
  }, [items, addItem, removeItem, setQty, clear, markSent, sentSnapshot, undoSent, dismissUndo, isDrawerOpen, openDrawer, closeDrawer])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}

// ─── Mensaje de WhatsApp ─────────────────────────────────────────────────────

const STANDARD_WIDTHS = [1.5, 2.9]

/** "2,9" / "5" — mismo formato que la columna Medidas de la pestaña Precios. */
function sheetNumber(n: number): string {
  return String(Number(n.toFixed(2))).replace('.', ',')
}

/**
 * Nombre del producto tal como figura en la pestaña Precios de la planilla
 * ("Fondo 2.90m Color Vivo HD"), para que la vendedora lo encuentre sin traducir nada.
 */
export function cartProductName(size: SelectedSize): string {
  // Elegido desde /prices: el nombre ya viene de la lista (Híbrido, Piso Neoprene, Fundas…).
  if (size.productName) return size.productName
  const finish = size.finishLabel ?? 'Color Vivo HD'
  const width = STANDARD_WIDTHS.find(w => Math.abs(w - size.widthM) < 0.001)
  return width ? `Fondo ${width.toFixed(2)}m ${finish}` : `Fondo medida especial ${finish}`
}

const DEFAULT_FINISH = 'Color Vivo HD'

function isFabricBackdrop(size: SelectedSize): boolean {
  return !size.productName || size.productName.startsWith('Fondo ')
}

/**
 * Tipo corto para mostrar junto a la medida: la terminación en los fondos de tela
 * ("Color Vivo HD", "Neón (Fluo)") o el producto en el resto ("Híbrido", "Piso Neoprene").
 */
export function cartProductTag(size: SelectedSize): string {
  return isFabricBackdrop(size) ? size.finishLabel ?? DEFAULT_FINISH : size.productName!
}

/** Igual que `cartProductTag`, pero vacío para el caso por defecto (fondo de tela HD). */
export function cartProductNote(size: SelectedSize): string {
  const tag = cartProductTag(size)
  return tag === DEFAULT_FINISH ? '' : tag
}

export function cartSizeLabel(size: SelectedSize): string {
  return `${sheetNumber(size.widthM)} x ${sheetNumber(size.heightM)} m`
}

export function formatArs(n: number): string {
  return `$${n.toLocaleString('es-AR')}`
}

/**
 * Mensaje único con todas las líneas. Rótulos iguales a los de la web ("Diseño", no "Modelo": en la
 * pestaña Items de la planilla el código va en la columna Modelo). El precio va en su propia línea
 * y el cierre suma productos y total.
 */
export function cartDesignLine(category: string | undefined, designCode: string): string {
  return category ? `Diseño: ${category} (Cód: ${designCode})` : `Diseño: Cód. ${designCode}`
}

export function buildCartMessage(items: CartItem[], total: number, hasUnpricedItems: boolean): string {
  const lines = items.map((item, n) => {
    const { size } = item
    const unit = size.fromPrice && size.isExactPrice ? size.fromPrice : null
    const price = unit === null
      ? 'a confirmar (medida especial)'
      : item.qty > 1
        ? `${formatArs(unit * item.qty)} (${item.qty} × ${formatArs(unit)})`
        : formatArs(unit)
    return [
      `${n + 1}) ${cartDesignLine(item.category, item.designCode)}`,
      `Producto: ${cartProductName(size)}`,
      `Medida: ${cartSizeLabel(size)} · Cantidad: ${item.qty}`,
      `Precio: ${price}`,
      `Ver imagen: ${item.imageUrl}`,
    ].join('\n')
  })

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const products = `${count} ${count === 1 ? 'producto' : 'productos'}`
  const totalLine = total > 0
    ? `*Total: ${products} · ${formatArs(total)}*${hasUnpricedItems ? ' + medidas especiales a confirmar' : ''}`
    : `*Total: ${products}* (precio a confirmar)`

  return `Hola! Quiero hacer este pedido:\n\n${lines.join('\n\n')}\n\n${totalLine}\n¿Cómo sigo con la compra?`
}
