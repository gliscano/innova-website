export interface ContentSet {
  title: string
  highlight: string
  subtitle: string
  /** Línea corta debajo del H1; reemplaza al párrafo largo que había antes. */
  tagline: string
  buttonText: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  reviews: { rating: string; count: number; url: string }
}

export interface ImageSet {
  src: string
  alt: string
  /** Carpeta de Cloudinary a la que lleva la imagen (`/design-catalog/[folder]`). */
  folder: string
  /** Etiqueta visible sobre la imagen. */
  category: string
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

/** Mismo formato de ruta que `CardCatalog`. */
export const catalogHref = (folder: string) => `/design-catalog/${encodeURIComponent(folder)}`

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
    reviews: { rating: "5.0", count: 85, url: "https://maps.app.goo.gl/umYECNsdo57obniE6" },
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

/** Chips de temáticas: la temporada primero, "En stock" al final. */
export const heroChips: HeroLink[] = [
  { label: "Navidad 2026", href: NAVIDAD_URL },
  { label: "Halloween", href: catalogHref("Halloween") },
  { label: "Newborn", href: catalogHref("Newborn") },
  { label: "Egresados", href: catalogHref("Egresados") },
  { label: "Mundo Infantil", href: catalogHref("mundo-infantil") },
  { label: "Boho", href: catalogHref("Boho") },
  { label: "Texturas", href: catalogHref("Texturas") },
  { label: "Globos", href: catalogHref("Globos") },
  { label: "Baby Shower", href: catalogHref("BabyShower") },
  { label: "En stock", href: STORE_URL, external: true },
]

// Collage de la computadora (3×3). El `alt` se usa como texto alternativo y como `title` del
// enlace; cada imagen lleva a la categoría de su `folder`.
export const imageSets: ImageSet[][] = [
  [
    { src: "/images/innova/hero/01.webp", alt: "Arco de globos dorados y perlados con pampas sobre fondo negro", folder: "Globos", category: "Globos" },
    { src: "/images/innova/hero/02.webp", alt: "Fondo de textura pictórica en ocres envejecidos", folder: "Texturas", category: "Texturas" },
    { src: "/images/innova/hero/06.webp", alt: "Set temático de abejitas con panal, margaritas y globos amarillos", folder: "mundo-infantil", category: "Mundo Infantil" },
    { src: "/images/innova/hero/04.webp", alt: "Arco de globos plateados con cortina de flecos metálicos y bolas de espejos", folder: "Glitter", category: "Glitter" },
    { src: "/images/innova/hero/07.webp", alt: "Telón de tela azul petróleo con piso de baldosas", folder: "Paredes", category: "Paredes" },
    { src: "/images/innova/hero/05.webp", alt: "Fondo de textura pintada a mano en verde oliva", folder: "Texturas", category: "Texturas" },
    { src: "/images/innova/hero/08.webp", alt: "Set primaveral de margaritas blancas y globos durazno", folder: "Margaritas", category: "Margaritas" },
    { src: "/images/innova/hero/03.webp", alt: "Escenografía submarina en tonos pastel con caracolas y estrellas de mar", folder: "mundo-infantil", category: "Mundo Infantil" },
    { src: "/images/innova/hero/09.webp", alt: "Sesión de primer añito en un set rosa con globos y flores", folder: "Globos", category: "Globos" },
  ]
]
