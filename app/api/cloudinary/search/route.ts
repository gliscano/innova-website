import cloudinary from '@/app/utils/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiter: sliding window en memoria
// 30 requests por IP cada 60 segundos
const RATE_LIMIT = 30
const WINDOW_MS = 60_000
const ipTimestamps = new Map<string, number[]>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const timestamps = (ipTimestamps.get(ip) ?? []).filter(t => t > windowStart)
  if (timestamps.length >= RATE_LIMIT) return true
  timestamps.push(now)
  ipTimestamps.set(ip, timestamps)
  // Limpiar IPs inactivas para evitar memory leak
  if (ipTimestamps.size > 5000) {
    for (const [key, ts] of ipTimestamps) {
      if (ts[ts.length - 1] < windowStart) ipTimestamps.delete(key)
    }
  }
  return false
}

interface SearchParams {
  searchTerm?: string
  folder?: string
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
  bytes?: number
  metadata?: Record<string, unknown>
  image_metadata?: Record<string, unknown>
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

// Validaciones y sanitización básica para evitar inyección en expresiones de Cloudinary
// Permite letras (incluyendo acentos latinos), números, espacios, guiones, guiones bajos y barras
const FOLDER_REGEX = /^[A-Za-zÀ-ÿ0-9 _\/-]{1,200}$/
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

function buildExpression(params: { searchTerm?: string; folder?: string }) {
  const { folder } = params
  let expression = 'resource_type:image'

  // Si hay folder, filtrar primero por carpeta exacta (con comillas para soportar espacios)
  if (folder) {
    expression += ` AND folder:"${folder}"`
  }

  return expression
}

function transformResources(resources: CloudinaryImage[]) {
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

async function runFolderList(params: { folder: string; nextCursor?: string; maxResults?: number }) {
  const { folder, nextCursor, maxResults = 20 } = params

  const options: Record<string, unknown> = {
    asset_folder: folder,
    max_results: maxResults,
    tags: true,
    context: true,
    metadata: true,
    resource_type: 'image',
  }
  if (nextCursor) options.next_cursor = nextCursor

  const result = await cloudinary.api.resources_by_asset_folder(folder, options) as unknown as CloudinaryResponse

  const images = transformResources(result.resources || [])
  return NextResponse.json(
    {
      images,
      nextCursor: result.next_cursor || null,
      totalCount: result.total_count ?? images.length,
      hasMore: Boolean(result.next_cursor),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
      },
    },
  )
}

async function runSearch(params: { searchTerm?: string; folder?: string; nextCursor?: string; maxResults?: number; ttlSeconds?: number }) {
  const { searchTerm, folder, nextCursor, maxResults = 20, ttlSeconds } = params

  if (folder && !searchTerm) {
    return runFolderList({ folder, nextCursor, maxResults })
  }

  const expression = buildExpression({ searchTerm, folder })

  let search = cloudinary.search
    .expression(expression)
    .max_results(maxResults)
    .sort_by('created_at', 'desc')
    .with_field('tags')
    .with_field('context')
    .with_field('metadata')
    .with_field('image_metadata')
  if (nextCursor) {
    search = search.next_cursor(nextCursor)
  }

  const ttl = typeof ttlSeconds === 'number' && ttlSeconds > 0 ? ttlSeconds : 60
  let data: CloudinaryResponse | null = null
  try {
    const url = search.to_url(ttl, nextCursor)
    const res = await fetch(url, { cache: 'default' })
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

  return NextResponse.json(
    {
      images,
      nextCursor: data.next_cursor || null,
      totalCount: data.total_count || images.length || 0,
      hasMore: Boolean(data.next_cursor),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
      },
    },
  )
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 })
  }
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
    const nextCursor = sanitizeCursor(raw.nextCursor)
    const maxResults = sanitizeMaxResults(raw.maxResults)

    if ((raw.searchTerm && !searchTerm) || (raw.folder && !folder) || (raw.nextCursor && !nextCursor)) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 },
      )
    }

    return await runSearch({ searchTerm, folder, nextCursor, maxResults })
  } catch (error) {
    console.error('Error en búsqueda de Cloudinary (POST):', error)
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
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 })
  }
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
    const nextCursorRaw = sp.get('nextCursor') || undefined
    const maxResultsParam = sp.get('maxResults')
    const maxResults = maxResultsParam ? sanitizeMaxResults(Number(maxResultsParam)) : 20
    const ttlParam = sp.get('ttl')
    const ttlSeconds = ttlParam ? Math.max(10, Math.min(3600, Number(ttlParam))) : 60

    const searchTerm = sanitizeSearchTerm(searchTermRaw)
    const folder = sanitizeFolder(folderRaw)
    const nextCursor = sanitizeCursor(nextCursorRaw)


    if ((searchTermRaw && !searchTerm) || (folderRaw && !folder) || (nextCursorRaw && !nextCursor)) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 },
      )
    }

    return await runSearch({ searchTerm, folder, nextCursor, maxResults, ttlSeconds })
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
