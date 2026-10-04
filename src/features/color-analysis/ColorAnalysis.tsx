import { useCallback, useState } from 'react'
import { CameraPreview } from '../../components/camera/CameraPreview'
import { rgbToHex } from './colorSampler'
import type { RGBColor } from '../../types/color'

export function ColorAnalysis() {
  const [currentColor, setCurrentColor] =
    useState<RGBColor | null>(null)

  const handleColorSample = useCallback((color: RGBColor) => {
    setCurrentColor(color)
  }, [])

  const hexColor = currentColor
    ? rgbToHex(currentColor)
    : null

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Analysis
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Color Analysis
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Capture and analyze color data using the Vauck Colors
          engine.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <CameraPreview onColorSample={handleColorSample} />

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-600">
            Current measurement
          </p>

          <div
            className="mt-6 aspect-square rounded-xl border border-slate-800"
            style={{
              backgroundColor: hexColor ?? '#020617',
            }}
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Sample color
            </span>

            <span className="font-mono text-xs text-slate-400">
              {hexColor ?? '—'}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <ColorValue
              label="R"
              value={currentColor?.r}
            />

            <ColorValue
              label="G"
              value={currentColor?.g}
            />

            <ColorValue
              label="B"
              value={currentColor?.b}
            />
          </div>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Color degree
              </span>

              <span className="text-sm font-medium text-slate-400">
                —
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Degree classification will be introduced after the
              color reference model is defined.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ColorValue({
  label,
  value,
}: {
  label: string
  value?: number
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-center">
      <p className="text-[10px] font-semibold text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-slate-300">
        {value ?? '—'}
      </p>
    </div>
  )
}