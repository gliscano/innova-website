'use client'

import { DynamicIcon, IconName } from 'lucide-react/dynamic';

type NavItemProps = { 
  title: string,
  icon: IconName,
  href: string,
}

const navItems: Array<NavItemProps> = [
  { 
    title: 'Entrega inmediata',
    icon: 'store',
    href: 'https://store.innova54.com/',
  },
  
  {
    title: 'Precios y medidas',
    icon: 'circle-dollar-sign', 
    href: '/prices',
  },
  { 
    title: 'Preguntas frecuentes',
    icon: 'message-circle-question-mark',
    href: '/preguntas-frecuentes',
  }
]

export default function AnimatedCards() {
  return (
    <div className="mx-auto sm:px-6 lg:px-8 section-menu-buttons">
      <nav className="flex items-center justify-center py-2 px-4 lg:gap-24">
        {navItems.map((item) => (
          <a
            key={item.title}
            className="flex flex-col items-center justify-center mx-2 py-2 px-3 rounded-xl btn-cta-style lg:px-16"
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : '_self'}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <DynamicIcon name={item.icon} size={20} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-center text-xs text-uppercase lg:text-lg">
              <h4 className="leading-tight">{item.title}</h4>
            </div>
          </a>
        ))}
      </nav>
    </div>
  )
}
