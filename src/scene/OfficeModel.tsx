import { Grid } from '@react-three/drei'
import { useTwinStore } from '../store/twinStore'
import { Room } from './Room'
import { CYAN_DIM } from '../lib/colors'

// Renders the office from store geometry. GLB LOADER SEAM:
// to use a real model, load a GLB whose nodes map to Room/Sensor shapes and
// feed that Office into the store instead of the procedural OFFICE. Rooms here
// render whatever geometry the store holds, so nothing downstream changes.
export function OfficeModel() {
  const office = useTwinStore((s) => s.office)

  return (
    <group>
      {/* grid floor */}
      <Grid
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.5}
        cellColor={CYAN_DIM}
        sectionSize={5}
        sectionThickness={1}
        sectionColor={CYAN_DIM}
        fadeDistance={45}
        fadeStrength={1.5}
        position={[0, 0, 0]}
        infiniteGrid
      />
      {office.rooms.map((r) => (
        <Room key={r.id} room={r} />
      ))}
    </group>
  )
}
