'use client'

import Footer from '@/app/components/Footer'
import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { HeroSection } from '@/app/components/navidad/HeroSection'
import { PurchaseInfoSection } from '@/app/components/navidad/PurchaseInfoSection'
import { IntroSection } from '@/app/components/navidad/IntroSection'
import { CategorySection } from '@/app/components/navidad/CategorySection'
import { CierreSection } from '@/app/components/navidad/CierreSection'
import { navidadDisplayFont, navidadBodyFont } from './navidad-fonts'
import './navidad-theme.css'

export default function NavidadPageContent() {
  return (
    <div className={`navidad-theme ${navidadDisplayFont.variable} ${navidadBodyFont.variable}`}>
      <HeroSection />
      <PurchaseInfoSection />
      <IntroSection />

      {navidadCategories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}

      <CierreSection />

      <Footer />
    </div>
  )
}
