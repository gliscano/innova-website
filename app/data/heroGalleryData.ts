
export interface ContentSet {
  title: string
  highlight: string
  subtitle: string
  /** Línea corta debajo del H1; reemplaza al párrafo largo que había antes. */
  tagline: string
  buttonText: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  /** `count` es el texto que se muestra antes de "reseñas en Google" (p. ej. "+100"). */
  reviews: { rating: string; count: string; url: string }
}

export interface HeroLink {
  label: string
  /** Etiqueta corta para el menú de la computadora. */
  short?: string
  href: string
  /** true si sale del sitio (tienda externa): abre en otra pestaña y emite `store_exit`. */
  external?: boolean
}

/** Redirige a innova54store.empretienda.com.ar. */
export const STORE_URL = "https://store.innova54.com"
export const NAVIDAD_URL = "/navidad"


export const contentSets: ContentSet[] = [
  {
    // H1 en dos líneas: "Fondos que transforman" / "tu fotografía.", con "transforman" en el acento.
    title: "Fondos que",
    highlight: "transforman",
    subtitle: "tu fotografía.",
    tagline: "+4.500 diseños en alta definición",
    buttonText: "Explorar diseños",
    secondaryButtonText: "Consultar precios",
    secondaryButtonUrl: "/prices",
    reviews: { rating: "5.0", count: "+100", url: "https://maps.app.goo.gl/umYECNsdo57obniE6" },
  }
]

/** Menú de la barra superior de la portada. */
export const heroMenuLinks: HeroLink[] = [
  { label: "Catálogo", href: "/design-catalog" },
  { label: "En stock", href: STORE_URL, external: true },
  { label: "Navidad 2026", href: NAVIDAD_URL },
  { label: "Precios y medidas", short: "Precios", href: "/prices" },
  { label: "Preguntas frecuentes", short: "Preguntas", href: "/preguntas-frecuentes" },
]
