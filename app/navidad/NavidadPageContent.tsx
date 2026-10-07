'use client'

import Footer from '@/app/components/Footer'
import { navidadCategories, type NavidadCategoryPreviews } from '@/app/data/navidadCategoriesData'
import { HeroSection } from '@/app/components/navidad/HeroSection'
import { PurchaseInfoSection } from '@/app/components/navidad/PurchaseInfoSection'
import { IntroSection } from '@/app/components/navidad/IntroSection'
import { CategorySection } from '@/app/components/navidad/CategorySection'
import { CategoryStickyBar } from '@/app/components/navidad/CategoryStickyBar'
import { CierreSection } from '@/app/components/navidad/CierreSection'
import { navidadBodyFont } from './navidad-fonts'
import './navidad-theme.css'

export default function NavidadPageContent({ previews }: { previews: NavidadCategoryPreviews }) {
  return (
    <div className={`navidad-theme ${navidadBodyFont.variable}`}>
      <CategoryStickyBar />
      <HeroSection />
      {/* Las categorías van antes que el selector de medida: con el hero a media pantalla quedan
          en la primera pantalla, y la temática se elige antes que el tamaño. */}
      <IntroSection previews={previews} />
      <PurchaseInfoSection />

      {navidadCategories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}

      <CierreSection />

      <Footer />
    </div>
  )
}
