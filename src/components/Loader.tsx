import type { ReactNode } from 'react'
import { Diamonds } from './Diamonds'

/** Full-screen loading state: spinning dotted squares with a line of text in the middle. */
export function Loader({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      <Diamonds size="min(560px, 88vw)" spin />
      <div className="animate-fade-in relative z-10 flex flex-col items-center gap-6 text-center">
        {children}
        <p className="text-label animate-pulse font-semibold uppercase">{text}</p>
      </div>
    </div>
  )
}

/** "To get better results make sure to have ◇ neutral expression ◇ frontal pose ◇ adequate lighting" */
export function PhotoTips({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`text-body flex flex-col items-center gap-4 text-center uppercase ${light ? 'text-paper' : 'text-ink'}`}
    >
      <p>To get better results make sure to have</p>
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {['Neutral expression', 'Frontal pose', 'Adequate lighting'].map((tip) => (
          <li key={tip} className="flex items-center gap-2">
            <span className="size-2 rotate-45 border border-current" aria-hidden="true" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
