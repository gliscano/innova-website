// Carpeta raíz temporal en Cloudinary. Está anidada dentro de "latest-creations" a propósito
// para que la colección Navidad 2026 no quede expuesta públicamente en /design-catalog todavía
// (esa carpeta está en EXCLUDED_FOLDERS). Cuando marketing la mueva a la raíz, alcanza con
// actualizar esta única constante.
export const NAVIDAD_2026_BASE_FOLDER = 'latest-creations/Navidad-2026'

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
}

export const navidadCategories: NavidadCategory[] = [
  {
    id: 'tendencia',
    order: 1,
    cloudinaryFolder: 'Tendencia',
    theme: 'claro',
    eyebrow: '01 · Fine Art',
    title: 'Tendencia 2026',
    description:
      'Diseños de autor con montajes de alta complejidad. Elementos flotantes, fondos mágicos y estética Fine Art.',
    waMessage: 'Hola, me interesa la categoría Tendencia 2026',
    animation: 'reveal',
  },
  {
    id: 'interiores',
    order: 2,
    cloudinaryFolder: 'Interiores (Navidad Clásica)',
    theme: 'oscuro',
    eyebrow: '02 · Navidad Clásica',
    title: 'Interiores',
    description:
      'Escenas cálidas de living y chimenea. La Navidad de siempre, con la calidad de producción de Innova.',
    waMessage: 'Hola, me interesa la categoría Interiores y Chimeneas',
    animation: 'fade-up',
    videoPlaceholder: false,
  },
  {
    id: 'argentina',
    order: 3,
    cloudinaryFolder: 'Tradición Argentina',
    theme: 'claro',
    eyebrow: '03 · Raíces',
    title: 'Tradición Argentina',
    description:
      'Nuestra Navidad, con nuestros colores y símbolos. Una categoría pensada para sesiones con identidad local.',
    waMessage: 'Hola, me interesa la categoría Tradición Argentina',
    animation: 'slide-left',
  },
  {
    id: 'infantil',
    order: 4,
    cloudinaryFolder: 'Mundo Infantil',
    theme: 'oscuro',
    eyebrow: '04 · Magia',
    title: 'Mundo Infantil',
    description:
      'Duendes, renos y color. Fondos pensados para que los más chicos sean los protagonistas de la sesión.',
    waMessage: 'Hola, me interesa la categoría Mundo Infantil',
    animation: 'bounce',
    lottieSrc: '/animations/infantil-santa-animation.json',
  },
  {
    id: 'exterior',
    order: 5,
    cloudinaryFolder: 'Exterior y Viajes Mágicos',
    theme: 'claro',
    eyebrow: '05 · Viajes Mágicos',
    title: 'Exterior',
    description:
      'Paisajes nevados y postales de otro hemisferio, para sesiones que parecen filmadas en otro país.',
    waMessage: 'Hola, me interesa la categoría Exterior y Viajes Mágicos',
    animation: 'blur-focus',
    hasSnow: true,
  },
  {
    id: 'cocinas',
    order: 6,
    cloudinaryFolder: 'Cocinas y Sabores',
    theme: 'oscuro',
    eyebrow: '06 · Sabores',
    title: 'Cocinas y Sabores',
    description:
      'Mesas dulces, cocinas navideñas y detalles gourmet para las sesiones de fin de año.',
    waMessage: 'Hola, me interesa la categoría Cocinas y Sabores',
    animation: 'warm-fade',
  },
]

export function getNavidadFolderPath(category: NavidadCategory): string {
  return `${NAVIDAD_2026_BASE_FOLDER}/${category.cloudinaryFolder}`
}
