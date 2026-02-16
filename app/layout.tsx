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
        
        {/* Google Analytics */}
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
        {/* Meta Pixel Facebook */}
        <Script id='meta-pixel'>
          {
          `!function(f,b,e,v,n,t,s) {
          if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2037570953478682');
          fbq('track', 'PageView');
          `}
        </Script>
        <noscript><img height="1" width="1" style={{display: 'none' as const}}
        src="https://www.facebook.com/tr?id=2037570953478682&ev=PageView&noscript=1"
        /></noscript>
        {/* End Meta Pixel Facebook */}
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
