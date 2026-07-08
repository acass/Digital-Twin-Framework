import { useTwinStore } from '../store/twinStore'
import { Sensor } from './Sensor'

// Holographic sensor/label overlay, decoupled from the wireframe Room so it renders
// in BOTH wireframe and solid modes. Each sensor group sits at its room center +
// wall-half-height, matching the placement Room used to give it.
const WALL_H = 3

export function SensorLayer() {
  const office = useTwinStore((s) => s.office)

  return (
    <group>
      {office.rooms.map((r) => (
        <group key={r.id} position={[r.bounds.x, WALL_H / 2, r.bounds.z]}>
          {r.sensors.map((s) => (
            <Sensor key={s.id} sensor={s} roomId={r.id} floorY={-WALL_H / 2} />
          ))}
        </group>
      ))}
    </group>
  )
}
