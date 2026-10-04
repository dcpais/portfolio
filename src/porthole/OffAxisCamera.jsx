import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BASE_EYE_Z } from './geometry'

const VIEWPOINT_SCALE = { x: 2.6, y: 1.8, z: 3.2 }
const SMOOTHING = 0.12

/**
 * Treats the screen as a fixed window and the viewer as a moving eye behind it.
 * The camera is placed at the eye and given an asymmetric frustum whose corners
 * stay pinned to the window edges, which is what sells the illusion of depth.
 */
export default function OffAxisCamera({ viewpointRef, halfWidth, halfHeight, frozen }) {
  const target = useRef(new THREE.Vector3(0, 0, BASE_EYE_Z))

  useFrame(({ camera }) => {
    const viewpoint = frozen ? { x: 0, y: 0, z: 0 } : viewpointRef.current
    target.current.set(
      viewpoint.x * VIEWPOINT_SCALE.x,
      viewpoint.y * VIEWPOINT_SCALE.y,
      BASE_EYE_Z - viewpoint.z * VIEWPOINT_SCALE.z,
    )
    camera.position.lerp(target.current, SMOOTHING)

    const eyeX = camera.position.x
    const eyeY = camera.position.y
    const eyeZ = Math.max(camera.near * 2, camera.position.z)
    camera.position.z = eyeZ
    camera.lookAt(eyeX, eyeY, 0)

    const { near, far } = camera
    camera.projectionMatrix.makePerspective(
      (near * (-halfWidth - eyeX)) / eyeZ,
      (near * (halfWidth - eyeX)) / eyeZ,
      (near * (halfHeight - eyeY)) / eyeZ,
      (near * (-halfHeight - eyeY)) / eyeZ,
      near,
      far,
    )
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
  })

  return null
}
