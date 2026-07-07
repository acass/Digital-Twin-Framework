// Data seam. v1 = DummyProvider. Live IoT later implements the same interface.

export type MetricStatus = 'normal' | 'warn' | 'alert'

export interface Metric {
  label: string
  value: number | string
  unit: string
  status: MetricStatus
}

export type SensorType =
  | 'climate' // temp/humidity/air
  | 'light'
  | 'power'
  | 'door'
  | 'motion'
  | 'network'

export interface Sensor {
  id: string
  type: SensorType
  // position relative to room center, in world units
  position: [number, number, number]
}

export interface Room {
  id: string
  name: string
  // floor-plane bounds: center x/z and width(x)/depth(z)
  bounds: { x: number; z: number; w: number; d: number }
  sensors: Sensor[]
}

export interface Office {
  rooms: Room[]
}

export type ModeId =
  | 'overview'
  | 'climate'
  | 'energy'
  | 'lighting'
  | 'security'
  | 'occupancy'
  | 'network'
  | 'maintenance'

// readings[sensorId] = current target metrics for the active mode
export type Readings = Record<string, Metric[]>

export interface DataProvider {
  // compute target metrics for every sensor under a given mode
  getReadings(office: Office, mode: ModeId): Readings
  // push new targets on a timer; returns an unsubscribe fn
  subscribe(office: Office, mode: ModeId, cb: (r: Readings) => void): () => void
}
