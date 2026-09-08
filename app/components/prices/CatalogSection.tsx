'use client'

import { forwardRef } from 'react'
import InnovaCatalog from '../gallery/DesignCatalog'
import NavidadBanner from '../NavidadBanner'
import type { Sel } from './types'
import type { CloudinaryFolder } from '@/app/types/catalog'

interface Props {
  sel: Sel
  initialFolders: CloudinaryFolder[]
}

const CatalogSection = forwardRef<HTMLDivElement, Props>(function CatalogSection(
  { sel, initialFolders },
  ref
) {
  return (
    <div id="catalogo" className="cat-sec" ref={ref}>
      <div className="cat-heading">
        <div className="cat-sechead">
          <div>
            <div className="pk-label"><span className="pk-num">2</span> Elegí tu diseño</div>
          </div>
        </div>
      </div>
      <NavidadBanner />
      <InnovaCatalog initialFolders={initialFolders} />
    </div>
  )
})

export default CatalogSection
