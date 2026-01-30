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

export const contentSets: ContentSet[] = [
  {
    title: "Creatividad sin límites",
    highlight: "Diseño y Tecnología",
    subtitle: "que elevan tus producciones",
    description: "Fondos fotográficos y Diseños digitales creados para inspirar.",
    buttonText: "Ver Diseños",
    stats: [
      { value: "50+", label: "Estilos artísticos" },
      { value: "10K+", label: "Diseños disponibles" },
      { value: "RGB", label: "Colores verdaderos" },
    ],
    gradientFrom: "from-blue-500",
    gradientVia: "via-teal-500 ",
    gradientTo: "to-teal-700",
  }
]

// Image sets for iterations
export const imageSets: ImageSet[][] = [
  // Set 1
  [
    { src: "/images/innova/hero/01.webp", alt: "", icon: Camera, column: 1, height: "h-72" },
    { src: "/images/innova/hero/02.webp", alt:"", icon: Sparkles, column: 1, height: "h-64" },
    { src: "/images/innova/hero/03.webp", alt:"", icon: Palette, column: 1, height: "h-56" },
    { src: "/images/innova/hero/04.webp", alt:"", icon: Wand2, column: 2, height: "h-64" },
    { src: "/images/innova/hero/05.webp", alt: "", icon: Layers, column: 2, height: "h-56" },
    { src: "/images/innova/hero/06.webp", alt:"", icon: Brush, column: 2, height: "h-52" },
    { src: "/images/innova/hero/07.webp", alt:"", icon: Palette, column: 3, height: "h-56" },
    { src: "/images/innova/hero/08.webp", alt:"", icon: Sparkles, column: 3, height: "h-52" },
    { src: "/images/innova/hero/09.webp", alt: "", icon: Camera, column: 3, height: "h-64" },
  ]
]
