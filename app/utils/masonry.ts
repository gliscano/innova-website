import type { GalleryImage } from '@/app/types/gallery'

// Rango de aspect ratio (ancho/alto) permitido para las tarjetas: masonry "controlado".
// Evita retratos gigantes (< 0.66) o panorámicas extremas (> 1.5) que rompen la armonía visual.
export const MIN_RATIO = 0.66
export const MAX_RATIO = 1.5

// Aspect ratio (ancho/alto) de la imagen, acotado al rango permitido para un masonry armónico.
export function getClampedRatio(image: GalleryImage): number {
  const ratio = image.width && image.height ? image.width / image.height : 1
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio))
}

export interface Cell {
  image: GalleryImage
  index: number
  ratio: number
}

/**
 * Reparte las imágenes entre N columnas (masonry tipo Pinterest). Cada imagen va a la columna
 * con menor altura acumulada; el aporte de altura es 1/ratio (una foto más alta suma más).
 * Dentro de cada columna las tarjetas se apilan en un flex-column con su alto natural, por lo que
 * es matemáticamente imposible que queden huecos internos: solo el borde inferior queda irregular
 * (el efecto masonry deseado).
 *
 * Estabilidad ante "Ver más": la columna de la imagen i solo depende de las imágenes 0..i-1 —
 * nunca de las que vienen después. Agregar imágenes al final nunca mueve algo ya dibujado.
 * Se preserva `index` (posición global) para que openModal(index) abra la imagen correcta.
 */
export function distributeIntoColumns(images: GalleryImage[], columns: number): Cell[][] {
  const cols: Cell[][] = Array.from({ length: columns }, () => [])
  const heights = new Array(columns).fill(0)

  images.forEach((image, index) => {
    const ratio = getClampedRatio(image)
    let target = 0
    for (let c = 1; c < columns; c++) {
      if (heights[c] < heights[target]) target = c
    }
    cols[target].push({ image, index, ratio })
    heights[target] += 1 / ratio
  })

  return cols
}
