import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { spreadAtDepth } from './geometry'
import { createPlanetTexture, createCometTexture } from './celestialTextures'
import { planetPalettes, cometColors } from './palette'

const PLANET_COUNT = 7
const COMET_COUNT = 5
const FAR_DEPTH = -240
const NEAR_DEPTH = -40
const RECYCLE_DEPTH = -3
const DRIFT_SPEED = 1.1
const WARP_SPEED = 170

export default function CelestialBodies({ journeyRef, halfWidth, halfHeight, frozen }) {
  const groupRef = useRef(null)

  const bodies = useMemo(
    () => [
      ...buildPlanets(halfWidth, halfHeight),
      ...buildComets(halfWidth, halfHeight),
    ],
    [halfWidth, halfHeight],
  )

  useFrame((_, delta) => {
    if (frozen || !groupRef.current) return

    const { lightFraction } = journeyRef.current
    const step = (DRIFT_SPEED + lightFraction * WARP_SPEED) * Math.min(delta, 0.1)

    groupRef.current.children.forEach((child) => {
      child.position.z += step * child.userData.speed
      if (child.position.z > RECYCLE_DEPTH) {
        child.position.z = FAR_DEPTH
        scatter(child, halfWidth, halfHeight)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {bodies.map((body) => (
        <mesh
          key={body.key}
          position={body.position}
          rotation={[0, 0, body.rotation]}
          userData={{ speed: body.speed }}
        >
          <planeGeometry args={[body.size, body.size]} />
          <meshBasicMaterial map={body.texture} transparent depthWrite={false} opacity={body.opacity} />
        </mesh>
      ))}
    </group>
  )
}

function buildPlanets(halfWidth, halfHeight) {
  return Array.from({ length: PLANET_COUNT }, (_, index) => {
    const depth = FAR_DEPTH + ((NEAR_DEPTH - FAR_DEPTH) * index) / PLANET_COUNT
    const spread = spreadAtDepth(depth, halfWidth, halfHeight)
    return {
      key: `planet-${index}`,
      texture: createPlanetTexture(planetPalettes[index % planetPalettes.length], index + 1),
      size: 5 + (index % 4) * 2.5,
      speed: 0.5 + (index % 3) * 0.2,
      rotation: (index / PLANET_COUNT) * 0.6 - 0.3,
      opacity: 0.95,
      position: randomPosition(spread, depth),
    }
  })
}

function buildComets(halfWidth, halfHeight) {
  return Array.from({ length: COMET_COUNT }, (_, index) => {
    const depth = -30 - index * 22
    const spread = spreadAtDepth(depth, halfWidth, halfHeight)
    return {
      key: `comet-${index}`,
      texture: createCometTexture(cometColors[index % cometColors.length]),
      size: 3.5 + (index % 3) * 1.5,
      speed: 1.3 + (index % 3) * 0.35,
      rotation: (index % 2 === 0 ? 1 : -1) * (0.2 + index * 0.12),
      opacity: 0.9,
      position: randomPosition(spread, depth),
    }
  })
}

function randomPosition(spread, depth) {
  return [(Math.random() - 0.5) * 2 * spread.x, (Math.random() - 0.5) * 2 * spread.y, depth]
}

function scatter(child, halfWidth, halfHeight) {
  const spread = spreadAtDepth(child.position.z, halfWidth, halfHeight)
  child.position.x = (Math.random() - 0.5) * 2 * spread.x
  child.position.y = (Math.random() - 0.5) * 2 * spread.y
}
