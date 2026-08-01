import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sin remotePatterns a propósito: todo lo remoto se sirve por Cloudinary vía CldImage
    // (loader propio, no pasa por /_next/image). Si alguien vuelve a meter un <Image> de
    // next/image apuntando a res.cloudinary.com, Next falla en vez de facturar en silencio
    // una re-optimización en Vercel de algo que Cloudinary ya optimizó.
    formats: ['image/avif', 'image/webp'],
    // CldImage envuelve next/image, así que esta grilla también gobierna el srcset que se
    // pide a Cloudinary: cada ancho de más es un derived asset de más en ambos proveedores.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 384],
    // Solo afecta a los rasters de /public: lo de Cloudinary no pasa por /_next/image.
    // 60s (el valor viejo) re-optimizaba la misma fuente casi en cada request — el default
    // de Next son 4h. Ojo con subirlo más: este número se emite tal cual al navegador como
    // `Cache-Control: public, max-age=<TTL>, must-revalidate`, y los archivos de /public NO
    // llevan hash en el nombre (hero/0X.webp, logo-navidad.png, background-store.png...),
    // así que reemplazar uno in-place deja a los visitantes con la versión vieja hasta que
    // expire, sin forma de purgarlo. 30 días cubre el ahorro; el salto a 1 año ahorraba
    // ~750 transformaciones/año (nada) a cambio de 11 meses más de caché no purgable.
    // Si hace falta más, migrar esos archivos a `import` estático: Next les pone hash en
    // /_next/static/media y ahí sí sirve `immutable` sin riesgo.
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        // Aplicar headers de seguridad a todas las rutas
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://p.typekit.net",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com https://use.typekit.net",
              // `stats.g.doubleclick.net` y `www.google.com.ar`: los pide GA4 cuando
              // Google Signals está activo (datos cross-device y remarketing). El
              // primero recibe el /g/collect; el segundo es el ping de audiencias,
              // que usa el TLD del país del visitante — `www.google.com` solo no
              // alcanza para el tráfico argentino.
              // Sin estos dos, el navegador bloquea las llamadas y parte de la
              // telemetría de GA4 nunca llega. Si se prefiere no mandar nada a
              // doubleclick, la alternativa es desactivar Google Signals en el
              // panel de GA4 y quitar ambos de acá.
              "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://www.google.com.ar https://stats.g.doubleclick.net https://res.cloudinary.com https://use.typekit.net https://p.typekit.net https://connect.facebook.net https://www.facebook.com https://capig.stape.ma https://maps.googleapis.com https://*.api.mailchimp.com https://*.a.run.app https://*.conversionsapigateway.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
    ]
  },
};

export default nextConfig;
