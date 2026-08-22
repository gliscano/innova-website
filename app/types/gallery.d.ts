export interface GalleryImage {
  id: string
  url: string
  width: number
  height: number
  format: string
  createdAt: string
  tags: string[]
  folder?: string
  collection?: string
  description?: string
  display_name: string
  aspect_ratio: number
  bytes?: number
  metadata?: Record<string, unknown>
  context?: Record<string, unknown>
}

export interface GalleryProps {
  searchTerm?: string
  tags?: string[]
  folder?: string
  collection?: string
  itemsPerPage?: number
  showTags?: boolean
  onComplete?: () => void
  /**
   * Nombre legible de la categoría, usado para construir el `alt` de cada diseño. Si se omite se
   * deriva de `folder`/`searchTerm`.
   */
  categoryTitle?: string
  /**
   * Primera página resuelta en el servidor. Si viene, la galería se pinta ya renderizada en el
   * HTML inicial y el hook saltea el primer fetch.
   */
  initialImages?: GalleryImage[]
  initialCursor?: string | null
  initialTotalCount?: number
  initialHasMore?: boolean
}

export interface GallerySearchResponse {
  images: GalleryImage[]
  nextCursor?: string
  totalCount: number
  hasMore: boolean
  error?: string
}

export interface GalleryModalProps {
  isOpen: boolean
  images: GalleryImage[]
  initialIndex: number
  category?: string
  context?: {
    Description?: string
  }
  onClose: () => void
  goToNext: () => void
  goToPrevious: () => void
}

export interface GalleryItemProps {
  image: GalleryImage
  onClick: () => void
  index: number
  /** Aspect ratio (ancho/alto) acotado para el masonry; define el alto de la tarjeta. */
  ratio: number
  /** Nombre legible de la categoría, para el texto alternativo del diseño. */
  categoryTitle?: string
}

export interface GalleryGridProps {
  images: GalleryImage[]
  onImageClick: (index: number) => void
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
  categoryTitle?: string
}

export interface GallerySkeletonProps {
  count: number
}

export interface GalleryErrorProps {
  message: string
  onRetry: () => void
}
