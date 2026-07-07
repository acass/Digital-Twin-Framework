import type { ModeId, SensorType } from './provider'

// A metric spec describes how to generate ONE floating value for a sensor
// under a given mode. DummyProvider reads these to seed + drift values.
// status thresholds are optional; omit for enum/string metrics.
export interface MetricSpec {
  key: string
  label: string
  unit: string
  // numeric metrics: drift within [min,max]; enum metrics: pick from values
  min?: number
  max?: number
  decimals?: number
  values?: string[] // for enum/string metrics (e.g. ON/OFF, LOCKED)
  // status band: value >= warnAt -> warn, >= alertAt -> alert (or use badValues)
  warnAt?: number
  alertAt?: number
  badValues?: string[] // enum values that mean warn/alert
}

export interface ModeConfig {
  id: ModeId
  label: string
  // which metrics each sensor type exposes in this mode
  byType: Partial<Record<SensorType, MetricSpec[]>>
}

// Helpers to cut repetition
const n = (
  key: string,
  label: string,
  unit: string,
  min: number,
  max: number,
  decimals = 1,
  warnAt?: number,
  alertAt?: number,
): MetricSpec => ({ key, label, unit, min, max, decimals, warnAt, alertAt })

const enumM = (
  key: string,
  label: string,
  values: string[],
  badValues: string[] = [],
): MetricSpec => ({ key, label, unit: '', values, badValues })

export const MODES: Record<ModeId, ModeConfig> = {
  overview: {
    id: 'overview',
    label: 'Overview',
    byType: {
      climate: [n('temp', 'Temperature', '°F', 66, 79, 0, 77, 82)],
      light: [enumM('light', 'Lights', ['ON', 'OFF'])],
      power: [n('power', 'Power', 'kW', 1.5, 4.5, 1, 4, 5)],
      door: [enumM('door', 'Door', ['LOCKED', 'OPEN'], ['OPEN'])],
      motion: [enumM('motion', 'Motion', ['CLEAR', 'ACTIVE'])],
      network: [n('net', 'Latency', 'ms', 5, 40, 0, 30, 60)],
    },
  },
  climate: {
    id: 'climate',
    label: 'Climate',
    byType: {
      climate: [
        n('temp', 'Temperature', '°F', 66, 79, 0, 77, 82),
        n('humidity', 'Humidity', '%', 38, 60, 0, 55, 65),
        n('aq', 'Air Quality', 'AQI', 10, 80, 0, 50, 70),
        n('co2', 'CO₂', 'ppm', 400, 1100, 0, 800, 1000),
        n('airflow', 'Air Flow', 'm³/h', 80, 260, 0),
      ],
    },
  },
  energy: {
    id: 'energy',
    label: 'Energy',
    byType: {
      power: [
        n('watts', 'Power', 'kW', 1.5, 4.5, 2, 4, 5),
        n('voltage', 'Voltage', 'V', 228, 242, 0),
        n('current', 'Current', 'A', 6, 20, 1, 16, 18),
        enumM('breaker', 'Breaker', ['OK', 'TRIP'], ['TRIP']),
        n('ups', 'UPS', '%', 60, 100, 0),
      ],
    },
  },
  lighting: {
    id: 'lighting',
    label: 'Lighting',
    byType: {
      light: [
        enumM('status', 'Light', ['ON', 'OFF']),
        n('bright', 'Brightness', '%', 0, 100, 0),
        n('draw', 'Power Draw', 'W', 4, 60, 0),
        n('health', 'Bulb Health', '%', 70, 100, 0, 80, 75),
        n('runtime', 'Runtime', 'h', 100, 9000, 0),
      ],
    },
  },
  security: {
    id: 'security',
    label: 'Security',
    byType: {
      door: [
        enumM('door', 'Door', ['LOCKED', 'OPEN'], ['OPEN']),
        enumM('badge', 'Badge', ['IDLE', 'GRANTED', 'DENIED'], ['DENIED']),
      ],
      motion: [
        enumM('motion', 'Motion', ['CLEAR', 'DETECTED']),
        enumM('camera', 'Camera', ['ONLINE', 'OFFLINE'], ['OFFLINE']),
      ],
    },
  },
  occupancy: {
    id: 'occupancy',
    label: 'Occupancy',
    byType: {
      motion: [
        n('people', 'People', '', 0, 12, 0),
        enumM('meeting', 'Meeting', ['FREE', 'IN USE']),
      ],
      climate: [n('desks', 'Desk Usage', '%', 0, 100, 0)],
    },
  },
  network: {
    id: 'network',
    label: 'Network',
    byType: {
      network: [
        n('latency', 'Latency', 'ms', 5, 60, 0, 30, 60),
        n('throughput', 'Throughput', 'Mbps', 50, 950, 0),
        n('loss', 'Packet Loss', '%', 0, 5, 1, 1, 3),
        enumM('link', 'Link', ['UP', 'DEGRADED'], ['DEGRADED']),
      ],
    },
  },
  maintenance: {
    id: 'maintenance',
    label: 'Maintenance',
    byType: {
      power: [
        n('health', 'Equip Health', '%', 60, 100, 0, 80, 70),
        n('due', 'Maint Due', 'days', 0, 90, 0, 14, 5),
      ],
      climate: [n('filter', 'Filter Life', '%', 20, 100, 0, 40, 25)],
    },
  },
}

export const MODE_LIST = Object.values(MODES)
