import React from "react"
import Image from "next/image"
import Link from "next/link"
import { catalogHref, type ImageSet } from "@/app/data/heroGalleryData"

interface GalleryCardProps {
  image: ImageSet
}

/** Imagen del collage de la computadora: lleva a su categoría y muestra la etiqueta. */
export const GalleryCard = React.memo(function GalleryCard({ image }: GalleryCardProps) {
  return (
    <Link
      href={catalogHref(image.folder)}
      title={image.alt}
      className="relative block aspect-square rounded-xl overflow-hidden bg-[var(--surface-2)] transition-transform duration-200 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
    >
      <Image src={image.src} alt={image.alt} fill sizes="200px" className="object-cover" />
      <span className="absolute left-2 bottom-2 px-2.5 py-0.5 rounded-full text-xs font-medium text-[var(--ink)] bg-[var(--surface)]">
        {image.category}
      </span>
    </Link>
  )
})
