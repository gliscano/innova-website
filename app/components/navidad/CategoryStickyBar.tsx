'use client'

import { useEffect, useRef, useState } from 'react'
import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { trackNavidadCategoryClick } from '@/app/utils/tracking'

/** Alto de la barra más un margen: coincide con el `scroll-margin-top` de `.nv-cat`. */
const BAR_OFFSET = 64

/**
 * Barra fija con las categorías. Aparece mientras se recorren las secciones de categorías, marca
 * en cuál está la persona y permite saltar a otra sin volver arriba.
 */
export function CategoryStickyBar() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const sections = navidadCategories
        .map((c) => document.getElementById(c.id))
        .filter((el): el is HTMLElement => el !== null)
      if (sections.length === 0) return
      const firstTop = sections[0].getBoundingClientRect().top
      const lastBottom = sections[sections.length - 1].getBoundingClientRect().bottom
      setVisible(firstTop <= BAR_OFFSET && lastBottom > BAR_OFFSET)
      let current: string | null = null
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= BAR_OFFSET + 1) current = section.id
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  // En el celular la barra se desliza: mantiene centrada la categoría activa.
  useEffect(() => {
    const list = listRef.current
    const pill = active ? list?.querySelector<HTMLElement>(`[data-cat="${active}"]`) : null
    if (!list || !pill) return
    list.scrollTo({ left: pill.offsetLeft - list.clientWidth / 2 + pill.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <nav className={`nv-catbar${visible ? ' is-visible' : ''}`} aria-label="Categorías de Navidad" inert={!visible}>
      <ul ref={listRef} className="nv-catbar__list">
        {navidadCategories.map((category) => (
          <li key={category.id}>
            <a
              href={`#${category.id}`}
              data-cat={category.id}
              aria-current={active === category.id ? 'true' : undefined}
              className="nv-catbar__pill"
              onClick={() => trackNavidadCategoryClick(category.id, 'sticky_bar')}
            >
              {category.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
