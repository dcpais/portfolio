import * as THREE from 'three'
import { palette } from './palette'

const PLANET_SIZE = 512
const COMET_SIZE = 512
const OUTLINE_RATIO = 0.022

function createCanvas(size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return { canvas, context: canvas.getContext('2d') }
}

function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}

/** Flat body, bold outline, a scatter of craters, and an optional ring. */
export function createPlanetTexture({ body, crater, ring }, seed) {
  const { canvas, context } = createCanvas(PLANET_SIZE)
  const centre = PLANET_SIZE / 2
  const radius = PLANET_SIZE * 0.34
  const outline = PLANET_SIZE * OUTLINE_RATIO
  const random = seededRandom(seed)

  if (ring) drawRing(context, centre, radius, ring, outline, 'back')

  context.beginPath()
  context.arc(centre, centre, radius, 0, Math.PI * 2)
  context.fillStyle = body
  context.fill()
  context.lineWidth = outline
  context.strokeStyle = palette.outline
  context.stroke()

  drawCraters(context, centre, radius, crater, random)
  if (ring) drawRing(context, centre, radius, ring, outline, 'front')

  return toTexture(canvas)
}

function drawCraters(context, centre, radius, colour, random) {
  const craterCount = 3 + Math.floor(random() * 3)

  context.save()
  context.beginPath()
  context.arc(centre, centre, radius, 0, Math.PI * 2)
  context.clip()
  context.fillStyle = colour

  for (let index = 0; index < craterCount; index += 1) {
    const angle = random() * Math.PI * 2
    const distance = random() * radius * 0.7
    const craterRadius = radius * (0.12 + random() * 0.18)
    context.beginPath()
    context.arc(
      centre + Math.cos(angle) * distance,
      centre + Math.sin(angle) * distance,
      craterRadius,
      0,
      Math.PI * 2,
    )
    context.fill()
  }
  context.restore()
}

function drawRing(context, centre, radius, colour, outline, half) {
  context.save()
  if (half === 'front') {
    context.beginPath()
    context.rect(0, centre, PLANET_SIZE, PLANET_SIZE / 2)
    context.clip()
  }
  context.beginPath()
  context.ellipse(centre, centre, radius * 1.65, radius * 0.42, -0.35, 0, Math.PI * 2)
  context.lineWidth = outline * 3.5
  context.strokeStyle = colour
  context.stroke()
  context.lineWidth = outline * 0.9
  context.strokeStyle = palette.outline
  context.stroke()
  context.restore()
}

/** A bright head with a tapering tail, pointing back along its travel. */
export function createCometTexture(colour) {
  const { canvas, context } = createCanvas(COMET_SIZE)
  const headX = COMET_SIZE * 0.76
  const headY = COMET_SIZE * 0.24
  const headRadius = COMET_SIZE * 0.085

  const trail = context.createLinearGradient(headX, headY, COMET_SIZE * 0.1, COMET_SIZE * 0.9)
  trail.addColorStop(0, colour)
  trail.addColorStop(1, `${colour}00`)

  context.beginPath()
  context.moveTo(headX + headRadius * 0.7, headY + headRadius * 0.7)
  context.lineTo(COMET_SIZE * 0.1, COMET_SIZE * 0.9)
  context.lineTo(headX - headRadius * 0.7, headY - headRadius * 0.7)
  context.closePath()
  context.fillStyle = trail
  context.fill()

  context.beginPath()
  context.arc(headX, headY, headRadius, 0, Math.PI * 2)
  context.fillStyle = palette.foam
  context.fill()
  context.lineWidth = COMET_SIZE * OUTLINE_RATIO
  context.strokeStyle = colour
  context.stroke()

  return toTexture(canvas)
}

/** Deterministic so a reload does not reshuffle every planet. */
function seededRandom(seed) {
  let state = seed * 9301 + 49297
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}
