import './globals.css'
import './fonts.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Innova - Backdrops e Insumos de fotografía',
  description: 'Fondos fotográficos (backdrops) y props para crear una experiencia de otro nivel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-EZ8J02VNPE"></Script>
      <Script id='google-analytics'>
        {
        `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-EZ8J02VNPE');
        `
        }
      </Script>
      </head>
      <body
        className={inter.className}
         cz-shortcut-listen="true"
      >
        {children}
      </body>
    </html>
  );
}
