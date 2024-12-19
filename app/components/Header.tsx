import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/svg/innova-logo.svg" alt="Innova Logo" width={180} height={43} />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="#" className="text-gray-700 hover:text-gray-900">
            Inicio
          </Link>
          <Link href="#" className="text-gray-700 hover:text-gray-900">
            Productos
          </Link>
          <Link href="#" className="text-gray-700 hover:text-gray-900">
            Servicios
          </Link>
          <Link href="#" className="text-gray-700 hover:text-gray-900">
            Contacto
          </Link>
        </div>
      </nav>
    </header>
  )
}
