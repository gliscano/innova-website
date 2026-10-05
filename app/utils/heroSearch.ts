import { catalogData } from "@/app/data/catalogData"
import { NAVIDAD_URL, catalogHref } from "@/app/data/heroGalleryData"

/** Lo mínimo de cada carpeta que necesita el buscador de la portada. */
export interface HeroSearchFolder {
  folderName: string
  title: string
  imageCount: number
  isCollection?: boolean
}

export interface HeroSearchResult {
  name: string
  href: string
  countLabel: string
}

export const normalizeSearch = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim()

/** Términos que la gente escribe y no coinciden con el nombre de ninguna carpeta. */
const SYNONYMS: Record<string, string> = {
  "recien nacido": "newborn",
  bebe: "newborn",
  cumple: "globos",
  navida: "navidad",
  egresado: "egresados",
  pared: "paredes",
  textura: "texturas",
}

const tagsByFolder = new Map(
  catalogData.map((c) => [c.category, c.tags.map(normalizeSearch)])
)

const NAVIDAD: HeroSearchResult = { name: "Navidad 2026", href: NAVIDAD_URL, countLabel: "Colección" }

/**
 * Búsqueda por temática sobre las carpetas del catálogo: nombre, título y etiquetas de
 * `catalogData`, sin tildes ni mayúsculas. Sin término devuelve todas las temáticas.
 */
export function searchThemes(folders: HeroSearchFolder[], query: string): HeroSearchResult[] {
  const toResult = (f: HeroSearchFolder): HeroSearchResult => ({
    name: f.title,
    href: catalogHref(f.folderName),
    countLabel: f.isCollection ? "Subcategorías" : f.imageCount > 0 ? `${f.imageCount} diseños` : "",
  })

  let term = normalizeSearch(query)
  const sorted = [...folders].sort((a, b) => a.title.localeCompare(b.title, "es"))
  if (!term) return [NAVIDAD, ...sorted.map(toResult)]

  for (const [k, v] of Object.entries(SYNONYMS)) {
    if (term.startsWith(k)) term = v
  }

  const byName: HeroSearchResult[] = []
  const byTag: HeroSearchResult[] = []
  if (normalizeSearch(NAVIDAD.name).includes(term)) byName.push(NAVIDAD)
  for (const f of sorted) {
    if (normalizeSearch(f.title).includes(term) || normalizeSearch(f.folderName).includes(term)) {
      byName.push(toResult(f))
    } else if (term.length >= 3 && tagsByFolder.get(f.folderName)?.some((t) => t.includes(term))) {
      byTag.push(toResult(f))
    }
  }
  return [...byName, ...byTag]
}
