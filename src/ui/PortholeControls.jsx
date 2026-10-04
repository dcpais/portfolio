const STATUS_COPY = {
  idle: 'Parallax is following your cursor.',
  loading: 'Loading face model and opening the camera…',
  ready: 'Tracking your head. Lean to look around the frame.',
  error: 'Falling back to cursor parallax.',
}

/**
 * Consent and controls for the camera-driven parallax. Kept opt-in and blunt
 * about what the camera does, because asking for it at all is a big ask.
 */
export default function PortholeControls({
  trackingRequested,
  onRequestTracking,
  onStopTracking,
  onCalibrate,
  status,
  errorMessage,
  videoRef,
}) {
  const live = status === 'ready'

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[17rem] rounded-blob border-2 border-hull-edge/70 bg-abyss/90 p-4 font-telemetry text-[11px] text-haze shadow-[0_6px_0_rgba(26,11,61,0.5)] backdrop-blur">
      <video
        ref={videoRef}
        playsInline
        muted
        aria-hidden="true"
        className={
          live
            ? 'mb-2 h-20 w-full scale-x-[-1] rounded border border-hull-edge/60 object-cover'
            : 'sr-only'
        }
      />

      <p className="mb-2 leading-relaxed">
        {status === 'error' ? errorMessage : STATUS_COPY[status]}
      </p>

      {!live && (
        <>
          <button
            type="button"
            onClick={onRequestTracking}
            disabled={status === 'loading'}
            className="w-full rounded border border-glow/60 px-2 py-1.5 uppercase tracking-widest text-glow transition-colors hover:bg-glow/10 disabled:opacity-50"
          >
            {status === 'loading' ? 'Standby…' : 'Enable porthole'}
          </button>
          <p className="mt-2 text-[10px] leading-relaxed text-hull-edge">
            Uses your camera to find your head and move the view to match. The video never
            leaves your browser — the model runs on this page.
          </p>
        </>
      )}

      {live && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCalibrate}
            className="flex-1 rounded border border-hull-edge px-2 py-1.5 uppercase tracking-widest transition-colors hover:border-glow hover:text-glow"
          >
            Recentre
          </button>
          <button
            type="button"
            onClick={onStopTracking}
            className="flex-1 rounded border border-hull-edge px-2 py-1.5 uppercase tracking-widest transition-colors hover:border-sun hover:text-sun"
          >
            Camera off
          </button>
        </div>
      )}

      {trackingRequested && status === 'error' && (
        <button
          type="button"
          onClick={onStopTracking}
          className="mt-2 w-full rounded border border-hull-edge px-2 py-1.5 uppercase tracking-widest transition-colors hover:border-foam hover:text-foam"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}
