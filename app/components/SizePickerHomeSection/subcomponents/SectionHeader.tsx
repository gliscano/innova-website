'use client'

/**
 * Header de sección con título y subtítulo.
 * Estilo Leonardo AI: jerarquía clara, tipografía semi-bold.
 */

interface SectionHeaderProps {
  title: string
  subtitle: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="text-center mb-8 md:mb-10">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </header>
  )
}
