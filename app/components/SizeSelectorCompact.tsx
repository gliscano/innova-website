'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  FAMILIES,
  FINISH_LABEL,
  ars,
  dimLabel,
  selectedSizeFromFamily,
  type Family,
  type FamilyItem,
} from '../data/pricesData'
import { type SelectedSize } from '../context/SelectedSizeContext'

// ─── Productos ──────────────────────────────────────────────────────────────

/**
 * Tipos que se pueden pedir desde el catálogo. Fondo HD va primero y es el valor por defecto: quien
 * no toca los chips sigue el flujo de siempre (ancho × alto de tela HD). Neón es la misma tela con
 * otra terminación, pero va como chip propio para que sea una sola decisión y una sola fila.
 */
type ProductId = 'hd' | 'neon' | 'hibrido' | 'piso' | 'fundas'

const PRODUCTS: { id: ProductId; label: string; familyId?: string }[] = [
  { id: 'hd', label: 'Fondo HD' },
  { id: 'neon', label: 'Neón' },
  { id: 'hibrido', label: 'Híbrido', familyId: 'hibrido' },
  { id: 'piso', label: 'Piso', familyId: 'piso' },
  { id: 'fundas', label: 'Fundas', familyId: 'fundas' },
]

/** Fondos de tela con medida de tabla, por ancho. */
const FABRIC_FAMILIES = FAMILIES.filter(f => f.finishes.includes('hd'))
const STANDARD_WIDTHS = FABRIC_FAMILIES.map(f => f.ancho as number)

function fabricFamily(width: number): Family | undefined {
  return FABRIC_FAMILIES.find(f => f.ancho === width)
}

/** Tipo de una medida ya elegida, para reabrir el selector con el mismo producto marcado. */
function productFromSize(size?: SelectedSize | null): ProductId {
  if (!size) return 'hd'
  const listed = PRODUCTS.find(p => p.familyId && FAMILIES.find(f => f.id === p.familyId)?.nombre === size.productName)
  if (listed) return listed.id
  return size.finishLabel === FINISH_LABEL.neon ? 'neon' : 'hd'
}

/**
 * Fila de la tabla que cubre una medida de tela: el ancho estándar y el largo inmediatamente
 * superiores. Es el precio de referencia de una medida especial.
 */
function nearestFabricItem(widthM: number, heightM: number): { family: Family; item: FamilyItem } | null {
  const width = STANDARD_WIDTHS.slice().sort((a, b) => a - b).find(w => w >= widthM)
  const family = width !== undefined ? fabricFamily(width) : undefined
  if (!family) return null
  const item = family.largos.slice().sort((a, b) => a.largo - b.largo).find(i => i.largo >= heightM)
  return item ? { family, item } : null
}

// ─── Custom Dropdown ────────────────────────────────────────────────────────

interface DropdownOption {
  value: string
  label: string
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  isDark,
}: {
  value: string
  onChange: (v: string) => void
  options: DropdownOption[]
  placeholder: string
  disabled?: boolean
  isDark: boolean
}) {
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedLabel = options.find(o => o.value === value)?.label

  const handleOpen = () => {
    if (disabled) return
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const estimatedHeight = options.length * 44
      const spaceBelow = window.innerHeight - rect.bottom

      if (spaceBelow < estimatedHeight) {
        setDropdownStyle({
          position: 'fixed',
          bottom: window.innerHeight - rect.top + 6,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        })
      } else {
        setDropdownStyle({
          position: 'fixed',
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        })
      }
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleScroll = () => setOpen(false)
    if (open) {
      document.addEventListener('mousedown', handleClick)
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  const triggerBase = `w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150`
  const triggerActive = open
    ? isDark
      ? 'border-amber-400 bg-white/15 text-white'
      : 'border-amber-400 bg-amber-50 text-gray-900'
    : isDark
      ? 'border-white/20 bg-white/10 text-white hover:border-white/40'
      : 'border-gray-200 bg-white text-gray-900 hover:border-amber-300'

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`${triggerBase} ${disabled ? 'opacity-40 cursor-not-allowed' : triggerActive}`}
      >
        <span className={!value ? (isDark ? 'text-gray-500 font-normal' : 'text-gray-400 font-normal') : ''}>
          {selectedLabel ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isDark ? 'text-amber-400' : 'text-amber-500'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          style={dropdownStyle}
          className={`rounded-2xl shadow-xl overflow-hidden border ${
            isDark ? 'bg-gray-900 border-white/15' : 'bg-white border-gray-100'
          }`}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value
            const isSpecial = opt.value === 'custom'
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b last:border-b-0 ${
                  isDark ? 'border-white/5' : 'border-gray-50'
                } ${
                  isSelected
                    ? isDark ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'bg-amber-50 text-amber-700 font-semibold'
                    : isSpecial
                      ? isDark ? 'text-amber-400 hover:bg-white/10 italic' : 'text-amber-600 hover:bg-amber-50 italic'
                      : isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isSelected && <span className="mr-2">✓</span>}
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


// ─── Main Component ──────────────────────────────────────────────────────────

interface SizeSelectorCompactProps {
  onSelect: (size: SelectedSize) => void
  variant?: 'light' | 'dark'
  /** Medida elegida antes ("cambiar"): el selector abre con ese producto ya marcado. */
  initialSize?: SelectedSize | null
}

export function SizeSelectorCompact({ onSelect, variant = 'light', initialSize = null }: SizeSelectorCompactProps) {
  const [product, setProduct] = useState<ProductId>(() => productFromSize(initialSize))
  const [widthValue, setWidthValue] = useState('')
  const [heightValue, setHeightValue] = useState('')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')

  const isDark = variant === 'dark'
  const listedFamily = FAMILIES.find(f => f.id === PRODUCTS.find(p => p.id === product)?.familyId)
  const finish = product === 'neon' ? 'neon' : 'hd'

  const isCustomWidth = widthValue === 'custom'
  const isCustomHeight = heightValue === 'custom'
  const parsedWidth = isCustomWidth ? parseFloat(customWidth) : parseFloat(widthValue)
  const parsedHeight = isCustomHeight ? parseFloat(customHeight) : parseFloat(heightValue)
  const canConfirm = !isNaN(parsedWidth) && parsedWidth > 0 && !isNaN(parsedHeight) && parsedHeight > 0

  const nearest = canConfirm ? nearestFabricItem(parsedWidth, parsedHeight) : null
  const nearestPrice = nearest ? nearest.item[finish] ?? null : null
  const isExactMatch =
    !!nearest && nearest.family.ancho === parsedWidth && nearest.item.largo === parsedHeight

  const standardHeights = !isCustomWidth && widthValue
    ? (fabricFamily(parseFloat(widthValue))?.largos.map(i => i.largo) ?? []).sort((a, b) => a - b)
    : []

  /** Confirma una medida de tela (de tabla o especial). */
  const confirmFabric = (w: number, h: number) => {
    const match = nearestFabricItem(w, h)
    if (match && match.family.ancho === w && match.item.largo === h) {
      onSelect(selectedSizeFromFamily(match.family, match.item, finish))
      return
    }
    onSelect({
      id: `custom-${w}x${h}`,
      label: `${w.toFixed(2)}m × ${h.toFixed(1)}m`,
      widthM: w,
      heightM: h,
      fromPrice: match?.item[finish] ?? undefined,
      isExactPrice: false,
      finishLabel: finish === 'neon' ? FINISH_LABEL.neon : undefined,
    })
  }

  const pickProduct = (id: ProductId) => {
    setProduct(id)
    setWidthValue('')
    setHeightValue('')
    setCustomWidth('')
    setCustomHeight('')
  }

  const pickWidth = (v: string) => {
    setWidthValue(v)
    setHeightValue('')
    setCustomHeight('')
  }

  // Con ancho y alto de la tabla la medida se confirma sola; las especiales piden "Confirmar".
  const pickHeight = (v: string) => {
    setHeightValue(v)
    if (v !== 'custom' && !isCustomWidth && widthValue) confirmFabric(parseFloat(widthValue), parseFloat(v))
  }

  const widthOptions: DropdownOption[] = [
    ...STANDARD_WIDTHS.map(w => ({ value: String(w), label: `${w.toFixed(2)}m` })),
    { value: 'custom', label: 'Otra medida' },
  ]

  const heightOptions: DropdownOption[] = [
    ...standardHeights.map(h => ({ value: String(h), label: `${h.toFixed(1)}m` })),
    { value: 'custom', label: 'Otra medida' },
  ]

  const listedOptions: DropdownOption[] = listedFamily
    ? listedFamily.largos.map((item, i) => ({
        value: String(i),
        label: `${dimLabel(listedFamily, item)}${item.unico ? ` · ${ars(item.unico)}` : ''}`,
      }))
    : []

  const inputClass = isDark
    ? 'w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors'
    : 'w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors'

  const labelClass = `block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`

  const chipClass = (active: boolean) =>
    `shrink-0 h-8 px-3 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors ${
      active
        ? 'bg-amber-400 border-amber-400 text-[#1F1A14]'
        : isDark
          ? 'bg-white/5 border-white/20 text-gray-200 hover:border-white/40'
          : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
    }`

  return (
    <div className="space-y-3">
      {/* Producto — Fondo HD por defecto */}
      <div>
        <span className={labelClass} id="size-selector-product">Producto</span>
        <div
          role="radiogroup"
          aria-labelledby="size-selector-product"
          className="flex flex-wrap gap-1.5"
        >
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={product === p.id}
              onClick={() => pickProduct(p.id)}
              className={chipClass(product === p.id)}
            >
              {product === p.id && <span aria-hidden className="mr-1">✓</span>}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {listedFamily ? (
        /* Híbrido / Piso / Fundas: solo medidas de la lista, se confirma al elegir */
        <div>
          <label className={labelClass}>Medida</label>
          <CustomDropdown
            value=""
            onChange={v => onSelect(selectedSizeFromFamily(listedFamily, listedFamily.largos[Number(v)], 'unico'))}
            options={listedOptions}
            placeholder="— elegir —"
            isDark={isDark}
          />
        </div>
      ) : (
        <>
          <div className="flex gap-3">
            {/* Ancho */}
            <div className="flex-1">
              <label className={labelClass}>Ancho</label>
              {!isCustomWidth ? (
                <CustomDropdown
                  value={widthValue}
                  onChange={pickWidth}
                  options={widthOptions}
                  placeholder="— elegir —"
                  isDark={isDark}
                />
              ) : (
                <div className="flex gap-1.5 items-center">
                  <input
                    type="number"
                    placeholder="ej: 2.00"
                    value={customWidth}
                    onChange={e => setCustomWidth(e.target.value)}
                    step="0.1"
                    min="0.1"
                    className={inputClass}
                  />
                  <button
                    onClick={() => { pickWidth(''); setCustomWidth('') }}
                    className={`text-sm px-2 py-1 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    aria-label="Volver a las medidas de la lista"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Alto */}
            <div className="flex-1">
              <label className={labelClass}>Alto</label>
              {!isCustomHeight ? (
                <CustomDropdown
                  value={heightValue}
                  onChange={pickHeight}
                  options={heightOptions}
                  placeholder="— elegir —"
                  disabled={!widthValue}
                  isDark={isDark}
                />
              ) : (
                <div className="flex gap-1.5 items-center">
                  <input
                    type="number"
                    placeholder="ej: 2.20"
                    value={customHeight}
                    onChange={e => setCustomHeight(e.target.value)}
                    step="0.1"
                    min="0.1"
                    className={inputClass}
                  />
                  <button
                    onClick={() => { setHeightValue(''); setCustomHeight('') }}
                    className={`text-sm px-2 py-1 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    aria-label="Volver a las medidas de la lista"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resultado de una medida especial (las de la tabla se confirman solas) */}
          {canConfirm && (isCustomWidth || isCustomHeight) && (
            <div className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${
              isDark ? 'bg-amber-400/15 border border-amber-400/30' : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="min-w-0">
                {nearestPrice ? (
                  <>
                    <p className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {ars(nearestPrice)}
                    </p>
                    {!isExactMatch && nearest && (
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                        Precio ref. para {dimLabel(nearest.family, nearest.item)}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Medida personalizada
                    </p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      Elegí tu medida, confirmala y te enviaremos el valor por WhatsApp.
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => confirmFabric(parsedWidth, parsedHeight)}
                className="shrink-0 px-4 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-amber-200"
              >
                Confirmar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
