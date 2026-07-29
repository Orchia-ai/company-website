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

// Longhands rather than the `inset` shorthand, matching byte-for-byte what
// `next/image` applies for `fill` — the film's CSS was authored against these.
const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
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
