import { FAMILIES, FINISH_LABEL, ars, type FamilyItem } from '@/app/data/pricesData'
import { faqCategories, type FaqCategory } from '@/app/data/faqsData'
import { SITE_URL, absoluteUrl, catalogUrl } from '@/app/lib/siteUrl'
import { faqAnswerToPlainText } from '@/app/components/JsonLd'

/**
 * /llms.txt — resumen en Markdown pensado para agentes y buscadores de IA (formato llmstxt.org).
 *
 * Se genera desde las mismas fuentes que consume el sitio (`FAMILIES` y `faqCategories`), así
 * precios y plazos no tienen un segundo lugar donde actualizarse. Es estático: no consulta
 * Cloudinary; las categorías se descubren navegando el catálogo.
 */

const WHATSAPP_URL = 'https://wa.me/5491171142152'
const CONTACT_EMAIL = 'store@innova54.com'

function pricesOf(item: FamilyItem): number[] {
  return [item.hd, item.neon, item.unico].filter((n): n is number => typeof n === 'number')
}

function priceRange(items: FamilyItem[]): string {
  const prices = items.flatMap(pricesOf)
  if (prices.length === 0) return ''
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  return low === high ? ars(low) : `${ars(low)} a ${ars(high)}`
}

function pricesSection(): string {
  return FAMILIES.map((family) => {
    const finishes = family.finishes.map((f) => FINISH_LABEL[f]).join(' / ')
    return `- **${family.nombre}** (${family.eyebrow}): ${family.desc} Acabados: ${finishes}. Precios en ARS: ${priceRange(family.largos)} según medida (${family.largos.length} medidas).`
  }).join('\n')
}

function faqSection(categories: FaqCategory[]): string {
  return categories
    .flatMap((category) => category.items)
    .map((item) => `- **${item.question}** ${faqAnswerToPlainText(item.answer, item.link)}`)
    .join('\n')
}

export function GET() {
  const body = `# Innova Backdrops

> Innova es una marca argentina (Vicente López, Buenos Aires) que diseña y fabrica fondos fotográficos (backdrops), pisos, fundas para paneles y props en alta definición para fotógrafos, estudios, productores y decoradores de eventos. Vende diseños de catálogo y fondos personalizados. Sitio en español (es-AR); precios en pesos argentinos (ARS).

## Páginas principales

- [Catálogo de diseños](${absoluteUrl('/design-catalog')}): categorías temáticas de fondos fotográficos con sus diseños en alta definición.
- [Precios y medidas](${absoluteUrl('/prices')}): lista completa de medidas y precios por tipo de producto.
- [Preguntas frecuentes](${absoluteUrl('/preguntas-frecuentes')}): producción, envíos, pagos, materiales y contacto.
- [Navidad 2026](${absoluteUrl('/navidad')}): colección navideña.
- [Términos y condiciones](${absoluteUrl('/terminos-y-condiciones')})

## Productos y precios (ARS)

${pricesSection()}

Los precios exactos de cada medida están en [Precios y medidas](${absoluteUrl('/prices')}). Para fondos personalizados o medidas especiales, la cotización se hace por WhatsApp.

## Preguntas frecuentes

${faqSection(faqCategories)}

## Contacto

- WhatsApp: ${WHATSAPP_URL}
- Email: ${CONTACT_EMAIL}
- Showroom: Av. San Martín 1777 PB B, Vicente López, Buenos Aires, Argentina (con turno previo)
- Sitio web: ${SITE_URL}

## Categorías del catálogo

Las categorías de diseños están en ${absoluteUrl('/design-catalog')}. Cada categoría tiene su propia página con todos sus diseños, por ejemplo: ${catalogUrl('Abstractas')}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
