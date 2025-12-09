import cloudinary from '@/app/utils/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

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

  // Si hay folder, filtrar primero por carpeta exacta
  if (folder) {
    // Usar coincidencia exacta de carpeta (sin asterisco para evitar subcarpetas)
    expression += ` AND folder:${folder}`
  }

  return expression
}

async function runSearch(params: { searchTerm?: string; folder?: string; nextCursor?: string; maxResults?: number; ttlSeconds?: number }) {
  const { searchTerm, folder, nextCursor, maxResults = 20, ttlSeconds } = params
  const expression = buildExpression({ searchTerm, folder })

  let search = cloudinary.search.expression(expression).max_results(maxResults).sort_by('created_at', 'desc')
  if (nextCursor) {
    search = search.next_cursor(nextCursor)
  }

  // 1) Intentar URL cacheable firmada (CDN) con to_url
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
    console.error('Error en búsqueda de Cloudinary (GET):', error)
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

  let transformedImages = (data.resources || [])
    .map((img) => ({
      id: img.public_id,
      url: img.secure_url,
      width: img.width,
      height: img.height,
      format: img.format,
      createdAt: img.created_at,
      tags: img.tags || [],
      folder: img.folder,
      display_name: (img as CloudinaryImage).display_name,
      aspect_ratio: (img as CloudinaryImage).aspect_ratio,
      collection: img.context?.custom?.collection,
      bytes: (img as CloudinaryImage).bytes || 0,
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
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
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
