"use client"

import Image from "next/image"
import Link from "next/link"
import type { CloudinaryFolder } from "@/app/types/catalog"

interface CardCatalogProps {
  folder: CloudinaryFolder
}

export default function CardCatalog({ folder }: CardCatalogProps) {
  return (
    <Link
      href={`/design-catalog/${encodeURIComponent(folder.folderName)}`}
      aria-label={`${folder.title} — ${folder.imageCount} diseños`}
      className="group relative flex rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-[3/4] focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      {/* Imagen de fondo */}
      {folder.thumbnailUrl ? (
        <Image
          src={folder.thumbnailUrl}
          alt={folder.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300" />
      )}

      {/* Gradient inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      {/* Badge con cantidad — esquina superior derecha */}
      {folder.imageCount > 0 && (
        <div className="absolute top-3 right-3 bg-black/75 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {folder.imageCount} diseños
        </div>
      )}

      {/* Título y CTA superpuestos en el gradient */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 space-y-1">
        <h3 className="text-white font-bold text-lg sm:text-xl leading-snug line-clamp-2 drop-shadow-sm">
          {folder.title}
        </h3>
        <p className="text-white/75 text-sm font-medium group-hover:text-white transition-colors">
          Ver diseños →
        </p>
      </div>
    </Link>
  )
}
