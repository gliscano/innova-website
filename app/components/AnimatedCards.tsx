'use client'

type NavItemProps = { 
  title: string,
  subtitle: string,
  icon: string,
  href: string,
}

const navItems: Array<NavItemProps> = [
  { 
    title: 'Whatsapp',
    subtitle: 'Consultas',
    icon: '/svg/whatsapp.svg',
    href: 'https://wa.me/5491171142152',
  },
  {
    title: 'Precios',
    subtitle: ' y Medidas',
    icon: '/svg/list-icon.svg', 
    href: '/prices',
  },
  { 
    title: 'Stock',
    subtitle: 'Fondos',
    icon: '/svg/gallery-icon.svg',
    href: 'https://store.innova54.com/',
  },
  { 
    title: 'Newborn',
    subtitle: 'Línea',
    icon: '/svg/star_featured_icon.svg',
    href: 'https://store.innova54.com/',
  },
  { 
    title: 'Props',
    subtitle: 'Decoraciones',
    icon: '/svg/palette.svg',
    href: 'https://store.innova54.com/',
  },
]

export default function AnimatedCards() {
  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="w-full">
        <nav className="flex items-center justify-around py-3 px-4">
          {navItems.map((item) => (
            <a
              key={item.title}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 group min-w-0 flex-1"
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <img 
                  src={item.icon} 
                  alt={item.title}
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <div className="text-center">
                <h4 className="text-xs font-medium text-gray-900 leading-tight">{item.title}</h4>
                <p className="text-xs text-gray-600 leading-tight">{item.subtitle}</p>
              </div>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
