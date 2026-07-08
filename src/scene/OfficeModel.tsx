import { Suspense } from 'react'
import { Grid } from '@react-three/drei'
import { useTwinStore } from '../store/twinStore'
import { Room } from './Room'
import { SensorLayer } from './SensorLayer'
import { RealOfficeModel } from './RealOfficeModel'
import { CYAN_DIM } from '../lib/colors'

// Renders the office from store geometry. Two visual modes off store.viewMode:
//   solid     -> real GLB mesh (public/office.glb) + invisible pick boxes
//   wireframe -> cyan wireframe boxes (the original look)
// The holographic SensorLayer overlays in BOTH modes.
export function OfficeModel() {
  const office = useTwinStore((s) => s.office)
  const viewMode = useTwinStore((s) => s.viewMode)
  const solid = viewMode === 'solid'

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

      {solid && (
        <Suspense fallback={null}>
          <RealOfficeModel />
        </Suspense>
      )}

      {/* room boxes: full wireframe in wireframe mode, invisible pick boxes in solid */}
      {office.rooms.map((r) => (
        <Room key={r.id} room={r} pickOnly={solid} />
      ))}

      <SensorLayer />
    </group>
  )
}
