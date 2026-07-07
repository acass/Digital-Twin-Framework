import type { Office, Room, Sensor, SensorType } from './provider'

// Procedural low-poly office. Geometry only — no values here.
// Rooms laid out on the X/Z floor plane; y is up.
// This is the GLB loader seam: replace buildOffice() with a GLB parse later,
// keeping the same Office/Room/Sensor shape and OfficeModel renders it as-is.

let sid = 0
const sensor = (type: SensorType, position: [number, number, number]): Sensor => ({
  id: `s${sid++}`,
  type,
  position,
})

// helper: room with sensors placed near its center at label height
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
    // spread sensors across the room footprint
    const cols = Math.ceil(Math.sqrt(types.length))
    const col = i % cols
    const rowN = Math.floor(i / cols)
    const px = (col - (cols - 1) / 2) * (w / (cols + 1))
    const pz = (rowN - 0.5) * (d / 3)
    return sensor(t, [px, 1.4, pz])
  })
  return { id, name, bounds: { x, z, w, d }, sensors }
}

// Footprint ~ 24 wide (X) x 14 deep (Z), centered at origin.
export function buildOffice(): Office {
  const rooms: Room[] = [
    room('reception', 'Reception', -8, -3.5, 8, 7, ['climate', 'light', 'door', 'motion']),
    room('conference', 'Conference Room', 0, -3.5, 8, 7, ['climate', 'light', 'motion', 'power']),
    room('manager', 'Manager Office', 8, -3.5, 8, 7, ['climate', 'light', 'power']),
    room('open-office', 'Open Office', -4, 3.5, 16, 7, ['climate', 'light', 'motion', 'power']),
    room('server', 'Server Room', 6, 3.5, 6, 7, ['climate', 'power', 'network', 'door']),
    room('kitchen', 'Kitchen', 10.5, 3.5, 3, 7, ['climate', 'light']),
  ]
  return { rooms }
}

export const OFFICE = buildOffice()
