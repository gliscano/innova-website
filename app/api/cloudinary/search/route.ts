import { NextRequest, NextResponse } from 'next/server'
import { fetchGalleryImages, sanitizeFolder, type GalleryQuery } from '@/app/lib/cloudinaryImages'

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

// Validaciones y sanitización básica para evitar inyección en expresiones de Cloudinary.
// `sanitizeFolder` ya no vive acá: se movió a `@/app/lib/cloudinaryImages`, junto al sink que
// construye la expresión, para que la página de categoría —que no pasa por esta route— también
// la aplique. Estas dos siguen siendo específicas de la route.
const SEARCH_TERM_REGEX = /^[A-Za-z0-9 _.-]{1,100}$/
const CURSOR_REGEX = /^[A-Za-z0-9_.-]{1,512}$/

function sanitizeSearchTerm(value?: string): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!SEARCH_TERM_REGEX.test(trimmed)) return undefined
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

/**
 * La búsqueda vive en `@/app/lib/cloudinaryImages` para que la página de categoría pueda
 * resolverla en el servidor con exactamente la misma implementación que esta route.
 */
async function runSearch(params: GalleryQuery) {
  const result = await fetchGalleryImages(params)

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
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
