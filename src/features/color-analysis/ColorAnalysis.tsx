import { useState } from 'react'
import {
  CameraPreview,
  type ColorSample,
} from '../../components/camera/CameraPreview'
import type {
  ColorMeasurement,
  ColorReference,
  RGBColor,
} from '../../types/color'
import { createColorMeasurement } from './measurement'
import { createColorReference } from './reference'

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString()
}

function isValidChannel(value: number) {
  return Number.isInteger(value) && value >= 0 && value <= 255
}

function getQualityStatusLabel(
  status: 'good' | 'warning' | 'poor',
) {
  switch (status) {
    case 'good':
      return 'Good'
    case 'warning':
      return 'Warning'
    case 'poor':
      return 'Poor'
  }
}

function getQualityStatusClasses(
  status: 'good' | 'warning' | 'poor',
) {
  switch (status) {
    case 'good':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    case 'warning':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
    case 'poor':
      return 'border-red-500/30 bg-red-500/10 text-red-400'
  }
}

export function ColorAnalysis() {
  const [currentMeasurement, setCurrentMeasurement] =
    useState<ColorMeasurement | null>(null)

  const [colorReference, setColorReference] =
    useState<ColorReference | null>(null)

  const [referenceRgb, setReferenceRgb] =
    useState<RGBColor>({
      r: 0,
      g: 0,
      b: 0,
    })

  const [referenceLabel, setReferenceLabel] =
    useState('Reference color')

  function handleColorSample(sample: ColorSample) {
    const measurement = createColorMeasurement(
      sample.rgb,
      'camera',
      sample.signature.sampleSize,
      sample.signature,
    )

    setCurrentMeasurement(measurement)
  }

  function handleReferenceChannelChange(
    channel: keyof RGBColor,
    value: string,
  ) {
    if (value === '') {
      setReferenceRgb((current: RGBColor) => ({
        ...current,
        [channel]: 0,
      }))

      return
    }

    const parsedValue = Number(value)

    if (!Number.isNaN(parsedValue)) {
      setReferenceRgb((current: RGBColor) => ({
        ...current,
        [channel]: parsedValue,
      }))
    }
  }

  function handleCreateReference() {
    if (
      !isValidChannel(referenceRgb.r) ||
      !isValidChannel(referenceRgb.g) ||
      !isValidChannel(referenceRgb.b)
    ) {
      return
    }

    const reference = createColorReference(
      referenceRgb,
      'manual',
      referenceLabel.trim() || 'Reference color',
    )

    setColorReference(reference)
  }

  function handleUseCurrentMeasurement() {
    if (!currentMeasurement) {
      return
    }

    const reference = createColorReference(
      currentMeasurement.rgb,
      'measurement',
      referenceLabel.trim() || 'Reference color',
    )

    setColorReference(reference)
    setReferenceRgb(currentMeasurement.rgb)
  }

  function handleClearReference() {
    setColorReference(null)
  }

  const signature = currentMeasurement?.signature
  const quality = currentMeasurement?.quality

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Color Analysis
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Capture, inspect and define color references.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-white">
              Camera
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Central region is used for statistical color
              sampling.
            </p>
          </div>

          <CameraPreview
            onColorSample={handleColorSample}
          />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-white">
              Current Measurement
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Live color measurement from the camera.
            </p>
          </div>

          {currentMeasurement ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-xl border border-white/10"
                  style={{
                    backgroundColor:
                      currentMeasurement.hex,
                  }}
                />

                <div>
                  <p className="font-mono text-lg text-white">
                    {currentMeasurement.hex}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Camera measurement
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <p className="text-xs text-zinc-500">
                    R
                  </p>

                  <p className="mt-1 font-mono text-sm text-white">
                    {currentMeasurement.rgb.r}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <p className="text-xs text-zinc-500">
                    G
                  </p>

                  <p className="mt-1 font-mono text-sm text-white">
                    {currentMeasurement.rgb.g}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <p className="text-xs text-zinc-500">
                    B
                  </p>

                  <p className="mt-1 font-mono text-sm text-white">
                    {currentMeasurement.rgb.b}
                  </p>
                </div>
              </div>

              {signature && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Sample Statistics
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                      Statistical signature extracted from
                      the ROI.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Pixels analyzed
                      </p>

                      <p className="mt-1 font-mono text-sm text-white">
                        {signature.pixelsAnalyzed}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Sample size
                      </p>

                      <p className="mt-1 font-mono text-sm text-white">
                        {signature.sampleSize} ×{' '}
                        {signature.sampleSize}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Mean
                      </p>

                      <p className="mt-2 font-mono text-xs text-white">
                        R {signature.statistics.mean.r}
                        <br />
                        G {signature.statistics.mean.g}
                        <br />
                        B {signature.statistics.mean.b}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Median
                      </p>

                      <p className="mt-2 font-mono text-xs text-white">
                        R {signature.statistics.median.r}
                        <br />
                        G {signature.statistics.median.g}
                        <br />
                        B {signature.statistics.median.b}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Std. Dev.
                      </p>

                      <p className="mt-2 font-mono text-xs text-white">
                        R {signature.statistics.stdDev.r}
                        <br />
                        G {signature.statistics.stdDev.g}
                        <br />
                        B {signature.statistics.stdDev.b}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Minimum
                      </p>

                      <p className="mt-2 font-mono text-xs text-white">
                        R {signature.statistics.min.r}
                        <br />
                        G {signature.statistics.min.g}
                        <br />
                        B {signature.statistics.min.b}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <p className="text-xs text-zinc-500">
                        Maximum
                      </p>

                      <p className="mt-2 font-mono text-xs text-white">
                        R {signature.statistics.max.r}
                        <br />
                        G {signature.statistics.max.g}
                        <br />
                        B {signature.statistics.max.b}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {quality && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Capture Quality
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                      Deterministic quality assessment of the
                      current ROI capture.
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">
                          Quality score
                        </p>

                        <p className="mt-1 font-mono text-2xl font-semibold text-white">
                          {quality.score}
                          <span className="ml-1 text-sm font-normal text-zinc-600">
                            / 100
                          </span>
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getQualityStatusClasses(
                          quality.status,
                        )}`}
                      >
                        {getQualityStatusLabel(
                          quality.status,
                        )}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                        <p className="text-xs text-zinc-500">
                          Uniformity
                        </p>

                        <p className="mt-1 font-mono text-sm text-white">
                          {quality.uniformity}%
                        </p>
                      </div>

                      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                        <p className="text-xs text-zinc-500">
                          Exposure
                        </p>

                        <p className="mt-1 font-mono text-sm text-white">
                          {quality.exposure}%
                        </p>
                      </div>

                      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                        <p className="text-xs text-zinc-500">
                          Valid pixels
                        </p>

                        <p className="mt-1 font-mono text-sm text-white">
                          {quality.validPixelRatio}%
                        </p>
                      </div>

                      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                        <p className="text-xs text-zinc-500">
                          Color variation
                        </p>

                        <p className="mt-1 font-mono text-sm text-white">
                          {quality.colorVariation}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-zinc-500">
                    Source
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {currentMeasurement.source}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">
                    Sample
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {currentMeasurement.sampleSize} ×{' '}
                    {currentMeasurement.sampleSize}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">
                    Captured at
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {formatTime(
                      currentMeasurement.capturedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50">
              <p className="text-sm text-zinc-500">
                Waiting for camera measurement...
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-white">
            Color Reference
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Define the expected color that will be used as
            a reference.
          </p>
        </div>

        {colorReference ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-xl border border-white/10"
                  style={{
                    backgroundColor:
                      colorReference.hex,
                  }}
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    {colorReference.label}
                  </p>

                  <p className="mt-1 font-mono text-sm text-zinc-300">
                    {colorReference.hex}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Source: {colorReference.source}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearReference}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900"
              >
                Clear reference
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <p className="text-xs text-zinc-500">
                  R
                </p>

                <p className="mt-1 font-mono text-sm text-white">
                  {colorReference.rgb.r}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <p className="text-xs text-zinc-500">
                  G
                </p>

                <p className="mt-1 font-mono text-sm text-white">
                  {colorReference.rgb.g}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <p className="text-xs text-zinc-500">
                  B
                </p>

                <p className="mt-1 font-mono text-sm text-white">
                  {colorReference.rgb.b}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs text-zinc-500">
                Reference name
              </label>

              <input
                type="text"
                value={referenceLabel}
                onChange={(event) =>
                  setReferenceLabel(event.target.value)
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-600"
                placeholder="Reference color"
              />
            </div>

            <div>
              <p className="mb-2 text-xs text-zinc-500">
                RGB reference
              </p>

              <div className="grid grid-cols-3 gap-3">
                {(['r', 'g', 'b'] as const).map(
                  (channel) => (
                    <div key={channel}>
                      <label className="mb-1 block text-xs uppercase text-zinc-600">
                        {channel}
                      </label>

                      <input
                        type="number"
                        min={0}
                        max={255}
                        step={1}
                        value={referenceRgb[channel]}
                        onChange={(event) =>
                          handleReferenceChannelChange(
                            channel,
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-white outline-none transition focus:border-zinc-600"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCreateReference}
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Set reference
              </button>

              <button
                type="button"
                onClick={handleUseCurrentMeasurement}
                disabled={!currentMeasurement}
                className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Use current measurement
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default ColorAnalysis
