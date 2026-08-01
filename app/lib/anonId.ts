import { ANON_COOKIE, ANON_COOKIE_MAX_AGE } from '../types/favorites'

/**
 * Id anónimo del visitante.
 *
 * Se genera en el cliente (no en middleware: sería el primero del repo, pondría
 * una función en el edge para cada request, y `Set-Cookie` sobre respuestas
 * cacheables es un footgun — esta app cachea fuerte con s-maxage=86400).
 *
 * El id se espeja en el blob de localStorage y se reconcilia en cada boot: el
 * ITP de Safari limita las cookies puestas por JS a 7 días, así que la cookie
 * sola no es durable. Ese par es auto-reparable y es lo que hace que la
 * migración a backend (fase 2) sea sin pérdida de datos.
 */

function generateId(): string {
  // crypto.randomUUID necesita secure context; en dev sobre http plano no está.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch {
      /* cae al fallback */
    }
  }
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function readAnonCookie(): string | null {
  if (typeof document === 'undefined') return null
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${ANON_COOKIE}=([^;]*)`)
    )
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

export function writeAnonCookie(id: string): void {
  if (typeof document === 'undefined') return
  try {
    const secure = typeof location !== 'undefined' && location.protocol === 'https:'
    document.cookie =
      `${ANON_COOKIE}=${encodeURIComponent(id)}` +
      `; Path=/; Max-Age=${ANON_COOKIE_MAX_AGE}; SameSite=Lax` +
      (secure ? '; Secure' : '')
  } catch {
    /* storage bloqueado: seguimos con el id en memoria */
  }
}

/**
 * Reconcilia cookie ↔ localStorage y devuelve el id definitivo.
 * @param storedId el `anonId` que venía en el blob de localStorage, si había.
 */
export function ensureAnonId(storedId?: string | null): string {
  const cookieId = readAnonCookie()

  // El blob gana: sobrevive al corte de 7 días de ITP que sí afecta a la cookie.
  const id = storedId || cookieId || generateId()

  // Se re-escribe siempre, incluso si no cambió: refresca el Max-Age en cada
  // visita y repone la cookie si ITP ya la había borrado.
  writeAnonCookie(id)

  return id
}
