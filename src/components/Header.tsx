import { Link } from 'react-router-dom'

interface HeaderProps {
  /** The word in the brackets next to the logo. */
  section?: 'INTRO' | 'ANALYSIS'
  /** Shows the "Enter code" button (landing page only). */
  showCode?: boolean
  /** Light text, for the screens over the camera feed. */
  light?: boolean
}

export function Header({
  section = 'INTRO',
  showCode = false,
  light = false,
}: HeaderProps) {
  return (
    <header
      className={`relative z-20 flex h-16 items-center justify-between px-4 sm:px-8 ${light ? 'text-paper' : 'text-ink'}`}
    >
      <div className="text-body flex items-center gap-4 leading-4 font-semibold tracking-[-0.02em] uppercase">
        <Link to="/" className="hover:opacity-60">
          Skinstric
        </Link>
        <span
          className={`flex items-center gap-1.5 font-normal ${light ? 'text-paper/70' : 'text-muted'}`}
        >
          <span aria-hidden="true">[</span>
          {section}
          <span aria-hidden="true">]</span>
        </span>
      </div>
      {showCode && (
        <button
          type="button"
          className="bg-ink text-tiny text-paper px-4 py-2 font-semibold uppercase hover:opacity-80"
        >
          Enter code
        </button>
      )}
    </header>
  )
}
