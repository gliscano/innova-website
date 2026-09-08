'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { trackStoreExit } from '@/app/utils/tracking'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Dónde estaba el CTA, para poder comparar qué salida convierte ("hero", "stock_grid", …). */
  ctaLocation: string
  children: ReactNode
}

/**
 * Ancla hacia la tienda externa que además registra la salida.
 *
 * Existe porque los componentes que enlazan a store.innova54.com / empretienda son server
 * components y no pueden llevar un onClick: sin esto, el salto entre dominios —donde termina el
 * funnel— no deja ningún rastro en Analytics.
 */
export default function StoreExitLink({ href, ctaLocation, children, ...anchorProps }: Props) {
  return (
    <a href={href} onClick={() => trackStoreExit(href, ctaLocation)} {...anchorProps}>
      {children}
    </a>
  )
}
