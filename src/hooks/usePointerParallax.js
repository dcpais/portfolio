import { useEffect, useRef } from 'react'

const POINTER_RANGE = 0.32

/**
 * Fallback viewpoint source: maps the pointer across the viewport into the same
 * offset space the head tracker produces, so the scene can consume either.
 */
export function usePointerParallax(enabled) {
  const pointerRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    if (!enabled) {
      pointerRef.current = { x: 0, y: 0, z: 0 }
      return undefined
    }

    const handleMove = (clientX, clientY) => {
      pointerRef.current = {
        x: (clientX / window.innerWidth - 0.5) * 2 * POINTER_RANGE,
        y: -(clientY / window.innerHeight - 0.5) * 2 * POINTER_RANGE,
        z: 0,
      }
    }

    const onPointerMove = (event) => handleMove(event.clientX, event.clientY)
    const onTouchMove = (event) => {
      const touch = event.touches[0]
      if (touch) handleMove(touch.clientX, touch.clientY)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [enabled])

  return { pointerRef }
}
