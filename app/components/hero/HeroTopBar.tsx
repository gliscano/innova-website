"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { Menu, Search, X } from "lucide-react"
import WhatsAppDropdown from "@/app/components/WhatsAppDropdown"
import { heroMenuLinks } from "@/app/data/heroGalleryData"
import { searchThemes, type HeroSearchFolder } from "@/app/utils/heroSearch"
import { useSearchTracking } from "@/app/hooks/useSearchTracking"
import { HeroLink } from "./HeroLink"

interface HeroTopBarProps {
  folders: HeroSearchFolder[]
}

const iconButton =
  "w-11 h-11 grid place-items-center rounded-[10px] text-[var(--ink)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"

/**
 * Barra superior de la portada. En el celular es fija (56 px) con lupa y menú; en la computadora
 * (72 px) muestra el menú completo y el acceso a WhatsApp con las dos vendedoras.
 *
 * Es `fixed` y no `sticky` porque `html` y `body` tienen `overflow-x: hidden`, y eso convierte a
 * `body` en el contenedor de scroll de `sticky`, que entonces nunca se pega.
 */
export function HeroTopBar({ folders }: HeroTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  const closeSearch = () => {
    setSearchOpen(false)
    searchButtonRef.current?.focus()
  }

  useEffect(() => {
    if (!menuOpen && !searchOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        if (searchOpen) {
          setSearchOpen(false)
          searchButtonRef.current?.focus()
        }
      }
    }
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onDown)
    }
  }, [menuOpen, searchOpen])

  return (
    <>
      <header
        className="fixed lg:static inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]"
      >
        <div className="h-14 lg:h-[72px] pl-4 pr-2 lg:px-12 max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" aria-label="Innova — inicio" className="flex items-center">
            <Image
              src="/svg/innova-logo.svg"
              alt="Innova"
              width={130}
              height={32}
              priority
              className="h-[26px] lg:h-8 w-auto"
            />
          </Link>

          {/* Computadora: menú y WhatsApp */}
          <nav aria-label="Principal" className="hidden lg:flex gap-1">
            {heroMenuLinks.map((l) => (
              <HeroLink
                key={l.href}
                link={l}
                location="hero_menu"
                className="h-11 px-3.5 flex items-center text-[15px] text-[var(--ink)] rounded-lg hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {l.short ?? l.label}
              </HeroLink>
            ))}
          </nav>
          <div className="hidden lg:block">
            <WhatsAppDropdown
              message="Hola! Quiero consultar sobre sus fondos fotográficos"
              buttonText="WhatsApp"
              className="h-10 px-3.5 flex items-center gap-1 text-sm font-medium text-[var(--ink)] border border-[var(--line-strong)] rounded-[10px] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors"
              iconClassName="!mr-1"
            />
          </div>

          {/* Celular: lupa y menú */}
          <div ref={menuRef} className="lg:hidden flex gap-0.5 relative">
            <button
              ref={searchButtonRef}
              type="button"
              aria-label="Buscar una temática"
              className={iconButton}
              onClick={() => {
                setMenuOpen(false)
                setSearchOpen(true)
              }}
            >
              <Search className="w-5 h-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label="Menú"
              aria-expanded={menuOpen}
              aria-controls="hero-menu"
              className={iconButton}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {menuOpen && (
              <nav
                id="hero-menu"
                aria-label="Principal"
                className="absolute top-[52px] right-0 w-[220px] p-1.5 flex flex-col rounded-[14px] border border-[var(--line)] bg-[var(--surface)]"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                {heroMenuLinks.map((l) => (
                  <HeroLink
                    key={l.href}
                    link={l}
                    location="hero_menu"
                    onClick={() => setMenuOpen(false)}
                    className="min-h-11 flex items-center px-3 rounded-[10px] text-[15px] text-[var(--ink)] hover:bg-[var(--surface-2)]"
                  />
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>
      {/* Reserva el alto de la barra fija en el celular */}
      <div aria-hidden className="h-14 lg:hidden" />

      {searchOpen && <SearchOverlay folders={folders} onClose={closeSearch} />}
    </>
  )
}

function SearchOverlay({ folders, onClose }: { folders: HeroSearchFolder[]; onClose: () => void }) {
  const [q, setQ] = useState("")
  const dialogRef = useRef<HTMLDivElement>(null)
  const results = useMemo(() => searchThemes(folders, q), [folders, q])
  useSearchTracking(q, "hero_mobile")

  // Mientras el buscador está abierto la página de fondo no scrollea.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Mantiene el foco del teclado dentro del diálogo.
  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>("input, button, a[href]")
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={dialogRef}
      onKeyDown={trapFocus}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar una temática"
      className="lg:hidden fixed inset-0 z-[60] flex flex-col bg-[var(--bg)]"
    >
      <div className="h-14 pl-4 pr-2 flex items-center gap-2 border-b border-[var(--line)]">
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscá una temática: newborn, globos…"
          aria-label="Buscá una temática"
          className="flex-1 min-w-0 h-10 px-3 rounded-[10px] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] text-base placeholder:text-[var(--ink-faint)] outline-none focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={onClose}
          className="h-11 px-2.5 text-[15px] text-[var(--accent-dark)] rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Cerrar
        </button>
      </div>
      <p className="px-4 pt-2.5 text-xs text-[var(--ink-soft)]" aria-live="polite">
        {q ? `${results.length} ${results.length === 1 ? "temática" : "temáticas"}` : `Todas las temáticas · ${folders.length} catálogos`}
      </p>
      <div className="flex-1 overflow-y-auto px-2 pt-1 pb-4">
        <SearchResults results={results} onPick={onClose} />
        {results.length === 0 && <NoResults query={q} />}
      </div>
    </div>
  )
}

export function SearchResults({
  results,
  onPick,
  itemClassName = "min-h-11",
}: {
  results: ReturnType<typeof searchThemes>
  onPick?: () => void
  itemClassName?: string
}) {
  return (
    <ul>
      {results.map((r) => (
        <li key={r.href}>
          <Link
            href={r.href}
            onClick={onPick}
            className={`${itemClassName} flex items-center justify-between px-3 rounded-[10px] text-[15px] text-[var(--ink)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:bg-[var(--surface-2)]`}
          >
            <span>{r.name}</span>
            <span className="text-[13px] text-[var(--ink-soft)]">{r.countLabel}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function NoResults({ query }: { query: string }) {
  return (
    <div className="px-3 py-3 text-sm text-[var(--ink-soft)] leading-relaxed">
      <p className="text-[var(--ink)]">
        No encontramos &ldquo;<strong className="font-semibold">{query.trim()}</strong>&rdquo;.
      </p>
      <p className="mt-1 mb-3">
        Probá con una palabra más general o relacionada, o escribinos y te ayudamos de forma
        personalizada.
      </p>
      <WhatsAppDropdown
        message={`Hola! Busco un fondo de "${query.trim()}" y no lo encontré en el catálogo.`}
        buttonText="Pedilo personalizado por WhatsApp"
        className="w-full min-h-11 px-3 flex items-center gap-1 rounded-[10px] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--accent-dark)] font-medium hover:bg-[var(--surface-2)] transition-colors [&>span]:flex-1 [&>span]:text-left"
      />
    </div>
  )
}
