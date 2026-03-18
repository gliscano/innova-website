'use client'

interface CategoryChipsProps {
  categories: string[]
  activeCategory: string | null
  onSelect: (cat: string | null) => void
}

export function CategoryChips({ categories, activeCategory, onSelect }: CategoryChipsProps) {
  if (categories.length === 0) return null

  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5"
      role="group"
      aria-label="Filtrar por categoría"
    >
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
          activeCategory === null
            ? 'bg-[#c19d83] text-white border-[#c19d83] shadow-sm'
            : 'bg-white/70 text-stone-600 border-stone-200 hover:border-[#c19d83] hover:text-[#c19d83]'
        }`}
        aria-pressed={activeCategory === null}
      >
        Todas
      </button>

      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(activeCategory === cat ? null : cat)}
          className={`flex-shrink-0 px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border capitalize ${
            activeCategory === cat
              ? 'bg-[#c19d83] text-white border-[#c19d83] shadow-sm'
              : 'bg-white/70 text-stone-600 border-stone-200 hover:border-[#c19d83] hover:text-[#c19d83]'
          }`}
          aria-pressed={activeCategory === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
