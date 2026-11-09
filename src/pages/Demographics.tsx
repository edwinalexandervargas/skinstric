import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { DiamondButton } from '@/components/DiamondButton'
import { Header } from '@/components/Header'
import { formatPercent, sortByConfidence } from '@/lib/demographics'
import { titleCase } from '@/lib/format'
import { CATEGORIES, type Category } from '@/lib/types'
import { selectedLabel, useSkinstric } from '@/store/useSkinstric'

const CATEGORY_NAMES: Record<Category, string> = {
  race: 'Race',
  age: 'Age',
  gender: 'Sex',
}

/** Screens 013 and 014. */
export function Demographics() {
  const navigate = useNavigate()
  const results = useSkinstric((s) => s.results)
  const picks = useSkinstric((s) => s.picks)
  const pick = useSkinstric((s) => s.pick)
  const resetPicks = useSkinstric((s) => s.resetPicks)
  const [active, setActive] = useState<Category>('race')

  if (!results) return <Navigate to="/result" replace />

  const rows = sortByConfidence(results[active])
  const chosen = selectedLabel(results, picks, active)
  const chosenScore = results[active][chosen] ?? 0
  const chosenText = active === 'age' ? `${chosen} y.o.` : titleCase(chosen)

  return (
    <div className="flex min-h-dvh flex-col">
      <Header section="ANALYSIS" />

      <div className="px-4 pt-4 sm:px-8">
        <p className="text-label font-semibold uppercase">A. I. Analysis</p>
        <h1 className="mt-2 text-[clamp(2.25rem,9vw,4.5rem)] leading-[0.89] tracking-[-0.06em] uppercase">
          Demographics
        </h1>
        <p className="text-body mt-2 uppercase">Predicted race &amp; age</p>
      </div>

      <main className="grid flex-1 gap-4 px-4 pt-8 pb-6 sm:px-8 lg:grid-cols-[minmax(160px,190px)_1fr_minmax(300px,448px)] lg:pt-10">
        {/* Left: the three categories with the current answer for each. */}
        <nav
          aria-label="Categories"
          className="grid grid-cols-3 gap-2 lg:flex lg:flex-col"
        >
          {CATEGORIES.map((category) => {
            const isActive = category === active
            const label = selectedLabel(results, picks, category)
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={isActive}
                className={`border-ink text-label flex min-h-24 flex-col justify-between border-t p-3 text-left font-semibold uppercase transition-colors ${
                  isActive ? 'bg-ink text-paper' : 'bg-panel hover:bg-hover'
                }`}
              >
                <span className="break-words">{titleCase(label)}</span>
                <span>{CATEGORY_NAMES[category]}</span>
              </button>
            )
          })}
        </nav>

        {/* Middle: the chosen answer and its confidence ring. */}
        <section className="border-ink bg-panel relative flex min-h-80 flex-col justify-between border-t p-4 lg:min-h-[544px]">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-none tracking-[-0.05em]">
            {chosenText}
          </h2>
          <ConfidenceRing value={chosenScore} />
        </section>

        {/* Right: every option, highest score first. Clicking one corrects the A.I. */}
        <section className="border-ink bg-panel border-t">
          <div className="text-label flex justify-between px-4 py-3 font-semibold uppercase">
            <span>{CATEGORY_NAMES[active]}</span>
            <span>A. I. Confidence</span>
          </div>
          <ul>
            {rows.map((row) => {
              const isChosen = row.label === chosen
              return (
                <li key={row.label}>
                  <button
                    type="button"
                    onClick={() => pick(active, row.label)}
                    aria-pressed={isChosen}
                    className={`text-label flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isChosen ? 'bg-ink text-paper' : 'hover:bg-hover'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2 shrink-0 rotate-45 border border-current ${isChosen ? 'bg-current' : ''}`}
                    />
                    <span className="flex-1">{titleCase(row.label)}</span>
                    <span className="tabular-nums">{formatPercent(row.value)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <footer className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 pb-8 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
        <DiamondButton
          label="Back"
          direction="left"
          onClick={() => navigate('/select')}
        />
        <p className="text-body text-muted order-last col-span-2 text-center md:order-none md:col-span-1">
          If A.I. estimate is wrong, select the correct one.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={resetPicks}
            className="border-ink text-tiny hover:bg-hover border px-4 py-2 font-semibold uppercase"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigate('/select')}
            className="bg-ink text-tiny text-paper px-4 py-2 font-semibold uppercase hover:opacity-80"
          >
            Confirm
          </button>
        </div>
      </footer>
    </div>
  )
}

/** The big circle: a full ring is 100%. */
function ConfidenceRing({ value }: { value: number }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative ml-auto aspect-square w-[min(384px,100%)] max-w-[70vw] self-end">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-hover)"
          strokeWidth="0.6"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="0.8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.05em]">
        {Math.round(value * 100)}
        <sup className="text-[0.6em]">%</sup>
      </p>
    </div>
  )
}
