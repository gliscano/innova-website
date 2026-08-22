import type { MetadataRoute } from 'next'
import { absoluteUrl } from './lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Las rutas de API no aportan nada al índice y consumen presupuesto de rastreo.
      disallow: '/api/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
