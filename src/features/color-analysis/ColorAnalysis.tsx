import { CameraPreview } from '../../components/camera/CameraPreview'

export function ColorAnalysis() {
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
          Capture and analyze color data using the Vauck Colors engine.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <CameraPreview />

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-600">
            Current measurement
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <ColorValue label="R" value="—" />
            <ColorValue label="G" value="—" />
            <ColorValue label="B" value="—" />
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
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-center">
      <p className="text-[10px] font-semibold text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-slate-300">
        {value}
      </p>
    </div>
  )
}
