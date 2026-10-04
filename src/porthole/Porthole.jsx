import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  GLASS_FRACTION,
  createHullMaskGeometry,
  portholeHalfSize,
} from './geometry'
import { createPortholeTexture } from './portholeTexture'
import { palette } from './palette'

const PLATE_DEPTH = -0.22
// The mask opening sits just outside the glass so the plate always covers the join.
const MASK_CLEARANCE = 1.02

/**
 * The submarine porthole you are looking through: a hull plate with the glass
 * cut out, and a brass plate drawn on top of it. Both sit just behind the
 * screen, so moving your head shifts them against the scene beyond.
 */
export default function Porthole({ journeyRef, halfWidth, halfHeight }) {
  const groupRef = useRef(null)

  const { maskGeometry, texture, plateSize } = useMemo(() => {
    const halfSize = portholeHalfSize(halfWidth, halfHeight)
    const glassRadius = halfSize * GLASS_FRACTION
    return {
      maskGeometry: createHullMaskGeometry(halfWidth, halfHeight, glassRadius * MASK_CLEARANCE),
      texture: createPortholeTexture(),
      plateSize: halfSize * 2,
    }
  }, [halfWidth, halfHeight])

  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    // The porthole recedes as you scroll past the hero: you leave through it.
    const visibility = 1 - journeyRef.current.heroExit
    group.visible = visibility > 0.01
    group.traverse((child) => {
      if (child.material) child.material.opacity = visibility
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, PLATE_DEPTH]}>
      <mesh geometry={maskGeometry}>
        <meshBasicMaterial color={palette.hull} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[plateSize, plateSize]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
