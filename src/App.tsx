import { useState } from 'react'

type View = 'overview' | 'analysis' | 'presets' | 'history'

const navigation: { id: View; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'analysis', label: 'Color Analysis' },
  { id: 'presets', label: 'Presets' },
  { id: 'history', label: 'History' },
]

function App() {
  const [activeView, setActiveView] = useState<View>('overview')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
              V
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-wide">
                Vauck Colors
              </h1>

              <p className="text-xs text-slate-500">
                Color Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Prototype
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
        <aside className="w-60 border-r border-slate-800 px-4 py-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = activeView === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              System
            </p>

            <div className="mt-3 rounded-lg bg-slate-900 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Color Engine
                </span>

                <span className="text-[10px] text-amber-400">
                  Standby
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                Awaiting camera initialization.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8">
          {activeView === 'overview' && (
            <Overview onStartAnalysis={() => setActiveView('analysis')} />
          )}

          {activeView === 'analysis' && <Analysis />}

          {activeView === 'presets' && <Placeholder title="Presets" />}

          {activeView === 'history' && <Placeholder title="History" />}
        </main>
      </div>
    </div>
  )
}

function Overview({
  onStartAnalysis,
}: {
  onStartAnalysis: () => void
}) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Vauck Colors
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Color analysis for industrial printing.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Analyze color measurements, compare them against defined references,
          identify deviations and build a reliable history for the printing
          process.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Measurements"
          value="0"
          description="Captured color readings"
        />

        <Metric
          label="Presets"
          value="0"
          description="Configured color references"
        />

        <Metric
          label="Engine"
          value="Standby"
          description="Camera not initialized"
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-white">
              Start a color analysis
            </p>

            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Initialize the camera and capture a color measurement using the
              Vauck Colors analysis engine.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartAnalysis}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Start analysis
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Feature
          title="Color Engine"
          description="Extract objective RGB data from the captured image."
        />

        <Feature
          title="Reference Presets"
          description="Compare measurements against defined color standards."
        />

        <Feature
          title="Deviation Analysis"
          description="Identify differences between measured and reference colors."
        />

        <Feature
          title="Measurement History"
          description="Build a traceable history of analyzed colors."
        />
      </div>
    </section>
  )
}

function Analysis() {
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
          Camera and RGB analysis will be initialized here.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-lg">
              +
            </div>

            <p className="mt-4 text-sm font-medium text-slate-300">
              Camera not initialized
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Camera preview will appear here.
            </p>
          </div>
        </div>

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

function Metric({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>

      <p className="mt-1 text-xs text-slate-600">{description}</p>
    </div>
  )
}

function Feature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
      <h3 className="text-sm font-medium text-slate-200">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
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
      <p className="text-[10px] font-semibold text-slate-600">{label}</p>

      <p className="mt-1 text-lg font-semibold text-slate-300">{value}</p>
    </div>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <section>
      <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
        Vauck Colors
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>

      <div className="mt-8 rounded-xl border border-dashed border-slate-800 p-12 text-center">
        <p className="text-sm text-slate-500">
          This module will be implemented in a future sprint.
        </p>
      </div>
    </section>
  )
}

export default App
