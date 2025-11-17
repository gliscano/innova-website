declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set' | 'js',
      targetId: string,
      config?: {
        event_category?: string
        event_label?: string
        value?: number | string
        description?: string
        fatal?: boolean
        [key: string]: unknown
      }
    ) => void
  }
}

export {}
