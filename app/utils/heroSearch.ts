import { catalogData } from "@/app/data/catalogData"
import { NAVIDAD_URL } from "@/app/data/heroGalleryData"
import { catalogHref } from "@/app/lib/siteUrl"

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
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()

/**
 * Términos que la gente escribe y que no aparecen en el nombre de ninguna carpeta. Se buscan
 * además del término original (no en su lugar), así "bebe shower" no se pierde en "newborn".
 */
const SYNONYMS: Record<string, string> = {
  "recien nacido": "newborn",
  bebe: "newborn",
  cumple: "globos",
}

/** El término más el equivalente de cada sinónimo que contiene o que está empezando a escribir. */
function expandTerm(term: string): string[] {
  const terms = [term]
  for (const [k, v] of Object.entries(SYNONYMS)) {
    if (term.startsWith(k) || (term.length >= 3 && k.startsWith(term))) terms.push(v)
  }
  return terms
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

  const term = normalizeSearch(query)
  // La carpeta `navidad` del catálogo ya está representada por la colección fija de /navidad.
  const sorted = folders
    .filter((f) => normalizeSearch(f.folderName) !== "navidad")
    .sort((a, b) => a.title.localeCompare(b.title, "es"))
  if (!term) return [NAVIDAD, ...sorted.map(toResult)]

  const terms = expandTerm(term)
  const matches = (text: string) => terms.some((t) => text.includes(t))

  const byName: HeroSearchResult[] = []
  const byTag: HeroSearchResult[] = []
  if (matches(normalizeSearch(NAVIDAD.name))) byName.push(NAVIDAD)
  for (const f of sorted) {
    if (matches(normalizeSearch(f.title)) || matches(normalizeSearch(f.folderName))) {
      byName.push(toResult(f))
    } else if (term.length >= 3 && tagsByFolder.get(f.folderName)?.some(matches)) {
      byTag.push(toResult(f))
    }
  }
  return [...byName, ...byTag]
}
