import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { spreadAtDepth } from './geometry'
import { streakIntensity, streakReach } from './traversal'

const STAR_COUNT = 2200
const STREAK_COUNT = 900
const FAR_DEPTH = -280
const RECYCLE_DEPTH = -1.6
const SPREAD_MARGIN = 1.35
const DRIFT_SPEED = 1.4
const WARP_SPEED = 320

const STAR_TINTS = [
  [1.0, 1.0, 1.0],
  [0.92, 0.95, 1.0],
  [1.0, 0.85, 0.35],
  [0.3, 0.89, 0.9],
  [1.0, 0.55, 0.7],
]

export default function Starfield({ journeyRef, halfWidth, halfHeight, frozen }) {
  const streakMaterialRef = useRef(null)

  const { starGeometry, streakGeometry, speeds } = useMemo(
    () => buildStarfield(halfWidth, halfHeight),
    [halfWidth, halfHeight],
  )

  useFrame((_, delta) => {
    if (frozen) return

    const { lightFraction } = journeyRef.current
    const step = (DRIFT_SPEED + lightFraction * WARP_SPEED) * Math.min(delta, 0.1)
    const positions = starGeometry.attributes.position.array

    for (let index = 0; index < STAR_COUNT; index += 1) {
      const zSlot = index * 3 + 2
      positions[zSlot] += step * speeds[index]
      if (positions[zSlot] > RECYCLE_DEPTH) {
        placeStar(positions, index, FAR_DEPTH, halfWidth, halfHeight)
      }
    }
    starGeometry.attributes.position.needsUpdate = true

    updateStreaks(streakGeometry, streakMaterialRef.current, positions, speeds, lightFraction)
  })

  return (
    <group>
      <points geometry={starGeometry} frustumCulled={false}>
        <pointsMaterial
          size={0.045}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments geometry={streakGeometry} frustumCulled={false}>
        <lineBasicMaterial
          ref={streakMaterialRef}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

function buildStarfield(halfWidth, halfHeight) {
  const positions = new Float32Array(STAR_COUNT * 3)
  const colors = new Float32Array(STAR_COUNT * 3)
  const speeds = new Float32Array(STAR_COUNT)

  for (let index = 0; index < STAR_COUNT; index += 1) {
    placeStar(positions, index, FAR_DEPTH * Math.random(), halfWidth, halfHeight)

    const tint = STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)]
    const intensity = 0.45 + Math.random() * 0.55
    colors[index * 3] = tint[0] * intensity
    colors[index * 3 + 1] = tint[1] * intensity
    colors[index * 3 + 2] = tint[2] * intensity

    speeds[index] = 0.6 + Math.random() * 0.9
  }

  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Each streak is a pair of vertices: the star, and where it was moments ago.
  const streakPositions = new Float32Array(STREAK_COUNT * 6)
  const streakColors = new Float32Array(STREAK_COUNT * 6)
  for (let index = 0; index < STREAK_COUNT; index += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      streakColors[index * 6 + channel] = colors[index * 3 + channel]
      streakColors[index * 6 + 3 + channel] = colors[index * 3 + channel] * 0.15
    }
  }
  const streakGeometry = new THREE.BufferGeometry()
  streakGeometry.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3))
  streakGeometry.setAttribute('color', new THREE.BufferAttribute(streakColors, 3))

  return { starGeometry, streakGeometry, speeds }
}

function updateStreaks(streakGeometry, material, positions, speeds, lightFraction) {
  if (!material) return

  const intensity = streakIntensity(lightFraction)
  material.opacity = intensity
  if (intensity <= 0) return

  const streaks = streakGeometry.attributes.position.array
  const reach = streakReach(lightFraction)

  for (let index = 0; index < STREAK_COUNT; index += 1) {
    const x = positions[index * 3]
    const y = positions[index * 3 + 1]
    const z = positions[index * 3 + 2]
    streaks[index * 6] = x
    streaks[index * 6 + 1] = y
    streaks[index * 6 + 2] = z
    streaks[index * 6 + 3] = x
    streaks[index * 6 + 4] = y
    streaks[index * 6 + 5] = z - reach * speeds[index]
  }
  streakGeometry.attributes.position.needsUpdate = true
}

function placeStar(positions, index, depth, halfWidth, halfHeight) {
  const spread = spreadAtDepth(depth, halfWidth, halfHeight)
  positions[index * 3] = (Math.random() - 0.5) * 2 * spread.x * SPREAD_MARGIN
  positions[index * 3 + 1] = (Math.random() - 0.5) * 2 * spread.y * SPREAD_MARGIN
  positions[index * 3 + 2] = depth
}
