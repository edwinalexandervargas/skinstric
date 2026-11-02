/**
 * Placeholder for a function you haven't written yet. It throws a clear message,
 * and the screen that called it shows that message, so you always know what's missing.
 * Delete the call once the real code is in.
 */
export function todo(what: string): never {
  throw new Error(`Not written yet: ${what}`)
}

/** Turns anything thrown into a message a person can read. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
