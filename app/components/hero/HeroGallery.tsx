"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import CardCatalog from "@/app/components/gallery/CardCatalog"
import { contentSets, heroChips, imageSets, NAVIDAD_URL } from "@/app/data/heroGalleryData"
import type { CloudinaryFolder } from "@/app/types/catalog"
import { searchThemes } from "@/app/utils/heroSearch"
import { trackHeroCta, trackSearch } from "@/app/utils/tracking"
import { GalleryCard } from "./GalleryCard"
import { HeroLink } from "./HeroLink"
import { NoResults, SearchResults } from "./HeroTopBar"

interface HeroGalleryProps {
  folders: CloudinaryFolder[]
}

const NAVIDAD_IMAGE = "/images/innova/navidad/navidad-1.webp"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"

/**
 * Primera pantalla de la portada.
 *
 * Celular: título, reseñas, los dos botones, chips de temáticas y la grilla de destacados (con la
 * franja de Navidad 2026 arriba). Computadora: título, buscador, chips, franja de Navidad y los
 * botones a la izquierda; collage clickeable a la derecha.
 */
export function HeroGallery({ folders }: HeroGalleryProps) {
  const content = contentSets[0]
  const featured = useMemo(() => folders.filter((f) => f.featured), [folders])

  // El CTA primario es un <Link> real (rastreable). En la home, donde la sección #catalog está en
  // la misma página, se intercepta para conservar el scroll suave.
  const handleViewDesigns = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackHeroCta("catalog")
    const catalogSection = document.getElementById("catalog")
    if (catalogSection) {
      e.preventDefault()
      catalogSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const { rating, count, url: reviewsUrl } = content.reviews

  return (
    <section className="max-w-[1440px] mx-auto px-4 pt-5 lg:px-12 lg:pt-14 lg:pb-16">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_48%] lg:gap-14 lg:items-center">
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

          {/* Botones: arriba de los chips en el celular, al final en la computadora */}
          <div className="order-3 lg:order-6 mt-3.5 lg:mt-7 grid grid-cols-2 gap-2 lg:flex lg:gap-3">
            <Link
              href="/design-catalog"
              onClick={handleViewDesigns}
              className={`h-12 lg:h-[52px] lg:px-7 rounded-xl btn-cta-style flex items-center justify-center text-[15px] lg:text-base ${focusRing}`}
            >
              {content.buttonText}
            </Link>
            <Link
              href={content.secondaryButtonUrl}
              onClick={() => trackHeroCta("prices")}
              className={`h-12 lg:h-[52px] lg:px-7 rounded-xl border-[1.5px] border-[var(--accent)] text-[var(--accent-dark)] font-semibold flex items-center justify-center text-[15px] lg:text-base hover:bg-[var(--surface-2)] transition-colors ${focusRing}`}
            >
              {content.secondaryButtonText}
            </Link>
          </div>

          {/* Chips: deslizables en el celular, en varias filas en la computadora */}
          <ul
            aria-label="Temáticas"
            className="order-4 mt-3.5 -mx-4 px-4 pb-0.5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:flex-wrap lg:overflow-visible lg:max-w-[540px]"
          >
            {heroChips.map((c) => (
              <li key={c.label} className="flex-none">
                <HeroLink
                  link={c}
                  location="hero_chips"
                  className={`h-[38px] lg:h-9 px-3.5 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] text-sm text-[var(--ink)] whitespace-nowrap flex items-center hover:border-[var(--accent)] transition-colors ${focusRing}`}
                />
              </li>
            ))}
          </ul>

          <NavidadStripDesktop />
        </div>

        {/* Collage de la computadora */}
        <div className="hidden lg:grid grid-cols-3 gap-2.5">
          {imageSets[0].map((image) => (
            <GalleryCard key={image.src} image={image} />
          ))}
        </div>
      </div>

      {/* Destacados del celular: las mismas tarjetas del catálogo, con su imagen de Cloudinary */}
      <div className="lg:hidden">
        <div className="pt-5 flex items-baseline justify-between">
          <h2 className="text-xl text-[var(--ink)]">Destacados</h2>
          <Link href="/design-catalog" className={`min-h-8 flex items-center text-sm font-medium text-[var(--accent)] rounded ${focusRing}`}>
            Ver todo
          </Link>
        </div>

        <Link
          href={NAVIDAD_URL}
          className={`mt-2.5 relative block h-[120px] rounded-[10px] overflow-hidden text-[var(--surface)] bg-[var(--ink)] ${focusRing}`}
        >
          <Image src={NAVIDAD_IMAGE} alt="" fill sizes="(min-width: 640px) 90vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
            <div>
              <p className="text-xs text-white/80">Temporada</p>
              <p className="copperplate-bold-font text-xl leading-tight text-white">Colección Navidad 2026</p>
            </div>
            <span className="text-sm font-medium text-white">Ver →</span>
          </div>
        </Link>

        {featured.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featured.map((folder) => (
              <CardCatalog key={folder.folderName} folder={folder} />
            ))}
          </div>
        )}

        <div className="py-4 flex justify-center">
          <Link href="/design-catalog" className={`min-h-11 flex items-center text-[15px] font-medium text-[var(--accent)] rounded ${focusRing}`}>
            Ver las {folders.length} categorías →
          </Link>
        </div>
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

function DesktopSearch({ folders }: { folders: CloudinaryFolder[] }) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const tracked = useRef(false)
  const ref = useRef<HTMLDivElement>(null)
  const results = useMemo(() => searchThemes(folders, q).slice(0, 8), [folders, q])

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
    if (value.trim().length >= 3 && !tracked.current) {
      trackSearch(value)
      tracked.current = true
    }
    if (!value) tracked.current = false
  }

  return (
    <div ref={ref} className="hidden lg:block order-3 relative mt-8 max-w-[520px]">
      <label className="h-[54px] px-4 flex items-center gap-2.5 rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface)] focus-within:border-[var(--accent)] cursor-text">
        <Search aria-hidden className="w-[18px] h-[18px] text-[var(--ink-soft)] shrink-0" strokeWidth={2.25} />
        <input
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
