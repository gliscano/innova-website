'use client'

import { useEffect } from 'react'

/**
 * Bloquea el scroll de la página mientras `active` es true (modales, paneles, buscador).
 *
 * - `overflow: hidden` en el body no alcanza en Safari de iPhone: el dedo sigue moviendo la página
 *   de atrás. Por eso el body se fija (`position: fixed` con `top` negativo, así no salta) y al
 *   liberar se vuelve a la misma posición.
 * - Es un contador compartido: el modal de la galería y "Mi pedido" pueden estar abiertos a la vez,
 *   y en las colecciones hay varias galerías en la misma página. Antes cada una ponía
 *   `overflow: unset` por su cuenta y liberaba el bloqueo de otra que seguía abierta. Ahora la
 *   página se libera solo cuando se cierra el último.
 */
let lockCount = 0
let savedScrollY = 0
let savedStyles: Partial<Record<'position' | 'top' | 'left' | 'right' | 'width' | 'overflow', string>> = {}
let savedHtmlOverscroll = ''

function lock() {
  lockCount += 1
  if (lockCount > 1) return

  const { body, documentElement: html } = document
  savedScrollY = window.scrollY
  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  }
  savedHtmlOverscroll = html.style.overscrollBehavior

  body.style.position = 'fixed'
  body.style.top = `-${savedScrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overflow = 'hidden'
  // Evita el "rebote" que en iOS / Android arrastra la página al llegar al borde del modal.
  html.style.overscrollBehavior = 'none'
}

function unlock() {
  if (lockCount === 0) return
  lockCount -= 1
  if (lockCount > 0) return

  const { body, documentElement: html } = document
  Object.assign(body.style, savedStyles)
  html.style.overscrollBehavior = savedHtmlOverscroll
  // `instant`: si la página tiene scroll suave, no queremos ver el viaje de vuelta.
  window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' })
}

export function useBodyScrollLock(active: boolean = true): void {
  useEffect(() => {
    if (!active) return
    lock()
    return unlock
  }, [active])
}
