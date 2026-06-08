'use client'

import { formatFolderName } from '@/app/utils/catalogUtils'
import type { CloudinarySubfolder } from '@/app/types/catalog'
import Gallery from './Gallery'

interface SubcategorySectionProps {
  subfolder: CloudinarySubfolder
  onSectionRef: (el: HTMLElement | null) => void
  onComplete: () => void
}

export function SubcategorySection({ subfolder, onSectionRef, onComplete }: SubcategorySectionProps) {
  return (
    <div
      ref={onSectionRef}
      style={{ scrollMarginTop: '96px' }}
    >
      {/* Separador con título de sección */}
      <div className="flex items-center gap-3 pt-6 pb-2 border-t border-stone-200">
        <h2 className="copperplate-bold-font text-base font-bold text-[#4a3a2a] whitespace-nowrap">
          {formatFolderName(subfolder.name)}
        </h2>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Galería de esta subcategoría */}
      <Gallery
        folder={subfolder.path}
        itemsPerPage={50}
        onComplete={onComplete}
      />
    </div>
  )
}
