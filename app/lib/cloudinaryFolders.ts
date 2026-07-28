import { unstable_cache } from 'next/cache'
import cloudinary from '@/app/utils/cloudinary'
import { formatFolderName, publicIdFromCloudinaryUrl } from '@/app/utils/catalogUtils'
import { catalogData } from '@/app/data/catalogData'
import type { CloudinaryFolder, CloudinarySubfolder } from '@/app/types/catalog'

export const EXCLUDED_FOLDERS = new Set(['latest-creations', 'innova-brand', 'Navidad-2026'])

export const COLLECTION_FOLDERS = new Set(['mundo-infantil'])

/** Ventana en días para considerar una carpeta como "Nueva" en el catálogo. */
export const NEW_FOLDER_DAYS = 30

/**
 * `search_folders` (distinto de `root_folders`) sí expone `created_at` por carpeta.
 * Sin expression, Cloudinary devuelve las carpetas más recientes primero — pedimos
 * el máximo de resultados para tener created_at de todas las carpetas relevantes.
 */
async function fetchFolderCreatedAtMap(): Promise<Map<string, string>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (cloudinary.api.search_folders as any)({ max_results: 500 }) as { folders: { path: string; created_at: string }[] }

    const map = new Map<string, string>()
    for (const folder of result.folders ?? []) {
      map.set(folder.path, folder.created_at)
    }
    return map
  } catch {
    return new Map()
  }
}

function isWithinNewWindow(createdAt: string | null): boolean {
  if (!createdAt) return false
  const ageMs = Date.now() - new Date(createdAt).getTime()
  return ageMs >= 0 && ageMs < NEW_FOLDER_DAYS * 24 * 60 * 60 * 1000
}

/**
 * En dynamic folder mode, `asset_folder` puede ser una ruta anidada
 * (ej. "latest-creations/Navidad-2026/tradición Argentina"). Excluimos si el
 * primer segmento — o la ruta completa — está en EXCLUDED_FOLDERS, para que un
 * match exacto no deje pasar las subcarpetas.
 */
export function isExcludedFolder(folderPath: string | undefined | null): boolean {
  if (!folderPath) return false
  return EXCLUDED_FOLDERS.has(folderPath.split('/')[0]) || EXCLUDED_FOLDERS.has(folderPath)
}

async function fetchSubfolders(parent: string): Promise<CloudinarySubfolder[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { folders } = await (cloudinary.api.sub_folders as any)(parent) as { folders: { name: string; path: string }[] }

  return Promise.all(
    folders.map(async (sub) => {
      try {
        const res = await cloudinary.api.resources_by_asset_folder(sub.path, {
          max_results: 3,
          resource_type: 'image',
        })
        const imgs = ((res as unknown as Record<string, unknown>).resources as { public_id: string }[]) ?? []
        // Determinista a propósito: elegirlo al azar rotaba el thumbnail en cada refresh de
        // unstable_cache (24h) e invalidaba el caché de derivadas de Cloudinary sin motivo.
        return { name: sub.name, path: sub.path, thumbnailId: imgs[0]?.public_id ?? null }
      } catch {
        return { name: sub.name, path: sub.path, thumbnailId: null }
      }
    })
  )
}

export const getCachedSubfolders = (parent: string) =>
  unstable_cache(
    () => fetchSubfolders(parent),
    [`cloudinary-subfolders-${parent}`],
    { revalidate: 86400 }
  )()

async function fetchFolders(): Promise<CloudinaryFolder[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { folders } = await (cloudinary.api.root_folders as any)({ max_results: 500 })
  const filtered = (folders as { name: string }[]).filter(f => !isExcludedFolder(f.name))

  // ── DESARROLLO: datos estáticos de catalogData, sin llamadas extra ─────────
  if (process.env.NODE_ENV !== 'production') {
    return filtered.map((folder): CloudinaryFolder => {
      const isCollection = COLLECTION_FOLDERS.has(folder.name)
      const catalogItem = catalogData.find(c => c.category === folder.name)
      return {
        folderName: folder.name,
        title: formatFolderName(folder.name),
        thumbnailId: publicIdFromCloudinaryUrl(catalogItem?.thumbnailUrl),
        imageCount: catalogItem?.imageCount ?? 0,
        isCollection,
        featured: catalogItem?.featured ?? false,
      }
    })
  }

  // ── PRODUCCIÓN: thumbnails y conteos frescos de Cloudinary ────────────────
  const createdAtMap = await fetchFolderCreatedAtMap()

  return Promise.all(
    filtered.map(async (folder): Promise<CloudinaryFolder> => {
      const isCollection = COLLECTION_FOLDERS.has(folder.name)
      const catalogItem = catalogData.find(c => c.category === folder.name)
      const isFeatured = catalogItem?.featured ?? false

      const fallbackId = publicIdFromCloudinaryUrl(catalogItem?.thumbnailUrl)

      const createdAt = createdAtMap.get(folder.name) ?? null
      const isNew = isWithinNewWindow(createdAt)

      if (isCollection) {
        if (fallbackId) {
          return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailId: fallbackId, imageCount: 0, isCollection: true, featured: isFeatured, createdAt, isNew }
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { folders: subs } = await (cloudinary.api.sub_folders as any)(folder.name) as { folders: { name: string; path: string }[] }
          let thumbnailId: string | null = null
          if (subs.length > 0) {
            const res = await cloudinary.api.resources_by_asset_folder(subs[0].path, { max_results: 3, resource_type: 'image' })
            const imgs = ((res as unknown as Record<string, unknown>).resources as { public_id: string }[]) ?? []
            thumbnailId = imgs[0]?.public_id ?? null
          }
          return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailId, imageCount: 0, isCollection: true, featured: isFeatured, createdAt, isNew }
        } catch {
          return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailId: null, imageCount: 0, isCollection: true, featured: isFeatured, createdAt, isNew }
        }
      }

      // Folder regular: thumbnail y conteo frescos de Cloudinary
      try {
        const res = await cloudinary.api.resources_by_asset_folder(folder.name, {
          max_results: 500,
          resource_type: 'image',
        })
        const resources = ((res as unknown as Record<string, unknown>).resources as { public_id: string }[]) ?? []
        return {
          folderName: folder.name,
          title: formatFolderName(folder.name),
          thumbnailId: resources[0]?.public_id ?? fallbackId,
          imageCount: resources.length,
          isCollection: false,
          featured: isFeatured,
          createdAt,
          isNew,
        }
      } catch {
        return {
          folderName: folder.name,
          title: formatFolderName(folder.name),
          thumbnailId: fallbackId,
          imageCount: catalogItem?.imageCount ?? 0,
          isCollection: false,
          featured: isFeatured,
          createdAt,
          isNew,
        }
      }
    })
  )
}

export const getCachedFolders = unstable_cache(fetchFolders, ['cloudinary-folders'], {
  revalidate: 86400, // 24h en producción
})

async function fetchLatestFolderNames(n: number): Promise<string[]> {
  // Usa la Search API ordenada por created_at desc para encontrar las N carpetas
  // con actividad más reciente. Es más confiable que root_folders porque:
  //  - root_folders no garantiza el campo created_at en todos los folders
  //  - Este enfoque refleja qué carpetas tienen imágenes subidas recientemente
  // Trae las 300 imágenes más recientes y extrae carpetas únicas en orden de aparición.
  const result = await cloudinary.search
    .expression('resource_type:image')
    .sort_by('created_at', 'desc')
    .max_results(300)
    .execute() as { resources: Array<{ folder?: string; asset_folder?: string }> }

  const seen = new Set<string>()
  const latestFolders: string[] = []

  for (const resource of result.resources ?? []) {
    const name = resource.folder ?? resource.asset_folder
    if (name && !isExcludedFolder(name) && !seen.has(name)) {
      seen.add(name)
      latestFolders.push(name)
      if (latestFolders.length >= n) break
    }
  }

  return latestFolders
}

export const getLatestFolderNames = unstable_cache(
  (n: number) => fetchLatestFolderNames(n),
  ['cloudinary-latest-folder-names'],
  { revalidate: 3600 }, // 1 hora — refresca automáticamente cuando se sube contenido nuevo
)
