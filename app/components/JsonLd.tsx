import type { FaqCategory } from '@/app/data/faqsData'
import type { CloudinaryFolder } from '@/app/types/catalog'
import { FAMILIES, type FamilyItem } from '@/app/data/pricesData'
import { SITE_URL, absoluteUrl, catalogUrl } from '@/app/lib/siteUrl'

/**
 * Inserta un bloque JSON-LD. Es un server component: los datos ya están resueltos en el servidor,
 * así que el bloque viaja en el HTML inicial y no depende de que corra JS del cliente.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro y se serializa con JSON.stringify; se escapa `<` para que una
      // cadena no pueda cerrar el <script> antes de tiempo.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/**
 * Las respuestas de las FAQ traen markdown (`**negrita**`) y un placeholder `{1}` que el
 * componente FAQ reemplaza por un enlace. Ninguna de las dos cosas debe llegar al JSON-LD.
 */
export function faqAnswerToPlainText(answer: string, link?: string): string {
  return answer
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\{1\}/g, link ?? '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Innova Backdrops',
    alternateName: 'Innova',
    url: SITE_URL,
    logo: absoluteUrl('/svg/innova-logo.svg'),
    description:
      'Diseño y fabricación de fondos fotográficos (backdrops), props e insumos para fotógrafos, productores y decoradores de eventos.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. San Martín 1777 PB B',
      addressLocality: 'Vicente López',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    sameAs: [
      'https://www.instagram.com/innova54backdrops',
      'https://www.facebook.com/innova54backdrops',
    ],
  }
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Innova Backdrops',
    inLanguage: 'es-AR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function faqPageSchema(categories: FaqCategory[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faqAnswerToPlainText(item.answer, item.link),
        },
      }))
    ),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function catalogItemListSchema(folders: CloudinaryFolder[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de fondos fotográficos Innova',
    numberOfItems: folders.length,
    itemListElement: folders.map((folder, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: folder.title,
      url: catalogUrl(folder.folderName),
    })),
  }
}

/** Cada medida puede tener precio en varias terminaciones (HD, neón o precio único). */
function pricesOf(item: FamilyItem): number[] {
  return [item.hd, item.neon, item.unico].filter((n): n is number => typeof n === 'number')
}

/**
 * Un Product por familia de medidas, con el rango de precios de sus variantes. Se arma desde
 * `FAMILIES`, la misma estructura que consume la página de precios, para que no haya un segundo
 * lugar donde actualizar valores.
 */
export function priceProductsSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': FAMILIES.map((family) => {
      const prices = family.largos.flatMap(pricesOf)
      return {
        '@type': 'Product',
        name: `Fondo fotográfico Innova — ${family.nombre}`,
        description: family.desc,
        brand: { '@type': 'Brand', name: 'Innova Backdrops' },
        category: 'Fondos fotográficos',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'ARS',
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: prices.length,
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/prices'),
          seller: { '@id': `${SITE_URL}/#organization` },
        },
      }
    }),
  }
}
