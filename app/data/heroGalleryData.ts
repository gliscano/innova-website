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
    title: "Creatividad sin límites:",
    highlight: "Diseño y Tecnología",
    subtitle: "que elevan tus producciones",
    description: "Fondos fotográficos y diseños digitales en alta definición, pensados para inspirar y destacar.",
    buttonText: "Quiero ver los diseños!",
    stats: [
      { value: "50+", label: "Estilos artísticos" },
      { value: "3K+", label: "Diseños disponibles" },
      { value: "300dpi", label: "Alta definición" },
    ],
    gradientFrom: "from-blue-400",
    gradientVia: "via-indigo-400",
    gradientTo: "to-blue-500",
  },
  {
    title: "Diseños digitales y",
    highlight: "Fondos fotográficos",
    subtitle: "creados para inspirar",
    description: "Escenografías para producciones y eventos en alta definición, desarrolladas con una mirada creativa.",
    buttonText: "Crear ahora",
    stats: [
      { value: "50+", label: "Estilos artísticos" },
      { value: "4K", label: "Resolución máxima" },
      { value: "< 10s", label: "Tiempo de generación" },
    ],
    gradientFrom: "from-purple-400",
    gradientVia: "via-pink-400",
    gradientTo: "to-rose-500",
  }
]

// Image sets for 2 iterations
export const imageSets: ImageSet[][] = [
  // Set 1
  [
    { src: "/images/innova/hero/set_01/01.png", alt: "Dunas del desierto", icon: Camera, column: 1, height: "h-48" },
    { src: "/images/innova/hero/set_01/02.png", alt: "Libélula iridiscente", icon: Sparkles, column: 1, height: "h-72" },
    { src: "/images/innova/hero/set_01/03.png", alt: "Esfera flotante", icon: Palette, column: 1, height: "h-56" },
    { src: "/images/innova/hero/set_01/04.png", alt: "Retrato holográfico", icon: Wand2, column: 2, height: "h-64" },
    { src: "/images/innova/hero/set_01/05.png", alt: "Zapatilla de cristal", icon: Layers, column: 2, height: "h-56" },
    { src: "/images/innova/hero/set_01/06.png", alt: "Formas orgánicas", icon: Brush, column: 2, height: "h-52" },
    { src: "/images/innova/hero/set_01/07.jpg", alt: "Hojas abstractas", icon: Palette, column: 3, height: "h-44" },
    { src: "/images/innova/hero/set_01/08.png", alt: "Pétalos flotantes", icon: Sparkles, column: 3, height: "h-52" },
    { src: "/images/innova/hero/set_01/09.png", alt: "Paisaje de nubes", icon: Camera, column: 3, height: "h-64" },
    { src: "/images/innova/hero/neon-city.jpg", alt: "Ciudad neón", icon: Zap, column: 1, height: "h-52" },
    { src: "/images/innova/hero/crystal-butterfly.jpg", alt: "Mariposa de cristal", icon: Sparkles, column: 1, height: "h-64" },
    { src: "/images/innova/hero/liquid-chrome.jpg", alt: "Metal líquido", icon: Layers, column: 1, height: "h-56" },
    { src: "/images/innova/hero/cosmic-eye.jpg", alt: "Ojo cósmico", icon: Star, column: 2, height: "h-56" },
    { src: "/images/innova/hero/floating-bonsai.jpg", alt: "Bonsái flotante", icon: Palette, column: 2, height: "h-68" },
    { src: "/images/innova/hero/aurora-mountains.jpg", alt: "Aurora boreal", icon: Camera, column: 2, height: "h-48" },
    { src: "/images/innova/hero/robot-portrait.jpg", alt: "Retrato robot", icon: Wand2, column: 3, height: "h-60" },
    { src: "/images/innova/hero/neon-jellyfish.jpg", alt: "Medusa neón", icon: Sparkles, column: 3, height: "h-52" },
    { src: "/images/innova/hero/origami-bird.jpg", alt: "Origami", icon: Brush, column: 3, height: "h-48" },
  ]
]
