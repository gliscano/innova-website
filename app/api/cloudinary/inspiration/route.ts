import cloudinary from '@/app/utils/cloudinary'
import { NextRequest, NextResponse } from 'next/server'
import { getLatestFolderNames, isExcludedFolder } from '@/app/lib/cloudinaryFolders'

// ─── Rate limiter: sliding window en memoria (mismo patrón que search/route.ts) ───
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
  if (ipTimestamps.size > 5000) {
    for (const [key, ts] of ipTimestamps) {
      if (ts[ts.length - 1] < windowStart) ipTimestamps.delete(key)
    }
  }
  return false
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 12
// Regex para validar el cursor compuesto (base64url, hasta 4096 chars)
const COMPOSITE_CURSOR_REGEX = /^[A-Za-z0-9_-]{1,4096}$/

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface FolderCursorState {
  name: string
  cursor: string | null // null = desde el inicio
  hasMore: boolean
}

interface CompositeCursor {
  folders: FolderCursorState[]
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
  context?: {
    custom?: {
      collection?: string
      Description?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

interface CloudinaryFolderResponse {
  resources: CloudinaryImage[]
  next_cursor?: string
  total_count?: number
}

// ─── Cursor encode / decode ───────────────────────────────────────────────────
function encodeCursor(state: CompositeCursor): string {
  return Buffer.from(JSON.stringify(state)).toString('base64url')
}

function decodeCursor(encoded: string): CompositeCursor | null {
  if (!COMPOSITE_CURSOR_REGEX.test(encoded)) return null
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf8')
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed?.folders)) return null
    for (const f of parsed.folders) {
      if (typeof f.name !== 'string') return null
      if (f.cursor !== null && typeof f.cursor !== 'string') return null
      if (typeof f.hasMore !== 'boolean') return null
    }
    return parsed as CompositeCursor
  } catch {
    return null
  }
}

// ─── Transformación de recursos (mismo patrón que search/route.ts) ────────────
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

// ─── Fisher-Yates shuffle ─────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ─── Fetch de un único folder, ordenado por created_at desc (más recientes primero) ──
// Usa la Search API en lugar de resources_by_asset_folder porque esta última
// no soporta sort_by y devuelve imágenes por public_id asc (las más antiguas primero).
async function fetchFromFolder(
  folderName: string,
  cursor: string | null,
  maxResults: number,
): Promise<{
  images: ReturnType<typeof transformResources>
  nextCursor: string | null
  hasMore: boolean
}> {
  let search = cloudinary.search
    .expression(`resource_type:image AND folder:${folderName}`)
    .max_results(maxResults)
    .sort_by('created_at', 'desc')
    .with_field('tags')
    .with_field('context')
    .with_field('metadata')

  if (cursor) {
    search = search.next_cursor(cursor)
  }

  const result = await search.execute() as unknown as CloudinaryFolderResponse

  const images = transformResources(result.resources || [])
  const nextCursor = result.next_cursor || null
  return { images, nextCursor, hasMore: Boolean(nextCursor) }
}

// ─── Handler principal ────────────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' },
      { status: 429 },
    )
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary no está configurado en el servidor' },
      { status: 500 },
    )
  }

  try {
    const sp = new URL(request.url).searchParams
    const rawCursor = sp.get('nextCursor') || undefined

    let folderStates: FolderCursorState[]

    if (rawCursor) {
      // Load-more: decodificar el cursor compuesto enviado por el cliente
      const decoded = decodeCursor(rawCursor)
      if (!decoded) {
        return NextResponse.json({ error: 'Cursor inválido' }, { status: 400 })
      }
      folderStates = decoded.folders
    } else {
      // Carga inicial: resolver los 2 folders más recientes
      const folderNames = await getLatestFolderNames(2)

      if (folderNames.length === 0) {
        return NextResponse.json(
          { images: [], nextCursor: null, totalCount: 0, hasMore: false },
          {
            headers: {
              'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
            },
          },
        )
      }

      folderStates = folderNames
        .filter((name) => !isExcludedFolder(name))
        .map((name) => ({
          name,
          cursor: null,
          hasMore: true,
        }))
    }

    // Solo fetchar folders que aún tienen imágenes disponibles
    const activeFolders = folderStates.filter((f) => f.hasMore)

    if (activeFolders.length === 0) {
      return NextResponse.json(
        { images: [], nextCursor: null, totalCount: 0, hasMore: false },
        {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        },
      )
    }

    // Distribuir ITEMS_PER_PAGE entre los folders activos
    // 2 activos → 6 cada uno | 1 activo → 12
    const perFolder = Math.ceil(ITEMS_PER_PAGE / activeFolders.length)

    // Fetchear todos los folders activos en paralelo
    const results = await Promise.allSettled(
      activeFolders.map((f) => fetchFromFolder(f.name, f.cursor, perFolder)),
    )

    // Merge de imágenes y actualización de estados de cursor
    const allImages: ReturnType<typeof transformResources> = []

    const updatedStates: FolderCursorState[] = folderStates.map((folderState) => {
      // Si ya estaba agotado, lo llevamos tal cual al próximo cursor
      if (!folderState.hasMore) return folderState

      const activeIdx = activeFolders.findIndex((f) => f.name === folderState.name)
      const result = results[activeIdx]

      if (result.status === 'rejected') {
        // En caso de error, marcar como agotado para no reintentar
        console.error(`Error fetching folder "${folderState.name}":`, result.reason)
        return { ...folderState, hasMore: false }
      }

      const { images, nextCursor, hasMore } = result.value
      allImages.push(...images)
      return { name: folderState.name, cursor: nextCursor, hasMore }
    })

    const shuffledImages = shuffleArray(allImages)
    const hasMore = updatedStates.some((f) => f.hasMore)
    const nextCursorOut = hasMore
      ? encodeCursor({ folders: updatedStates })
      : null

    return NextResponse.json(
      {
        images: shuffledImages,
        nextCursor: nextCursorOut,
        totalCount: shuffledImages.length,
        hasMore,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
        },
      },
    )
  } catch (error) {
    console.error('Error en /api/cloudinary/inspiration:', error)
    return NextResponse.json(
      {
        error: 'Error al cargar las creaciones',
        images: [],
        nextCursor: null,
        totalCount: 0,
        hasMore: false,
      },
      { status: 500 },
    )
  }
}
