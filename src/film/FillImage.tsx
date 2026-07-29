import type { CSSProperties } from 'react'

/**
 * Drop-in stand-in for `next/image` so the ported film can keep its original
 * JSX. The film only ever uses `unoptimized`-style raw sources, so this is a
 * plain <img> plus the layout rules `next/image` applies for `fill`.
 */
type FillImageProps = {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  /* Accepted and ignored — meaningful only to the Next.js optimizer. */
  sizes?: string
  priority?: boolean
  unoptimized?: boolean
  className?: string
  style?: CSSProperties
}

const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  color: 'transparent',
}

export default function FillImage({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  className,
  style,
}: FillImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      style={fill ? { ...FILL_STYLE, ...style } : style}
    />
  )
}
