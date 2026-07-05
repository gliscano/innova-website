'use client'

import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { SnowCanvas } from './SnowCanvas'

export function IntroSection() {
  return (
    <section className="nv-intro" aria-label="Categorías del catálogo">
      <SnowCanvas className="nv-intro-snow" />
      <div>
        <p className="nv-intro-label">Explorá las categorías</p>
        <nav className="nv-anchors" aria-label="Navegación por categoría">
          {navidadCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="nv-pill">
              {category.title}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
