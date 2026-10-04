import { useEffect, useRef, useState } from 'react'
import { sampleCenterSignature } from '../../features/color-analysis/colorSampler'
import type {
  RGBColor,
  SampleSignature,
} from '../../types/color'

type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'error'

export interface ColorSample {
  rgb: RGBColor
  signature: SampleSignature
}

interface CameraPreviewProps {
  onColorSample: (sample: ColorSample) => void
}

export function CameraPreview({
  onColorSample,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const onColorSampleRef = useRef(onColorSample)

  const [status, setStatus] = useState<CameraStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    onColorSampleRef.current = onColorSample
  }, [onColorSample])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    if (status !== 'active') {
      return
    }

    let animationFrameId = 0
    let lastSampleTime = 0

    const sampleLoop = (timestamp: number) => {
      if (timestamp - lastSampleTime >= 150) {
        const video = videoRef.current
        const canvas = canvasRef.current

        if (video && canvas) {
          const signature = sampleCenterSignature(
            video,
            canvas,
          )

          if (signature) {
            onColorSampleRef.current({
              rgb: signature.statistics.mean,
              signature,
            })
          }
        }

        lastSampleTime = timestamp
      }

      animationFrameId = requestAnimationFrame(sampleLoop)
    }

    animationFrameId = requestAnimationFrame(sampleLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [status])

  async function startCamera() {
    try {
      setStatus('requesting')
      setErrorMessage(null)

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera access is not supported by this browser.',
        )
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
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
      console.error(
        'Failed to initialize camera:',
        error,
      )

      if (
        error instanceof DOMException &&
        error.name === 'NotAllowedError'
      ) {
        setStatus('denied')
        setErrorMessage(
          'Camera permission was denied. Please allow camera access and try again.',
        )

        return
      }

      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to initialize the camera.',
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

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-28 w-28 rounded-lg border border-white/70">
            <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-white" />
            <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-white" />
            <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-white" />
            <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-white" />

            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </div>
        </div>

        {status !== 'active' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-lg text-slate-500">
                📷
              </div>

              <p className="mt-4 text-sm font-medium text-slate-300">
                {status === 'requesting'
                  ? 'Requesting camera access...'
                  : 'Camera not initialized'}
              </p>

              <p className="mt-1 max-w-xs text-xs text-slate-600">
                {errorMessage ??
                  'Initialize the camera to begin color analysis.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="hidden"
        aria-hidden="true"
      />

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
              ? 'Camera active · sampling'
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