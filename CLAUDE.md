# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** e-commerce/showcase site for Innova, a photography backdrops company (Spanish-language, Argentina market).

### Key directories

- `app/` — All application code (App Router convention)
  - `page.tsx` / `layout.tsx` — Root home page and layout (GA + Facebook Pixel live here)
  - `components/` — Reusable React components, organized into subdirectories by feature (`gallery/`, `hero/`, `inspiracion/`, `SizePickerHomeSection/`, `icons/`)
  - `data/` — Static data files (catalog, prices, etc.)
  - `hooks/` — Custom hooks: `useGalleryImages`, `useGalleryModal`, `useInspirationFeed`, `useProductSearch`
  - `types/` — Shared TypeScript types
  - `utils/` — Utility functions
  - `api/cloudinary/search/` — API route that proxies Cloudinary search
- `public/` — Static assets (animations, icons, images, SVGs)

### Routes

| Path | Description |
|------|-------------|
| `/` | Home page |
| `/design-catalog` | Catalog listing |
| `/design-catalog/[id]` | Dynamic product detail |
| `/navidad` | Christmas section |
| `/pets` | Pets section |
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

- **Framework**: Next.js 15, React 19, TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3 + tailwindcss-animate
- **Animations**: Framer Motion, Lottie Web
- **Images**: Cloudinary + next-cloudinary
- **Icons**: lucide-react + custom SVG icons in `app/components/icons/`
- **Analytics**: Google Analytics + Facebook Pixel — both injected in `app/layout.tsx`
