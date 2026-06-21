'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { defaultOptions } from './WhatsAppDropdown'
import { useSelectedSize } from '../context/SelectedSizeContext'
import { dimLabel } from '@/app/data/pricesData'
import type { Sel, Family, FamilyItem, Finish } from './prices/types'
import type { CloudinaryFolder } from '@/app/types/catalog'
import PriceHero from './prices/PriceHero'
import GuidedPicker from './prices/GuidedPicker'
import StickyBar from './prices/StickyBar'
import CatalogSection from './prices/CatalogSection'

const ACCENT = '#b5532e'

export default function PriceList({ initialFolders }: { initialFolders?: CloudinaryFolder[] }) {
  const { setSelectedSize } = useSelectedSize()
  const [sel, setSel] = useState<Sel>({ familyId: 'p290', largoIndex: null, finish: 'hd' })
  const catRef = useRef<HTMLDivElement>(null)

  function handleSelect(family: Family, item: FamilyItem, finish: Finish) {
    const ancho = item.ancho || family.ancho || 0
    const price = finish === 'unico' ? item.unico! : (item[finish] ?? 0)
    setSelectedSize({
      id: `${ancho}x${item.largo}`,
      label: dimLabel(family, item),
      widthM: ancho,
      heightM: item.largo,
      fromPrice: price,
      isExactPrice: true,
    })
  }

  function chooseDesign() {
    if (!catRef.current) return
    const y = catRef.current.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top: y, behavior: 'smooth' })
    catRef.current.classList.add('flash')
    setTimeout(() => catRef.current?.classList.remove('flash'), 1200)
  }

  return (
    <>
      <PriceHero />

      <section className="picker-sec">
        <GuidedPicker
          sel={sel}
          setSel={setSel}
          accent={ACCENT}
          onSelect={handleSelect}
          onChooseDesign={chooseDesign}
        />
      </section>

      {initialFolders && (
        <CatalogSection
          sel={sel}
          initialFolders={initialFolders}
          ref={catRef}
        />
      )}

      <section style={{ marginTop: 40 }}>
        <div className="rounded-xl bg-green-50 border border-green-200 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-gray-900">¿Ya elegiste tu diseño?</p>
            <p className="text-sm text-gray-600 mt-0.5">Escribinos y coordinamos el pedido con el tamaño que necesitás.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {defaultOptions.map((option, i) => (
              <Link
                key={i}
                href={`https://wa.me/${option.phoneNumber}?text=${encodeURIComponent('Hola! Ya elegí mi diseño y quiero consultar el precio y el pedido.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-full transition-colors shadow-sm"
              >
                <Image src="/svg/whatsapp.svg" alt="" width={16} height={16} aria-hidden />
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StickyBar sel={sel} accent={ACCENT} onChooseDesign={chooseDesign} />
    </>
  )
}
