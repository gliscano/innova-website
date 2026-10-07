"use client"

import React, { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { contentSets, NAVIDAD_URL } from "@/app/data/heroGalleryData"
import { useSearchTracking } from "@/app/hooks/useSearchTracking"
import { searchThemes, type HeroSearchFolder } from "@/app/utils/heroSearch"
import { trackHeroCta } from "@/app/utils/tracking"
import { GalleryCard, type HeroCollageItem } from "./GalleryCard"
import { NoResults, SearchResults } from "./HeroTopBar"

interface HeroGalleryProps {
  folders: HeroSearchFolder[]
  /** Destacados del catálogo para el collage de la computadora (hasta 6, una por categoría). */
  collage: HeroCollageItem[]
}

const NAVIDAD_IMAGE = "/images/innova/navidad/navidad-1.webp"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"

/**
 * Primera pantalla de la portada.
 *
 * Celular: título, reseñas y los dos botones. Computadora: título, buscador, franja de Navidad y
 * los botones a la izquierda; collage clickeable a la derecha.
 */
export function HeroGallery({ folders, collage }: HeroGalleryProps) {
  const content = contentSets[0]

  // El CTA primario baja a la sección #catalog de la misma página, con scroll suave; el href
  // `#catalog` es el respaldo si el script no llegó a hidratar.
  const handleViewDesigns = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackHeroCta("catalog")
    e.preventDefault()
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const { rating, count, url: reviewsUrl } = content.reviews

  return (
    <section className="max-w-[1440px] mx-auto px-4 pt-5 pb-6 lg:px-12 lg:pt-14 lg:pb-16">
      <div className={collage.length > 0 ? "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:items-center" : undefined}>
        <div className="flex flex-col">
          <h1 className="copperplate-bold-font text-[31px] leading-[1.12] lg:text-[38px] xl:text-[50px] 2xl:text-[58px] lg:leading-[1.05] tracking-[-.01em] text-[var(--ink)] order-1">
            {content.title} <em className="not-italic text-[var(--accent)]">{content.highlight}</em>
            <br />
            {content.subtitle}
          </h1>

          {/* Línea corta + reseñas: dos renglones en el celular, una fila en la computadora */}
          <div className="order-2 mt-2.5 lg:mt-[18px] flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-1 text-[15px] xl:text-[17px] text-[var(--ink-soft)] lg:whitespace-nowrap">
            <p>{content.tagline}</p>
            <span aria-hidden className="hidden lg:block w-px h-4 bg-[var(--line-strong)]" />
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1 lg:mt-0 min-h-7 flex items-center gap-1.5 text-sm lg:text-[15px] xl:text-[17px] text-[var(--ink-soft)] rounded ${focusRing}`}
            >
              <span aria-hidden className="text-[var(--accent)]">★</span>
              <span>
                <strong className="font-semibold text-[var(--ink)]">{rating}</strong> · {count} reseñas en Google
              </span>
            </a>
          </div>

          <DesktopSearch folders={folders} />

          {/* Botones: debajo de las reseñas en el celular, al final en la computadora */}
          <div className="order-3 lg:order-6 mt-3.5 lg:mt-7 grid grid-cols-2 gap-2 lg:flex lg:gap-3">
            <a
              href="#catalog"
              onClick={handleViewDesigns}
              className={`h-12 lg:h-[52px] lg:px-7 rounded-xl btn-cta-style flex items-center justify-center text-[15px] lg:text-base ${focusRing}`}
            >
              {content.buttonText}
            </a>
            <Link
              href={content.secondaryButtonUrl}
              onClick={() => trackHeroCta("prices")}
              className={`h-12 lg:h-[52px] lg:px-7 rounded-xl border-[1.5px] border-[var(--accent)] text-[var(--accent-dark)] font-semibold flex items-center justify-center text-[15px] lg:text-base hover:bg-[var(--surface-2)] transition-colors ${focusRing}`}
            >
              {content.secondaryButtonText}
            </Link>
          </div>

          <NavidadStripDesktop />
        </div>

        {/* Collage de la computadora: 3×2 con los destacados del catálogo */}
        {collage.length > 0 && (
          <div className="hidden lg:grid grid-cols-3 gap-2.5 w-[420px] xl:w-[480px]">
            {collage.map((item) => (
              <GalleryCard key={item.folderName} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function NavidadStripDesktop() {
  return (
    <Link
      href={NAVIDAD_URL}
      className={`hidden lg:grid order-5 mt-5 max-w-[520px] grid-cols-[120px_1fr_auto] gap-4 items-center rounded-[14px] overflow-hidden pr-5 bg-[var(--ink)] ${focusRing}`}
    >
      <div className="relative h-[84px]">
        <Image src={NAVIDAD_IMAGE} alt="" fill sizes="120px" className="object-cover" />
      </div>
      <div>
        <p className="text-[13px] text-white/75">Temporada · en el catálogo</p>
        <p className="copperplate-bold-font text-[21px] leading-tight text-white">Colección Navidad 2026</p>
      </div>
      <span className="text-[15px] font-medium text-white">Ver colección →</span>
    </Link>
  )
}

function DesktopSearch({ folders }: { folders: HeroSearchFolder[] }) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => searchThemes(folders, q).slice(0, 8), [folders, q])
  useSearchTracking(q, "hero_desktop")

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const onChange = (value: string) => {
    setQ(value)
    setOpen(value.length > 0)
  }

  // Flechas: desde el input bajan al primer resultado y se mueven entre resultados; desde el
  // primero, la flecha arriba vuelve al input.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!open || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return
    const links = Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>("[data-search-results] a[href]") ?? [])
    if (links.length === 0) return
    e.preventDefault()
    const i = links.indexOf(document.activeElement as HTMLAnchorElement)
    if (e.key === "ArrowDown") {
      links[Math.min(i + 1, links.length - 1)].focus()
    } else if (i <= 0) {
      inputRef.current?.focus()
    } else {
      links[i - 1].focus()
    }
  }

  return (
    <div ref={ref} onKeyDown={onKeyDown} className="hidden lg:block order-3 relative mt-8 max-w-[520px]">
      <label className="h-[54px] px-4 flex items-center gap-2.5 rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface)] focus-within:border-[var(--accent)] cursor-text">
        <Search aria-hidden className="w-[18px] h-[18px] text-[var(--ink-soft)] shrink-0" strokeWidth={2.25} />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => q && setOpen(true)}
          placeholder="Buscá por temática: newborn, globos, boho…"
          aria-label="Buscá por temática"
          className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-base text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
        />
      </label>
      {open && (
        <div
          data-search-results
          className="absolute inset-x-0 top-[60px] z-20 p-1.5 max-h-[300px] overflow-y-auto rounded-[14px] border border-[var(--line)] bg-[var(--surface)]"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <SearchResults results={results} onPick={() => setOpen(false)} itemClassName="h-[42px]" />
          {results.length === 0 && <NoResults query={q} />}
        </div>
      )}
    </div>
  )
}
