import type { Metadata } from 'next'
import { formatFolderName, getCatalogItemByCategory } from '@/app/utils/catalogUtils'
import { COLLECTION_FOLDERS, getCachedFolders, getCachedSubfolders } from '@/app/lib/cloudinaryFolders'
import { SITE_URL, absoluteUrl, catalogUrl } from '@/app/lib/siteUrl'
import JsonLd, { breadcrumbSchema } from '@/app/components/JsonLd'
import { getCachedGalleryImages } from '@/app/lib/cloudinaryImages'
import ProductPageContent from './ProductPageContent'

/** Debe coincidir con el `itemsPerPage` que usa <Gallery>, o la siembra no se reconoce. */
const GALLERY_PAGE_SIZE = 100

interface Props {
  params: Promise<{ id: string }>
}

/** Las meta descriptions rinden mejor entre 130 y 160 caracteres; se corta en un borde de palabra. */
function clampDescription(text: string, max = 158): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).replace(/[\s,.;:—-]+$/, '')}…`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const folderName = decodeURIComponent(id)
  const title = formatFolderName(folderName)

  // Copy curado por categoría cuando existe; si no, una fórmula que al menos nombra la categoría.
  const curated = getCatalogItemByCategory(folderName)?.description?.trim().replace(/[.\s]+$/, '')
  const description = clampDescription(
    curated
      ? `${curated}. Fondos fotográficos en alta definición, distintas medidas y envíos a todo el país.`
      : `Explorá los fondos fotográficos ${title} de Innova: alta definición, distintas medidas y envíos a todo el país.`
  )

  // El título va pelado: el template de `layout.tsx` ya agrega " | Innova". Devolverlo acá
  // producía "Catálogo Boho | Innova | Innova" en las 36 categorías.
  const pageTitle = `Fondos Fotográficos ${title}`
  const url = catalogUrl(folderName)

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${pageTitle} | Innova`,
      description,
      url,
    },
  }
}

/**
 * Prerenderiza las categorías en build en vez de resolverlas por demanda. Si Cloudinary no está
 * disponible (por ejemplo, un build sin credenciales) se devuelve una lista vacía y Next cae de
 * nuevo a renderizado bajo demanda, en lugar de romper el build entero.
 */
export async function generateStaticParams() {
  try {
    const folders = await getCachedFolders()
    return folders.map((folder) => ({ id: folder.folderName }))
  } catch {
    return []
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const folderName = decodeURIComponent(id)
  const isCollection = COLLECTION_FOLDERS.has(folderName)
  const subfolders = isCollection ? await getCachedSubfolders(folderName) : []

  // Primera página resuelta en el servidor para que los diseños (y sus alt) estén en el HTML
  // inicial en lugar de "Cargando diseños…". Las colecciones se saltean: su grilla depende de la
  // subcarpeta que elija el usuario. Si Cloudinary falla, la galería vuelve al fetch de cliente.
  let initialGallery: Awaited<ReturnType<typeof getCachedGalleryImages>> | null = null
  if (!isCollection) {
    try {
      initialGallery = await getCachedGalleryImages(folderName, GALLERY_PAGE_SIZE)
    } catch {
      initialGallery = null
    }
  }

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: SITE_URL },
          { name: 'Catálogo de Diseños', url: absoluteUrl('/design-catalog') },
          { name: formatFolderName(folderName), url: catalogUrl(folderName) },
        ])}
      />
      <ProductPageContent
        id={id}
        subfolders={subfolders}
        isCollection={isCollection}
        initialGallery={initialGallery}
      />
    </>
  )
}
