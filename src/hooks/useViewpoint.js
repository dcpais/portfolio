import { useHeadTracking } from './useHeadTracking'
import { usePointerParallax } from './usePointerParallax'

/**
 * Single viewpoint the camera reads from, sourced from head tracking when it is
 * live and from the pointer otherwise. With `enabled` false nothing listens and
 * the viewpoint stays centred.
 */
export function useViewpoint(trackingRequested, enabled = true) {
  const { headRef, videoRef, status, errorMessage, calibrate } = useHeadTracking(
    enabled && trackingRequested,
  )
  const tracking = status === 'ready'
  const { pointerRef } = usePointerParallax(enabled && !tracking)

  return {
    viewpointRef: tracking ? headRef : pointerRef,
    source: tracking ? 'head' : 'pointer',
    videoRef,
    status,
    errorMessage,
    calibrate,
  }
}
