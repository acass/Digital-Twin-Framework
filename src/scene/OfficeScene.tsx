import { Canvas } from '@react-three/fiber'
import { OfficeModel } from './OfficeModel'
import { CameraRig } from './CameraRig'
import { Postprocessing } from './effects/Postprocessing'
import { useTwinStore } from '../store/twinStore'

export function OfficeScene() {
  const clearSelection = useTwinStore((s) => s.selectRoom)

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [18, 16, 22], fov: 50 }}
      gl={{ antialias: true }}
      onPointerMissed={() => clearSelection(null)}
    >
      <color attach="background" args={['#05080f']} />
      <fog attach="fog" args={['#05080f', 25, 70]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 20, 10]} intensity={0.6} color="#8fd0ff" />
      <pointLight position={[0, 12, 0]} intensity={40} color="#5ec8ff" distance={50} />

      <OfficeModel />
      <CameraRig />
      <Postprocessing />
    </Canvas>
  )
}
