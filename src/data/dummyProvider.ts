import type { DataProvider, Metric, MetricStatus, Office, ModeId, Readings } from './provider'
import { MODES, type MetricSpec } from './modes'

// DummyProvider: seeds plausible values per (sensor, metric), random-walks them
// on a timer, and emits new target readings. Swap this for a real IoT provider
// implementing DataProvider with zero UI changes.

const DRIFT_MS = 3000

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function statusFor(spec: MetricSpec, value: number | string): MetricStatus {
  if (typeof value === 'string') {
    return spec.badValues?.includes(value) ? 'alert' : 'normal'
  }
  if (spec.alertAt !== undefined && value >= spec.alertAt) return 'alert'
  if (spec.warnAt !== undefined && value >= spec.warnAt) return 'warn'
  return 'normal'
}

export class DummyProvider implements DataProvider {
  // running numeric state: key = `${sensorId}:${metricKey}`
  private nums = new Map<string, number>()
  private enums = new Map<string, string>()

  private seedNum(key: string, spec: MetricSpec): number {
    let v = this.nums.get(key)
    if (v === undefined) {
      v = rand(spec.min ?? 0, spec.max ?? 1)
      this.nums.set(key, v)
    }
    return v
  }

  private driftNum(key: string, spec: MetricSpec): number {
    const min = spec.min ?? 0
    const max = spec.max ?? 1
    const cur = this.seedNum(key, spec)
    // random walk ~5% of range, clamp
    const step = (max - min) * 0.05 * (Math.random() * 2 - 1)
    const next = Math.min(max, Math.max(min, cur + step))
    this.nums.set(key, next)
    return next
  }

  private driftEnum(key: string, spec: MetricSpec): string {
    const values = spec.values ?? ['—']
    let cur = this.enums.get(key)
    if (cur === undefined) {
      cur = values[Math.floor(Math.random() * values.length)]
    } else if (Math.random() < 0.25) {
      // occasionally flip to keep it lively
      cur = values[Math.floor(Math.random() * values.length)]
    }
    this.enums.set(key, cur)
    return cur
  }

  private metricFor(sensorId: string, spec: MetricSpec, drift: boolean): Metric {
    const key = `${sensorId}:${spec.key}`
    if (spec.values) {
      const v = drift ? this.driftEnum(key, spec) : this.enums.get(key) ?? this.driftEnum(key, spec)
      return { label: spec.label, value: v, unit: spec.unit, status: statusFor(spec, v) }
    }
    const raw = drift ? this.driftNum(key, spec) : this.seedNum(key, spec)
    const value = Number(raw.toFixed(spec.decimals ?? 0))
    return { label: spec.label, value, unit: spec.unit, status: statusFor(spec, value) }
  }

  getReadings(office: Office, mode: ModeId): Readings {
    return this.compute(office, mode, false)
  }

  private compute(office: Office, mode: ModeId, drift: boolean): Readings {
    const byType = MODES[mode].byType
    const out: Readings = {}
    for (const r of office.rooms) {
      for (const s of r.sensors) {
        const specs = byType[s.type]
        out[s.id] = specs ? specs.map((spec) => this.metricFor(s.id, spec, drift)) : []
      }
    }
    return out
  }

  subscribe(office: Office, mode: ModeId, cb: (r: Readings) => void): () => void {
    const id = setInterval(() => cb(this.compute(office, mode, true)), DRIFT_MS)
    return () => clearInterval(id)
  }
}
