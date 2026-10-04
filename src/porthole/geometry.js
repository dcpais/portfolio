import * as THREE from 'three'

export const BASE_EYE_Z = 5
export const FOV_DEGREES = 12

/** Fraction of the porthole texture taken up by clear glass. */
export const GLASS_FRACTION = 0.63

/** Half-size of the window plane at z = 0, i.e. the screen itself. */
export function windowHalfSize(aspect) {
  const halfHeight = BASE_EYE_Z * Math.tan((FOV_DEGREES * Math.PI) / 180 / 2)
  return { halfWidth: halfHeight * aspect, halfHeight }
}

/**
 * How far the view spreads at depth `z`, so content can be scattered across the
 * whole visible volume instead of a narrow column.
 */
export function spreadAtDepth(z, halfWidth, halfHeight) {
  const scale = (BASE_EYE_Z - z) / BASE_EYE_Z
  return { x: halfWidth * scale, y: halfHeight * scale }
}

/**
 * Half-size of the porthole plate. On a wide display the whole brass rim stays
 * on screen; on a portrait one the rim is allowed to run off the sides, because
 * clamping to width there leaves the glass too small to hold the hero text.
 */
export function portholeHalfSize(halfWidth, halfHeight) {
  return Math.min(halfWidth * 1.22, halfHeight * 1.19)
}

/** A rectangle large enough to cover the view, with the glass cut out of it. */
export function createHullMaskGeometry(halfWidth, halfHeight, holeRadius) {
  const plate = new THREE.Shape()
  const width = halfWidth * 6
  const height = halfHeight * 6
  plate.moveTo(-width, -height)
  plate.lineTo(width, -height)
  plate.lineTo(width, height)
  plate.lineTo(-width, height)
  plate.closePath()

  const hole = new THREE.Path()
  hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true)
  plate.holes.push(hole)

  return new THREE.ShapeGeometry(plate, 64)
}
