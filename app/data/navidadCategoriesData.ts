// Carpeta raíz en Cloudinary donde vive la colección Navidad 2026, junto a los
// demás catálogos. Sigue excluida de /design-catalog (ver EXCLUDED_FOLDERS en
// app/lib/cloudinaryFolders.ts) — solo se accede vía /navidad y los banners.
export const NAVIDAD_2026_BASE_FOLDER = 'Navidad-2026'

export type NavidadCategoryId =
  | 'tendencia'
  | 'interiores'
  | 'argentina'
  | 'infantil'
  | 'exterior'
  | 'cocinas'

export type NavidadRevealAnimation =
  | 'reveal'
  | 'fade-up'
  | 'slide-left'
  | 'bounce'
  | 'blur-focus'
  | 'warm-fade'

export interface NavidadCategory {
  id: NavidadCategoryId
  order: number
  /** Nombre exacto de la subcarpeta en Cloudinary (con tildes/mayúsculas). */
  cloudinaryFolder: string
  theme: 'claro' | 'oscuro'
  eyebrow: string
  title: string
  description: string
  waMessage: string
  animation: NavidadRevealAnimation
  hasSnow?: boolean
  lottieSrc?: string
  /** Reservado para más adelante: la categoría Interiores todavía no tiene el video listo. */
  videoPlaceholder?: boolean
  /** Video de fondo del Hero cinematográfico, en /public/video/. */
  heroVideo: string
  /** Título grande de 2 líneas para el Hero. */
  heroHeadline: [string, string]
  /** Color de acento único de la categoría (dots, progress bar, marca sobre el eyebrow). */
  accentColor: string
}

export const navidadCategories: NavidadCategory[] = [
  {
    id: 'tendencia',
    order: 1,
    cloudinaryFolder: 'Tendencia',
    theme: 'claro',
    eyebrow: '01 · Fine Art · Diseño de Autor',
    title: 'Tendencia 2026',
    description:
      'Diseños de autor con montajes de alta complejidad. Elementos flotantes, fondos mágicos y estética Fine Art.',
    waMessage: 'Hola, me interesa la categoría Tendencia 2026',
    animation: 'reveal',
    heroVideo: '/video/tendencia.mp4',
    heroHeadline: ['Tendencias', '2026'],
    accentColor: '#9B7FD4',
  },
  {
    id: 'interiores',
    order: 2,
    cloudinaryFolder: 'Interiores',
    theme: 'oscuro',
    eyebrow: '02 · Navidad Clásica',
    title: 'Interior',
    description:
      'Escenas cálidas de living y chimenea. La Navidad de siempre, con la calidad de producción de Innova.',
    waMessage: 'Hola, me interesa la categoría Interiores y Chimeneas',
    animation: 'fade-up',
    videoPlaceholder: false,
    heroVideo: '/video/interior.mp4',
    heroHeadline: ['Interior y', 'Clásicos'],
    accentColor: '#D4882A',
  },
  
  {
    id: 'cocinas',
    order: 3,
    cloudinaryFolder: 'Cocinas',
    theme: 'claro',
    eyebrow: '03 · Sabores',
    title: 'Cocinas y Sabores',
    description:
      'Mesas dulces, cocinas navideñas y detalles gourmet para las sesiones de fin de año.',
    waMessage: 'Hola, me interesa la categoría Cocinas y Sabores',
    animation: 'warm-fade',
    heroVideo: '/video/cocina.mp4',
    heroHeadline: ['Cocinas y', 'Sabores'],
    accentColor: '#C84B6E',
  },
  {
    id: 'argentina',
    order: 4,
    cloudinaryFolder: 'Tradicion',
    theme: 'oscuro',
    eyebrow: '04 · Navidad Gaucha',
    title: 'Tradición Argentina',
    description:
      'Nuestra Navidad, con nuestros colores y símbolos. Una categoría pensada para sesiones con identidad local.',
    waMessage: 'Hola, me interesa la categoría Tradición Argentina',
    animation: 'slide-left',
    heroVideo: '/video/tradicion.mp4',
    heroHeadline: ['Tradición', 'Argentina'],
    accentColor: '#C84B2A',
  },
  {
    id: 'infantil',
    order: 5,
    cloudinaryFolder: 'Infantil',
    theme: 'claro',
    eyebrow: '05 · Fábrica de Sueños',
    title: 'Mundo Infantil',
    description:
      'Duendes, renos y color. Fondos pensados para que los más chicos sean los protagonistas de la sesión.',
    waMessage: 'Hola, me interesa la categoría Mundo Infantil',
    animation: 'bounce',
    lottieSrc: '/animations/infantil-santa-animation.json',
    heroVideo: '/video/infantil.mp4',
    heroHeadline: ['Mundo', 'Infantil'],
    accentColor: '#4A9B6F',
  },
  {
    id: 'exterior',
    order: 6,
    cloudinaryFolder: 'Exterior',
    theme: 'oscuro',
    eyebrow: '06 · Viajes Mágicos',
    title: 'Exterior',
    description:
      'Paisajes nevados y postales de otro hemisferio, para sesiones que parecen filmadas en otro país.',
    waMessage: 'Hola, me interesa la categoría Exterior y Viajes Mágicos',
    animation: 'blur-focus',
    hasSnow: true,
    heroVideo: '/video/exterior-2.mp4',
    heroHeadline: ['Exterior y', 'Viajes'],
    accentColor: '#4A7FB5',
  },
]

export function getNavidadFolderPath(category: NavidadCategory): string {
  return `${NAVIDAD_2026_BASE_FOLDER}/${category.cloudinaryFolder}`
}
