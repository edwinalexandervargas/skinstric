import { todo } from './todo'
import type { Demographics } from './types'

export const PHASE_ONE_URL =
  'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne'
export const PHASE_TWO_URL =
  'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo'

/**
 * POSTs { name, location } as JSON to Phase 1. Resolves when the server says OK; throws otherwise.
 */
export async function submitIntro(_name: string, _location: string): Promise<void> {
  todo('submitIntro (src/lib/api.ts)')
}

/**
 * Sends the photo to Phase 2 and returns the `data` part of the response (race / age / gender).
 * Takes the full data URL.
 */
export async function analyzeImage(_imageDataUrl: string): Promise<Demographics> {
  todo('analyzeImage (src/lib/api.ts)')
}
