/**
 * Host canónico único del sitio.
 *
 * `www.innova54.com` resuelve a Vercel pero su certificado TLS no cubre el subdominio, así que
 * toda URL absoluta que emitamos (metadataBase, canonicals, openGraph, sitemap) tiene que apuntar
 * al apex. Antes esto estaba repartido: `metadataBase` usaba el apex y cinco rutas hardcodeaban
 * `www` en su `openGraph.url`, de modo que los shares sociales de esas rutas apuntaban a un host
 * que no carga.
 */
export const SITE_URL = 'https://innova54.com'

/** URL absoluta a partir de un path relativo. `path` debe venir ya percent-encoded si hace falta. */
export function absoluteUrl(path = '/'): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * URL canónica de una categoría del catálogo. Recibe el nombre crudo de la carpeta de Cloudinary
 * (que puede traer espacios o `ñ`) y lo encodea, así el canonical no depende de si el `params.id`
 * de Next llegó encodeado o no.
 */
export function catalogUrl(folderName: string): string {
  return `${SITE_URL}/design-catalog/${encodeURIComponent(folderName)}`
}
