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
}

export interface GalleryGridProps {
  images: GalleryImage[]
  onImageClick: (index: number) => void
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export interface GallerySkeletonProps {
  count: number
}

export interface GalleryErrorProps {
  message: string
  onRetry: () => void
}
