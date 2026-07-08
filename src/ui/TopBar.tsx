import { useEffect, useState } from 'react'
import { useTwinStore } from '../store/twinStore'

export function TopBar() {
  const viewMode = useTwinStore((s) => s.viewMode)
  const toggleViewMode = useTwinStore((s) => s.toggleViewMode)
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const time = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="pointer-events-none absolute left-0 top-0 flex w-full items-start justify-between p-6">
      <h1
        className="text-3xl font-bold tracking-[0.3em] text-white"
        style={{ textShadow: '0 0 20px #5ec8ff88' }}
      >
        INNOVATION LAB
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleViewMode}
          className="pointer-events-auto rounded border border-cyan-glow/40 bg-cyan-glow/10 px-3 py-1.5 text-sm font-medium text-cyan-glow transition hover:bg-cyan-glow/20"
        >
          {viewMode === 'solid' ? 'Solid model' : 'Wireframe'}
        </button>
        <div className="text-right text-cyan-glow/90">
          <div className="text-sm">{date}</div>
          <div className="text-lg font-semibold">{time}</div>
        </div>
      </div>
    </div>
  )
}
