'use client'

import { GallerySkeletonProps } from '../../types/gallery'

export default function GallerySkeleton({ count }: GallerySkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          {/* Skeleton de la imagen */}
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          
          {/* Skeleton del contenido */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
