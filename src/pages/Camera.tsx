import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DiamondButton } from '@/components/DiamondButton'
import { ErrorNote } from '@/components/ErrorNote'
import { Header } from '@/components/Header'
import { CameraIcon, ShutterIcon } from '@/components/icons'
import { Loader, PhotoTips } from '@/components/Loader'
import { useAnalyze } from '@/hooks/useAnalyze'
import { useCamera } from '@/hooks/useCamera'
import { captureFrame } from '@/lib/image'
import { errorMessage } from '@/lib/todo'

/** Screens 007 (setting up), 009 (live) and 010 (photo taken). */
export function Camera() {
  const navigate = useNavigate()
  const { videoRef, status, error, start, stop } = useCamera()
  const { analyze, pending, error: analyzeError, clearError } = useAnalyze()
  const [shot, setShot] = useState<string | null>(null)
  const [shotError, setShotError] = useState<string | null>(null)

  useEffect(() => {
    void start()
  }, [start])

  function takePicture() {
    const video = videoRef.current
    if (!video) return
    try {
      setShot(captureFrame(video))
      setShotError(null)
    } catch (err) {
      setShotError(errorMessage(err))
    }
  }

  function leave() {
    stop()
    navigate('/result')
  }

  if (pending) return <Loader text="Preparing your analysis ..." />

  const live = status === 'live'

  return (
    <div className="bg-ink relative flex h-dvh flex-col overflow-hidden">
      {/* The video is always mounted so the hook can attach the stream to it. */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 size-full -scale-x-100 object-cover ${live ? '' : 'invisible'}`}
      />
      {shot && (
        <img
          src={shot}
          alt="Your photo"
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {!live && (
        <div className="bg-paper absolute inset-0">
          {status === 'error' ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
              <CameraIcon className="size-24 opacity-40" />
              <p className="text-label max-w-md">{error}</p>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => void start()}
                  className="bg-ink text-tiny text-paper px-4 py-2 font-semibold uppercase"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={leave}
                  className="border-ink text-tiny border px-4 py-2 font-semibold uppercase"
                >
                  Upload a photo instead
                </button>
              </div>
            </div>
          ) : (
            <Loader text="Setting up camera ...">
              <CameraIcon className="size-[clamp(96px,26vw,136px)] animate-pulse" />
            </Loader>
          )}
          {status !== 'error' && (
            <div className="absolute inset-x-4 bottom-10">
              <PhotoTips />
            </div>
          )}
        </div>
      )}

      {live && (
        <>
          <div className="from-ink/40 relative z-10 bg-gradient-to-b to-transparent">
            <Header section="ANALYSIS" light />
          </div>

          {shot && (
            <p className="animate-fade-in text-label text-paper relative z-10 mt-[12vh] text-center font-semibold uppercase">
              Great shot!
            </p>
          )}

          {/* Take picture / retake, on the right. */}
          <button
            type="button"
            onClick={shot ? () => setShot(null) : takePicture}
            className="group text-body text-paper absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-center gap-4 font-semibold uppercase sm:right-8"
          >
            <span className="hidden sm:inline">{shot ? 'Retake' : 'Take picture'}</span>
            <ShutterIcon className="size-14 transition-transform group-hover:scale-110 sm:size-[62px]" />
          </button>

          <div className="from-ink/50 absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 bg-gradient-to-t to-transparent px-4 pt-16 pb-6 sm:px-8 sm:pb-8">
            <PhotoTips light />
            <div className="flex items-center justify-between">
              <DiamondButton label="Back" direction="left" light onClick={leave} />
              {shot && (
                <DiamondButton
                  label="Proceed"
                  direction="right"
                  light
                  className="animate-fade-in"
                  // The camera closes itself when this page unmounts on success.
                  onClick={() => void analyze(async () => shot)}
                />
              )}
            </div>
          </div>
        </>
      )}

      {(shotError ?? analyzeError) && (
        <div className="absolute inset-x-4 top-24 z-30 flex justify-center">
          <ErrorNote
            message={(shotError ?? analyzeError)!}
            onClose={() => {
              setShotError(null)
              clearError()
            }}
          />
        </div>
      )}
    </div>
  )
}
