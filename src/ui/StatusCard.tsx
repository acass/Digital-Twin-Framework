import { motion } from 'framer-motion'
import { useTwinStore } from '../store/twinStore'
import { useLerpedValue } from '../hooks/useLerpedValue'
import { STATUS_COLOR } from '../lib/colors'
import type { Room } from '../data/provider'

// One summary card per room: room name + headline metric of its first sensor.
export function StatusCard({ room }: { room: Room }) {
  const readings = useTwinStore((s) => s.readings)
  const selectRoom = useTwinStore((s) => s.selectRoom)
  const selected = useTwinStore((s) => s.selection.roomId === room.id)

  // first sensor with data in the current mode
  const sensor = room.sensors.find((s) => (readings[s.id]?.length ?? 0) > 0)
  const head = sensor ? readings[sensor.id][0] : undefined
  const numeric = typeof head?.value === 'number'
  const lerped = useLerpedValue(numeric ? (head!.value as number) : 0)

  const color = head ? STATUS_COLOR[head.status] : '#2a6a90'
  const shown = head ? (numeric ? formatNum(lerped, head.value as number) : head.value) : '—'

  return (
    <motion.button
      layout
      onClick={() => selectRoom(selected ? null : room.id)}
      className="flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors"
      style={{
        borderColor: selected ? '#5ec8ff' : '#2a6a9044',
        background: selected ? 'rgba(94,200,255,0.12)' : 'rgba(10,20,35,0.5)',
      }}
    >
      <span className="text-[11px] uppercase tracking-wide text-cyan-glow/70">{room.name}</span>
      <span className="mt-0.5 text-2xl font-semibold leading-none" style={{ color }}>
        {shown}
        {head?.unit && <span className="ml-1 text-sm opacity-70">{head.unit}</span>}
      </span>
      <span className="mt-0.5 text-[10px] uppercase tracking-wider opacity-50">
        {head?.label ?? 'no data'}
      </span>
    </motion.button>
  )
}

function formatNum(display: number, target: number): string {
  const decimals = Number.isInteger(target) ? 0 : target < 10 ? 2 : 1
  return display.toFixed(decimals)
}
