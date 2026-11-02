import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DiamondButton } from '@/components/DiamondButton'
import { Diamonds } from '@/components/Diamonds'
import { ErrorNote } from '@/components/ErrorNote'
import { Header } from '@/components/Header'
import { submitIntro } from '@/lib/api'
import { errorMessage } from '@/lib/todo'
import { validateLocation, validateName } from '@/lib/validation'
import { useSkinstric } from '@/store/useSkinstric'

type Step = 'name' | 'location' | 'sending' | 'done'

const FIELDS = {
  name: {
    placeholder: 'Introduce Yourself',
    label: 'Introduce yourself',
    validate: validateName,
  },
  location: {
    placeholder: 'Where are you from?',
    label: 'Where are you from?',
    validate: validateLocation,
  },
} as const

/** Screens 002, 504 and 505: name, then location, then send both to Phase 1. */
export function Intro() {
  const navigate = useNavigate()
  const savedName = useSkinstric((s) => s.name)
  const savedLocation = useSkinstric((s) => s.location)
  const setIntro = useSkinstric((s) => s.setIntro)

  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState(savedName)
  const [location, setLocation] = useState(savedLocation)
  const [sendError, setSendError] = useState<string | null>(null)

  const field = step === 'location' ? 'location' : 'name'
  const value = field === 'name' ? name : location
  const setValue = field === 'name' ? setName : setLocation
  const typed = value.trim() !== ''
  // Don't nag before the user has typed anything.
  const error = typed ? FIELDS[field].validate(value) : null
  const canProceed = typed && error === null

  async function send() {
    setStep('sending')
    setSendError(null)
    const cleanName = name.trim()
    const cleanLocation = location.trim()
    setIntro(cleanName, cleanLocation) // saved locally (persisted) either way
    try {
      await submitIntro(cleanName, cleanLocation)
      setStep('done')
    } catch (err) {
      setSendError(errorMessage(err))
      setStep('location')
    }
  }

  function proceed(event?: FormEvent) {
    event?.preventDefault()
    if (step === 'done') return navigate('/result')
    if (!canProceed) return
    if (step === 'name') setStep('location')
    else void send()
  }

  function back() {
    if (step === 'location' || step === 'done')
      setStep(step === 'done' ? 'location' : 'name')
    else navigate('/')
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Header />
      <p className="text-label relative z-10 px-4 pt-4 font-semibold uppercase sm:px-8">
        To start analysis
      </p>

      <main className="relative flex flex-1 items-center justify-center px-4">
        <Diamonds spin={step === 'sending'} />

        {step === 'sending' || step === 'done' ? (
          <div className="animate-fade-in relative z-10 flex flex-col items-center gap-4 text-center">
            <p className="text-body text-muted uppercase">
              {step === 'sending' ? 'Processing submission' : 'Thank you!'}
            </p>
            <p className="text-[clamp(2rem,6vw,3.75rem)] leading-[1.07] tracking-[-0.07em]">
              {step === 'sending' ? '...' : 'Proceed for the next step'}
            </p>
          </div>
        ) : (
          <form
            key={step}
            onSubmit={proceed}
            className="animate-fade-in relative z-10 flex w-full max-w-[488px] flex-col items-center gap-1"
          >
            <label htmlFor="intro-input" className="text-body text-muted uppercase">
              {typed ? FIELDS[field].label : 'Click to type'}
            </label>
            <input
              id="intro-input"
              autoFocus
              autoComplete={field === 'name' ? 'name' : 'address-level2'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={FIELDS[field].placeholder}
              aria-invalid={error !== null}
              aria-describedby="intro-error"
              className="border-ink placeholder:text-ink focus:placeholder:text-muted/60 w-full border-b bg-transparent text-center text-[clamp(1.75rem,7.5vw,3.75rem)] leading-[1.07] tracking-[-0.07em] outline-none"
            />
            <p id="intro-error" aria-live="polite" className="text-body text-ink min-h-6">
              {error}
            </p>
          </form>
        )}

        {sendError && (
          <div className="absolute inset-x-4 bottom-28 z-20 flex flex-col items-center gap-3">
            <ErrorNote message={sendError} onClose={() => setSendError(null)} />
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={() => {
                  setSendError(null)
                  setStep('done')
                }}
                className="border-muted text-tiny text-muted hover:text-ink border border-dashed px-3 py-1.5 uppercase"
              >
                Dev: skip the API
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="relative z-10 flex items-center justify-between px-4 pb-8 sm:px-8">
        <DiamondButton label="Back" direction="left" onClick={back} />
        {(canProceed || step === 'done') && (
          <DiamondButton
            label="Proceed"
            direction="right"
            onClick={() => proceed()}
            className="animate-fade-in"
          />
        )}
      </footer>
    </div>
  )
}
