import { lazy, Suspense, useState } from 'react'
import { useViewpoint } from '../hooks/useViewpoint'
import { useScrollJourney } from '../hooks/useScrollJourney'
import { sceneFeatures } from '../porthole/sceneFeatures'
import Hud from '../ui/Hud'
import TrajectoryRail from '../ui/TrajectoryRail'
import MobileNav from '../ui/MobileNav'
import PortholeControls from '../ui/PortholeControls'
import ViewModeToggle from '../ui/ViewModeToggle'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Experience from '../sections/Experience'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'
import Certifications from '../sections/Certifications'
import Contact from '../sections/Contact'

// three.js and the scene load only for visitors who stay in the space view.
const PortholeScene = lazy(() => import('../porthole/PortholeScene'))

export default function PortholeView({ onAbort, reducedMotion }) {
  const [trackingRequested, setTrackingRequested] = useState(false)
  const { viewpointRef, videoRef, status, errorMessage, calibrate } = useViewpoint(
    trackingRequested,
    sceneFeatures.parallax,
  )
  const { journeyRef, readout } = useScrollJourney()

  return (
    <>
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <Suspense fallback={null}>
          <PortholeScene
            viewpointRef={viewpointRef}
            journeyRef={journeyRef}
            driftPaused={reducedMotion}
          />
        </Suspense>
      </div>

      <MobileNav />
      <TrajectoryRail activeWaypointId={readout.waypointId} />
      <Hud readout={readout} />
      <ViewModeToggle label="Abort mission" onClick={onAbort} />

      <main className="relative pt-16 md:pt-0">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      {/* No camera prompt while the parallax it drives is switched off. */}
      {sceneFeatures.parallax && (
        <PortholeControls
          trackingRequested={trackingRequested}
          onRequestTracking={() => setTrackingRequested(true)}
          onStopTracking={() => setTrackingRequested(false)}
          onCalibrate={calibrate}
          status={status}
          errorMessage={errorMessage}
          videoRef={videoRef}
        />
      )}
    </>
  )
}
