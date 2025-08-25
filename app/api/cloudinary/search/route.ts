import cloudinary from '@/app/utils/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

interface SearchParams {
  searchTerm?: string
  tags?: string[]
  folder?: string
  collection?: string
  nextCursor?: string
  maxResults?: number
}

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
  context?: {
    custom?: {
      collection?: string
    }
  }
}

interface CloudinaryResponse {
  resources: CloudinaryImage[]
  next_cursor?: string
  total_count?: number
}

// Validaciones y sanitización básica para evitar inyección en expresiones de Cloudinary
const TAG_REGEX = /^[A-Za-z0-9._-]{1,64}$/
const FOLDER_REGEX = /^[A-Za-z0-9_\/-]{1,200}$/
const SEARCH_TERM_REGEX = /^[A-Za-z0-9 _.-]{1,100}$/
const CURSOR_REGEX = /^[A-Za-z0-9_.-]{1,512}$/

function sanitizeSearchTerm(value?: string): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!SEARCH_TERM_REGEX.test(trimmed)) return undefined
  return trimmed
}

function sanitizeFolder(value?: string): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!FOLDER_REGEX.test(trimmed)) return undefined
  if (trimmed.includes('..') || trimmed.includes('//')) return undefined
  return trimmed
}

function sanitizeTags(values?: string[]): string[] | undefined {
  if (!values) return undefined
  const sanitized = values
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((v) => TAG_REGEX.test(v))
  return sanitized.length > 0 ? Array.from(new Set(sanitized)) : undefined
}

function sanitizeCursor(value?: string): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!CURSOR_REGEX.test(trimmed)) return undefined
  return trimmed
}

function sanitizeMaxResults(value?: number): number {
  const num = Number.isFinite(value) ? Number(value) : 20
  return Math.min(100, Math.max(1, Math.floor(num)))
}

function buildExpression(params: { searchTerm?: string; tags?: string[]; folder?: string; collection?: string }) {
  const { searchTerm, tags, folder, collection } = params
  let expression = 'resource_type:image'

  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.trim()
    // Envolver en comillas para tratarlo como frase y evitar operadores
    expression += ` AND "${term}"`
  }

  if (tags && tags.length > 0) {
    const tagQuery = tags.map((tag) => `tags:${tag}`).join(' OR ')
    expression += ` AND (${tagQuery})`
  }

  if (folder && folder.trim().length > 0) {
    expression += ` AND folder:${folder}*`
  }

  /* if (collection && collection.trim().length > 0) {
    expression += ` AND context.custom.collection:${collection}`
  } */

  return expression
}

async function runSearch(params: { searchTerm?: string; tags?: string[]; folder?: string; collection?: string; nextCursor?: string; maxResults?: number; ttlSeconds?: number }) {
  const { searchTerm, tags, folder, collection, nextCursor, maxResults = 20, ttlSeconds } = params

  const expression = buildExpression({ searchTerm, tags, folder, collection })

  let search = cloudinary.search.expression(expression).max_results(maxResults).sort_by('created_at', 'desc')
  if (nextCursor) {
    search = search.next_cursor(nextCursor)
  }

  // 1) Intentar URL cacheable firmada (CDN) con to_url
  const ttl = typeof ttlSeconds === 'number' && ttlSeconds > 0 ? ttlSeconds : 60
  let data: CloudinaryResponse | null = null
  try {
    const url = search.to_url(ttl, nextCursor)
    const res = await fetch(url, { cache: 'force-cache' })
    if (res.ok) {
      const json = await res.json().catch(() => null)
      if (json && Array.isArray(json.resources)) {
        data = {
          resources: json.resources || [],
          next_cursor: json.next_cursor,
          total_count: json.total_count,
        }
      }
    }
  } catch (e) {
    // Ignorar y hacer fallback
  }

  // 2) Fallback a Admin API si no hay datos válidos desde CDN
  if (!data || (data && data.resources.length === 0) ) {
    const searchResult = await search.execute()
    data = {
      resources: searchResult.resources || [],
      next_cursor: searchResult.next_cursor,
      total_count: searchResult.total_count,
    }
  }

  const transformedImages = (data.resources || []).map((img) => ({
    id: img.public_id,
    url: img.secure_url,
    width: img.width,
    height: img.height,
    format: img.format,
    createdAt: img.created_at,
    tags: img.tags || [],
    folder: img.folder,
    display_name: (img as any).display_name,
    aspect_ratio: (img as any).aspect_ratio,
    collection: img.context?.custom?.collection,
  }))

  return NextResponse.json(
    {
      images: transformedImages,
      nextCursor: data.next_cursor || null,
      totalCount: data.total_count || transformedImages.length || 0,
      hasMore: Boolean(data.next_cursor),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      },
    },
  )
}

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary no está configurado en el servidor' },
        { status: 500 },
      )
    }

    const raw: SearchParams = await request.json()

    const searchTerm = sanitizeSearchTerm(raw.searchTerm)
    const folder = sanitizeFolder(raw.folder)
    const tags = sanitizeTags(raw.tags)
    const nextCursor = sanitizeCursor(raw.nextCursor)
    const maxResults = sanitizeMaxResults(raw.maxResults)

    if ((raw.searchTerm && !searchTerm) || (raw.folder && !folder) || (raw.tags && !tags) || (raw.nextCursor && !nextCursor)) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 },
      )
    }

    return await runSearch({ searchTerm, tags, folder, collection: raw.collection, nextCursor, maxResults })
  } catch (error) {
    console.error('Error en búsqueda de Cloudinary:', error)
    return NextResponse.json(
      {
        error: 'Error al buscar imágenes',
        images: [],
        nextCursor: null,
        totalCount: 0,
        hasMore: false,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary no está configurado en el servidor' },
        { status: 500 },
      )
    }

    const url = new URL(request.url)
    const sp = url.searchParams

    const searchTermRaw = sp.get('searchTerm') || undefined
    const folderRaw = sp.get('folder') || undefined
    const collection = sp.get('collection') || undefined
    const nextCursorRaw = sp.get('nextCursor') || undefined
    const maxResultsParam = sp.get('maxResults')
    const maxResults = maxResultsParam ? sanitizeMaxResults(Number(maxResultsParam)) : 20
    const ttlParam = sp.get('ttl')
    const ttlSeconds = ttlParam ? Math.max(10, Math.min(3600, Number(ttlParam))) : 60

    // Soportar múltiples formatos de tags: ?tags=a&tags=b o ?tags=a,b
    let tags: string[] | undefined = undefined
    const tagsMulti = sp.getAll('tags')
    if (tagsMulti && tagsMulti.length > 0) {
      tags = sanitizeTags(tagsMulti.flatMap((t) => t.split(',')))
    }

    const searchTerm = sanitizeSearchTerm(searchTermRaw)
    const folder = sanitizeFolder(folderRaw)
    const nextCursor = sanitizeCursor(nextCursorRaw)

    if ((searchTermRaw && !searchTerm) || (folderRaw && !folder) || (tagsMulti.length > 0 && !tags) || (nextCursorRaw && !nextCursor)) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 },
      )
    }

    return await runSearch({ searchTerm, tags, folder, collection, nextCursor, maxResults, ttlSeconds })
  } catch (error) {
    console.error('Error en búsqueda de Cloudinary (GET):', error)
    return NextResponse.json(
      {
        error: 'Error al buscar imágenes',
        images: [],
        nextCursor: null,
        totalCount: 0,
        hasMore: false,
      },
      { status: 500 },
    )
  }
}
