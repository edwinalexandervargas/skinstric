import type { ButtonHTMLAttributes } from 'react'
import { DiamondArrow } from './icons'

interface DiamondButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  /** Which way the arrow points. The label sits on the far side of the arrow. */
  direction: 'left' | 'right'
  light?: boolean
}

/** The "◀ BACK" / "PROCEED ▶" buttons used at the bottom of most screens. */
export function DiamondButton({
  label,
  direction,
  light = false,
  className = '',
  ...buttonProps
}: DiamondButtonProps) {
  const arrow = (
    <DiamondArrow
      className={`size-11 shrink-0 transition-transform duration-300 group-hover:scale-110 ${direction === 'right' ? 'rotate-180' : ''}`}
    />
  )
  return (
    <button
      type="button"
      {...buttonProps}
      className={`group text-body flex items-center gap-4 leading-4 font-semibold uppercase disabled:opacity-30 ${light ? 'text-paper' : 'text-ink'} ${className}`}
    >
      {direction === 'left' && arrow}
      <span>{label}</span>
      {direction === 'right' && arrow}
    </button>
  )
}
