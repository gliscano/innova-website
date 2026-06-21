export default function Proportion({
  ancho,
  largo,
  max = 104,
  accent,
}: {
  ancho: number
  largo: number
  max?: number
  accent: string
}) {
  const big = Math.max(ancho, largo)
  const w = (ancho / big) * max
  const h = (largo / big) * max
  return (
    <div className="prop" style={{ width: max, height: max }}>
      <div
        className="prop-rect"
        style={{ width: w, height: h, borderColor: accent }}
      >
        <span className="prop-w">{ancho.toString().replace('.', ',')}</span>
        <span className="prop-h">{largo.toString().replace('.', ',')}</span>
      </div>
    </div>
  )
}
