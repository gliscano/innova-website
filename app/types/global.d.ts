declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set' | 'js',
      targetIdOrEventName: string,
      config?: {
        event_category?: string
        event_label?: string
        value?: number | string
        description?: string
        fatal?: boolean
        [key: string]: unknown
      }
    ) => void
    fbq: (
      command: 'init' | 'track' | 'trackCustom',
      eventNameOrPixelId: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export {}
