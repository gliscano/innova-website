"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import StoreExitLink from "@/app/components/StoreExitLink"
import type { HeroLink as HeroLinkData } from "@/app/data/heroGalleryData"

interface HeroLinkProps {
  link: HeroLinkData
  /** Se registra como `ctaLocation` cuando el enlace sale a la tienda. */
  location: string
  className?: string
  onClick?: () => void
  children?: ReactNode
}

/** Enlace del menú o de los chips: interno con `next/link`, la tienda externa con `StoreExitLink`. */
export function HeroLink({ link, location, className, onClick, children }: HeroLinkProps) {
  const content = children ?? link.label
  if (link.external) {
    return (
      <StoreExitLink
        href={link.href}
        ctaLocation={location}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClickCapture={onClick}
      >
        {content}
      </StoreExitLink>
    )
  }
  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {content}
    </Link>
  )
}
