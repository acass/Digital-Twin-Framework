import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

// Holographic glow: bloom on emissive sensors/labels + soft vignette.
export function Postprocessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  )
}
