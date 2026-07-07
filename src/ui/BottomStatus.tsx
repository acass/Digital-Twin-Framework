import { useTwinStore } from '../store/twinStore'

export function BottomStatus() {
  const selection = useTwinStore((s) => s.selection)
  const clear = useTwinStore((s) => s.selectRoom)

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 flex w-[calc(100%-340px)] items-end justify-between p-6">
      <div className="pointer-events-auto">
        {selection.roomId && (
          <button
            onClick={() => clear(null)}
            className="rounded-md border border-cyan-dim/40 bg-panel px-3 py-1.5 text-xs uppercase tracking-wide text-cyan-glow/80 hover:border-cyan-glow"
          >
            ⟲ Reset View
          </button>
        )}
      </div>
    </div>
  )
}
