'use client'

import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import { navidadCategories } from '@/app/data/navidadCategoriesData'
import { HeroSection } from '@/app/components/navidad/HeroSection'
import { IntroSection } from '@/app/components/navidad/IntroSection'
import { CategorySection } from '@/app/components/navidad/CategorySection'
import { CierreSection } from '@/app/components/navidad/CierreSection'
import { navidadDisplayFont, navidadBodyFont } from './navidad-fonts'
import './navidad-theme.css'

export default function NavidadPageContent() {
  return (
    <div className={`navidad-theme ${navidadDisplayFont.variable} ${navidadBodyFont.variable}`}>
      <header className="nv-nav">
        <Link href="/" className="nv-nav-logo">
          <Image
            src="/images/innova/logo-navidad.png"
            alt="Innova"
            width={140}
            height={34}
            className="w-auto h-auto"
            priority
          />
        </Link>
        <a href="https://store.innova54.com/" className="nv-nav-link">
          Ir a la tienda
        </a>
      </header>

      <HeroSection />
      <IntroSection />

      {navidadCategories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}

      <CierreSection />

      <Footer />
    </div>
  )
}
