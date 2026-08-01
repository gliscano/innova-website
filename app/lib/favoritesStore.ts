import type { GalleryImage } from '../types/gallery'
import {
  MAX_FAVORITES,
  PERSIST_DEBOUNCE_MS,
  SCHEMA_VERSION,
  STORAGE_KEY,
  type FavoriteDesign,
  type FavoritesStoreV1,
} from '../types/favorites'
import { ensureAnonId } from './anonId'

/**
 * Store de favoritos: singleton a nivel de módulo consumido con
 * useSyncExternalStore.
 *
 * No es un React Context a propósito: Header y layout son Server Components y
 * no hay un provider único que envuelva header y contenido en todas las rutas.
 * Un singleton es alcanzable desde cualquier client component sin plumbing, y
 * resuelve gratis el caso multi-instancia (CollectionGallery monta N galerías
 * en simultáneo y todas comparten un único store por realm).
 *
 * ⚠️ INVARIANTES QUE ROMPEN SI SE VIOLAN:
 *  1. getSnapshot NO debe allocar nunca (sin JSON.parse, .filter ni new Set
 *     adentro) o React 19 tira "The result of getSnapshot should be cached to
 *     avoid an infinite loop". localStorage se lee una sola vez, en hydrate().
 *  2. getServerSnapshot es obligatorio bajo SSR de Next y debe devolver siempre
 *     el MISMO objeto.
 */

/** Aviso para el snackbar global. Solo se emite al AGREGAR un favorito. */
export interface FavoriteNotice {
  /** Incrementa en cada alta. Sin esto, guardar dos diseños seguidos no
   *  re-dispara el timer ni la animación porque el objeto luciría "igual". */
  seq: number
  name: string
}

export interface FavoritesSnapshot {
  hydrated: boolean
  items: readonly FavoriteDesign[]
  ids: ReadonlySet<string>
  /** true si la escritura a localStorage falló (Safari privado, cuota).
   *  La sesión sigue funcionando en memoria. */
  persistError: boolean
  anonId: string
  /** Efímero y en memoria: lo consume FavoritesToast y se limpia solo. */
  notice: FavoriteNotice | null
}

const EMPTY_IDS: ReadonlySet<string> = new Set()
const EMPTY_ITEMS: readonly FavoriteDesign[] = []

const EMPTY: FavoritesSnapshot = Object.freeze({
  hydrated: false,
  items: EMPTY_ITEMS,
  ids: EMPTY_IDS,
  persistError: false,
  anonId: '',
  notice: null,
})

let snapshot: FavoritesSnapshot = EMPTY
const listeners = new Set<() => void>()

export function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** Nunca aloca: devuelve la referencia cacheada. */
export function getSnapshot(): FavoritesSnapshot {
  return snapshot
}

/** Siempre el mismo objeto, o Next tira mismatch de hidratación. */
export function getServerSnapshot(): FavoritesSnapshot {
  return EMPTY
}

function notify() {
  listeners.forEach((cb) => cb())
}

function setSnapshot(next: Partial<FavoritesSnapshot>) {
  snapshot = { ...snapshot, ...next }
  notify()
}

// ─── Persistencia ────────────────────────────────────────────────────────────

let persistTimer: ReturnType<typeof setTimeout> | null = null

function writeNow(): void {
  if (typeof window === 'undefined') return
  try {
    const payload: FavoritesStoreV1 = {
      version: SCHEMA_VERSION,
      anonId: snapshot.anonId,
      updatedAt: Date.now(),
      items: snapshot.items as FavoriteDesign[],
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    if (snapshot.persistError) setSnapshot({ persistError: false })
  } catch {
    // Cuota llena o modo privado: nos quedamos con el estado en memoria y
    // NUNCA lanzamos al render de la galería.
    if (!snapshot.persistError) setSnapshot({ persistError: true })
  }
}

/**
 * Difiere el setItem. La UI ya se actualizó de forma síncrona; esto solo evita
 * escribir el blob entero en cada tap al marcar varios diseños seguidos
 * (setItem es síncrono y bloquea el main thread).
 */
function schedulePersist(): void {
  if (typeof window === 'undefined') return
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    persistTimer = null
    writeNow()
  }, PERSIST_DEBOUNCE_MS)
}

/**
 * Fuerza la escritura pendiente. Obligatorio en pagehide/visibilitychange: sin
 * esto, cerrar la pestaña dentro de la ventana de debounce pierde el último ♥.
 */
export function flush(): void {
  if (persistTimer) {
    clearTimeout(persistTimer)
    persistTimer = null
    writeNow()
  }
}

// ─── Parseo e hidratación ────────────────────────────────────────────────────

function isValidItem(raw: unknown): raw is FavoriteDesign {
  if (!raw || typeof raw !== 'object') return false
  const it = raw as Record<string, unknown>
  return (
    typeof it.id === 'string' &&
    it.id.length > 0 &&
    typeof it.url === 'string' &&
    typeof it.width === 'number' &&
    typeof it.height === 'number' &&
    typeof it.display_name === 'string' &&
    typeof it.addedAt === 'number'
  )
}

function parseStored(raw: string | null): { items: FavoriteDesign[]; anonId: string | null } {
  if (!raw) return { items: [], anonId: null }
  try {
    const parsed = JSON.parse(raw) as Partial<FavoritesStoreV1>
    if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.items)) {
      return { items: [], anonId: typeof parsed?.anonId === 'string' ? parsed.anonId : null }
    }
    return {
      items: parsed.items.filter(isValidItem).slice(0, MAX_FAVORITES),
      anonId: typeof parsed.anonId === 'string' ? parsed.anonId : null,
    }
  } catch {
    return { items: [], anonId: null }
  }
}

function readStorage(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** Se llama una sola vez, desde el efecto de FavoritesInit. */
export function hydrate(): void {
  if (typeof window === 'undefined' || snapshot.hydrated) return

  const { items, anonId: storedId } = parseStored(readStorage())
  const anonId = ensureAnonId(storedId)

  snapshot = {
    ...snapshot,
    hydrated: true,
    items,
    ids: new Set(items.map((i) => i.id)),
    anonId,
  }
  notify()

  // Si el blob no traía anonId (primera visita, o venía de una versión previa)
  // lo dejamos escrito para que el par cookie/storage quede consistente.
  if (storedId !== anonId) schedulePersist()
}

/**
 * Handler del evento `storage`. No es cosmético: previene pérdida de datos real
 * — dos pestañas, A agrega un item, B (con su array en memoria stale) agrega
 * otro y sobrescribe el de A. NUNCA re-escribe a localStorage acá (loop).
 * `storage` no dispara en la pestaña origen, así que no hay eco.
 */
export function handleStorageEvent(e: StorageEvent): void {
  if (e.key !== STORAGE_KEY) return

  if (e.newValue == null) {
    snapshot = { ...snapshot, items: EMPTY_ITEMS, ids: EMPTY_IDS }
    notify()
    return
  }

  const { items } = parseStored(e.newValue)
  snapshot = { ...snapshot, items, ids: new Set(items.map((i) => i.id)) }
  notify()
}

// ─── Adaptadores ─────────────────────────────────────────────────────────────

export function fromGalleryImage(img: GalleryImage, folderHint?: string): FavoriteDesign {
  return {
    id: img.id,
    url: img.url,
    width: img.width,
    height: img.height,
    display_name: img.display_name,
    // El hint del cliente es más confiable que el campo de la API: `folder`
    // depende del fix de asset_folder en la ruta de búsqueda.
    folder: img.folder ?? folderHint,
    addedAt: Date.now(),
  }
}

export function toGalleryImage(f: FavoriteDesign): GalleryImage {
  return {
    id: f.id,
    url: f.url,
    width: f.width,
    height: f.height,
    format: '',
    createdAt: '',
    tags: [],
    folder: f.folder,
    display_name: f.display_name,
    aspect_ratio: f.height > 0 ? f.width / f.height : 1,
  }
}

// ─── Mutaciones ──────────────────────────────────────────────────────────────

export function isFavorite(id: string): boolean {
  return snapshot.ids.has(id)
}

let noticeSeq = 0

export function addFavorite(img: GalleryImage, folderHint?: string): boolean {
  if (snapshot.ids.has(img.id)) return true
  if (snapshot.items.length >= MAX_FAVORITES) return false

  const items = [...snapshot.items, fromGalleryImage(img, folderHint)]
  snapshot = {
    ...snapshot,
    items,
    ids: new Set(items.map((i) => i.id)),
    notice: { seq: ++noticeSeq, name: img.display_name },
  }
  notify()
  schedulePersist()
  return true
}

/** La llama FavoritesToast al cerrarse (timer o click en la acción). */
export function dismissNotice(): void {
  if (snapshot.notice === null) return
  setSnapshot({ notice: null })
}

export function removeFavorite(id: string): void {
  if (!snapshot.ids.has(id)) return

  const items = snapshot.items.filter((i) => i.id !== id)
  snapshot = { ...snapshot, items, ids: new Set(items.map((i) => i.id)) }
  notify()
  schedulePersist()
}

/** @returns el estado resultante, o null si se rechazó por llegar al tope. */
export function toggleFavorite(img: GalleryImage, folderHint?: string): boolean | null {
  if (snapshot.ids.has(img.id)) {
    removeFavorite(img.id)
    return false
  }
  return addFavorite(img, folderHint) ? true : null
}

export function clearFavorites(): void {
  snapshot = { ...snapshot, items: EMPTY_ITEMS, ids: EMPTY_IDS }
  notify()
  schedulePersist()
}

