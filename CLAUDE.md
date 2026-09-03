# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (flat config: eslint.config.mjs)
```

No test suite is configured.

`next lint` was removed in Next 16, so `lint` invokes `eslint` directly against `eslint.config.mjs`
(flat config). There is no `.eslintrc.json` — adding one back does nothing under ESLint 9.
`eslint-config-next` 16 ships flat config natively, so no `FlatCompat` shim is needed.

## Architecture

**Next.js 16 App Router** e-commerce/showcase site for Innova, a photography backdrops company (Spanish-language, Argentina market).

### Key directories

- `app/` — All application code (App Router convention)
  - `page.tsx` / `layout.tsx` — Root home page and layout (GA + Facebook Pixel live here)
  - `components/` — Reusable React components, organized into subdirectories by feature (`gallery/`, `hero/`, `inspiracion/`, `SizePickerHomeSection/`, `icons/`)
  - `data/` — Static data files (catalog, prices, etc.)
  - `hooks/` — Custom hooks: `useGalleryImages`, `useGalleryModal`, `useInspirationFeed`, `useProductSearch`
  - `types/` — Shared TypeScript types
  - `utils/` — Utility functions (`tracking.ts` is the single entry point for every GA4/Meta Pixel
    event — do not call `window.gtag` / `window.fbq` inline from components)
  - `lib/` — Server-side data access (`cloudinaryFolders`, `cloudinaryImages`, `siteUrl`,
    `empretiendaProducts`), all cached with `unstable_cache`
  - `api/cloudinary/search/` — API route that proxies Cloudinary search; it delegates to
    `lib/cloudinaryImages` so the server components and the route share one implementation
- `public/` — Static assets (animations, icons, images, SVGs)

### Routes

| Path | Description |
|------|-------------|
| `/` | Home page |
| `/design-catalog` | Catalog listing |
| `/design-catalog/[id]` | Dynamic product detail |
| `/navidad` | Christmas section |
| `/prices` | Pricing page |
| `/preguntas-frecuentes` | FAQ |
| `/terminos-y-condiciones` | Terms & conditions |

### Image management

All product images are hosted on Cloudinary (cloud name: `innova54`). The `next.config.ts` whitelists `res.cloudinary.com/innova54/*` for Next.js Image optimization. The `/api/cloudinary/search` route is used by hooks to fetch image collections. Use `next-cloudinary` components or the API route — avoid direct Cloudinary SDK calls from client components.

### Styling conventions

- Tailwind CSS with a custom design system defined in `tailwind.config.ts`
- Custom brand colors: `rose-gold` (light/default/dark) and `yellow-gold` palettes
- HSL-based semantic tokens: `background`, `foreground`, `primary`, `secondary`, `accent`, etc.
- Custom font utility classes for Copperplate variants (defined in `fonts.css`)
- Path alias `@/*` maps to the repo root (e.g., `@/app/components/...`)

### Tech stack summary

- **Framework**: Next.js 16, React 19, TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3 + tailwindcss-animate
- **Animations**: Framer Motion, Lottie Web
- **Images**: Cloudinary + next-cloudinary
- **Icons**: lucide-react + custom SVG icons in `app/components/icons/`
- **Analytics**: Google Analytics + Facebook Pixel — both injected in `app/layout.tsx`, events
  emitted through `app/utils/tracking.ts`
- **Linting**: ESLint 9 flat config + `eslint-config-next` 16

### SEO conventions

- `app/lib/siteUrl.ts` holds the only canonical host (`https://innova54.com` — the apex; `www` has
  no TLS certificate). Build every absolute URL with `absoluteUrl()` / `catalogUrl()`; never
  hardcode the host in a route's metadata.
- `app/layout.tsx` owns the `| Innova` title template. A route's `generateMetadata` returns the
  bare title, or it gets the suffix twice.
- `app/sitemap.ts` and `app/robots.ts` are generated; the sitemap reuses `getCachedFolders()` so it
  costs no extra Cloudinary calls.
- Structured data lives in `app/components/JsonLd.tsx` (Organization, WebSite, FAQPage,
  BreadcrumbList, ItemList, Product/Offer).
- `/design-catalog/[id]` is prerendered via `generateStaticParams()` and seeds the first page of
  gallery images server-side, so the designs are in the served HTML.
