import { Playfair_Display, Inter } from 'next/font/google'

export const navidadDisplayFont = Playfair_Display({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-navidad-display',
})

export const navidadBodyFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-navidad-body',
})
