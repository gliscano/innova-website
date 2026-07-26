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
}
