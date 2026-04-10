'use client'

import React, { useState, useEffect, useRef } from 'react'
import { propertiesBackdrops } from '../data/pricesData'
import { type SelectedSize } from '../context/SelectedSizeContext'

const STANDARD_WIDTHS = [1.50, 2.90]

function getStandardHeights(width: number): number[] {
  return propertiesBackdrops
    .filter(p => p.width === width)
    .map(p => p.height)
    .sort((a, b) => a - b)
}

function findNearestPrice(widthM: number, heightM: number): { price: number | null; matchedLabel: string | null } {
  const matchedWidth = STANDARD_WIDTHS.find(w => w >= widthM)
  if (!matchedWidth) return { price: null, matchedLabel: null }

  const heights = getStandardHeights(matchedWidth)
  const matchedHeight = heights.find(h => h >= heightM)
  if (!matchedHeight) return { price: null, matchedLabel: null }

  const item = propertiesBackdrops.find(p => p.width === matchedWidth && p.height === matchedHeight)
  if (!item) return { price: null, matchedLabel: null }

  return {
    price: item.price,
    matchedLabel: `${matchedWidth.toFixed(2)}m × ${matchedHeight.toFixed(1)}m`,
  }
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
}

export function SizeSelectorCompact({ onSelect, variant = 'light' }: SizeSelectorCompactProps) {
  const [widthValue, setWidthValue] = useState('')
  const [heightValue, setHeightValue] = useState('')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')

  const isCustomWidth = widthValue === 'custom'
  const isCustomHeight = heightValue === 'custom'

  const parsedWidth = isCustomWidth ? parseFloat(customWidth) : parseFloat(widthValue)
  const parsedHeight = isCustomHeight ? parseFloat(customHeight) : parseFloat(heightValue)

  const isValidWidth = !isNaN(parsedWidth) && parsedWidth > 0
  const isValidHeight = !isNaN(parsedHeight) && parsedHeight > 0
  const canConfirm = isValidWidth && isValidHeight

  const standardHeights = !isCustomWidth && isValidWidth ? getStandardHeights(parsedWidth) : []

  const nearestSize = canConfirm ? findNearestPrice(parsedWidth, parsedHeight) : null
  const isExactMatch =
    nearestSize?.matchedLabel === `${parsedWidth.toFixed(2)}m × ${parsedHeight.toFixed(1)}m`

  useEffect(() => {
    setHeightValue('')
    setCustomHeight('')
  }, [widthValue])

  const handleConfirm = () => {
    if (!canConfirm) return
    onSelect({
      id: nearestSize?.matchedLabel ?? `${parsedWidth}x${parsedHeight}`,
      label: `${parsedWidth.toFixed(2)}m × ${parsedHeight.toFixed(1)}m`,
      widthM: parsedWidth,
      heightM: parsedHeight,
      fromPrice: nearestSize?.price ?? undefined,
      isExactPrice: isExactMatch ?? false,
    })
  }

  const isDark = variant === 'dark'

  const widthOptions: DropdownOption[] = [
    ...STANDARD_WIDTHS.map(w => ({ value: String(w), label: `${w.toFixed(2)}m` })),
    { value: 'custom', label: 'Otra medida' },
  ]

  const heightOptions: DropdownOption[] = [
    ...standardHeights.map(h => ({ value: String(h), label: `${h.toFixed(1)}m` })),
    { value: 'custom', label: 'Otra medida' },
  ]

  const inputClass = isDark
    ? 'w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors'
    : 'w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors'

  const labelClass = `block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {/* Ancho */}
        <div className="flex-1">
          <label className={labelClass}>Ancho</label>
          {!isCustomWidth ? (
            <CustomDropdown
              value={widthValue}
              onChange={setWidthValue}
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
                onClick={() => { setWidthValue(''); setCustomWidth('') }}
                className={`text-sm px-2 py-1 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
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
              onChange={setHeightValue}
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
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resultado */}
      {canConfirm && (
        <div className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${
          isDark ? 'bg-amber-400/15 border border-amber-400/30' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="min-w-0">
            {nearestSize?.price ? (
              <>
                <p className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${nearestSize.price.toLocaleString('es-AR')}
                </p>
                {!isExactMatch && (
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    Precio ref. para {nearestSize.matchedLabel}
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
            onClick={handleConfirm}
            className="shrink-0 px-4 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-amber-200"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  )
}
