import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FavoritesGallery from '../components/favorites/FavoritesGallery'
import FavoritesBarSpacer from '../components/favorites/FavoritesBarSpacer'

export const metadata: Metadata = {
  title: 'Mis favoritos',
  description: 'Los diseños de fondos fotográficos que guardaste en Innova.',
  // La página está vacía para un crawler (el contenido vive en localStorage del
  // visitante), así que indexarla sería un pasivo de thin-content.
  robots: { index: false, follow: true },
}

export default function FavoritosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Destino fijo en vez de router.back(): a /favoritos se llega desde el
            FAB, la tira de la Home o el snackbar, así que "la anterior" es
            variable, y si entraron por link directo el back se va del sitio.
            Mismo markup que el breadcrumb de /design-catalog/[id]. */}
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center gap-1.5 text-sm text-[#6B5F52]"
          aria-label="Breadcrumb"
        >
          <Link href="/#catalog" className="hover:text-[#1F1A14] transition-colors">
            ← Catálogo
          </Link>
          <span>/</span>
          <span className="text-[#1F1A14] font-medium">Mis favoritos</span>
        </nav>
        <FavoritesGallery />
      </main>
      <Footer />
      <FavoritesBarSpacer />
    </div>
  )
}
