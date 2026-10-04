import { formatDistance, formatVelocity } from '../lib/format'
import { formatDebt } from '../lib/relativity'
import { findWaypoint } from '../content/waypoints'

export default function Hud({ readout }) {
  const waypoint = findWaypoint(readout.waypointId)

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 left-4 z-30 hidden font-telemetry text-[11px] leading-relaxed tracking-wide text-haze sm:block"
    >
      <Row label="RANGE" value={formatDistance(readout.distanceKm)} accent />
      <Row label="VEL" value={formatVelocity(readout.lightFraction)} />
      <Row label="ZONE" value={waypoint?.designation ?? '—'} />
      <Row label="DRIFT" value={`−${formatDebt(readout.debtSeconds)}`} />
    </aside>
  )
}

function Row({ label, value, accent = false }) {
  return (
    <div className="flex gap-2">
      <span className="w-12 text-hull-edge">{label}</span>
      <span className={accent ? 'text-glow' : 'text-haze'}>{value}</span>
    </div>
  )
}
