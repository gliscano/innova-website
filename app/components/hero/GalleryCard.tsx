import React from "react"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { catalogHref } from "@/app/lib/siteUrl"

/** Lo mínimo de una carpeta destacada que necesita el collage del hero. */
export interface HeroCollageItem {
  folderName: string
  title: string
  thumbnailId: string
}

interface GalleryCardProps {
  item: HeroCollageItem
}

/** Imagen del collage de la computadora: lleva a su categoría y muestra la etiqueta. */
export const GalleryCard = React.memo(function GalleryCard({ item }: GalleryCardProps) {
  return (
    <Link
      href={catalogHref(item.folderName)}
      title={item.title}
      className="relative block aspect-[4/5] rounded-xl overflow-hidden bg-[var(--surface-2)] transition-transform duration-200 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
    >
      <CldImage
        src={item.thumbnailId}
        alt={item.title}
        fill
        sizes="160px"
        quality="auto:good"
        className="object-cover"
      />
      <span className="absolute left-2 bottom-2 max-w-[calc(100%-1rem)] truncate px-2.5 py-0.5 rounded-full text-xs font-medium text-[var(--ink)] bg-[var(--surface)]">
        {item.title}
      </span>
    </Link>
  )
})
