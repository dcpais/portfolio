import * as THREE from 'three'

// Landmark placement along the journey.
export const CLOSEST_DEPTH = -20
export const SECTION_SPACING = 115
export const VANISH_DEPTH = -6
export const FADE_IN_DEPTH = -260

// Warp streaks: hidden at a browse-speed scroll, full-length once you accelerate.
export const STREAK_ONSET = 0.012
export const STREAK_FULL = 0.12
export const STREAK_LENGTH = 90

/** Where a landmark sits given how far along the waypoint chain you are. */
export function landmarkDepth(index, sectionTravel) {
  return CLOSEST_DEPTH - (index - sectionTravel) * SECTION_SPACING
}

export function isLandmarkVisible(depth) {
  return depth < VANISH_DEPTH && depth > FADE_IN_DEPTH
}

/** Eases in from the far distance and out again as it sweeps past the camera. */
export function landmarkOpacity(depth) {
  const appearing = THREE.MathUtils.smoothstep(depth, FADE_IN_DEPTH, FADE_IN_DEPTH * 0.72)
  const leaving = 1 - THREE.MathUtils.smoothstep(depth, CLOSEST_DEPTH * 0.75, VANISH_DEPTH)
  return appearing * leaving
}

export function streakIntensity(lightFraction) {
  return THREE.MathUtils.clamp((lightFraction - STREAK_ONSET) / (STREAK_FULL - STREAK_ONSET), 0, 1)
}

export function streakReach(lightFraction) {
  return streakIntensity(lightFraction) * STREAK_LENGTH * lightFraction
}
