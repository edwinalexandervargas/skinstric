import { Navigate, useNavigate } from 'react-router-dom'
import { DiamondButton } from '@/components/DiamondButton'
import { Diamonds } from '@/components/Diamonds'
import { Header } from '@/components/Header'
import { useSkinstric } from '@/store/useSkinstric'

/** Grid order (before the 45° turn): top, right, left, bottom. Only Demographics is in scope. */
const TILES = [
  { label: 'Demographics', to: '/demographics' },
  { label: 'Cosmetic concerns', to: null },
  { label: 'Skin type details', to: null },
  { label: 'Weather', to: null },
] as const

/** Screen 012: the four-diamond menu after the analysis. */
export function AnalysisMenu() {
  const navigate = useNavigate()
  const results = useSkinstric((s) => s.results)
  if (!results) return <Navigate to="/result" replace />

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Header section="ANALYSIS" />
      <div className="relative z-10 px-4 pt-4 sm:px-8">
        <h1 className="text-label font-semibold uppercase">A. I. Analysis</h1>
        <p className="text-body mt-2 max-w-[336px] uppercase">
          A. I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      <main className="relative flex flex-1 items-center justify-center py-16">
        <Diamonds size="min(762px, 120vw)" />
        <div
          className="relative z-10 grid rotate-45 grid-cols-2 gap-2"
          style={{ width: 'min(306px, 58vw)' }}
        >
          {TILES.map((tile) => (
            <button
              key={tile.label}
              type="button"
              disabled={!tile.to}
              onClick={() => tile.to && navigate(tile.to)}
              className={`aspect-square transition-colors ${
                tile.to ? 'bg-hover hover:bg-line' : 'bg-panel'
              }`}
              title={tile.to ? undefined : 'Not part of this project'}
            >
              <span className="block -rotate-45 px-2 text-[clamp(0.75rem,2.4vw,1rem)] leading-5 font-semibold tracking-[-0.02em] uppercase">
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </main>

      <footer className="relative z-10 flex items-center justify-between px-4 pb-8 sm:px-8">
        <DiamondButton
          label="Back"
          direction="left"
          onClick={() => navigate('/result')}
        />
        <DiamondButton
          label="Get summary"
          direction="right"
          disabled
          title="Not part of this project"
        />
      </footer>
    </div>
  )
}
