import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { waypoints } from '../content/waypoints'
import { createPlanetTexture } from './celestialTextures'
import { planetPalettes } from './palette'
import { FADE_IN_DEPTH, isLandmarkVisible, landmarkDepth, landmarkOpacity } from './traversal'

// Closest approach sits just off to one side, large enough to fill the edge.
const LATERAL_OFFSET = 5.2

/**
 * One body per waypoint, placed by how far along the journey you are rather
 * than by a drift timer — so each section is somewhere you arrive at and pass.
 */
export default function Landmarks({ journeyRef, frozen }) {
  const groupRef = useRef(null)

  const landmarks = useMemo(
    () =>
      waypoints.map((waypoint, index) => ({
        id: waypoint.id,
        texture: createPlanetTexture(planetPalettes[index % planetPalettes.length], index + 11),
        size: 11 + (index % 3) * 4,
        lateral: (index % 2 === 0 ? 1 : -1) * LATERAL_OFFSET,
        vertical: (index % 3 === 1 ? 1 : -1) * LATERAL_OFFSET * 0.42,
        spin: (index % 2 === 0 ? 1 : -1) * 0.25,
      })),
    [],
  )

  useFrame(() => {
    const group = groupRef.current
    if (!group || frozen) return

    const { sectionTravel } = journeyRef.current

    group.children.forEach((child, index) => {
      const depth = landmarkDepth(index, sectionTravel)
      child.position.z = depth
      child.visible = isLandmarkVisible(depth)
      if (child.visible) {
        child.material.opacity = landmarkOpacity(depth)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {landmarks.map((landmark) => (
        <mesh
          key={landmark.id}
          position={[landmark.lateral, landmark.vertical, FADE_IN_DEPTH]}
          rotation={[0, 0, landmark.spin]}
          visible={false}
        >
          <planeGeometry args={[landmark.size, landmark.size]} />
          <meshBasicMaterial map={landmark.texture} transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

