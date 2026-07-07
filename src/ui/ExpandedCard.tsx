import { AnimatePresence, motion } from 'framer-motion'
import { useTwinStore } from '../store/twinStore'
import { STATUS_COLOR } from '../lib/colors'

// Full detail card shown when a room or sensor is selected.
// Room selected -> all sensors' metrics. Sensor selected -> that sensor only.
export function ExpandedCard() {
  const { roomId, sensorId } = useTwinStore((s) => s.selection)
  const office = useTwinStore((s) => s.office)
  const readings = useTwinStore((s) => s.readings)

  const room = office.rooms.find((r) => r.id === roomId)
  const open = Boolean(room)

  const sensors = room
    ? sensorId
      ? room.sensors.filter((s) => s.id === sensorId)
      : room.sensors
    : []

  return (
    <AnimatePresence>
      {open && room && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-auto absolute left-6 top-24 w-72 rounded-xl border border-cyan-glow/40 p-4"
          style={{
            background: 'rgba(6,14,26,0.82)',
            boxShadow: '0 0 30px #5ec8ff33',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="mb-2 text-lg font-semibold text-white">{room.name}</div>
          <div className="flex flex-col gap-3">
            {sensors.map((s) => {
              const metrics = readings[s.id] ?? []
              if (metrics.length === 0) return null
              return (
                <div key={s.id}>
                  <div className="mb-1 text-[10px] uppercase tracking-widest text-cyan-glow/50">
                    {s.type}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded border border-cyan-dim/20 bg-black/30 px-2 py-1"
                      >
                        <div className="text-[9px] uppercase text-cyan-glow/50">{m.label}</div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: STATUS_COLOR[m.status] }}
                        >
                          {m.value}
                          {m.unit && <span className="ml-0.5 text-[10px] opacity-70">{m.unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
