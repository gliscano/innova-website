// Flat config de ESLint 9. Reemplaza a .eslintrc.json + `next lint`, que Next 16
// eliminó (el CLI ahora se invoca directo: `npm run lint` / `npm run lint:fix`).
//
// `eslint-config-next/core-web-vitals` y `/typescript` exportan arrays de flat
// config, así que se spreadean. Equivalen al viejo
// `extends: ["next/core-web-vitals", "next/typescript"]`.
// El segundo ya aporta los ignores de .next/, out/, build/ y next-env.d.ts.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      // Assets de diseño extraídos y fuentes de media: no son código de la app.
      'design-extracted/**',
      'media-src/**',
      'public/**',
      // Templates de skills de Claude Code, no del proyecto.
      '.agents/**',
      '.claude/**',
    ],
  },
  {
    // Los archivos de configuración corren en Node y `require()` es su forma
    // idiomática (tailwind.config.ts carga plugins así).
    files: ['*.config.ts', '*.config.js', '*.config.mjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // ── Backlog de migración a Next 16 ──────────────────────────────────────
    // Reglas nuevas de eslint-plugin-react-hooks v6 (React Compiler). No
    // existían con `next lint` + eslint-config-next 15, así que al actualizar
    // aparecieron 10 hallazgos preexistentes en hooks del core: useProductSearch,
    // useGalleryImages, useInspirationFeed, SizeSelectorCompact, HeroGallery y
    // GalleryModal.
    //
    // Quedan en `warn` a propósito: son deuda real y hay que verlas, pero
    // arreglarlas implica refactorizar hooks centrales del catálogo y la home
    // sin suite de tests que respalde el cambio. Dejarlas en `error` bloquearía
    // el lint por un backlog que no introdujo el cambio actual.
    //
    // Al saldarlo, borrar este bloque para que vuelvan a ser error.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]

export default config
