import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DiamondButton } from '@/components/DiamondButton'
import { Header } from '@/components/Header'

type Side = 'left' | 'right' | null

/** Screen 000/001. Hovering "Take test" slides the headline left and grows the right squares. */
export function Landing() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<Side>(null)

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Header showCode />

      {/* Half-squares peeking in from the edges (desktop). */}
      <SideSquare side="left" hidden={hover === 'right'} grow={hover === 'left'} />
      <SideSquare side="right" hidden={hover === 'left'} grow={hover === 'right'} />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        <h1
          className={`text-center text-[clamp(3.5rem,11vw,8rem)] leading-[0.94] font-light tracking-[-0.07em] transition-transform duration-700 ease-in-out ${
            hover === 'right' ? 'lg:-translate-x-[calc(50vw-50%-2rem)] lg:text-left' : ''
          } ${hover === 'left' ? 'lg:translate-x-[calc(50vw-50%-2rem)] lg:text-right' : ''}`}
        >
          Sophisticated
          <br />
          skincare
        </h1>

        {/* Phones and tablets: one centred button instead of the two side buttons. */}
        <div className="relative mt-16 flex size-60 items-center justify-center lg:hidden">
          <div className="diamond opacity-25" style={{ ['--size' as string]: '170px' }} />
          <DiamondButton
            label="Enter experience"
            direction="right"
            onClick={() => navigate('/testing')}
          />
        </div>
      </main>

      <DiamondButton
        label="Discover A.I."
        direction="left"
        onMouseEnter={() => setHover('left')}
        onMouseLeave={() => setHover(null)}
        className={`absolute top-1/2 left-8 hidden -translate-y-1/2 transition-opacity duration-500 lg:flex ${hover === 'right' ? 'opacity-0' : ''}`}
      />
      <DiamondButton
        label="Take test"
        direction="right"
        onClick={() => navigate('/testing')}
        onMouseEnter={() => setHover('right')}
        onMouseLeave={() => setHover(null)}
        className={`absolute top-1/2 right-8 hidden -translate-y-1/2 transition-opacity duration-500 lg:flex ${hover === 'left' ? 'opacity-0' : ''}`}
      />

      <p className="text-body relative mx-auto mb-8 max-w-[316px] px-4 text-center uppercase lg:absolute lg:bottom-6 lg:left-8 lg:mx-0 lg:mb-0 lg:px-0 lg:text-left">
        Skinstric developed an A.I. that creates a highly-personalised routine tailored to
        what your skin needs.
      </p>
    </div>
  )
}

/** A dotted square centred on the left or right edge, so only half of it shows. */
function SideSquare({
  side,
  hidden,
  grow,
}: {
  side: 'left' | 'right'
  hidden: boolean
  grow: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 hidden size-[602px] -translate-y-1/2 transition-opacity duration-500 lg:block ${
        side === 'left' ? '-left-[301px]' : '-right-[301px]'
      } ${hidden ? 'opacity-0' : ''}`}
    >
      <div className="diamond opacity-30" style={{ ['--size' as string]: '426px' }} />
      <div
        className={`diamond transition-opacity duration-500 ${grow ? 'opacity-20' : 'opacity-0'}`}
        style={{ ['--size' as string]: '482px' }}
      />
      <div
        className={`diamond transition-opacity duration-500 ${grow ? 'opacity-10' : 'opacity-0'}`}
        style={{ ['--size' as string]: '539px' }}
      />
    </div>
  )
}
