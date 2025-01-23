import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/innova-logo.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ul className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-1">
          🌟 Una nueva experiencia en el diseño y producción de insumos para fotógrafos y estudios creativos.
          </li>
          <li className="mb-1">
          📸 Fondos fotográficos personalizados con piso.
          </li>
          <li className="mb-1">
          🧺 Hermosos Props para recrear una experiencia innova
          </li>
        </ul>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://innova54store.empretienda.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Ir a la tienda
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 mr-1"
            href="https://wa.me/5491171142152"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/phone.svg"
              alt="Whatsapp icon"
              className="mr-1"
              width={16}
              height={16}
            />
            Escribir a Whatsapp
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://innova54store.empretienda.com.ar/catalogo-de-fondos"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/gallery-icon.svg"
              alt="design catalogue icon"
              className="mr-1"
              width={16}
              height={16}
            />
            Catálogo de diseños
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://drive.google.com/file/d/1pEjFLUMFoQP1C3cwVas3-uwHNa3LNuwd/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/list-icon.svg"
              alt="price list icon"
              className="mr-1"
              width={16}
              height={16}
            />
            Lista de medidas y precios
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://drive.google.com/file/d/1pEjFLUMFoQP1C3cwVas3-uwHNa3LNuwd/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/order-icon.svg"
              alt="custom order icon"
              className="mr-1"
              width={16}
              height={16}
            />
            Pasos para fondos a medidas
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.instagram.com/innova54.store"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/ig.svg"
            alt="instagram icon"
            width={16}
            height={16}
          />
          @innova54.store
        </a>
        <a
          className="flex items-center gap-4 hover:underline hover:underline-offset-4"
          href="https://www.facebook.com/innova54.store"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/facebook-icon.svg"
            alt="facebook icon"
            width={16}
            height={16}
          />
          @innova54.store
        </a>
        <div
          className="flex items-center gap-4"
        >
          <Image
            aria-hidden
            src="/code-icon.svg"
            alt="code devs icon"
            width={16}
            height={16}
          />
          By Innova Tech - 2024
        </div>
      </footer>
    </div>
  );
}
