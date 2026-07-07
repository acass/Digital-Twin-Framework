import { create } from 'zustand'
import type { ModeId, Office, Readings } from '../data/provider'
import { OFFICE } from '../data/office'
import { DummyProvider } from '../data/dummyProvider'

// Single source of truth. Swap `provider` for a live DataProvider later.
const provider = new DummyProvider()

interface Selection {
  roomId: string | null
  sensorId: string | null
}

interface TwinState {
  office: Office
  activeMode: ModeId
  selection: Selection
  readings: Readings // current target values, keyed by sensorId
  hoveredRoomId: string | null

  setMode: (mode: ModeId) => void
  selectRoom: (roomId: string | null) => void
  selectSensor: (sensorId: string | null, roomId: string | null) => void
  setHovered: (roomId: string | null) => void
  applyReadings: (r: Readings) => void
  refresh: () => void // recompute targets for current mode (used on tick subscribe)
}

export const useTwinStore = create<TwinState>((set, get) => ({
  office: OFFICE,
  activeMode: 'overview',
  selection: { roomId: null, sensorId: null },
  readings: provider.getReadings(OFFICE, 'overview'),
  hoveredRoomId: null,

  setMode: (mode) =>
    set({ activeMode: mode, readings: provider.getReadings(get().office, mode) }),

  selectRoom: (roomId) => set({ selection: { roomId, sensorId: null } }),
  selectSensor: (sensorId, roomId) => set({ selection: { roomId, sensorId } }),
  setHovered: (roomId) => set({ hoveredRoomId: roomId }),
  applyReadings: (r) => set({ readings: r }),
  refresh: () => set({ readings: provider.getReadings(get().office, get().activeMode) }),
}))

// expose provider so hooks can subscribe to drift
export { provider }
