'use client'

import { useRef } from 'react'
import { CategoryChips } from './CategoryChips'

interface InspirationHeaderProps {
  searchTerm: string
  onSearch: (term: string) => void
  activeCategory: string | null
  onCategoryChange: (cat: string | null) => void
  categories: string[]
}

export function InspirationHeader({
  searchTerm,
  onSearch,
  activeCategory,
  onCategoryChange,
  categories,
}: InspirationHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="sticky top-0 z-20 bg-white/88 backdrop-blur-md border-b border-stone-200/60 px-4 py-3 space-y-2.5">
      {/* Buscador */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
          placeholder="Buscar por nombre o estilo…"
          className="w-full pl-9 pr-9 py-2 rounded-full bg-stone-100 text-sm text-stone-700 placeholder-stone-400 border border-transparent focus:outline-none focus:border-[#c19d83] focus:bg-white transition-all duration-200"
          aria-label="Buscar creaciones"
        />

        {searchTerm && (
          <button
            onClick={() => {
              onSearch('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Chips de categorías */}
      <CategoryChips
        categories={categories}
        activeCategory={activeCategory}
        onSelect={onCategoryChange}
      />
    </div>
  )
}
