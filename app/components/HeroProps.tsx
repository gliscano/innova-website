import Image from 'next/image'
import { Leaf, Camera, Heart } from 'lucide-react'

const features = [
  { icon: Leaf,   label: 'Texturas\nsuaves' },
  { icon: Camera, label: 'Ideales para\nsesiones newborn' },
  { icon: Heart,  label: 'Tonos delicados\ncombinables' },
]

export default function HeroProps() {
  return (
    <section className="relative overflow-hidden min-h-[600px] sm:min-h-[680px] max-w-7xl mx-auto">
      <Image
        src="/images/innova/props/background-newborn.png"
        alt="Fondos y props para sesiones newborn"
        fill
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Overlay: transparente arriba → cream opaco abajo para legibilidad */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 35%, oklch(0.995 0.005 80 / 0.80) 60%, oklch(0.952 0.013 72) 95%)',
        }}
      />

      {/* Contenido en la parte inferior */}
      <div className="relative z-10 flex flex-col justify-end min-h-[600px] sm:min-h-[680px] px-6 pb-10 lg:px-12 lg:pb-14">

        <span
          className="inline-block mb-3 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold self-start copperplate-bold-font"
          style={{ background: 'var(--surface)', color: 'var(--accent)' }}
        >
          Línea Newborn
        </span>

        <h2 className="text-3xl sm:text-4xl leading-tight mb-3 max-w-sm" style={{ color: 'var(--ink)' }}>
          Crea composiciones llenas de ternura
        </h2>

        <hr className="w-12 border-0 border-t my-3" style={{ borderColor: 'color-mix(in oklab, var(--accent) 40%, transparent)' }} />

        <p className="text-sm lg:text-base leading-relaxed mb-6 max-w-sm" style={{ color: 'var(--ink)' }}>
          Props y Mini Friends para sesiones newborn.
        </p>

        <div className="flex gap-5 mb-7">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  border: 'color-mix(in oklab, var(--accent) 40%, transparent) 1px solid',
                  background: 'oklch(0.995 0.005 80 / 0.30)',
                  backdropFilter: 'blur(4px)',
                  color: 'var(--accent)',
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-center max-w-[72px] leading-tight whitespace-pre-line" style={{ color: 'var(--ink)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <a
          href="https://innova54store.empretienda.com.ar/linea-new-born"
          target="_self"
          rel="noopener noreferrer"
          className="btn-accent inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 self-start"
        >
          Ver accesorios newborn →
        </a>

      </div>
    </section>
  )
}
