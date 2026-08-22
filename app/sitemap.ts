import type { MetadataRoute } from 'next'
import { getCachedFolders } from './lib/cloudinaryFolders'
import { absoluteUrl, catalogUrl } from './lib/siteUrl'

/** Rutas estáticas, de mayor a menor prioridad comercial. */
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/design-catalog', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/prices', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/navidad', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/preguntas-frecuentes', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/terminos-y-condiciones', priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }))

  // Reusa el `unstable_cache` de 24h de getCachedFolders, así generar el sitemap no agrega
  // llamadas a Cloudinary. Si falla, se sirve igual el sitemap con las rutas estáticas en vez
  // de devolver un 500.
  let categoryEntries: MetadataRoute.Sitemap = []
  try {
    const folders = await getCachedFolders()
    categoryEntries = folders.map((folder) => ({
      url: catalogUrl(folder.folderName),
      lastModified: folder.createdAt ? new Date(folder.createdAt) : now,
      changeFrequency: 'weekly',
      priority: folder.featured ? 0.8 : 0.7,
    }))
  } catch {
    categoryEntries = []
  }

  return [...staticEntries, ...categoryEntries]
}
