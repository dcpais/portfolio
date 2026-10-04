import { useMemo } from 'react'
import * as THREE from 'three'
import { spreadAtDepth } from './geometry'
import { palette } from './palette'
import {
  BACKDROP_FRAGMENT_SHADER,
  CLOUD_FRAGMENT_SHADER,
  RADIAL_VERTEX_SHADER,
} from './shaders'

const BACKDROP_DEPTH = -272

// Higher values hold the darker end across more of the screen.
const BACKDROP_CURVE = 1.35

// These blend additively, so strength here is pure added brightness.
const CLOUDS = [
  { depth: -230, tint: palette.nebulaBlue, strength: 0.15, offset: [-0.38, 0.2] },
  { depth: -196, tint: palette.nebulaRed, strength: 0.1, offset: [0.42, -0.24] },
  { depth: -150, tint: palette.nebulaGreen, strength: 0.09, offset: [0.12, 0.34] },
]

/** Graded deep-space backdrop plus soft colour, so space is never flat black. */
export default function Backdrop({ halfWidth, halfHeight }) {
  const { backdrop, clouds } = useMemo(() => {
    const spread = spreadAtDepth(BACKDROP_DEPTH, halfWidth, halfHeight)
    const width = spread.x * 2.4
    const height = spread.y * 2.4

    return {
      backdrop: {
        width,
        height,
        uniforms: {
          uCore: { value: new THREE.Color(palette.backdropCore) },
          uEdge: { value: new THREE.Color(palette.backdropEdge) },
          uAspect: { value: width / height },
          uCurve: { value: BACKDROP_CURVE },
        },
      },
      clouds: CLOUDS.map((cloud) => ({
        ...cloud,
        spread: spreadAtDepth(cloud.depth, halfWidth, halfHeight),
        uniforms: {
          uTint: { value: new THREE.Color(cloud.tint) },
          uStrength: { value: cloud.strength },
        },
      })),
    }
  }, [halfWidth, halfHeight])

  return (
    <group>
      <mesh position={[0, 0, BACKDROP_DEPTH]}>
        <planeGeometry args={[backdrop.width, backdrop.height]} />
        <shaderMaterial
          vertexShader={RADIAL_VERTEX_SHADER}
          fragmentShader={BACKDROP_FRAGMENT_SHADER}
          uniforms={backdrop.uniforms}
          depthWrite={false}
        />
      </mesh>

      {clouds.map((cloud) => (
        <mesh
          key={cloud.depth}
          position={[
            cloud.spread.x * cloud.offset[0] * 2,
            cloud.spread.y * cloud.offset[1] * 2,
            cloud.depth,
          ]}
        >
          <planeGeometry args={[cloud.spread.x * 2.4, cloud.spread.y * 2.4]} />
          <shaderMaterial
            vertexShader={RADIAL_VERTEX_SHADER}
            fragmentShader={CLOUD_FRAGMENT_SHADER}
            uniforms={cloud.uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
