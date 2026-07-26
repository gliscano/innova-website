import type { CatalogItem } from "../data/catalogData"
import { catalogData } from "../data/catalogData"

export function getCatalogItemByCategory(category: string) {
  return catalogData.find((item) => item.category === category) as CatalogItem | undefined
}

export function formatFolderName(name: string): string {
  return name
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim()
}

/** `decodeURIComponent` tolerante: una secuencia mal formada devuelve el segmento intacto. */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/**
 * Extrae el public_id de una URL de delivery de Cloudinary, para poder pasarlo a `CldImage`
 * en vez de mandar el secure_url crudo a `next/image` (que haría que Vercel re-optimice algo
 * que Cloudinary ya sirve optimizado).
 *
 *   https://res.cloudinary.com/innova54/image/upload/v1776424129/10_bmi8dy.jpg  ->  "10_bmi8dy"
 *   .../image/upload/f_auto,q_auto/v123/carpeta/foto.webp                       ->  "carpeta/foto"
 *   .../image/upload/v1761303093/Dise%C3%B1os_Urbanos_10.jpg  ->  "Diseños_Urbanos_10"
 *
 * Devuelve null si la URL no es de Cloudinary o no tiene el segmento /upload/.
 */
export function publicIdFromCloudinaryUrl(url: string | null | undefined): string | null {
  if (!url) return null

  const afterUpload = url.split(/\/(?:image|video)\/upload\//)[1]
  if (!afterUpload) return null

  // Tanto los secure_url de la Admin API como las URLs de catalogData traen siempre el
  // segmento de versión (v1776424129). Todo lo que va después es el public_id — que puede
  // incluir carpetas — y todo lo anterior son transformaciones.
  const segments = afterUpload.split('/')
  const versionIdx = segments.findIndex(seg => /^v\d+$/.test(seg))
  const idSegments = versionIdx >= 0 ? segments.slice(versionIdx + 1) : segments

  // La URL viene percent-encoded, pero `CldImage` vuelve a encodear cada segmento al armar
  // la suya. Devolver el public_id encodeado produce doble encoding (`ñ` -> `%25C3%25B1`) y
  // un 404, así que hay que decodificarlo acá. Se decodifica segmento a segmento para no
  // tocar las barras que separan carpetas.
  return idSegments.map(decodeSegment).join('/').replace(/\.[a-z0-9]+$/i, '') || null
}

