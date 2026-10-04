import * as THREE from 'three'
import { palette } from './palette'

const TEXTURE_SIZE = 1024
const BOLT_COUNT = 14
const GLASS_RADIUS = 0.63
const BEZEL_RADIUS = 0.72
const RIM_RADIUS = 0.94
const OUTLINE_WIDTH = TEXTURE_SIZE * 0.012

/**
 * A submarine porthole drawn flat and chunky: brass rim, hex bolts, bold
 * outlines, and a clear centre so the scene behind shows through the glass.
 */
export function createPortholeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_SIZE
  canvas.height = TEXTURE_SIZE

  const context = canvas.getContext('2d')
  const centre = TEXTURE_SIZE / 2

  drawHullPlate(context, centre)
  drawBrassRim(context, centre)
  drawBolts(context, centre)
  drawBezel(context, centre)
  drawGlass(context, centre)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}

function drawHullPlate(context, centre) {
  context.fillStyle = palette.hull
  context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
}

function drawBrassRim(context, centre) {
  const gradient = context.createLinearGradient(
    centre * 0.4,
    centre * 0.3,
    centre * 1.7,
    centre * 1.8,
  )
  gradient.addColorStop(0, palette.brassLight)
  gradient.addColorStop(0.45, palette.brass)
  gradient.addColorStop(1, palette.brassDark)

  fillCircle(context, centre, centre * RIM_RADIUS, gradient)
  strokeCircle(context, centre, centre * RIM_RADIUS, palette.outline, OUTLINE_WIDTH)
}

function drawBolts(context, centre) {
  const boltOrbit = centre * (BEZEL_RADIUS + RIM_RADIUS) / 2
  const boltRadius = centre * 0.045

  for (let index = 0; index < BOLT_COUNT; index += 1) {
    const angle = (index / BOLT_COUNT) * Math.PI * 2 - Math.PI / 2
    const x = centre + Math.cos(angle) * boltOrbit
    const y = centre + Math.sin(angle) * boltOrbit
    drawHexBolt(context, x, y, boltRadius)
  }
}

function drawHexBolt(context, x, y, radius) {
  context.beginPath()
  for (let corner = 0; corner < 6; corner += 1) {
    const angle = (corner / 6) * Math.PI * 2 - Math.PI / 2
    const pointX = x + Math.cos(angle) * radius
    const pointY = y + Math.sin(angle) * radius
    if (corner === 0) context.moveTo(pointX, pointY)
    else context.lineTo(pointX, pointY)
  }
  context.closePath()
  context.fillStyle = palette.brassLight
  context.fill()
  context.lineWidth = OUTLINE_WIDTH * 0.6
  context.strokeStyle = palette.outline
  context.stroke()
}

function drawBezel(context, centre) {
  fillCircle(context, centre, centre * BEZEL_RADIUS, palette.brassDark)
  strokeCircle(context, centre, centre * BEZEL_RADIUS, palette.outline, OUTLINE_WIDTH)
}

function drawGlass(context, centre) {
  const glassRadius = centre * GLASS_RADIUS

  context.save()
  context.globalCompositeOperation = 'destination-out'
  fillCircle(context, centre, glassRadius, '#000')
  context.restore()

  strokeCircle(context, centre, glassRadius, palette.outline, OUTLINE_WIDTH * 0.8)
  drawGlassSheen(context, centre, glassRadius)
}

/** Two soft diagonal streaks, the shorthand every cartoon uses for glass. */
function drawGlassSheen(context, centre, glassRadius) {
  context.save()
  context.beginPath()
  context.arc(centre, centre, glassRadius, 0, Math.PI * 2)
  context.clip()
  context.translate(centre, centre)
  context.rotate(-Math.PI / 4)
  context.fillStyle = 'rgba(234, 242, 255, 0.16)'
  context.fillRect(-glassRadius * 0.95, -glassRadius * 1.4, glassRadius * 0.3, glassRadius * 2.8)
  context.fillRect(-glassRadius * 0.45, -glassRadius * 1.4, glassRadius * 0.14, glassRadius * 2.8)
  context.restore()
}

function fillCircle(context, centre, radius, fill) {
  context.beginPath()
  context.arc(centre, centre, radius, 0, Math.PI * 2)
  context.fillStyle = fill
  context.fill()
}

function strokeCircle(context, centre, radius, colour, width) {
  context.beginPath()
  context.arc(centre, centre, radius, 0, Math.PI * 2)
  context.lineWidth = width
  context.strokeStyle = colour
  context.stroke()
}
