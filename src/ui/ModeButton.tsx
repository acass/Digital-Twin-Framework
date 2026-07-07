import type { ModeId } from '../data/provider'
import { useTwinStore } from '../store/twinStore'

export function ModeButton({ id, label }: { id: ModeId; label: string }) {
  const active = useTwinStore((s) => s.activeMode === id)
  const setMode = useTwinStore((s) => s.setMode)

  return (
    <button
      onClick={() => setMode(id)}
      className="rounded-md border px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-all"
      style={{
        borderColor: active ? '#5ec8ff' : '#2a6a9055',
        background: active ? 'rgba(94,200,255,0.15)' : 'rgba(10,20,35,0.4)',
        color: active ? '#eaf7ff' : '#7fb8d6',
        boxShadow: active ? '0 0 14px #5ec8ff55' : 'none',
      }}
    >
      {label}
    </button>
  )
}
