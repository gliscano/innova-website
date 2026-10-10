declare namespace NodeJS {
  interface ProcessEnv {
    CLOUDINARY_CLOUD_NAME?: string
    CLOUDINARY_API_KEY?: string
    CLOUDINARY_API_SECRET?: string
    NEXT_PUBLIC_GA_ID?: string
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string
    MAILCHIMP_API_KEY?: string
    MAILCHIMP_AUDIENCE_ID?: string
    MAILCHIMP_SERVER_PREFIX?: string
    GOOGLE_PLACES_API_KEY?: string
    GOOGLE_PLACE_ID?: string
    /** Cuenta de servicio con acceso de editor a la planilla de pedidos. */
    GOOGLE_SA_EMAIL?: string
    GOOGLE_SA_PRIVATE_KEY?: string
    GOOGLE_SHEET_ID?: string
    /** Datos para transferir, que el cliente ve al completar el pedido. */
    TRANSFER_TITULAR?: string
    TRANSFER_BANCO?: string
    TRANSFER_CBU?: string
    TRANSFER_ALIAS?: string
    /** `1` en desarrollo muestra pedidos de ejemplo en /pedido sin credenciales de Google. */
    ORDERS_MOCK?: string
  }
}
