'use client'

interface SignedUrlParams {
  publicId: string
  width?: number | string
  height?: number | string
  format?: string
  quality?: string
  crop?: string
  gravity?: string
  transformations?: any
}

/**
 * Utilidad para obtener URLs firmadas de Cloudinary en desarrollo
 * Esto evita el error 401 cuando Cloudinary tiene "Allowed strict referral domains" configurado
 */
export async function getSignedCloudinaryUrl(
  params: SignedUrlParams
): Promise<string | null> {
  // Solo usar signed URLs en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  try {
    const urlParams = new URLSearchParams({ publicId: params.publicId })
    
    if (params.width) urlParams.set('width', String(params.width))
    if (params.height) urlParams.set('height', String(params.height))
    if (params.format) urlParams.set('format', params.format)
    if (params.quality) urlParams.set('quality', params.quality)
    if (params.crop) urlParams.set('crop', params.crop)
    if (params.gravity) urlParams.set('gravity', params.gravity)
    if (params.transformations) {
      urlParams.set('transformations', JSON.stringify(params.transformations))
    }

    const response = await fetch(`/api/cloudinary/signed-url?${urlParams.toString()}`)
    
    if (!response.ok) {
      console.warn('No se pudo obtener URL firmada, usando URL normal')
      return null
    }

    const data = await response.json()
    return data.url || null
  } catch (error) {
    console.warn('Error obteniendo URL firmada:', error)
    return null
  }
}

