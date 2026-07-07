import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Sensor as SensorT } from '../data/provider'
import { useTwinStore } from '../store/twinStore'
import { STATUS_COLOR } from '../lib/colors'
import { FloatingLabel } from './FloatingLabel'

export function Sensor({
  sensor,
  roomId,
  floorY,
}: {
  sensor: SensorT
  roomId: string
  floorY: number
}) {
  const meshRef = useRef<Mesh>(null)
  const metrics = useTwinStore((s) => s.readings[sensor.id])
  const selectSensor = useTwinStore((s) => s.selectSensor)
  const isSelected = useTwinStore((s) => s.selection.sensorId === sensor.id)

  const status = metrics?.[0]?.status ?? 'normal'
  const color = STATUS_COLOR[status]

  // gentle float + pulse
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.position.y = sensor.position[1] + Math.sin(t * 1.5 + sensor.position[0]) * 0.08
    const s = 1 + Math.sin(t * 3 + sensor.position[2]) * 0.08
    meshRef.current.scale.setScalar(s * (isSelected ? 1.5 : 1))
  })

  // sensors have no metrics in some modes -> dim marker, no label
  const hasData = metrics && metrics.length > 0

  const [px, , pz] = sensor.position
  void floorY

  return (
    <group position={[px, 0, pz]}>
      <mesh
        ref={meshRef}
        position={[0, sensor.position[1], 0]}
        onClick={(e) => {
          e.stopPropagation()
          selectSensor(isSelected ? null : sensor.id, roomId)
        }}
      >
        <icosahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hasData ? 2.2 : 0.4}
          transparent
          opacity={hasData ? 1 : 0.35}
        />
      </mesh>
      {hasData && <FloatingLabel sensorId={sensor.id} y={sensor.position[1] + 0.5} />}
    </group>
  )
}
