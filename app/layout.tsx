import './globals.css'
import './fonts.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Innova - Insumos para fotógrafos y estudios creativos',
  description: 'Fondos fotográficos personalizados y props para recrear una experiencia innova.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
      <link rel="dns-prefetch" href="https://www.googletagmanager.com/"></link>
      <link href="https://www.googletagmanager.com/gtag/js?id=G-EZ8J02VNPE" rel="preload" as="script"></link>
      <script id="google-analytics">
        {
          `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-EZ8J02VNPE');
          `
        }
      </script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
