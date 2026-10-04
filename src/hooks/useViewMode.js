import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const STORAGE_KEY = 'dcpais.viewMode'
export const VIEW_MODES = { porthole: 'porthole', flat: 'flat' }

function readStoredMode() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === VIEW_MODES.flat || stored === VIEW_MODES.porthole ? stored : null
  } catch {
    return null
  }
}

/**
 * Porthole or plain document. Reduced-motion users land on the plain view, and
 * whatever the visitor picks is remembered.
 */
export function useViewMode() {
  const reducedMotion = useReducedMotion()
  const [mode, setMode] = useState(() => readStoredMode() ?? VIEW_MODES.porthole)
  const [hasChosen] = useState(() => readStoredMode() !== null)

  useEffect(() => {
    if (!hasChosen && reducedMotion) setMode(VIEW_MODES.flat)
  }, [hasChosen, reducedMotion])

  const chooseMode = useCallback((next) => {
    setMode(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // A visitor with storage blocked simply does not get the preference remembered.
    }
  }, [])

  return { mode, chooseMode, reducedMotion }
}
