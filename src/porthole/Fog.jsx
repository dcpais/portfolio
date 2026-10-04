import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { spreadAtDepth } from './geometry'
import { palette } from './palette'
import { FOG_FRAGMENT_SHADER, RADIAL_VERTEX_SHADER } from './shaders'

// Layers at different depths so the banks separate as you travel through them.
// Two layers rather than three: each one is now a much heavier fragment
// shader, and two depths are enough to separate as you travel through them.
const LAYERS = [
  { depth: -10, tint: palette.fogWarm, strength: 0.3, scale: 4, drift: 0.05 },
  { depth: -6000, tint: palette.fogCool, strength: 0.26, scale: 5, drift: 0.1 },
]

const IDLE_DRIFT = 0.25
const TRAVEL_DRIFT = 34

/** Soft cloud banks spread across the view, drifting as the journey advances. */
export default function Fog({ journeyRef, halfWidth, halfHeight, frozen }) {
  const layers = useMemo(
    () =>
      LAYERS.map((layer) => {
        const spread = spreadAtDepth(layer.depth, halfWidth, halfHeight)
        return {
          ...layer,
          width: spread.x * 2.3,
          height: spread.y * 2.3,
          // three.js uses this object directly, so the frame loop can move the
          // cloud by writing to it without going through the material.
          uniforms: {
            uTint: { value: new THREE.Color(layer.tint) },
            uStrength: { value: layer.strength },
            uScale: { value: layer.scale },
            uOffset: { value: new THREE.Vector2(layer.depth * 0.37, layer.depth * 0.11) },
          },
        }
      }),
    [halfWidth, halfHeight],
  )

  useFrame((_, delta) => {
    if (frozen) return

    const { lightFraction } = journeyRef.current
    const step = (IDLE_DRIFT + lightFraction * TRAVEL_DRIFT) * Math.min(delta, 0.1)

    layers.forEach((layer) => {
      layer.uniforms.uOffset.value.y -= step * layer.drift
      layer.uniforms.uOffset.value.x += step * layer.drift * 0.13
    })
  })

  return (
    <group>
      {layers.map((layer) => (
        <mesh key={layer.depth} position={[0, 0, layer.depth]}>
          <planeGeometry args={[layer.width, layer.height]} />
          <shaderMaterial
            vertexShader={RADIAL_VERTEX_SHADER}
            fragmentShader={FOG_FRAGMENT_SHADER}
            uniforms={layer.uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
