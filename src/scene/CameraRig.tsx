import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useTwinStore } from '../store/twinStore'

const DEFAULT_POS = new Vector3(18, 16, 22)
const DEFAULT_TARGET = new Vector3(0, 0, 0)

// OrbitControls + smooth fly-to-selected-room + reset.
export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const office = useTwinStore((s) => s.office)
  const selectedRoomId = useTwinStore((s) => s.selection.roomId)

  // animation targets
  const wantPos = useRef(DEFAULT_POS.clone())
  const wantTarget = useRef(DEFAULT_TARGET.clone())
  const animating = useRef(false)

  useEffect(() => {
    if (!selectedRoomId) {
      wantPos.current.copy(DEFAULT_POS)
      wantTarget.current.copy(DEFAULT_TARGET)
    } else {
      const room = office.rooms.find((r) => r.id === selectedRoomId)
      if (room) {
        const { x, z } = room.bounds
        wantTarget.current.set(x, 1.5, z)
        wantPos.current.set(x + 8, 9, z + 10)
      }
    }
    animating.current = true
  }, [selectedRoomId, office])

  useFrame(() => {
    if (!animating.current || !controls.current) return
    camera.position.lerp(wantPos.current, 0.08)
    controls.current.target.lerp(wantTarget.current, 0.08)
    controls.current.update()
    if (
      camera.position.distanceTo(wantPos.current) < 0.05 &&
      controls.current.target.distanceTo(wantTarget.current) < 0.05
    ) {
      animating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controls}
      enablePan
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.1}
    />
  )
}
