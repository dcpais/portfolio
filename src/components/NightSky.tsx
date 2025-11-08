import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type ShootingStar = {
  id: number
  top: number
  left: number
  duration: number
  delay: number
}

type GeneratedStar = {
  id: string
  top: number
  left: number
  scale: number
  twinkleDelay: number
  twinkleDuration: number
  colorHue: number
  colorSaturation: number
  glowIntensity: number
  shapeVariation: number
}

const STAR_COUNT = 750
const STAR_LAYERS = 3

const createRng = (seed: number) => {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let result = Math.imul(state ^ (state >>> 15), 1 | state)
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

const createStarPositions = (count: number, seedOffset: number) =>
  Array.from({ length: count }, (_, index) => {
    const random = createRng(seedOffset + index * 17)
    const top = random() * 100
    const left = random() * 100
    const scale = 0.35 + random() * 1
    const twinkleDelay = random() * 14
    const twinkleDuration = 3 + random() * 5.5
    
    // Color variation: mostly white/blue-white, occasional warm tones
    const colorType = random()
    let colorHue: number
    let colorSaturation: number
    if (colorType < 0.7) {
      // Blue-white stars (most common)
      colorHue = 200 + random() * 20 // 200-220 (blue range)
      colorSaturation = 20 + random() * 30 // 20-50%
    } else if (colorType < 0.9) {
      // Pure white stars
      colorHue = 0
      colorSaturation = 0
    } else {
      // Warm stars (yellow/amber)
      colorHue = 30 + random() * 30 // 30-60 (yellow/amber range)
      colorSaturation = 40 + random() * 40 // 40-80%
    }
    
    // Glow intensity variation
    const glowIntensity = 0.6 + random() * 0.4 // 0.6-1.0
    
    // Slight shape variation (border-radius and size tweaks)
    const shapeVariation = random() // 0-1 for variation amount

    return {
      id: `${seedOffset}-${index}`,
      top,
      left,
      scale,
      twinkleDelay,
      twinkleDuration,
      colorHue,
      colorSaturation,
      glowIntensity,
      shapeVariation,
    }
  }) satisfies GeneratedStar[]

const NightSky = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const starIdRef = useRef(0)
  const removalTimeoutsRef = useRef<Set<number>>(new Set())
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

  const starLayers = useMemo(
    () =>
      Array.from({ length: STAR_LAYERS }, (_, layerIndex) =>
        createStarPositions(Math.round(STAR_COUNT / STAR_LAYERS), layerIndex * 311),
      ),
    [],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    container.style.setProperty('--parallax-x', '0')
    container.style.setProperty('--parallax-y', '0')

    const updateParallax = () => {
      const easing = 0.08
      smoothRef.current.x += (targetRef.current.x - smoothRef.current.x) * easing
      smoothRef.current.y += (targetRef.current.y - smoothRef.current.y) * easing

      container.style.setProperty('--parallax-x', smoothRef.current.x.toFixed(4))
      container.style.setProperty('--parallax-y', smoothRef.current.y.toFixed(4))

      const deltaX = Math.abs(targetRef.current.x - smoothRef.current.x)
      const deltaY = Math.abs(targetRef.current.y - smoothRef.current.y)

      if (deltaX > 0.001 || deltaY > 0.001) {
        rafRef.current = requestAnimationFrame(updateParallax)
      } else {
        rafRef.current = null
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5

      targetRef.current = {
        x: relativeX * 2,
        y: relativeY * 2,
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateParallax)
      }
    }

    const handlePointerLeave = () => {
      targetRef.current = { x: 0, y: 0 }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateParallax)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let timeoutId: number | undefined

    const spawnShootingStar = () => {
      const duration = 0.1 + Math.random() * 0.1
      const star: ShootingStar = {
        id: starIdRef.current++,
        top: Math.random() * 40,
        left: 40 + Math.random() * 20,
        duration,
        delay: 0,
      }

      setShootingStars((prev) => [...prev, star])

      const removalTimeout = window.setTimeout(() => {
        setShootingStars((prev) => prev.filter(({ id }) => id !== star.id))
        removalTimeoutsRef.current.delete(removalTimeout)
      }, (duration + star.delay) * 1000)

      removalTimeoutsRef.current.add(removalTimeout)

      const nextDelay = 4000 + Math.random() * 5000
      timeoutId = window.setTimeout(spawnShootingStar, nextDelay)
    }

    timeoutId = window.setTimeout(spawnShootingStar, 2500)

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
      removalTimeoutsRef.current.forEach((removalTimeout) => {
        window.clearTimeout(removalTimeout)
      })
      removalTimeoutsRef.current.clear()
    }
  }, [])

  return (
    <div className="night-sky" ref={containerRef}>
      <div className="sky-gradient" />

      {starLayers.map((layer, layerIndex) => (
        <div
          key={`layer-${layerIndex}`}
          className={`star-layer star-layer-${layerIndex + 1}`}
          aria-hidden
        >
          {layer.map((star) => (
            <span
              key={star.id}
              className="star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                transform: `scale(${star.scale})`,
                '--twinkle-delay': `${star.twinkleDelay}s`,
                '--twinkle-duration': `${star.twinkleDuration}s`,
                '--star-hue': star.colorHue,
                '--star-saturation': `${star.colorSaturation}%`,
                '--glow-intensity': star.glowIntensity,
                '--shape-variation': star.shapeVariation,
              } as CSSProperties}
            />
          ))}
        </div>
      ))}

      <div className="nebula" aria-hidden />

      <div className="shooting-star-layer" aria-hidden>
        {shootingStars.map((star) => (
          <div key={star.id} className="shooting-star-container" style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
          }}>
            <span className="shooting-star" />
            <span className="shooting-star-spark spark-1" />
            <span className="shooting-star-spark spark-2" />
            <span className="shooting-star-spark spark-3" />
          </div>
        ))}
      </div>

      <div className="horizon-glow" aria-hidden />
    </div>
  )
}

export default NightSky

