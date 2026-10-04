import { useEffect, useRef, useState, useCallback } from 'react'

const WASM_BUNDLE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const FACE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

// Outer eye corners in the MediaPipe face mesh.
const LEFT_EYE_OUTER = 33
const RIGHT_EYE_OUTER = 263

const NEUTRAL_READING = { x: 0.5, y: 0.5, z: 0.1 }

/**
 * Opens the webcam, runs MediaPipe Face Landmarker every frame, and writes the
 * head offset from the calibrated origin into a ref without re-rendering.
 */
export function useHeadTracking(enabled) {
  const videoRef = useRef(null)
  const headRef = useRef({ x: 0, y: 0, z: 0 })
  const rawReadingRef = useRef({ ...NEUTRAL_READING })
  const originRef = useRef({ ...NEUTRAL_READING })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!enabled) {
      setStatus('idle')
      return undefined
    }

    setStatus('loading')
    setErrorMessage('')

    let cancelled = false
    let stream = null
    let landmarker = null
    let frameHandle = 0
    let lastVideoTime = -1

    const readHead = () => {
      if (cancelled) return
      const video = videoRef.current
      if (video && landmarker && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime
        const { faceLandmarks } = landmarker.detectForVideo(video, performance.now())
        if (faceLandmarks?.length) {
          rawReadingRef.current = readEyeMidpoint(faceLandmarks[0])
          headRef.current = offsetFromOrigin(rawReadingRef.current, originRef.current)
        }
      }
      frameHandle = requestAnimationFrame(readHead)
    }

    async function start() {
      try {
        // Imported on demand so the face model never ships to visitors who decline.
        const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
        const fileset = await FilesetResolver.forVisionTasks(WASM_BUNDLE)
        landmarker = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numFaces: 1,
        })
        if (cancelled) return

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        })
        if (cancelled) return

        const video = videoRef.current
        if (!video) throw new Error('Video element is not mounted')
        video.srcObject = stream
        await new Promise((resolve) => {
          video.onloadedmetadata = () => video.play().then(resolve)
        })
        if (cancelled) return

        originRef.current = { ...rawReadingRef.current }
        setStatus('ready')
        frameHandle = requestAnimationFrame(readHead)
      } catch (error) {
        if (cancelled) return
        setErrorMessage(describeTrackingError(error))
        setStatus('error')
      }
    }

    start()

    return () => {
      cancelled = true
      cancelAnimationFrame(frameHandle)
      landmarker?.close()
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [enabled])

  const calibrate = useCallback(() => {
    originRef.current = { ...rawReadingRef.current }
    headRef.current = { x: 0, y: 0, z: 0 }
  }, [])

  return { headRef, videoRef, status, errorMessage, calibrate }
}

function readEyeMidpoint(landmarks) {
  const left = landmarks[LEFT_EYE_OUTER]
  const right = landmarks[RIGHT_EYE_OUTER]
  const dx = left.x - right.x
  const dy = left.y - right.y
  return {
    x: (left.x + right.x) / 2,
    y: (left.y + right.y) / 2,
    // Interocular distance is a steadier depth proxy than the landmarks' own z.
    z: Math.sqrt(dx * dx + dy * dy),
  }
}

function offsetFromOrigin(reading, origin) {
  // The webcam image is mirrored, so x is inverted to make leaning left feel left.
  return {
    x: -(reading.x - origin.x),
    y: -(reading.y - origin.y),
    z: reading.z - origin.z,
  }
}

function describeTrackingError(error) {
  if (error?.name === 'NotAllowedError') return 'Camera permission was declined.'
  if (error?.name === 'NotFoundError') return 'No camera was found on this device.'
  return error?.message || 'Head tracking could not start.'
}
