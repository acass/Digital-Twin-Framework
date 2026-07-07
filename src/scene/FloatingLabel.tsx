import { Html } from '@react-three/drei'
import { useTwinStore } from '../store/twinStore'
import { STATUS_COLOR } from '../lib/colors'
import { useLerpedValue } from '../hooks/useLerpedValue'
import type { Metric } from '../data/provider'

// Always-on minimal holographic label. Shows the sensor's headline metric.
// Numeric values lerp smoothly via useLerpedValue; enum values swap directly.
export function FloatingLabel({ sensorId, y }: { sensorId: string; y: number }) {
  const metrics = useTwinStore((s) => s.readings[sensorId])
  const head: Metric | undefined = metrics?.[0]
  const numeric = typeof head?.value === 'number'
  const lerped = useLerpedValue(numeric ? (head!.value as number) : 0)

  if (!head) return null
  const color = STATUS_COLOR[head.status]
  const shown = numeric ? formatNum(lerped, head.value as number) : head.value

  return (
    <Html position={[0, y, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
      <div
        className="select-none whitespace-nowrap rounded px-1.5 py-0.5 text-center leading-tight"
        style={{
          background: 'rgba(5, 12, 22, 0.72)',
          border: `1px solid ${color}66`,
          boxShadow: `0 0 10px ${color}55`,
          color,
          fontSize: 11,
          fontWeight: 600,
          transform: 'translateZ(0)',
        }}
      >
        <div style={{ opacity: 0.7, fontSize: 8, letterSpacing: 0.5 }}>
          {head.label.toUpperCase()}
        </div>
        <div>
          {shown}
          {head.unit && <span style={{ opacity: 0.7, fontSize: 9 }}> {head.unit}</span>}
        </div>
      </div>
    </Html>
  )
}

// keep display decimals matching the target's magnitude
function formatNum(display: number, target: number): string {
  const decimals = Number.isInteger(target) ? 0 : target < 10 ? 2 : 1
  return display.toFixed(decimals)
}
