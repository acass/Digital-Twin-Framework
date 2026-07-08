import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import type { Room as RoomT } from '../data/provider'
import { useTwinStore } from '../store/twinStore'
import { CYAN, CYAN_DIM } from '../lib/colors'
import { CALIBRATE } from '../data/realOffice'

const WALL_H = 3

// pickOnly: render just the invisible fill for hover/click (solid mode), no cyan edges.
export function Room({ room, pickOnly = false }: { room: RoomT; pickOnly?: boolean }) {
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
          opacity={
            pickOnly
              ? isSelected
                ? 0.08
                : isHovered
                  ? 0.05
                  : CALIBRATE
                    ? 0.04
                    : 0
              : isSelected
                ? 0.1
                : isHovered
                  ? 0.06
                  : 0.02
          }
        />
        {(!pickOnly || CALIBRATE) && <Edges threshold={15} color={edgeColor} />}
      </mesh>
    </group>
  )
}
