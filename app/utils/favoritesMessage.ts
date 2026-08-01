import type { FavoriteDesign } from '../types/favorites'
import type { SelectedSize } from '../context/SelectedSizeContext'
import { formatFolderName } from './catalogUtils'

/**
 * Arma el mensaje de WhatsApp para consultar por varios favoritos a la vez.
 *
 * Presupuesto: ~1400 chars codificados para el parámetro `text` (el techo
 * práctico de wa.me ronda 2000 para la URL completa, y algunos intents de
 * Android cortan antes).
 *
 * Las URLs de las imágenes quedan afuera a propósito: un secure_url de
 * Cloudinary son 110-140 chars crudos, pero ~200 codificados (`/`→%2F, `:`→%3A,
 * y cada acento son 9 chars), así que el presupuesto reventaría a los ~7
 * diseños. Solo nombre + catálogo son ~50 chars/línea y entran ~25 cómodos.
 *
 * Tampoco se linkea /favoritos: la vendedora lo abriría y vería SUS propios
 * favoritos (vacíos). El link compartible real necesita códigos cortos en el
 * backend, o sea fase 2.
 */

const MAX_ENCODED = 1400
const MAX_LINES = 30

function header(n: number): string {
  return `Hola! Guardé ${n} ${n === 1 ? 'diseño que me gusta' : 'diseños que me gustan'}:\n\n`
}

function line(f: FavoriteDesign): string {
  const catalog = f.folder ? ` (${formatFolderName(f.folder.split('/')[0])})` : ''
  return `• ${f.display_name}${catalog}\n`
}

function moreLine(k: number): string {
  return `\n…y ${k} ${k === 1 ? 'diseño más' : 'diseños más'} — te los paso por acá.\n`
}

/**
 * Cierre del mensaje.
 *
 * Con medida elegida el precio ya viaja en el mensaje, así que pedirlo de nuevo
 * ("¿Me pasás precio y disponibilidad?") sobra: se cierra pidiendo solo
 * disponibilidad. El precio se marca explícitamente **por diseño** y, si hay más
 * de uno, se agrega el total — si no, el vendedor puede leer el unitario como si
 * fuese el total del pedido.
 *
 * `designCount` es el total de favoritos guardados, no los que entraron en el
 * mensaje: el encabezado dice "Guardé N diseños" y los que no entran se pasan
 * por el chat, así que el precio del pedido corresponde a N.
 */
function footer(size: SelectedSize | null | undefined, designCount: number): string {
  // Sin precio no hay nada que calcular: se sigue pidiendo precio.
  if (!size?.fromPrice) {
    return size
      ? `\nTamaño: ${size.label}\n¿Me pasás precio y disponibilidad?`
      : '\n¿Me pasás precio y disponibilidad?'
  }

  const prefix = size.isExactPrice ? '' : 'desde '
  let out = `\nTamaño: ${size.label} — ${prefix}$${size.fromPrice.toLocaleString('es-AR')} por diseño\n`

  if (designCount > 1) {
    // "estimado" cuando el unitario es un "desde": el total hereda esa
    // imprecisión y no queremos que se lea como un presupuesto cerrado.
    const estimated = size.isExactPrice ? '' : 'estimado '
    const totalPrice = (size.fromPrice * designCount).toLocaleString('es-AR')
    out += `Total ${estimated}por los ${designCount} diseños: $${totalPrice}\n`
  }

  return `${out}¿Me confirmás disponibilidad?`
}

export interface FavoritesMessage {
  message: string
  included: number
  dropped: number
}

export function buildFavoritesWhatsAppMessage(
  items: readonly FavoriteDesign[],
  selectedSize?: SelectedSize | null
): FavoritesMessage {
  const total = items.length
  if (total === 0) {
    return {
      message: 'Hola! Quiero consultar sobre sus fondos fotográficos',
      included: 0,
      dropped: 0,
    }
  }

  const head = header(total)
  const foot = footer(selectedSize, total)

  // Se reserva el peor caso de la línea "…y X más" para no pasarnos justo al
  // agregarla al final.
  const reserve = encodeURIComponent(moreLine(total)).length

  let body = ''
  let included = 0

  for (const item of items) {
    if (included >= MAX_LINES) break

    const candidate = body + line(item)
    const projected = encodeURIComponent(head + candidate + foot).length + reserve

    if (projected > MAX_ENCODED) break

    body = candidate
    included += 1
  }

  const dropped = total - included
  const message = head + body + (dropped > 0 ? moreLine(dropped) : '') + foot

  return { message, included, dropped }
}
