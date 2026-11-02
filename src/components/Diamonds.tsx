import type { CSSProperties } from 'react'

interface DiamondsProps {
  /**
   * Width of the outer diamond point to point (what Figma reports for the rotated shape).
   * The two inner diamonds are scaled from it. Any CSS length, e.g. 'min(762px, 90vw)'.
   */
  size?: string
  /** Slowly rotate (the loading screens). */
  spin?: boolean
  className?: string
}

/** Three dotted squares turned 45 degrees, centred in their parent (which needs `relative`). */
export function Diamonds({
  size = 'min(762px, 92vw)',
  spin = false,
  className = '',
}: DiamondsProps) {
  const rings = [
    { scale: 1, opacity: 0.25, animation: 'animate-spin-slow' },
    { scale: 0.895, opacity: 0.45, animation: 'animate-spin-mid' },
    { scale: 0.79, opacity: 0.8, animation: 'animate-spin-fast' },
  ]
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      {rings.map((ring) => (
        <div
          key={ring.scale}
          className={`diamond ${spin ? ring.animation : ''}`}
          style={
            {
              '--size': `calc(${size} * ${ring.scale} / 1.4142)`,
              opacity: ring.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
