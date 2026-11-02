import { useNavigate } from 'react-router-dom'
import { SAMPLE_RESULTS } from '@/lib/sample'
import { useSkinstric } from '@/store/useSkinstric'

/** A small message box for a failed step, with a dev-only way around unwritten logic. */
export function ErrorNote({
  message,
  onClose,
}: {
  message: string
  onClose?: () => void
}) {
  return (
    <div
      role="alert"
      className="animate-fade-in bg-ink text-body text-paper flex max-w-md items-start gap-4 px-4 py-3"
    >
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="font-semibold uppercase hover:opacity-70"
        >
          Close
        </button>
      )}
    </div>
  )
}

/**
 * Only in `npm run dev`: skips the API with the example response from the PDF, so the results
 * screens can be reviewed before the upload logic exists. Never shows in the deployed build.
 */
export function DevSampleButton() {
  const navigate = useNavigate()
  const setAnalysis = useSkinstric((s) => s.setAnalysis)
  if (!import.meta.env.DEV) return null
  return (
    <button
      type="button"
      onClick={() => {
        setAnalysis(null, SAMPLE_RESULTS)
        navigate('/select')
      }}
      className="border-muted text-tiny text-muted hover:text-ink border border-dashed px-3 py-1.5 uppercase"
    >
      Dev: use sample results
    </button>
  )
}
