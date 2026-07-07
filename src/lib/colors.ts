import type { MetricStatus } from '../data/provider'

// Shared status -> color. Used by 3D labels and DOM cards alike.
export const STATUS_COLOR: Record<MetricStatus, string> = {
  normal: '#5ec8ff',
  warn: '#ffcf5e',
  alert: '#ff6b6b',
}

export const CYAN = '#5ec8ff'
export const CYAN_DIM = '#2a6a90'
