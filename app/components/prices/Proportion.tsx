/**
 * Diagrama de proporción de una medida.
 *
 * El tamaño NO se pasa por prop: el cuadro toma su lado de la custom property `--prop-size`, que
 * fija el CSS del contexto (`.tipo-card .prop`, `.result .prop`), y el rectángulo se dimensiona en
 * PORCENTAJE de ese cuadro. Antes el lado venía como `max` y se escribía inline, así que ganaba
 * por especificidad y el diagrama no se podía achicar desde una media query — en mobile las
 * tarjetas de tipo quedaban clavadas en 64px de diagrama.
 */
export default function Proportion({
  ancho,
  largo,
  accent,
}: {
  ancho: number
  largo: number
  accent: string
}) {
  const big = Math.max(ancho, largo)
  const w = (ancho / big) * 100
  const h = (largo / big) * 100
  return (
    <div className="prop">
      <div
        className="prop-rect"
        style={{ width: `${w}%`, height: `${h}%`, borderColor: accent }}
      >
        <span className="prop-w">{ancho.toString().replace('.', ',')}</span>
        <span className="prop-h">{largo.toString().replace('.', ',')}</span>
      </div>
    </div>
  )
}
