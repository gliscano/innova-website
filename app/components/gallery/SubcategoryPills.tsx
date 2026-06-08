'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { formatFolderName } from '@/app/utils/catalogUtils'
import type { CloudinarySubfolder } from '@/app/types/catalog'

interface SubcategoryPillsProps {
  subfolders: CloudinarySubfolder[]
  activeSubfolder: string
  onSelect: (path: string) => void
}

export function SubcategoryPills({ subfolders, activeSubfolder, onSelect }: SubcategoryPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  // Centrar pill activa en la barra al cambiar
  useEffect(() => {
    const activeBtn = buttonRefs.current.get(activeSubfolder)
    const container = containerRef.current
    if (!activeBtn || !container) return
    const targetScroll = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [activeSubfolder])

  const scrollBy = (delta: number) => {
    containerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const handleSelect = (path: string) => {
    setExpanded(false)
    onSelect(path)
  }

  if (subfolders.length === 0) return null

  return (
    <div>
      {/* Barra principal con flechas */}
      <div className="flex items-center gap-1">
        {/* Flecha izquierda */}
        <button
          onClick={() => scrollBy(-160)}
          aria-label="Desplazar izquierda"
          className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-all duration-200 hover:border-[#c19d83] hover:text-[#c19d83] ${
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Pills scrollables */}
        <div
          ref={containerRef}
          className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide pb-0.5"
          role="group"
          aria-label="Subcategorías"
        >
          {subfolders.map((sub) => (
            <button
              key={sub.path}
              ref={(el) => {
                if (el) buttonRefs.current.set(sub.path, el)
                else buttonRefs.current.delete(sub.path)
              }}
              onClick={() => handleSelect(sub.path)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeSubfolder === sub.path
                  ? 'bg-[#c19d83] text-white border-[#c19d83] shadow-sm'
                  : 'bg-white/70 text-stone-600 border-stone-200 hover:border-[#c19d83] hover:text-[#c19d83]'
              }`}
              aria-pressed={activeSubfolder === sub.path}
            >
              {formatFolderName(sub.name)}
            </button>
          ))}
        </div>

        {/* Flecha derecha */}
        <button
          onClick={() => scrollBy(160)}
          aria-label="Desplazar derecha"
          className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-all duration-200 hover:border-[#c19d83] hover:text-[#c19d83] ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Botón expandir todas */}
        <button
          onClick={() => setExpanded(v => !v)}
          aria-label={expanded ? 'Ocultar todas las subcategorías' : 'Ver todas las subcategorías'}
          aria-expanded={expanded}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-all duration-200 hover:border-[#c19d83] hover:text-[#c19d83]"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Panel expandido con todas las pills */}
      {expanded && (
        <div className="flex flex-wrap gap-2 pt-2 pb-1 border-t border-stone-200 mt-2">
          {subfolders.map((sub) => (
            <button
              key={sub.path}
              onClick={() => handleSelect(sub.path)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeSubfolder === sub.path
                  ? 'bg-[#c19d83] text-white border-[#c19d83] shadow-sm'
                  : 'bg-white/70 text-stone-600 border-stone-200 hover:border-[#c19d83] hover:text-[#c19d83]'
              }`}
              aria-pressed={activeSubfolder === sub.path}
            >
              {formatFolderName(sub.name)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
