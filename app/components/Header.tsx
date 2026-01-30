import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="header-innova shadow-sm">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href='/'>
          <Image src="/svg/innova-logo.svg" alt="Innova Logo" width={128} height={31} style={{ height: 'auto' }} />
        </Link>
        <div className='hidden md:block lg:block'>
          <h4 className='copperplate-condensed-ligth-font'>La verdadera magia, la haces vos!!!</h4>
        </div>
      </div>
    </header>
  )
}
