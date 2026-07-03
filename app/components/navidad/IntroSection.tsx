'use client'

import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { LottiePlayer } from './LottiePlayer'

export function IntroSection() {
  return (
    <section className="nv-intro" aria-label="Categorías del catálogo">
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
      <LottiePlayer src="/animations/hero-tree-animation.json" className="nv-intro-lottie" active />
    </section>
  )
}
