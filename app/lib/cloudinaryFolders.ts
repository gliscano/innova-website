import { unstable_cache } from 'next/cache'
import cloudinary from '@/app/utils/cloudinary'
import { formatFolderName } from '@/app/utils/catalogUtils'
import { catalogData } from '@/app/data/catalogData'
import type { CloudinaryFolder, CloudinarySubfolder } from '@/app/types/catalog'

const EXCLUDED_FOLDERS = new Set(['latest-creations', 'innova-brand'])

export const COLLECTION_FOLDERS = new Set(['mundo-infantil'])

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
        const imgs = ((res as unknown as Record<string, unknown>).resources as { secure_url: string }[]) ?? []
        const thumbnailUrl = imgs.length > 0 ? imgs[Math.floor(Math.random() * imgs.length)].secure_url : null
        return { name: sub.name, path: sub.path, thumbnailUrl }
      } catch {
        return { name: sub.name, path: sub.path, thumbnailUrl: null }
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
  const filtered = (folders as { name: string }[]).filter(f => !EXCLUDED_FOLDERS.has(f.name))

  // ── DESARROLLO: datos estáticos de catalogData, sin llamadas extra ─────────
  if (process.env.NODE_ENV !== 'production') {
    return filtered.map((folder): CloudinaryFolder => {
      const isCollection = COLLECTION_FOLDERS.has(folder.name)
      const catalogItem = catalogData.find(c => c.category === folder.name)
      return {
        folderName: folder.name,
        title: formatFolderName(folder.name),
        thumbnailUrl: catalogItem?.thumbnailUrl ?? null,
        imageCount: catalogItem?.imageCount ?? 0,
        isCollection,
        featured: catalogItem?.featured ?? false,
      }
    })
  }

  // ── PRODUCCIÓN: thumbnails y conteos frescos de Cloudinary ────────────────
  return Promise.all(
    filtered.map(async (folder): Promise<CloudinaryFolder> => {
      const isCollection = COLLECTION_FOLDERS.has(folder.name)
      const catalogItem = catalogData.find(c => c.category === folder.name)
      const isFeatured = catalogItem?.featured ?? false

      if (isCollection) {
        if (catalogItem?.thumbnailUrl) {
          return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailUrl: catalogItem.thumbnailUrl, imageCount: 0, isCollection: true, featured: isFeatured }
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { folders: subs } = await (cloudinary.api.sub_folders as any)(folder.name) as { folders: { name: string; path: string }[] }
          let thumbnailUrl: string | null = null
          if (subs.length > 0) {
            const res = await cloudinary.api.resources_by_asset_folder(subs[0].path, { max_results: 3, resource_type: 'image' })
            const imgs = ((res as unknown as Record<string, unknown>).resources as { secure_url: string }[]) ?? []
            thumbnailUrl = imgs.length > 0 ? imgs[Math.floor(Math.random() * imgs.length)].secure_url : null
          }
          return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailUrl, imageCount: 0, isCollection: true, featured: isFeatured }
        } catch {
          return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailUrl: null, imageCount: 0, isCollection: true, featured: isFeatured }
        }
      }

      // Folder regular: thumbnail y conteo frescos de Cloudinary
      try {
        const res = await cloudinary.api.resources_by_asset_folder(folder.name, {
          max_results: 500,
          resource_type: 'image',
        })
        const resources = ((res as unknown as Record<string, unknown>).resources as { secure_url: string }[]) ?? []
        return {
          folderName: folder.name,
          title: formatFolderName(folder.name),
          thumbnailUrl: resources[0]?.secure_url ?? catalogItem?.thumbnailUrl ?? null,
          imageCount: resources.length,
          isCollection: false,
          featured: isFeatured,
        }
      } catch {
        return {
          folderName: folder.name,
          title: formatFolderName(folder.name),
          thumbnailUrl: catalogItem?.thumbnailUrl ?? null,
          imageCount: catalogItem?.imageCount ?? 0,
          isCollection: false,
          featured: isFeatured,
        }
      }
    })
  )
}

export const getCachedFolders = unstable_cache(fetchFolders, ['cloudinary-folders'], {
  revalidate: 172800, // 48h en producción
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
    if (name && !EXCLUDED_FOLDERS.has(name) && !seen.has(name)) {
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
