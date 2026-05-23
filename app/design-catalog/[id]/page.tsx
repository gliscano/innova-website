import type { Metadata } from 'next'
import { formatFolderName } from '@/app/utils/catalogUtils'
import ProductPageContent from './ProductPageContent'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const title = formatFolderName(decodeURIComponent(id))
  return {
    title: `Catálogo ${title} | Innova`,
    description: `Explorá el catálogo de fondos fotográficos ${title} de Innova.`,
    openGraph: {
      title: `Catálogo ${title} | Innova`,
      description: `Fondos fotográficos ${title}`,
      url: `https://www.innova54.com/design-catalog/${id}`,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  return <ProductPageContent id={id} />
}
