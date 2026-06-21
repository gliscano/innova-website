import { Camera, Palette, Sparkles, Wand2, Brush, Layers } from "lucide-react"

export interface ContentSet {
  title: string
  highlight: string
  subtitle: string
  description: string
  buttonText: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
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
    title: "Tu backdrop",
    highlight: "personalizado",
    subtitle: "en dos semanas.",
    description: "Alta definición · Impresión RGB real.",
    buttonText: "Inspirarme con diseños",
    secondaryButtonText: "Quiero entrega inmediata",
    secondaryButtonUrl: "https://store.innova54.com",
    stats: [
      { value: "+4.5k", label: "Diseños" },
      { value: "+50", label: "Estilos" },
      { value: "5.0", label: "85 Reseñas" },
    ],
    gradientFrom: "from-amber-500",
    gradientVia: "via-orange-400",
    gradientTo: "to-rose-400",
  }
]

// Image sets for iterations
export const imageSets: ImageSet[][] = [
  // Set 1
  [
    { src: "/images/innova/hero/futb-03.png", alt: "", icon: Camera, column: 1, height: "h-72" },
    { src: "/images/innova/hero/02.webp", alt:"", icon: Sparkles, column: 1, height: "h-64" },
    { src: "/images/innova/hero/futb-06.png", alt:"", icon: Palette, column: 1, height: "h-56" },
    { src: "/images/innova/hero/futb-07.png", alt:"", icon: Wand2, column: 2, height: "h-64" },
    { src: "/images/innova/hero/05.webp", alt: "", icon: Layers, column: 2, height: "h-56" },
    { src: "/images/innova/hero/futb-01.png", alt:"", icon: Brush, column: 2, height: "h-52" },
    { src: "/images/innova/hero/futb-04.png", alt:"", icon: Palette, column: 3, height: "h-64" },
    { src: "/images/innova/hero/futb-05.png", alt:"", icon: Sparkles, column: 3, height: "h-52" },
    { src: "/images/innova/hero/09.webp", alt: "", icon: Camera, column: 3, height: "h-64" },
  ]
]
