import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href='/'>
          <Image src="/svg/innova-logo.svg" alt="Innova Logo" width={180} height={43} />
        </Link>
        <div className='hidden md:block lg:block'>
          <h4 className='copperplate-condensed-ligth-font'>Innova, Crea y Captura... sin limites y sin reglas!!! </h4>
        </div>
      </nav>
    </header>
  )
}
