import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DesignCatalog from '../components/gallery/DesignCatalog'
import JsonLd, { breadcrumbSchema, catalogItemListSchema } from '../components/JsonLd'
import { getCachedFolders } from '../lib/cloudinaryFolders'
import { SITE_URL, absoluteUrl, DESIGN_CATALOG_OG_IMAGE } from '../lib/siteUrl'

export const metadata: Metadata = {
  title: 'Catálogo de Diseños',
  description: 'Explorá más de 10.000 diseños de fondos fotográficos. Filtrá por categoría, estilo y medida. Infantiles, Boho, Navidad, Baby Shower y mucho más.',
  alternates: { canonical: absoluteUrl('/design-catalog') },
  openGraph: {
    title: 'Catálogo de Diseños | Innova',
    description: 'Más de 10.000 fondos fotográficos para cada tipo de sesión.',
    url: absoluteUrl('/design-catalog'),
    images: [DESIGN_CATALOG_OG_IMAGE],
  },
}

export default async function DesignCatalogPage() {
  const folders = await getCachedFolders()
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={catalogItemListSchema(folders)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: SITE_URL },
          { name: 'Catálogo de Diseños', url: absoluteUrl('/design-catalog') },
        ])}
      />
      <Header />
      <main className="flex-grow">
        <DesignCatalog initialFolders={folders} headingLevel="h1" />
      </main>
      <Footer />
    </div>
  )
}