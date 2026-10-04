import { useEffect, useRef, useState } from 'react'
import { waypoints } from '../content/waypoints'
import { lightFractionFromSpeed, timeDilationDebt } from '../lib/relativity'

// Tuned so a brisk scroll reads as a fraction of light speed rather than a silly one.
const PIXELS_TO_KILOMETRES_PER_SECOND = 15
const MAX_LIGHT_FRACTION = 0.35
const VELOCITY_DECAY = 0.9
const READOUT_INTERVAL_MS = 120

/**
 * Turns scroll position into the journey telemetry the porthole and HUD share:
 * a ref sampled every frame, plus throttled state for the readouts.
 */
export function useScrollJourney() {
  const journeyRef = useRef({
    scrollY: 0,
    progress: 0,
    heroExit: 0,
    distanceKm: 0,
    lightFraction: 0,
    sectionTravel: 0,
  })
  const [readout, setReadout] = useState({
    distanceKm: 0,
    lightFraction: 0,
    debtSeconds: 0,
    waypointId: waypoints[0].id,
  })

  useEffect(() => {
    let stops = measureWaypointStops()
    const remeasure = () => {
      stops = measureWaypointStops()
    }

    window.addEventListener('resize', remeasure)
    const remeasureTimer = window.setTimeout(remeasure, 600)

    let frameHandle = 0
    let lastTimestamp = performance.now()
    let lastScrollY = window.scrollY
    let smoothedSpeed = 0
    let debtSeconds = 0
    let lastReadoutAt = 0

    const tick = (timestamp) => {
      const deltaSeconds = Math.min(0.1, (timestamp - lastTimestamp) / 1000) || 0
      lastTimestamp = timestamp

      const scrollY = window.scrollY
      const instantSpeed = deltaSeconds > 0 ? Math.abs(scrollY - lastScrollY) / deltaSeconds : 0
      lastScrollY = scrollY
      smoothedSpeed = smoothedSpeed * VELOCITY_DECAY + instantSpeed * (1 - VELOCITY_DECAY)

      const lightFraction = Math.min(
        MAX_LIGHT_FRACTION,
        lightFractionFromSpeed(smoothedSpeed * PIXELS_TO_KILOMETRES_PER_SECOND),
      )
      debtSeconds += timeDilationDebt(lightFraction, deltaSeconds)

      journeyRef.current = {
        scrollY,
        progress: scrollProgress(scrollY),
        heroExit: Math.min(1, scrollY / Math.max(1, window.innerHeight)),
        distanceKm: interpolateDistance(stops, scrollY),
        lightFraction,
        sectionTravel: interpolateSectionTravel(stops, scrollY),
      }

      if (timestamp - lastReadoutAt > READOUT_INTERVAL_MS) {
        lastReadoutAt = timestamp
        setReadout({
          distanceKm: journeyRef.current.distanceKm,
          lightFraction,
          debtSeconds,
          waypointId: activeWaypointId(stops, scrollY),
        })
      }

      frameHandle = requestAnimationFrame(tick)
    }

    frameHandle = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameHandle)
      window.clearTimeout(remeasureTimer)
      window.removeEventListener('resize', remeasure)
    }
  }, [])

  return { journeyRef, readout }
}

function measureWaypointStops() {
  return waypoints
    .map(({ id, distanceKm }) => {
      const element = document.getElementById(id)
      return element ? { id, distanceKm, scrollY: element.offsetTop } : null
    })
    .filter(Boolean)
    .sort((a, b) => a.scrollY - b.scrollY)
}

function interpolateDistance(stops, scrollY) {
  if (stops.length === 0) return 0
  if (scrollY <= stops[0].scrollY) return stops[0].distanceKm

  for (let index = 1; index < stops.length; index += 1) {
    const previous = stops[index - 1]
    const current = stops[index]
    if (scrollY < current.scrollY) {
      const span = current.scrollY - previous.scrollY || 1
      const ratio = (scrollY - previous.scrollY) / span
      return previous.distanceKm + (current.distanceKm - previous.distanceKm) * ratio
    }
  }
  return stops[stops.length - 1].distanceKm
}

/**
 * Position along the waypoint chain as a continuous index: 2.35 means a third
 * of the way from the third waypoint to the fourth. Landmarks use this to
 * arrive as you reach their section.
 */
function interpolateSectionTravel(stops, scrollY) {
  if (stops.length === 0) return 0
  if (scrollY <= stops[0].scrollY) return 0

  for (let index = 1; index < stops.length; index += 1) {
    const previous = stops[index - 1]
    const current = stops[index]
    if (scrollY < current.scrollY) {
      const span = current.scrollY - previous.scrollY || 1
      return index - 1 + (scrollY - previous.scrollY) / span
    }
  }
  return stops.length - 1
}

function activeWaypointId(stops, scrollY) {
  const marker = scrollY + window.innerHeight * 0.4
  let active = stops[0]?.id
  stops.forEach((stop) => {
    if (stop.scrollY <= marker) active = stop.id
  })
  return active
}

function scrollProgress(scrollY) {
  const scrollable = document.body.scrollHeight - window.innerHeight
  return scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0
}
