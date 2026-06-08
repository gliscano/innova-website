import Image from 'next/image'
import { ShoppingBag, ArrowRight, Zap } from 'lucide-react'
import { getStockProducts } from '@/app/lib/empretiendaProducts'

const STORE_URL = 'https://innova54store.empretienda.com.ar/productos'

export default async function StockPreview() {
  const products = await getStockProducts()

  if (!products.length) {
    return (
      <a
        href="https://store.innova54.com/"
        target="_self"
        rel="noopener noreferrer"
        className="relative block overflow-hidden min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] cursor-pointer group max-w-7xl mx-auto"
      >
        <Image
          src="/images/innova/background-store.png"
          alt="Ver todos los productos en la tienda Innova"
          fill
          sizes="100vw"
          className="object-cover object-left transition-transform duration-500 group-hover:scale-105"
        />
      </a>
    )
  }

  return (
    <section className="py-14 px-4 bg-rose-gold-light/30">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-gold-light/40 text-yellow-gold-dark px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            <Zap className="w-3 h-3 fill-current" />
            En Stock
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Disponibles para entrega inmediata
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Fondos y pisos listos para despachar. Sin esperas, sin producción.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 font-medium leading-snug line-clamp-2 mb-1">
                  {product.name}
                </p>
                {product.price && (
                  <p className="text-sm font-bold text-rose-gold-dark">
                    {product.price}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-rose-gold hover:bg-rose-gold-dark text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Ver todos los productos en stock
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
