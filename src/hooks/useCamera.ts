/** Opens the front camera into videoRef and closes it again. status: 'idle' | 'starting' | 'live' | 'error'. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { errorMessage, todo } from '@/lib/todo'

export type CameraStatus = 'idle' | 'starting' | 'live' | 'error'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  /** The open camera stream, so stop() can close it. */
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const stop = useCallback(() => {
    const stream = streamRef.current
    if (!stream) return
    void stream
  }, [])

  const start = useCallback(async () => {
    setStatus('starting')
    setError(null)
    try {
      todo('useCamera start() (src/hooks/useCamera.ts)')
    } catch (err) {
      setError(errorMessage(err))
      setStatus('error')
    }
  }, [])

  // Close the camera when the page unmounts.
  useEffect(() => stop, [stop])

  return { videoRef, status, error, start, stop }
}
