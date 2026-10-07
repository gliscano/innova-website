import { useEffect, useRef } from "react"
import { trackSearch, type SearchLocation } from "@/app/utils/tracking"

/**
 * Registra una búsqueda por sesión del buscador: cuando la persona escribe 3 caracteres o más. No
 * manda el texto (ver `trackSearch`); vuelve a contar recién si borra todo y empieza otra búsqueda.
 */
export function useSearchTracking(query: string, location: SearchLocation) {
  const tracked = useRef(false)

  useEffect(() => {
    const length = query.trim().length
    if (length === 0) {
      tracked.current = false
    } else if (length >= 3 && !tracked.current) {
      tracked.current = true
      trackSearch(location)
    }
  }, [query, location])
}
