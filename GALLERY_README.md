# Componente de Galería de Imágenes con Next-Cloudinary

## Descripción
Componente reutilizable de galería de imágenes que se integra con Cloudinary, permitiendo búsqueda por parámetros y visualización en modal.

## Características

### ✅ Funcionalidades Implementadas
- **Búsqueda por parámetros**: `searchTerm`, `tags`, `folder`, `collection`
- **Carga infinita**: Scroll automático con 20 imágenes por página
- **Modal responsive**: Navegación circular anterior/siguiente, fullscreen en mobile
- **Grid responsive**: 2 columnas mobile, 4 columnas desktop
- **Lazy loading**: Con Intersection Observer para mejor performance
- **Skeleton loading**: Estados de carga visuales
- **Manejo de errores**: Con mensajes amigables y botón de reintento
- **Navegación por teclado**: ESC, flechas izquierda/derecha
- **Google Analytics**: Tracking de interacciones
- **TypeScript**: Type safety completo

### 🎨 Diseño y UX
- Diseño moderno y limpio con tonos claros
- Animaciones suaves con Framer Motion
- Responsive first mobile
- Optimizado para Core Web Vitals
- Estados de loading y error bien definidos

### 🔒 Seguridad
- Todas las llamadas a Cloudinary desde API routes
- No se exponen credenciales en el cliente
- Validación de parámetros en el servidor

## Instalación

### 1. Dependencias
```bash
npm install framer-motion
```

### 2. Variables de Entorno
Crear archivo `.env.local`:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Google Analytics
Asegúrate de que Google Analytics esté configurado en tu aplicación con un ID como `G-XXXXXXXXXX`.

## Uso

### Uso Básico
```tsx
import Gallery from '../components/gallery/Gallery'

export default function MyPage() {
  return (
    <Gallery 
      searchTerm="backdrop"
      itemsPerPage={20}
    />
  )
}
```

### Uso Avanzado
```tsx
<Gallery 
  searchTerm="fotografía"
  tags={["infantil", "colorido"]}
  folder="backdrops"
  collection="navidad"
  itemsPerPage={30}
/>
```

## Parámetros del Componente

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `searchTerm` | `string` | ❌ | Término de búsqueda en nombres y contexto |
| `tags` | `string[]` | ❌ | Array de tags para filtrar |
| `folder` | `string` | ❌ | Carpeta específica en Cloudinary |
| `collection` | `string` | ❌ | Colección personalizada |
| `itemsPerPage` | `number` | ❌ | Imágenes por página (default: 20) |

## Estructura de Archivos

```
app/
├── components/
│   └── gallery/
│       ├── Gallery.tsx          # Componente principal
│       ├── GalleryGrid.tsx      # Grid con carga infinita
│       ├── GalleryItem.tsx      # Item individual
│       ├── GalleryModal.tsx     # Modal de visualización
│       ├── GallerySkeleton.tsx  # Skeleton loading
│       └── GalleryError.tsx     # Estados de error
├── hooks/
│   ├── useGalleryImages.ts      # Lógica de carga infinita
│   └── useGalleryModal.ts      # Estado del modal
├── types/
│   └── gallery.d.ts            # Tipos TypeScript
└── api/
    └── cloudinary/
        └── search/
            └── route.ts         # Endpoint de búsqueda
```

## API Endpoints

### POST `/api/cloudinary/search`
Endpoint para buscar imágenes en Cloudinary.

**Body:**
```json
{
  "searchTerm": "backdrop",
  "tags": ["fotografía", "diseño"],
  "folder": "backdrops",
  "collection": "navidad",
  "nextCursor": "cursor_string",
  "maxResults": 20
}
```

**Response:**
```json
{
  "images": [
    {
      "id": "public_id",
      "url": "secure_url",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "createdAt": "2025-01-01T00:00:00Z",
      "tags": ["tag1", "tag2"],
      "folder": "backdrops",
      "collection": "navidad"
    }
  ],
  "nextCursor": "next_cursor_string",
  "totalCount": 150,
  "hasMore": true
}
```

## Eventos de Google Analytics

El componente trackea automáticamente:

- **`gallery_search`**: Búsquedas realizadas
- **`gallery_modal_open`**: Apertura del modal
- **`gallery_modal_close`**: Cierre del modal
- **`gallery_navigation`**: Navegación en el modal
- **`gallery_image_click`**: Clic en imágenes
- **`exception`**: Errores de búsqueda

## Personalización

### Estilos
Los estilos están basados en Tailwind CSS y pueden ser personalizados modificando las clases.

### Animaciones
Las animaciones usan Framer Motion y pueden ser ajustadas en cada componente.

### Performance
- Lazy loading automático con Intersection Observer
- Prioridad de carga para las primeras 8 imágenes
- Virtualización básica para listas grandes
- Debounce en búsquedas

## Troubleshooting

### Error: "Error al buscar imágenes"
- Verificar credenciales de Cloudinary
- Revisar logs del servidor
- Confirmar que la API de Cloudinary esté funcionando

### Imágenes no cargan
- Verificar que las imágenes existan en Cloudinary
- Confirmar permisos de acceso
- Revisar la expresión de búsqueda

### Modal no funciona
- Verificar que Framer Motion esté instalado
- Confirmar que no haya conflictos de z-index
- Revisar la consola del navegador

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

Este componente está bajo la misma licencia que el proyecto principal.
