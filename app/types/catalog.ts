export interface CloudinarySubfolder {
  name: string
  path: string
  /** public_id de Cloudinary para `CldImage`. Preferir siempre esto sobre una URL cruda. */
  thumbnailId: string | null
}

export interface CloudinaryFolder {
  folderName: string
  title: string
  /** public_id de Cloudinary para `CldImage`. Preferir siempre esto sobre `thumbnailUrl`. */
  thumbnailId: string | null
  imageCount: number
  isCollection?: boolean
  subfolders?: CloudinarySubfolder[]
  featured?: boolean
  /** Fecha de creación de la carpeta en Cloudinary (ISO), vía `search_folders`. `null` si no se pudo determinar. */
  createdAt?: string | null
  /** true si la carpeta fue creada dentro de la ventana de "Nueva" (ver `NEW_FOLDER_DAYS`). */
  isNew?: boolean
}
