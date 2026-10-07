'use client'

import type { CSSProperties } from 'react'
import { CldImage } from 'next-cloudinary'
import { navidadCategories, type NavidadCategoryPreviews } from '@/app/data/navidadCategoriesData'
import { trackNavidadCategoryClick } from '@/app/utils/tracking'
import { SnowCanvas } from './SnowCanvas'

/**
 * "Elegí tu categoría": una tarjeta con imagen por categoría. Reemplaza a la fila de pastillas de
 * texto, que pasaba desapercibida. En el celular se desliza (se ven dos tarjetas y media, para que
 * se note que hay más); en la computadora van las seis en una fila.
 */
export function IntroSection({ previews }: { previews: NavidadCategoryPreviews }) {
  return (
    <section className="nv-intro" aria-labelledby="nv-intro-title">
      <SnowCanvas className="nv-intro-snow" />
      <div className="nv-intro-inner">
        <h2 id="nv-intro-title" className="nv-intro-title">Elegí tu categoría</h2>
        <p className="nv-intro-sub">{navidadCategories.length} colecciones · tocá una para ver sus diseños</p>
        <ul className="nv-catcards">
          {navidadCategories.map((category) => {
            const preview = previews[category.id]
            return (
              <li key={category.id}>
                <a
                  href={`#${category.id}`}
                  className="nv-catcard"
                  style={{ '--nv-cat-accent': category.accentColor } as CSSProperties}
                  onClick={() => trackNavidadCategoryClick(category.id, 'cards')}
                >
                  {preview?.thumbnailId && (
                    <CldImage
                      src={preview.thumbnailId}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 200px, 40vw"
                      quality="auto:eco"
                      className="nv-catcard__img"
                    />
                  )}
                  <span className="nv-catcard__shade" aria-hidden />
                  <span className="nv-catcard__body">
                    <span className="nv-catcard__title">{category.title}</span>
                    <span className="nv-catcard__meta">
                      {preview?.count ? `${preview.count} diseños →` : 'Ver diseños →'}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
