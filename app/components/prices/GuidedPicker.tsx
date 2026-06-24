'use client'

import Proportion from './Proportion'
import { FAMILIES, FINISH_LABEL, ars, dimLabel } from '@/app/data/pricesData'
import type { Sel, Family, FamilyItem, Finish } from './types'

export default function GuidedPicker({
  sel,
  setSel,
  accent,
  onSelect,
  onChooseDesign,
}: {
  sel: Sel
  setSel: (s: Sel) => void
  accent: string
  onSelect: (family: Family, item: FamilyItem, finish: Finish) => void
  onChooseDesign: () => void
}) {
  const family = FAMILIES.find(f => f.id === sel.familyId) ?? FAMILIES[0]
  const item = sel.largoIndex != null ? family.largos[sel.largoIndex] : null
  const finish = sel.finish

  function pickFamily(id: string) {
    const f = FAMILIES.find(x => x.id === id)!
    setSel({ familyId: id, largoIndex: null, finish: f.finishes.includes(finish) ? finish : f.finishes[0] })
  }

  function pickRow(i: number) {
    const lg = family.largos[i]
    const f: Finish = family.finishes[0] === 'unico' ? 'unico' : finish
    setSel({ ...sel, largoIndex: i, finish: f })
    onSelect(family, lg, f)
  }

  const price = item
    ? (family.finishes[0] === 'unico' ? item.unico! : (item[finish] ?? 0))
    : null

  const anchoVal = family.ancho ?? (item?.ancho ?? 1.5)

  return (
    <div className="picker">
      {/* Paso 1: tipo */}
      <div className="pk-step">
        <div className="pk-label"><span className="pk-num">1</span> ¿Qué tipo de fondo buscas?</div>
        <div className="tipo-grid">
          {FAMILIES.map(f => {
            const tipAncho = f.ancho ?? (f.id === 'piso' ? 3 : 1.5)
            const tipLargo = f.ancho != null ? 3 : 1.5
            const isOn = f.id === sel.familyId
            return (
              <button
                key={f.id}
                className={'tipo-card' + (isOn ? ' on' : '')}
                onClick={() => pickFamily(f.id)}
                style={isOn ? { borderColor: accent } : undefined}
              >
                <Proportion
                  ancho={tipAncho}
                  largo={tipLargo}
                  max={64}
                  accent={isOn ? accent : 'var(--line-strong)'}
                />
                <div className="tipo-name">{f.nombre}</div>
                <div className="tipo-eye">{f.eyebrow}</div>
              </button>
            )
          })}
        </div>
        <p className="pk-desc">{family.desc}</p>
      </div>

      {/* Paso 2: tabla de medidas */}
      <div className="pk-step">
        <div className="pk-step-row">
          <div className="pk-label"><span className="pk-num">2</span> Elegí la medida</div>
          {family.finishes[0] !== 'unico' && (
            <div className="finish-row">
              <span className="finish-cap">Mostrar precio de</span>
              <div className="seg">
                {(family.finishes as Finish[]).map(fk => (
                  <button
                    key={fk}
                    className={'seg-btn' + (fk === finish ? ' on' : '')}
                    onClick={() => setSel({ ...sel, finish: fk })}
                    style={fk === finish ? { background: accent } : undefined}
                  >
                    {FINISH_LABEL[fk]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="pk-tbl">
          <div className="pk-tbl-head">
            <span>Dimensiones</span>
            <span>Área total</span>
            <span className="pk-th-price">Precio</span>
            <span></span>
          </div>
          {family.largos.map((lg, i) => {
            const isOn = i === sel.largoIndex
            const unico = family.finishes[0] === 'unico'
            const rowPrice = unico ? lg.unico! : (lg[finish] ?? 0)
            return (
              <button
                key={i}
                className={'pk-trow' + (isOn ? ' on' : '')}
                style={isOn ? { borderLeftColor: accent } : undefined}
                onClick={() => pickRow(i)}
              >
                <span className="pk-td-dim">{dimLabel(family, lg)}</span>
                <span className="pk-td-area">
                  {lg.area} m²
                  {lg.detalle && <span className="pk-detalle">{lg.detalle}</span>}
                </span>
                <span className="pk-td-price" style={isOn ? { color: accent } : undefined}>
                  {ars(rowPrice)}
                </span>
                <span
                  className={'pk-td-sel' + (isOn ? ' on' : '')}
                  style={isOn ? { background: accent, color: '#fff', borderColor: accent } : undefined}
                >
                  {isOn ? 'Elegido ✓' : 'Elegir'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Resultado */}
      <div className="result">
        {!item ? (
          <div className="result-empty">Seleccioná una medida para ver el precio.</div>
        ) : (
          <>
            <Proportion ancho={anchoVal} largo={item.largo} max={112} accent={accent} />
            <div className="result-body">
              <div className="result-dim">{dimLabel(family, item)}</div>
              <div className="result-meta">
                Área total {item.area} m²
                {family.finishes[0] !== 'unico' && <span> · {FINISH_LABEL[finish]}</span>}
                {item.detalle && <span className="result-detalle">{item.detalle}</span>}
              </div>
            </div>
            <div className="result-price">
              <span className="result-price-cap">Precio</span>
              <span className="result-price-num" style={{ color: accent }}>{ars(price!)}</span>
            </div>
            <button className="result-cta" style={{ background: accent }} onClick={onChooseDesign}>
              Elegí un diseño para esta medida →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
