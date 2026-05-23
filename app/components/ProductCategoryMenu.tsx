import Image from 'next/image'

export default function ProductCategoryMenu() {
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
