import { Canvas, useThree } from '@react-three/fiber'
import { BASE_EYE_Z, FOV_DEGREES, windowHalfSize } from './geometry'
import { palette } from './palette'
import { sceneFeatures } from './sceneFeatures'
import OffAxisCamera from './OffAxisCamera'
import Backdrop from './Backdrop'
import Fog from './Fog'
import Starfield from './Starfield'
import CelestialBodies from './CelestialBodies'
import Landmarks from './Landmarks'
import Porthole from './Porthole'

function SceneContents({ viewpointRef, journeyRef, driftPaused }) {
  const size = useThree((state) => state.size)
  const { halfWidth, halfHeight } = windowHalfSize(size.width / size.height)

  return (
    <>
      {sceneFeatures.parallax && (
        <OffAxisCamera viewpointRef={viewpointRef} halfWidth={halfWidth} halfHeight={halfHeight} />
      )}

      <Backdrop halfWidth={halfWidth} halfHeight={halfHeight} />
      <Fog
        journeyRef={journeyRef}
        halfWidth={halfWidth}
        halfHeight={halfHeight}
        frozen={driftPaused}
      />
      <Starfield
        journeyRef={journeyRef}
        halfWidth={halfWidth}
        halfHeight={halfHeight}
        frozen={driftPaused}
      />

      {sceneFeatures.planets && (
        <>
          <CelestialBodies
            journeyRef={journeyRef}
            halfWidth={halfWidth}
            halfHeight={halfHeight}
            frozen={driftPaused}
          />
          <Landmarks journeyRef={journeyRef} frozen={driftPaused} />
        </>
      )}

      {sceneFeatures.porthole && (
        <Porthole journeyRef={journeyRef} halfWidth={halfWidth} halfHeight={halfHeight} />
      )}
    </>
  )
}

export default function PortholeScene({ viewpointRef, journeyRef, driftPaused }) {
  return (
    <Canvas
      camera={{ position: [0, 0, BASE_EYE_Z], fov: FOV_DEGREES, near: 0.01, far: 500 }}
      dpr={[1, 1.75]}
      style={{ background: palette.abyss }}
    >
      <SceneContents
        viewpointRef={viewpointRef}
        journeyRef={journeyRef}
        driftPaused={driftPaused}
      />
    </Canvas>
  )
}
