import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeImage } from '@/lib/api'
import { resizeImage } from '@/lib/image'
import { errorMessage } from '@/lib/todo'
import { useSkinstric } from '@/store/useSkinstric'

/**
 * Shared by the gallery upload and the camera: shrink the photo, send it, save the results,
 * then go to the analysis menu. The screen shows the loader while `pending` is true.
 */
export function useAnalyze() {
  const navigate = useNavigate()
  const setAnalysis = useSkinstric((s) => s.setAnalysis)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze(getImage: () => Promise<string>) {
    setPending(true)
    setError(null)
    try {
      const original = await getImage()
      const small = await resizeImage(original)
      const results = await analyzeImage(small)
      setAnalysis(small, results)
      navigate('/select')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return { analyze, pending, error, clearError: () => setError(null) }
}
