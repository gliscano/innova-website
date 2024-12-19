import './globals.css'
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
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-EZ8J02VNPE"></script>
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
