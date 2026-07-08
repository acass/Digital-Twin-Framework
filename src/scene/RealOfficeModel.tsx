import { Component, type ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLB_TRANSFORM, CALIBRATE } from '../data/realOffice'

const GLB_URL = '/office.glb'
useGLTF.preload(GLB_URL)

function Model() {
  const { scene } = useGLTF(GLB_URL)
  return (
    <group
      position={GLB_TRANSFORM.position}
      rotation={GLB_TRANSFORM.rotation}
      scale={GLB_TRANSFORM.scale}
      onClick={
        CALIBRATE
          ? (e) => {
              e.stopPropagation()
              const { x, y, z } = e.point
              // world coordinate of the clicked point -> use for room bounds
              console.log(`[calibrate] x=${x.toFixed(2)} y=${y.toFixed(2)} z=${z.toFixed(2)}`)
            }
          : undefined
      }
    >
      <primitive object={scene} />
    </group>
  )
}

// Missing/broken GLB shouldn't white-screen the app — degrade to nothing.
// (grid, sensor overlay and pick boxes still render.)
class GLBBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// Solid real-office mesh from public/office.glb, aligned via GLB_TRANSFORM.
// Must be rendered inside a <Suspense>.
export function RealOfficeModel() {
  return (
    <GLBBoundary>
      <Model />
    </GLBBoundary>
  )
}
