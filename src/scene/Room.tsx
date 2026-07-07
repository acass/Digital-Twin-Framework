import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import type { Room as RoomT } from '../data/provider'
import { useTwinStore } from '../store/twinStore'
import { CYAN, CYAN_DIM } from '../lib/colors'
import { Sensor } from './Sensor'

const WALL_H = 3

export function Room({ room }: { room: RoomT }) {
  const { x, z, w, d } = room.bounds
  const selectRoom = useTwinStore((s) => s.selectRoom)
  const setHovered = useTwinStore((s) => s.setHovered)
  const selectedRoomId = useTwinStore((s) => s.selection.roomId)
  const hoveredRoomId = useTwinStore((s) => s.hoveredRoomId)

  const isSelected = selectedRoomId === room.id
  const isHovered = hoveredRoomId === room.id
  const edgeColor = isSelected ? '#ffffff' : isHovered ? CYAN : CYAN_DIM

  // wireframe box centered on room, sitting on the floor
  const geo = useMemo(() => [w, WALL_H, d] as [number, number, number], [w, d])

  return (
    <group position={[x, WALL_H / 2, z]}>
      {/* invisible fill mesh carries hover/click + faint glass look */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(room.id)
        }}
        onPointerOut={() => setHovered(null)}
        onClick={(e) => {
          e.stopPropagation()
          selectRoom(isSelected ? null : room.id)
        }}
      >
        <boxGeometry args={geo} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={isSelected ? 0.1 : isHovered ? 0.06 : 0.02}
        />
        <Edges threshold={15} color={edgeColor} />
      </mesh>

      {/* sensors are positioned relative to room center */}
      {room.sensors.map((s) => (
        <Sensor key={s.id} sensor={s} roomId={room.id} floorY={-WALL_H / 2} />
      ))}
    </group>
  )
}
