import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href='/'>
          <Image src="/svg/innova-logo.svg" alt="Innova Logo" width={180} height={43} />
        </a>
        {/* <a href='/pets'>
          <Image src="/svg/innpets-logo.svg" alt="Innpets Logo" width={180} height={43} />
        </a> */}
      </nav>
    </header>
  )
}
