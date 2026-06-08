export interface CloudinarySubfolder {
  name: string
  path: string
  thumbnailUrl: string | null
}

export interface CloudinaryFolder {
  folderName: string
  title: string
  thumbnailUrl: string | null
  imageCount: number
  isCollection?: boolean
  subfolders?: CloudinarySubfolder[]
  featured?: boolean
}
