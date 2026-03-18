import { InspirationFeed } from './InspirationFeed'

interface InspirationSectionProps {
  /** Carpeta de Cloudinary a filtrar. Si se omite, carga todas las imágenes. */
  folder?: string
}

/**
 * Server Component — wrapper de sección.
 * Toda la lógica interactiva (fetch, estado, modal) vive dentro de InspirationFeed ('use client').
 */
export function InspirationSection({ folder }: InspirationSectionProps) {
  return (
    <section
      className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8"
      aria-label="Creaciones recientes"
    >
      {/* Encabezado de sección */}
      <div className="px-4 sm:px-6 mb-5">
        <p className="catalog-eyebrow">Inspiración</p>
        <h2 className="catalog-title copperplate-bold-font">Creaciones Recientes</h2>
        <p className="text-sm text-stone-500 mt-1.5 max-w-lg leading-relaxed">
          Explorá los últimos diseños creados por nuestra comunidad de fotógrafos y decoradores.
          Tocá cualquier imagen para ver los detalles.
        </p>
        <div className="catalog-divider mt-5" />
      </div>

      <InspirationFeed folder={folder} />
    </section>
  )
}
