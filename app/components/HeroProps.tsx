import Image from 'next/image'
import { Leaf, Camera, Heart } from 'lucide-react'

const features = [
  { icon: Leaf,   label: 'Texturas\nsuaves' },
  { icon: Camera, label: 'Ideales para\nsesiones newborn' },
  { icon: Heart,  label: 'Tonos delicados\ncombinables' },
]

export default function HeroProps() {
  return (
    <section className="relative overflow-hidden min-h-[600px] sm:min-h-[680px]">
      <Image
        src="/images/innova/props/background-newborn.png"
        alt="Fondos y props para sesiones newborn"
        fill
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Overlay: transparente arriba (imagen visible) → opaco cálido abajo (texto legible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[35%] via-[#F0C9A0]/80 via-[60%] to-[#C19D83] to-[95%]" />

      {/* Contenido superpuesto en la parte inferior */}
      <div className="relative z-10 flex flex-col justify-end min-h-[600px] sm:min-h-[680px] px-6 pb-10 lg:px-12 lg:pb-14">

        <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold bg-amber-100 text-amber-800 self-start copperplate-bold-font">
          Línea Newborn
        </span>

        <h2 className="copperplate-bold-font text-3xl sm:text-4xl leading-tight text-[#4a3a2a] mb-3 max-w-sm">
          Crea composiciones llenas de ternura
        </h2>

        <hr className="w-12 border-0 border-t border-amber-800/40 my-3" />

        <p className="text-sm lg:text-base text-[#4a3a2a] leading-relaxed mb-6 max-w-sm">
          Props y Mini Friends para sesiones newborn.
        </p>

        <div className="flex gap-5 mb-7">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 rounded-full border border-amber-800/40 bg-white/30 backdrop-blur-sm flex items-center justify-center text-amber-800">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-center text-[#4a3a2a] max-w-[72px] leading-tight whitespace-pre-line">
                {label}
              </span>
            </div>
          ))}
        </div>

        <a
          href="https://innova54store.empretienda.com.ar/linea-new-born"
          target="_self"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 self-start"
        >
          Ver accesorios newborn →
        </a>

      </div>
    </section>
  )
}
