import { useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { DiamondButton } from '@/components/DiamondButton'
import { Diamonds } from '@/components/Diamonds'
import { DevSampleButton, ErrorNote } from '@/components/ErrorNote'
import { Header } from '@/components/Header'
import { CameraIcon, GalleryIcon, Pointer } from '@/components/icons'
import { Loader } from '@/components/Loader'
import { useAnalyze } from '@/hooks/useAnalyze'
import { fileToDataUrl } from '@/lib/image'

/** Screens 005 and 006: scan your face, or pick a photo from the gallery. */
export function ImageChoice() {
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const [askCamera, setAskCamera] = useState(false)
  const { analyze, pending, error, clearError } = useAnalyze()

  if (pending) return <Loader text="Preparing your analysis ..." />

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <p className="text-label px-4 pt-4 font-semibold uppercase sm:px-8">
        To start analysis
      </p>

      <main className="relative flex flex-1 flex-col items-center justify-center gap-4 px-4 py-6 md:flex-row md:justify-around md:gap-8 md:py-0">
        <Choice
          icon={<CameraIcon className="size-full" />}
          label={
            <>
              Allow A.I.
              <br />
              to scan your face
            </>
          }
          labelSide="top-right"
          onClick={() => setAskCamera(true)}
          dimmed={false}
        >
          {askCamera && (
            <div
              role="dialog"
              aria-label="Camera permission"
              className="animate-fade-in bg-ink text-paper absolute top-[calc(50%+8.5rem)] left-1/2 z-20 w-[min(352px,85vw)] -translate-x-1/2 md:top-[calc(50%-39px)] md:left-[calc(50%+92px)] md:translate-x-0"
            >
              <p className="text-label px-4 pt-4 pb-10 font-semibold uppercase">
                Allow A.I. to access your camera
              </p>
              <div className="border-paper/60 text-body flex justify-end gap-8 border-t px-4 py-2 font-semibold uppercase">
                <button
                  type="button"
                  onClick={() => setAskCamera(false)}
                  className="text-paper/60 hover:text-paper uppercase"
                >
                  Deny
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/camera')}
                  className="uppercase hover:opacity-70"
                >
                  Allow
                </button>
              </div>
            </div>
          )}
        </Choice>

        <Choice
          icon={<GalleryIcon className="size-full" />}
          label={
            <>
              Allow A.I.
              <br />
              access gallery
            </>
          }
          labelSide="bottom-left"
          onClick={() => fileInput.current?.click()}
          dimmed={askCamera}
        />

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = '' // lets the same file be picked again after an error
            if (file) void analyze(() => fileToDataUrl(file))
          }}
        />
      </main>

      {error && (
        <div className="absolute inset-x-4 bottom-28 z-30 flex flex-col items-center gap-3">
          <ErrorNote message={error} onClose={clearError} />
        </div>
      )}

      <footer className="relative z-10 flex items-center justify-between gap-4 px-4 pb-8 sm:px-8">
        <DiamondButton
          label="Back"
          direction="left"
          onClick={() => navigate('/testing')}
        />
        <DevSampleButton />
      </footer>
    </div>
  )
}

interface ChoiceProps {
  icon: ReactNode
  label: ReactNode
  labelSide: 'top-right' | 'bottom-left'
  onClick: () => void
  dimmed: boolean
  children?: ReactNode
}

/** One of the two big options: dotted squares, a round icon, and a label on a pointer line. */
function Choice({ icon, label, labelSide, onClick, dimmed, children }: ChoiceProps) {
  return (
    <div
      className={`relative flex aspect-square w-[min(60vw,482px)] items-center justify-center transition-opacity duration-300 md:w-[min(38vw,482px)] ${dimmed ? 'opacity-30' : ''}`}
    >
      <Diamonds size="100%" />
      <button
        type="button"
        onClick={onClick}
        className="group relative z-10 size-[clamp(96px,26vw,136px)] transition-transform duration-300 hover:scale-105"
      >
        {icon}
        <span
          className={`text-body absolute flex text-left leading-6 uppercase ${
            labelSide === 'top-right'
              ? 'md:bottom-[78%] md:left-[92%] md:items-end'
              : 'md:top-[78%] md:right-[92%] md:flex-row-reverse md:items-start md:text-right'
          }`}
        >
          <Pointer
            className={`hidden w-[66px] shrink-0 md:block ${labelSide === 'bottom-left' ? 'rotate-180' : ''}`}
          />
          <span className="w-max">{label}</span>
        </span>
      </button>
      {children}
    </div>
  )
}
