declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    NEXT_PUBLIC_GA_ID?: string
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string
  }
}
