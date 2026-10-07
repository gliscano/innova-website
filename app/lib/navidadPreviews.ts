import { getCachedGalleryImages } from './cloudinaryImages'
import {
  getNavidadFolderPath,
  navidadCategories,
  type NavidadCategoryPreview,
  type NavidadCategoryPreviews,
} from '@/app/data/navidadCategoriesData'

/**
 * Primera imagen y cantidad de diseños de cada categoría de Navidad, cacheadas 24h como el resto
 * de las consultas a Cloudinary. Si una carpeta falla, su tarjeta sale sin imagen en vez de romper
 * la página.
 */
export async function getNavidadPreviews(): Promise<NavidadCategoryPreviews> {
  const entries = await Promise.all(
    navidadCategories.map(async (category): Promise<[string, NavidadCategoryPreview]> => {
      try {
        const { images, totalCount } = await getCachedGalleryImages(getNavidadFolderPath(category), 1)
        return [category.id, { thumbnailId: images[0]?.id ?? null, count: totalCount }]
      } catch {
        return [category.id, { thumbnailId: null, count: 0 }]
      }
    }),
  )
  return Object.fromEntries(entries)
}
