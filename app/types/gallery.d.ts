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
  display_name: string
  aspect_ratio: number
}

export interface GalleryProps {
  searchTerm?: string
  tags?: string[]
  folder?: string
  collection?: string
  itemsPerPage?: number
  showTags?: boolean
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
  onClose: () => void
  goToNext: () => void
  goToPrevious: () => void
  goToImage: (index: number) => void
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
