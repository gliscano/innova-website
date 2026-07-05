import Link from 'next/link'

export default function NavidadBanner() {
  return (
    <div className="max-w-[1320px] mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <Link
        href="/navidad"
        className="group relative flex overflow-hidden rounded-3xl min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/innova/navidad/navidad-1.png"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          aria-hidden="true"
        >
          <source src="/video/banner-navidad.mov" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end w-full px-6 pb-8 lg:px-12 lg:pb-12">
          <span
            className="inline-block mb-2 sm:mb-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-semibold self-start copperplate-bold-font"
            style={{ background: 'var(--surface)', color: 'var(--accent)' }}
          >
            Lanzamiento
          </span>

          <h2 className="copperplate-bold-font text-white text-3xl sm:text-4xl lg:text-5xl font-bold drop-shadow-lg mb-5">
            Colección Navidad 2026
          </h2>

          <span className="btn-accent inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-200 self-start w-fit">
            Ingresar →
          </span>
        </div>
      </Link>
    </div>
  )
}
