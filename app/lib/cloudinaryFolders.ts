import { unstable_cache } from 'next/cache'
import cloudinary from '@/app/utils/cloudinary'
import { formatFolderName } from '@/app/utils/catalogUtils'
import type { CloudinaryFolder } from '@/app/types/catalog'

const EXCLUDED_FOLDERS = new Set(['latest-creations', 'innova-brand'])

async function fetchFolders(): Promise<CloudinaryFolder[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { folders } = await (cloudinary.api.root_folders as any)({ max_results: 500 })

  const filtered = (folders as { name: string }[]).filter(
    (f) => !EXCLUDED_FOLDERS.has(f.name)
  )

  return Promise.all(
    filtered.map(async (folder) => {
      try {
        const res = await cloudinary.api.resources_by_asset_folder(folder.name, {
          max_results: 10,
          resource_type: 'image',
        })
        const resAny = res as unknown as Record<string, unknown>
        const imgs = (resAny.resources as { secure_url: string }[]) ?? []
        const thumbnailUrl =
          imgs.length > 0
            ? imgs[Math.floor(Math.random() * imgs.length)].secure_url
            : null
        const imageCount = (resAny.total_count as number | undefined) ?? imgs.length
        return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailUrl, imageCount }
      } catch {
        return { folderName: folder.name, title: formatFolderName(folder.name), thumbnailUrl: null, imageCount: 0 }
      }
    })
  )
}

export const getCachedFolders = unstable_cache(fetchFolders, ['cloudinary-folders'], {
  revalidate: 86400,
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
