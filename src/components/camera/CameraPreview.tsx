import { useEffect, useRef, useState } from 'react'

type CameraStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'error'

export function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<CameraStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  async function startCamera() {
    try {
      setStatus('requesting')
      setErrorMessage(null)

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera access is not supported by this browser.'
        )
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setStatus('active')
    } catch (error) {
      console.error('Failed to initialize camera:', error)

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setStatus('denied')
        setErrorMessage(
          'Camera permission was denied. Please allow camera access and try again.'
        )
        return
      }

      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to initialize the camera.'
      )
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })

    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setStatus('idle')
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted
        />

        {status !== 'active' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-lg text-slate-500">
                📷
              </div>

              <p className="mt-4 text-sm font-medium text-slate-300">
                {status === 'requesting'
                  ? 'Requesting camera access...'
                  : 'Camera not initialized'}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {errorMessage ??
                  'Initialize the camera to begin color analysis.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === 'active'
                ? 'bg-emerald-500'
                : status === 'error' || status === 'denied'
                  ? 'bg-red-500'
                  : 'bg-slate-600'
            }`}
          />

          <span className="text-xs text-slate-500">
            {status === 'active'
              ? 'Camera active'
              : status === 'requesting'
                ? 'Initializing'
                : 'Camera offline'}
          </span>
        </div>

        {status === 'active' ? (
          <button
            type="button"
            onClick={stopCamera}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-900"
          >
            Stop camera
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            disabled={status === 'requesting'}
            className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'requesting'
              ? 'Initializing...'
              : 'Start camera'}
          </button>
        )}
      </div>
    </div>
  )
}