import type { Office, Room, Sensor, SensorType } from './provider'

// Real office layout, hand-authored to match a real GLB mesh (public/office.glb).
// Same Office/Room/Sensor shape as the procedural office.ts, so every downstream
// consumer (OfficeModel, Room, SensorLayer, CameraRig, store, DummyProvider) works
// unchanged. Trace `bounds` and sensor anchors from your GLB's room extents, then
// tune GLB_TRANSFORM below until the mesh lines up with these bounds.

// Calibration mode: shows the room pick boxes over the GLB and logs the world
// coordinate of any point you click on the model, so you can read off each room's
// center (x,z) and size (w,d) to author `bounds` below. Set false when aligned.
export const CALIBRATE = true

// Transform applied to the GLB mesh so it aligns with the authored room bounds.
// A real export rarely lands at the origin at the right scale/orientation.
// ponytail: this is the calibration knob, tune by eye in the running app.
export const GLB_TRANSFORM = {
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number], // radians, [x, y, z]
  scale: 1,
}

let sid = 0
const sensor = (type: SensorType, position: [number, number, number]): Sensor => ({
  id: `r${sid++}`,
  type,
  position,
})

// room with sensors spread across its footprint at label height (mirrors office.ts)
const room = (
  id: string,
  name: string,
  x: number,
  z: number,
  w: number,
  d: number,
  types: SensorType[],
): Room => {
  const sensors = types.map((t, i) => {
    const cols = Math.ceil(Math.sqrt(types.length))
    const col = i % cols
    const rowN = Math.floor(i / cols)
    const px = (col - (cols - 1) / 2) * (w / (cols + 1))
    const pz = (rowN - 0.5) * (d / 3)
    return sensor(t, [px, 1.4, pz])
  })
  return { id, name, bounds: { x, z, w, d }, sensors }
}

// Placeholder layout mirroring the generic office. Replace names/bounds/sensor sets
// with the REAL rooms traced from public/office.glb.
export function buildRealOffice(): Office {
  const rooms: Room[] = [
    room('reception', 'Reception', -8, -3.5, 8, 7, ['climate', 'light', 'door', 'motion']),
    room('conference', 'Conference Room', 0, -3.5, 8, 7, ['climate', 'light', 'motion', 'power']),
    room('manager', 'Manager Office', 8, -3.5, 8, 7, ['climate', 'light', 'power']),
    room('open-office', 'Open Office', -4.5, 3.5, 15, 7, ['climate', 'light', 'motion', 'power']),
    room('server', 'Server Room', 6, 3.5, 6, 7, ['climate', 'power', 'network', 'door']),
    room('kitchen', 'Kitchen', 10.5, 3.5, 3, 7, ['climate', 'light']),
  ]
  return { rooms }
}

export const REAL_OFFICE = buildRealOffice()
