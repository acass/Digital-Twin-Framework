import { MODE_LIST } from '../data/modes'
import { useTwinStore } from '../store/twinStore'
import { ModeButton } from './ModeButton'
import { StatusCard } from './StatusCard'
import { WeatherCard } from './WeatherCard'

export function RightPanel() {
  const office = useTwinStore((s) => s.office)
  const activeMode = useTwinStore((s) => s.activeMode)
  const activeLabel = MODE_LIST.find((m) => m.id === activeMode)?.label ?? ''

  return (
    <div className="pointer-events-auto absolute right-0 top-0 flex h-full w-[340px] flex-col gap-4 overflow-y-auto p-5 pt-24">
      {/* mode selector */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-widest text-cyan-glow/60">
          Dashboard Mode
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MODE_LIST.map((m) => (
            <ModeButton key={m.id} id={m.id} label={m.label} />
          ))}
        </div>
      </div>

      {/* room status cards */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-widest text-cyan-glow/60">
          {activeLabel} · Rooms
        </div>
        <div className="grid grid-cols-2 gap-2">
          {office.rooms.map((r) => (
            <StatusCard key={r.id} room={r} />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <WeatherCard />
      </div>
    </div>
  )
}
