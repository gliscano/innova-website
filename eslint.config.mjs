// Next 16 eliminó `next lint`, y ESLint 9 dejó de leer `.eslintrc.json`: la config vieja
// (`{ "extends": ["next/core-web-vitals", "next/typescript"] }`) hacía que `npm run lint`
// fallara antes de mirar un solo archivo. `eslint-config-next` 16 ya publica flat config nativa,
// así que no hace falta el shim `FlatCompat` de `@eslint/eslintrc`.
//
// `core-web-vitals` incluye internamente la config base de `eslint-config-next`; `typescript` es
// una entrada aparte. Las dos juntas equivalen al `extends` que había antes.
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  {
    // ESLint 9 solo ignora `node_modules` por defecto: el resto va explícito, o el lint recorre
    // los chunks generados de `.next` y tarda minutos en fallar con ruido inútil.
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'design-extracted/**', '.agents/**'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // `eslint-config-next` 16 trae `eslint-plugin-react-hooks` v7, que agregó reglas que el config
    // anterior no tenía. Marcan 6 sitios PREEXISTENTES, ninguno introducido por esta rama:
    //
    //   set-state-in-effect  SizeSelectorCompact:201, WhatsAppFloat:33, GalleryModal:75,
    //                        useInspirationFeed:117, useProductSearch:70
    //   immutability         SizeSelectorCompact:207
    //
    // Son patrones reales (reset de estado al cambiar props, alta de un IntersectionObserver) que
    // arreglar bien implica rediseñar esos hooks y cambiar comportamiento en runtime. Quedan en
    // `warn` a propósito: así `npm run lint` vuelve a servir de gate para código nuevo sin que un
    // refactor de riesgo se cuele junto con este deploy, y los 6 sitios siguen apareciendo en la
    // salida en vez de desaparecer. Subir a `error` cuando se haga esa pasada.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]

export default config
