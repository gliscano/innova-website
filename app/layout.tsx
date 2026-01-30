import './globals.css'
import './fonts.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Solo los pesos necesarios
  display: 'swap', // Mejora la percepción de carga
  preload: true,
  fallback: ['system-ui', 'arial'],
})

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
        {/* Preconnect a dominios externos para reducir latencia */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" />
        
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
