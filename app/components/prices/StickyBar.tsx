'use client'

import WhatsAppDropdown from '../WhatsAppDropdown'
import { FAMILIES, FINISH_LABEL, ars, dimLabel } from '@/app/data/pricesData'
import type { Sel, Finish } from './types'

export default function StickyBar({
  sel,
  accent,
  onChooseDesign,
}: {
  sel: Sel
  accent: string
  onChooseDesign: () => void
}) {
  if (sel.largoIndex == null) return null

  const family = FAMILIES.find(f => f.id === sel.familyId)!
  const item = family.largos[sel.largoIndex]
  const finish: Finish = family.finishes[0] === 'unico' ? 'unico' : sel.finish
  const price = finish === 'unico' ? item.unico! : (item[finish] ?? 0)
  const waText = `Hola! Me interesa un fondo ${dimLabel(family, item)} (${FINISH_LABEL[finish]}) — ${ars(price)}. Quiero ver diseños.`

  return (
    <div className="sticky">
      <div className="sticky-info">
        <span className="sticky-cap">{family.nombre}</span>
        <strong>{dimLabel(family, item)}</strong>
        <span className="sticky-dot">·</span>
        <span className="sticky-price" style={{ color: accent }}>{ars(price)}</span>
      </div>
      <div className="sticky-actions">
        <WhatsAppDropdown
          message={waText}
          buttonText="Consultar"
          className="sticky-wa"
        />
        <button className="sticky-cta" style={{ background: accent }} onClick={onChooseDesign}>
          Elegí tu diseño →
        </button>
      </div>
    </div>
  )
}
