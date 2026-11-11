'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { CldImage } from 'next-cloudinary'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { Check, Plus, ShoppingBag, X } from 'lucide-react'
import { GalleryModalProps } from '../../types/gallery'
import WhatsAppDropdown from '../WhatsAppDropdown'
import { useSelectedSize } from '../../context/SelectedSizeContext'
import { type SelectedSize } from '../../context/SelectedSizeContext'
import { useCart, cartItemKey, cartSizeLabel, cartProductName, cartProductNote, formatArs } from '../../context/CartContext'
import { SizeSelectorCompact } from '../SizeSelectorCompact'
import { parseImageDescription } from '@/app/utils/imageDescription'
import { formatFolderName } from '@/app/utils/catalogUtils'
import { trackAddToCart } from '@/app/utils/tracking'

function parseDescription(img?: GalleryModalProps['images'][number]) {
  const raw = typeof img?.description === 'string' && img.description.trim() !== ''
    ? img.description
    : typeof img?.context?.Description === 'string'
    ? img.context.Description
    : ''

  return parseImageDescription(raw)
}

/** Debajo de este largo la descripción entra en un renglón y no hace falta "Ver más". */
const DESCRIPTION_CLAMP_CHARS = 55
/** Desplazamiento horizontal (px) a partir del cual deslizar la imagen cambia de diseño. */
const SWIPE_THRESHOLD = 60

/** "Fondo HD" para el caso por defecto; si no, el tipo ("Neón (Fluo)", "Híbrido"…). */
function productShortLabel(size: SelectedSize): string {
  return cartProductNote(size) || 'Fondo HD'
}

export default function GalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  goToNext,
  goToPrevious,
  category: categoryProp,
}: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const { selectedSize, setSelectedSize, lastSelectedSize, setModalOpen } = useSelectedSize()
  const { items: cartItems, count: cartCount, addItem, removeItem, openDrawer } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const justAddedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Hoja "Elegí producto y medida": solo aparece cuando la persona quiere agregar, así explorar
  // diseños no es atravesar un formulario en cada uno.
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false)

  useEffect(() => {
    setModalOpen(isOpen)
    return () => setModalOpen(false)
  }, [isOpen, setModalOpen])

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element | null
      // El panel "Mi pedido" se abre por encima del modal: tocarlo no es un clic afuera.
      if (target?.closest?.('[data-cart-drawer]')) return
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && images[initialIndex]) {
      setHasError(false)
      setShowDescription(false)
      setJustAdded(false)
      setSizeSheetOpen(false)
    }
  }, [initialIndex, isOpen, images])

  // Con la hoja abierta, Escape cierra la hoja y no el modal (en captura, antes que useGalleryModal).
  useEffect(() => {
    if (!sizeSheetOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopImmediatePropagation()
      setSizeSheetOpen(false)
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [sizeSheetOpen])

  useEffect(() => () => {
    if (justAddedTimer.current) clearTimeout(justAddedTimer.current)
  }, [])

  const handleImageError = () => {
    setHasError(true)
  }

  const currentImage = images[initialIndex] ?? null
  // Sin categoría explícita (feed de inspiración) se usa la carpeta del diseño.
  const category = categoryProp || (currentImage?.folder ? formatFolderName(currentImage.folder.split('/').pop() ?? '') : '')
  const description = useMemo(() => parseDescription(currentImage), [currentImage])

  // WhatsApp directo (secundario): consulta puntual por este diseño. Para comprar, el camino
  // principal es "Agregar a Mi pedido", que junta varios diseños y medidas en un solo mensaje.
  const designLines = `Categoría: ${category || 'diseño'}\nModelo: ${currentImage?.display_name}`
  const whatsappMessage = selectedSize
    ? `Hola! Tengo una consulta por este diseño:\n${designLines}\nProducto: ${cartProductName(selectedSize)}\nMedida que me interesa: ${selectedSize.label}\nVer imagen: ${currentImage?.url}`
    : `Hola! Tengo una consulta por este diseño:\n${designLines}\nVer imagen: ${currentImage?.url}`

  // Líneas de este diseño que ya están en el pedido (puede estar en varias medidas).
  const linesForDesign = currentImage ? cartItems.filter(i => i.imageId === currentImage.id) : []
  const currentKey = currentImage && selectedSize ? cartItemKey(currentImage.id, selectedSize) : null
  const qtyInCartForSize = cartItems.find(i => i.key === currentKey)?.qty ?? 0

  // Recibe la medida explícita: desde la hoja se agrega en el mismo clic en que se elige, antes de
  // que `selectedSize` se actualice.
  const addToCart = (size: SelectedSize) => {
    if (!currentImage) return
    addItem({
      imageId: currentImage.id,
      designCode: currentImage.display_name,
      category: category || undefined,
      imageUrl: currentImage.url,
      size,
    })
    trackAddToCart(category || '', size.isExactPrice ? size.fromPrice : undefined, cartProductName(size))
    setJustAdded(true)
    if (justAddedTimer.current) clearTimeout(justAddedTimer.current)
    justAddedTimer.current = setTimeout(() => setJustAdded(false), 1800)
  }

  // Sin medida elegida, "Agregar" abre la hoja; con medida, agrega con un toque.
  const handleAddClick = () => {
    if (selectedSize) addToCart(selectedSize)
    else setSizeSheetOpen(true)
  }

  const handleSheetSelect = (size: SelectedSize) => {
    setSelectedSize(size)
    setSizeSheetOpen(false)
    addToCart(size)
  }

  const handleSwipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goToNext()
    else if (info.offset.x >= SWIPE_THRESHOLD) goToPrevious()
  }

  if (!isOpen || !currentImage) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 mob-landscape:p-0"
      >
        <div
          ref={modalRef}
          className="relative w-full h-full max-w-7xl flex flex-col mob-landscape:flex-row overflow-hidden"
        >
          {/* Botón cerrar — siempre absoluto top-right */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── IMAGEN ──
              Portrait:  order-1 → siempre arriba (flex-1)
              Landscape: order-1 → columna izquierda, ocupa toda la altura */}
          <div className="flex-1 relative min-h-0 overflow-hidden order-1">

            {/* Header overlay — solo en portrait (título + contador sobre la imagen) */}
            <div className="absolute top-0 inset-x-0 z-10 flex items-end pb-2 px-4 pt-8 bg-gradient-to-b from-black/60 to-transparent mob-landscape:hidden">
              <div className="pr-10">
                <h2 className="text-base font-semibold text-white leading-tight truncate">
                  {category || 'Diseño'}
                </h2>
                <span className="text-xs text-gray-300 block">
                  {initialIndex + 1} de {images.length}
                </span>
              </div>
            </div>
            <motion.div
              key={initialIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              // Deslizar a los costados cambia de diseño (el gesto natural en el celular).
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              dragSnapToOrigin
              onDragEnd={handleSwipe}
              style={{ touchAction: 'pan-y' }}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              {!hasError ? (
                <CldImage
                  src={currentImage.id}
                  alt={description?.text || `Imagen ${initialIndex + 1}`}
                  width={1600}
                  height={1200}
                  className="object-contain w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"
                  crop="limit"
                  format="webp"
                  quality="auto:good"
                  loading="eager"
                  draggable={false}
                  onError={handleImageError}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <svg className="w-24 h-24 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Imagen no disponible</p>
                  <p className="text-sm text-gray-400 mt-2">Esta imagen ya no está disponible</p>
                </div>
              )}
            </motion.div>

            {/* Controles de navegación encima de la imagen */}
            <button
              onClick={() => goToPrevious()}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => goToNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* ── PANEL INFO ──
              Portrait:  order-2 → siempre debajo de la imagen (descripción + footer)
              Landscape: order-2 → columna derecha fija (w-64), con scroll propio */}
          <div className="flex flex-col flex-shrink-0 order-2 max-h-[40vh] overflow-y-auto overscroll-contain mob-landscape:max-h-none mob-landscape:w-64 mob-landscape:h-full mob-landscape:overflow-y-auto mob-landscape:border-l mob-landscape:border-white/10 mob-landscape:bg-black/60">

            {/* Título + contador — solo visible en landscape (en portrait va como overlay sobre la imagen) */}
            <div className="hidden mob-landscape:flex items-start text-white px-4 py-3 pr-12 flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold leading-tight">
                  {category || 'Diseño'}
                </h2>
                <span className="text-xs text-gray-400 mt-0.5 block">
                  {initialIndex + 1} de {images.length}
                </span>
              </div>
            </div>

            {/* Descripción, colores y código (detalles, plegados en un renglón) */}
            <div className="flex-shrink-0 px-4 pt-3 pb-2 space-y-1.5">
                {description?.colors && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mr-1">Colores</span>
                    {description.colors.slice(0, 3).map((color) => (
                      <span
                        key={color}
                        className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                )}
                {description?.text && (
                  <div>
                    <p
                      className={`text-gray-300 text-sm leading-relaxed transition-all duration-200 ${
                        showDescription ? '' : 'line-clamp-1'
                      }`}
                    >
                      {description.text}
                    </p>
                    {description.text.length > DESCRIPTION_CLAMP_CHARS && (
                    <button
                      onClick={() => setShowDescription(prev => !prev)}
                      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-xs py-1.5 pr-3"
                    >
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${showDescription ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {showDescription ? 'Ver menos' : 'Ver más'}
                    </button>
                    )}
                  </div>
                )}
                <p className="text-[11px] text-gray-500 truncate" title={currentImage.display_name}>
                  Cód. {currentImage.display_name}
                </p>
            </div>

            {/* Footer — medida + Mi pedido (+ WhatsApp directo como secundario) */}
            <div className="flex-shrink-0 px-4 pb-4 pt-3 sticky bottom-0 z-10 bg-[#111] border-t border-white/10 mob-landscape:static mob-landscape:bg-transparent mob-landscape:border-t-0 space-y-2.5">

              {/* Medida elegida: una línea compacta. Sin medida no se muestra nada: el selector
                  aparece recién al tocar "Agregar". */}
              {selectedSize && (
                <div className="flex items-center gap-2 text-sm min-w-0">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" aria-hidden />
                  <span className="text-white font-medium truncate">
                    {productShortLabel(selectedSize)} · {selectedSize.label}
                  </span>
                  {selectedSize.fromPrice ? (
                    <span className="text-amber-300 shrink-0">
                      {selectedSize.isExactPrice ? '' : 'desde '}{formatArs(selectedSize.fromPrice)}
                    </span>
                  ) : null}
                  <button
                    onClick={() => setSizeSheetOpen(true)}
                    className="ml-auto text-gray-300 hover:text-white transition-colors text-xs underline underline-offset-2 shrink-0 py-1.5"
                  >
                    cambiar
                  </button>
                </div>
              )}

              {/* Este diseño ya en el pedido (en una o más medidas) */}
              {linesForDesign.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wide text-gray-400 mr-0.5">En tu pedido</span>
                  {linesForDesign.map(line => (
                    <span key={line.key} className="inline-flex items-center gap-1 rounded-full bg-white/10 pl-2.5 pr-1 py-0.5 text-xs text-gray-100">
                      {cartSizeLabel(line.size)}{cartProductNote(line.size) ? ` · ${cartProductNote(line.size)}` : ''} ×{line.qty}
                      <button
                        onClick={() => removeItem(line.key)}
                        className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
                        aria-label={`Quitar ${cartSizeLabel(line.size)} del pedido`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-stretch gap-2">
                <button
                  onClick={handleAddClick}
                  aria-haspopup={selectedSize ? undefined : 'dialog'}
                  className={`flex-1 h-12 rounded-xl px-4 flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.98] ${
                    justAdded ? 'bg-green-500 text-white' : 'bg-amber-400 hover:bg-amber-300 text-[#1F1A14]'
                  }`}
                >
                  {justAdded ? (
                    <><Check className="w-5 h-5" /> Agregado a Mi pedido</>
                  ) : qtyInCartForSize > 0 ? (
                    <><Plus className="w-5 h-5" /> Sumar otro ({qtyInCartForSize} en el pedido)</>
                  ) : (
                    <><Plus className="w-5 h-5" /> Agregar a Mi pedido</>
                  )}
                </button>
                <WhatsAppDropdown
                  iconOnly
                  wrapperClassName="relative shrink-0"
                  buttonText="Consultar este diseño por WhatsApp"
                  message={whatsappMessage}
                  className="h-12 w-12 rounded-xl border border-green-500/60 bg-green-500/10 hover:bg-green-500/25 flex items-center justify-center transition-colors"
                  iconClassName="brightness-0 invert"
                />
              </div>

              {cartCount > 0 && (
                <button
                  onClick={openDrawer}
                  className="w-full flex items-center justify-center gap-2 text-sm text-amber-200 hover:text-amber-100 py-1"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver Mi pedido ({cartCount}) y enviarlo
                  <span aria-hidden>→</span>
                </button>
              )}
            </div>

          </div>

          {/* Hoja "Elegí producto y medida" — dentro del modal, sobre el panel */}
          <AnimatePresence>
            {sizeSheetOpen && (
              <>
                <motion.div
                  key="size-sheet-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-black/60"
                  onClick={() => setSizeSheetOpen(false)}
                />
                <motion.div
                  key="size-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="size-sheet-title"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                  className="absolute inset-x-0 bottom-0 z-40 max-h-[85%] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-white/10 bg-[#151515] px-4 pt-2 pb-5 shadow-2xl sm:mx-auto sm:w-[28rem] sm:max-w-full mob-landscape:mr-0 mob-landscape:w-80"
                >
                  <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 id="size-sheet-title" className="text-white font-semibold leading-tight">
                        Elegí producto y medida
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Al elegir la medida se agrega a Mi pedido</p>
                    </div>
                    <button
                      onClick={() => setSizeSheetOpen(false)}
                      className="p-1.5 -mr-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
                      aria-label="Cerrar selector de medida"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <SizeSelectorCompact
                    onSelect={handleSheetSelect}
                    variant="dark"
                    initialSize={selectedSize ?? lastSelectedSize}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
