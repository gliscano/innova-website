import type { Metadata } from 'next'
import { getCatalogItemByCategory } from '@/app/utils/catalogUtils'
import ProductPageContent from './ProductPageContent'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getCatalogItemByCategory(decodeURIComponent(id))

  if (!product) {
    return { title: 'Catálogo' }
  }

  return {
    title: `Catálogo ${product.title}`,
    description: product.description ?? `Explorá el catálogo de fondos fotográficos ${product.title} de Innova.`,
    openGraph: {
      title: `Catálogo ${product.title} | Innova`,
      description: product.description ?? `Fondos fotográficos ${product.title}`,
      url: `https://www.innova54.com/design-catalog/${id}`,
      images: product.image ? [{ url: product.image, alt: product.title }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  return <ProductPageContent id={id} />
}
