import { Camera, Palette, Sparkles, Wand2, Brush, Zap, Star, Layers, Globe } from "lucide-react"

export interface ContentSet {
  title: string
  highlight: string
  subtitle: string
  description: string
  buttonText: string
  stats: Array<{ value: string; label: string }>
  gradientFrom: string
  gradientVia: string
  gradientTo: string
}

export interface ImageSet {
  src: string
  alt: string
  icon: React.ComponentType<{ className?: string }>
  column: number
  height: string
}

// Content sets for 3 iterations
export const contentSets: ContentSet[] = [
  {
    title: "Galería Creativa:",
    highlight: "tu espacio visual",
    subtitle: "impulsado por IA",
    description: "Explora imágenes, videos, y diseños creados con los mejores modelos de IA. Una experiencia visual única y dinámica.",
    buttonText: "Explorar ahora",
    stats: [
      { value: "10M+", label: "Imágenes creadas" },
      { value: "500K+", label: "Creadores activos" },
      { value: "99%", label: "Satisfacción" },
    ],
    gradientFrom: "from-blue-400",
    gradientVia: "via-indigo-400",
    gradientTo: "to-blue-500",
  },
  {
    title: "Imaginación Sin:",
    highlight: "límites creativos",
    subtitle: "con tecnología IA",
    description: "Transforma tus ideas en arte visual impresionante. Genera imágenes únicas con solo describir lo que imaginas.",
    buttonText: "Crear ahora",
    stats: [
      { value: "50+", label: "Estilos artísticos" },
      { value: "4K", label: "Resolución máxima" },
      { value: "< 10s", label: "Tiempo de generación" },
    ],
    gradientFrom: "from-purple-400",
    gradientVia: "via-pink-400",
    gradientTo: "to-rose-500",
  },
  {
    title: "El Futuro del:",
    highlight: "diseño digital",
    subtitle: "está aquí",
    description: "Únete a millones de artistas y diseñadores que ya están creando el futuro del contenido visual con inteligencia artificial.",
    buttonText: "Comenzar gratis",
    stats: [
      { value: "200+", label: "Países activos" },
      { value: "24/7", label: "Disponibilidad" },
      { value: "100%", label: "Seguro" },
    ],
    gradientFrom: "from-emerald-400",
    gradientVia: "via-teal-400",
    gradientTo: "to-cyan-500",
  },
]

// Image sets for 3 iterations
export const imageSets: ImageSet[][] = [
  // Set 1
  [
    { src: "/images/innova/hero/desert-dunes.jpg", alt: "Dunas del desierto", icon: Camera, column: 1, height: "h-48" },
    { src: "/images/innova/hero/dragonfly-macro.jpg", alt: "Libélula iridiscente", icon: Sparkles, column: 1, height: "h-72" },
    { src: "/images/innova/hero/hand-sphere.jpg", alt: "Esfera flotante", icon: Palette, column: 1, height: "h-56" },
    { src: "/images/innova/hero/portrait-holographic.jpg", alt: "Retrato holográfico", icon: Wand2, column: 2, height: "h-64" },
    { src: "/images/innova/hero/glass-sneaker.jpg", alt: "Zapatilla de cristal", icon: Layers, column: 2, height: "h-56" },
    { src: "/images/innova/hero/organic-swirl.jpg", alt: "Formas orgánicas", icon: Brush, column: 2, height: "h-52" },
    { src: "/images/innova/hero/abstract-leaves.jpg", alt: "Hojas abstractas", icon: Palette, column: 3, height: "h-44" },
    { src: "/images/innova/hero/abstract-petals.jpg", alt: "Pétalos flotantes", icon: Sparkles, column: 3, height: "h-52" },
    { src: "/images/innova/hero/cloud-dream.jpg", alt: "Paisaje de nubes", icon: Camera, column: 3, height: "h-64" },
  ],
  // Set 2
  [
    { src: "/images/innova/hero/neon-city.jpg", alt: "Ciudad neón", icon: Zap, column: 1, height: "h-52" },
    { src: "/images/innova/hero/crystal-butterfly.jpg", alt: "Mariposa de cristal", icon: Sparkles, column: 1, height: "h-64" },
    { src: "/images/innova/hero/liquid-chrome.jpg", alt: "Metal líquido", icon: Layers, column: 1, height: "h-56" },
    { src: "/images/innova/hero/cosmic-eye.jpg", alt: "Ojo cósmico", icon: Star, column: 2, height: "h-56" },
    { src: "/images/innova/hero/floating-bonsai.jpg", alt: "Bonsái flotante", icon: Palette, column: 2, height: "h-68" },
    { src: "/images/innova/hero/aurora-mountains.jpg", alt: "Aurora boreal", icon: Camera, column: 2, height: "h-48" },
    { src: "/images/innova/hero/robot-portrait.jpg", alt: "Retrato robot", icon: Wand2, column: 3, height: "h-60" },
    { src: "/images/innova/hero/neon-jellyfish.jpg", alt: "Medusa neón", icon: Sparkles, column: 3, height: "h-52" },
    { src: "/images/innova/hero/origami-bird.jpg", alt: "Origami", icon: Brush, column: 3, height: "h-48" },
  ],
  // Set 3
  [
    { src: "/images/innova/hero/cosmic-eye.jpg", alt: "Ojo cósmico", icon: Globe, column: 1, height: "h-56" },
    { src: "/images/innova/hero/aurora-mountains.jpg", alt: "Aurora boreal", icon: Camera, column: 1, height: "h-64" },
    { src: "/images/innova/hero/crystal-butterfly.jpg", alt: "Mariposa mágica", icon: Sparkles, column: 1, height: "h-52" },
    { src: "/images/innova/hero/neon-jellyfish.jpg", alt: "Medusa luminosa", icon: Star, column: 2, height: "h-60" },
    { src: "/images/innova/hero/portrait-holographic.jpg", alt: "Arte digital", icon: Wand2, column: 2, height: "h-56" },
    { src: "/images/innova/hero/floating-bonsai.jpg", alt: "Naturaleza zen", icon: Palette, column: 2, height: "h-56" },
    { src: "/images/innova/hero/liquid-chrome.jpg", alt: "Escultura 3D", icon: Layers, column: 3, height: "h-52" },
    { src: "/images/innova/hero/neon-city.jpg", alt: "Futuro urbano", icon: Zap, column: 3, height: "h-56" },
    { src: "/images/innova/hero/robot-portrait.jpg", alt: "IA humanizada", icon: Brush, column: 3, height: "h-52" },
  ],
]
