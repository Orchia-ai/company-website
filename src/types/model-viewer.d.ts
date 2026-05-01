import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string
    'ios-src'?: string
    alt?: string
    ar?: boolean | ''
    'ar-modes'?: string
    'ar-scale'?: string
    'ar-placement'?: string
    'auto-rotate'?: boolean | ''
    'camera-controls'?: boolean | ''
    'shadow-intensity'?: string | number
    'environment-image'?: string
    exposure?: string | number
    poster?: string
    reveal?: string
    loading?: string
    'interaction-prompt'?: string
    'interaction-prompt-style'?: string
    'touch-action'?: string
  },
  HTMLElement
>

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}

export {}
