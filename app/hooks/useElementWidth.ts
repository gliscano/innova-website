'use client'

import { useEffect, useState } from 'react'

/** Mide el ancho de un elemento vía ResizeObserver — se re-mide en cada resize. */
export function useElementWidth<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return [setNode, width] as const
}
