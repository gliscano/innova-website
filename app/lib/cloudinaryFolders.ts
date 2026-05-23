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
