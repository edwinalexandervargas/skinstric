import type { Demographics } from './types'
import { stripDataUrlPrefix } from './image'

export const PHASE_ONE_URL =
  'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne'
export const PHASE_TWO_URL =
  'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo'

/**
 * POSTs { name, location } as JSON to Phase 1. Resolves when the server says OK; throws otherwise.
 */
export async function submitIntro(name: string, location: string): Promise<void> {
  const response = await fetch(PHASE_ONE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, location}),
  })

  if (!response.ok) {
    throw new Error(`Couldn't save your details (status ${response.status}). Please try again.`)
  }
}

/**
 * Sends the photo to Phase 2 and returns the `data` part of the response (race / age / gender).
 * Takes the full data URL.
 */
// The PDF says "Image", but the server only accepts lowercase "image" (probed in the console).
export async function analyzeImage(imageDataUrl: string): Promise<Demographics> {
  const response = await fetch(PHASE_TWO_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({ image: stripDataUrlPrefix(imageDataUrl) })
  })

  if (!response.ok) {
    throw new Error(`Couldn't analyze your photo...(status ${response.status}). Please try again.`)
  }
  const json = await response.json()
  return json.data
}

