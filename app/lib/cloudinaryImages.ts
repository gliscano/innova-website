import { unstable_cache } from 'next/cache'
import cloudinary from '@/app/utils/cloudinary'
import type { GalleryImage } from '@/app/types/gallery'

/**
 * Listado de imágenes de una carpeta de Cloudinary.
 *
 * Vivía dentro de `app/api/cloudinary/search/route.ts` y sólo se podía consumir por HTTP desde el
 * cliente, así que la grilla de cada categoría se llenaba después de la hidratación y el HTML
 * servido decía "Cargando diseños…". Al extraerlo, la página puede resolverlo en el servidor y la
 * route sigue usando exactamente la misma implementación.
 */

interface CloudinaryImage {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  created_at: string
  tags: string[]
  folder?: string
  display_name: string
  aspect_ratio: number
  bytes?: number
  metadata?: Record<string, unknown>
  context?: {
    custom?: {
      collection?: string
      Description?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

interface CloudinaryResponse {
  resources: CloudinaryImage[]
  next_cursor?: string
  total_count?: number
}

export interface FolderImagesResult {
  images: GalleryImage[]
  nextCursor: string | null
  totalCount: number
  hasMore: boolean
}

export function transformResources(resources: CloudinaryImage[]): GalleryImage[] {
  return resources.map((img) => ({
    id: img.public_id,
    url: img.secure_url,
    width: img.width,
    height: img.height,
    format: img.format,
    createdAt: img.created_at,
    tags: img.tags || [],
    folder: img.folder,
    display_name: img.display_name,
    aspect_ratio: img.aspect_ratio,
    collection: img.context?.custom?.collection,
    description: img.context?.custom?.Description || '',
    bytes: img.bytes || 0,
    metadata: img.metadata || {},
    context: img.context || {},
  }))
}

export async function fetchFolderImages(
  folder: string,
  maxResults = 20,
  nextCursor?: string,
): Promise<FolderImagesResult> {
  const options: Record<string, unknown> = {
    asset_folder: folder,
    max_results: maxResults,
    tags: true,
    context: true,
    metadata: true,
    resource_type: 'image',
  }
  if (nextCursor) options.next_cursor = nextCursor

  const result = (await cloudinary.api.resources_by_asset_folder(
    folder,
    options,
  )) as unknown as CloudinaryResponse

  const images = transformResources(result.resources || [])
  return {
    images,
    nextCursor: result.next_cursor || null,
    totalCount: result.total_count ?? images.length,
    hasMore: Boolean(result.next_cursor),
  }
}

function buildExpression(folder?: string): string {
  let expression = 'resource_type:image'
  if (folder) expression += ` AND asset_folder:"${folder}"`
  return expression
}

export interface GalleryQuery {
  searchTerm?: string
  folder?: string
  nextCursor?: string
  maxResults?: number
  ttlSeconds?: number
}

/**
 * Punto de entrada único para pedir imágenes de la galería. Replica la decisión que ya tomaba la
 * route: sin `searchTerm` alcanza con listar la carpeta; con `searchTerm` se usa la Search API
 * ordenada por fecha de creación. Importa respetar esa bifurcación, porque las dos ramas
 * devuelven las imágenes en orden distinto y las páginas de categoría pasan ambos parámetros.
 */
export async function fetchGalleryImages(params: GalleryQuery): Promise<FolderImagesResult> {
  const { searchTerm, folder, nextCursor, maxResults = 20, ttlSeconds } = params

  if (folder && !searchTerm) {
    return fetchFolderImages(folder, maxResults, nextCursor)
  }

  let search = cloudinary.search
    .expression(buildExpression(folder))
    .max_results(maxResults)
    .sort_by('created_at', 'desc')
    .with_field('tags')
    .with_field('context')
    .with_field('metadata')
    .with_field('image_metadata')
  if (nextCursor) {
    search = search.next_cursor(nextCursor)
  }

  // Se intenta primero la URL firmada servida por CDN; si falla o vuelve vacía, se cae a la
  // Admin API. Es el comportamiento que ya tenía la route.
  const ttl = typeof ttlSeconds === 'number' && ttlSeconds > 0 ? ttlSeconds : 60
  let data: CloudinaryResponse | null = null
  try {
    const url = search.to_url(ttl, nextCursor)
    const res = await fetch(url, { cache: 'default' })
    if (res.ok) {
      const json = await res.json().catch(() => null)
      if (json && Array.isArray(json.resources)) {
        data = {
          resources: json.resources,
          next_cursor: json.next_cursor,
          total_count: json.total_count,
        }
      }
    }
  } catch (error) {
    console.error('Error en búsqueda de Cloudinary (CDN):', error)
  }

  if (!data || data.resources.length === 0) {
    const searchResult = await search.execute()
    data = {
      resources: searchResult.resources || [],
      next_cursor: searchResult.next_cursor,
      total_count: searchResult.total_count,
    }
  }

  const images = transformResources(data.resources || [])
  return {
    images,
    nextCursor: data.next_cursor || null,
    totalCount: data.total_count || images.length || 0,
    hasMore: Boolean(data.next_cursor),
  }
}

/**
 * Primera página de una categoría, cacheada 24h igual que `getCachedFolders`. Sólo para la carga
 * inicial: la paginación va sin cachear porque el cursor es de un solo uso.
 */
export const getCachedGalleryImages = (folder: string, maxResults = 20) =>
  unstable_cache(
    () => fetchGalleryImages({ searchTerm: folder, folder, maxResults }),
    [`cloudinary-gallery-${folder}-${maxResults}`],
    { revalidate: 86400 },
  )()
