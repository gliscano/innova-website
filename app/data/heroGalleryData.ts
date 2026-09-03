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
    title: "Tu fondo fotográfico",
    highlight: "personalizado",
    subtitle: "en dos semanas.",
    description: "Más de 4.500 diseños HD para fotógrafía y eventos",
    buttonText: "Catálogo de Diseños",
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
// El `alt` de cada imagen se usa dos veces: como texto alternativo y como caption visible en el
// hover de la card (ver GalleryCard). Estaban todos vacíos, así que las cards tampoco mostraban
// nada al pasar el mouse.
export const imageSets: ImageSet[][] = [
  // Set 1
  [
    { src: "/images/innova/hero/03.webp", alt: "Escenografía submarina en tonos pastel con caracolas y estrellas de mar", icon: Camera, column: 1, height: "h-36" },
    { src: "/images/innova/hero/02.webp", alt: "Fondo de textura pictórica en ocres envejecidos", icon: Sparkles, column: 1, height: "h-32" },
    { src: "/images/innova/hero/06.webp", alt: "Set temático de abejitas con panal, margaritas y globos amarillos", icon: Palette, column: 1, height: "h-28" },
    { src: "/images/innova/hero/07.webp", alt: "Telón de tela azul petróleo con piso de baldosas", icon: Wand2, column: 2, height: "h-32" },
    { src: "/images/innova/hero/05.webp", alt: "Fondo de textura pintada a mano en verde oliva", icon: Layers, column: 2, height: "h-28" },
    { src: "/images/innova/hero/01.webp", alt: "Arco de globos dorados y perlados con pampas sobre fondo negro", icon: Brush, column: 2, height: "h-[104px]" },
    { src: "/images/innova/hero/04.webp", alt: "Arco de globos plateados con cortina de flecos metálicos y bolas de espejos", icon: Palette, column: 3, height: "h-32" },
    { src: "/images/innova/hero/08.webp", alt: "Set primaveral de margaritas blancas y globos durazno", icon: Sparkles, column: 3, height: "h-[104px]" },
    { src: "/images/innova/hero/09.webp", alt: "Sesión de primer añito en un set rosa con globos y flores", icon: Camera, column: 3, height: "h-32" },
  ]
]
