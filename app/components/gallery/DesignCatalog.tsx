"use client"

import { useState, useRef, useEffect } from "react"
import { Star } from "lucide-react"
import { useProductSearch } from "../../hooks/useProductSearch"
import { trackSearch } from "@/app/utils/tracking"
import type { CloudinaryFolder } from "@/app/types/catalog"
import CardCatalog from "./CardCatalog"

interface Props {
  initialFolders: CloudinaryFolder[]
}

const sortLabels: Record<string, string> = {
  name: "Nombre A–Z",
  "name-desc": "Nombre Z–A",
  count: "Más diseños",
}

export default function InnovaCatalog({ initialFolders }: Props) {
  const sortRef = useRef<HTMLDivElement>(null)
  const searchTrackedRef = useRef(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(Infinity)

  const {
    searchTerm,
    sortBy,
    filteredProducts,
    setSearchTerm,
    setSortBy,
    clearFilters,
  } = useProductSearch(initialFolders)

  const totalDesigns = initialFolders.reduce((s, f) => s + f.imageCount, 0)

  useEffect(() => {
    if (!sortOpen) return
    const onDoc = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [sortOpen])

  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth < 640 ? 12 : 24)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 25) {
      setSearchTerm(value)
      if (value.length >= 3 && !searchTrackedRef.current) {
        trackSearch(value)
        searchTrackedRef.current = true
      }
      if (value.length === 0) {
        searchTrackedRef.current = false
      }
    }
  }

  return (
    <section id="catalog" className="py-4">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8 max-w-[720px]">
          <span className="block text-[11px] font-semibold tracking-[.18em] uppercase text-[#C8543D] mb-3">
            Inspirate y Elegí tu diseño
          </span>
          <h2
            className="leading-none tracking-tight mb-3 text-[#1F1A14]"
            style={{
              fontWeight: 500,
              fontSize: "clamp(36px, 7.5vw, 64px)",
            }}
          >
            Catálogo de <span className="font-bold text-[#C8543D]">Diseños</span>
          </h2>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">

          {/* Search */}
          <label className="flex items-center gap-2 bg-white border border-[#E7DFD2] rounded-[14px] h-[46px] px-3 transition-[border-color,box-shadow] focus-within:border-[#1F1A14] focus-within:ring-4 focus-within:ring-black/5 cursor-text">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 text-[#9C8E7C]">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5 L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar catálogo…"
              aria-label="Buscar en el catálogo de diseños"
              maxLength={25}
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[#1F1A14] placeholder:text-[#9C8E7C] text-[15px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Limpiar búsqueda"
                className="w-6 h-6 rounded-full grid place-items-center text-[#6B5F52] bg-[#F4EEE3] hover:bg-[#E7DFD2] text-[18px] leading-none shrink-0 transition-colors"
              >
                ×
              </button>
            )}
          </label>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className="flex items-center gap-2 bg-white border border-[#E7DFD2] rounded-[14px] h-[46px] px-[14px] text-[14px] font-medium text-[#1F1A14] hover:border-[#D9CEBC] transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline text-[#6B5F52] font-normal">Ordenar:</span>
              <span className="font-semibold">{sortLabels[sortBy] ?? "Nombre A–Z"}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {sortOpen && (
              <ul
                role="listbox"
                className="absolute top-[calc(100%+6px)] right-0 list-none m-0 p-[6px] bg-white border border-[#E7DFD2] rounded-[12px] shadow-[0_12px_32px_-8px_rgba(31,26,20,.18)] min-w-[180px] z-20"
              >
                {Object.entries(sortLabels).map(([k, v]) => (
                  <li key={k}>
                    <button
                      role="option"
                      aria-selected={sortBy === k}
                      onClick={() => { setSortBy(k); setSortOpen(false) }}
                      className={`w-full text-left px-3 py-[10px] text-[14px] font-medium rounded-[8px] transition-colors ${
                        sortBy === k
                          ? "bg-[#1F1A14] text-white"
                          : "text-[#1F1A14] hover:bg-[#F4EEE3]"
                      }`}
                    >
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Meta count */}
        <p className="text-[13px] text-[#6B5F52] mb-6 flex items-center gap-2 flex-wrap" aria-live="polite">
          <strong className="text-[#1F1A14] font-semibold">{filteredProducts.length}</strong>
          {filteredProducts.length === 1 ? "catálogo" : "catálogos"}
          <span className="text-[#9C8E7C]">·</span>
          <strong className="text-[#1F1A14] font-semibold">+4500</strong>
          diseños en total
        </p>

        {/* Grid */}
        {(() => {
          const isSearching = searchTerm.trim().length > 0

          // Búsqueda: mostrar todos los resultados filtrados sin límite
          if (isSearching) {
            if (filteredProducts.length === 0) {
              return (
                <div
                  role="status"
                  aria-live="polite"
                  className="border border-dashed border-[#D9CEBC] rounded-[18px] bg-white py-[60px] px-5 text-center"
                >
                  <p className="text-[15px] text-[#6B5F52] mb-3">
                    No encontramos catálogos para &ldquo;<strong className="text-[#1F1A14]">{searchTerm}</strong>&rdquo;.
                  </p>
                  <button
                    onClick={clearFilters}
                    aria-label="Limpiar búsqueda y ver todos los catálogos"
                    className="bg-[#1F1A14] text-white rounded-full px-[18px] py-[10px] text-[13px] font-semibold hover:bg-[#C8543D] transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )
            }
            return (
              <div
                role="grid"
                aria-label={`Catálogo de diseños fotográficos. ${filteredProducts.length} catálogos encontrados`}
                className="grid gap-3 grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredProducts.map((folder) => (
                  <CardCatalog key={folder.folderName} folder={folder} />
                ))}
              </div>
            )
          }

          // Navegación sin búsqueda: destacados siempre visibles, límite solo en regulares
          const allFeatured = filteredProducts.filter(f => f.featured)
          const allRegular = filteredProducts.filter(f => !f.featured)
          const featuredFolders = allFeatured
          const regularFolders = expanded ? allRegular : allRegular.slice(0, visibleCount)
          const hasHiddenItems = !expanded && allRegular.length > visibleCount

          return (
            <>
              {featuredFolders.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-[11px] font-semibold tracking-[.18em] uppercase text-[#C8543D] mb-4 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-[#C8543D]" />
                    Destacados
                  </h3>
                  <div className="grid gap-3 grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {featuredFolders.map((folder) => (
                      <CardCatalog key={folder.folderName} folder={folder} />
                    ))}
                  </div>
                </div>
              )}

              {regularFolders.length > 0 && (
                <div>
                  {featuredFolders.length > 0 && (
                    <h3 className="text-[11px] font-semibold tracking-[.18em] uppercase text-[#9C8E7C] mb-4">
                      Todos los catálogos
                    </h3>
                  )}
                  <div className="grid gap-3 grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {regularFolders.map((folder) => (
                      <CardCatalog key={folder.folderName} folder={folder} />
                    ))}
                  </div>
                </div>
              )}

              {hasHiddenItems && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9CEBC] bg-white text-[14px] font-semibold text-[#1F1A14] hover:bg-[#F4EEE3] hover:border-[#C8543D] transition-colors"
                  >
                    Ver más catálogos
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 5.5 L7 9.5 L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </section>
  )
}
