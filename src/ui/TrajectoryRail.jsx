import { waypoints } from '../content/waypoints'
import { formatDistance } from '../lib/format'

/** Doubles as the site navigation and as the mission progress indicator. */
export default function TrajectoryRail({ activeWaypointId }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 md:block"
    >
      <ol className="relative flex flex-col gap-6 border-l border-hull-edge/60 pl-4">
        {waypoints.map((waypoint) => {
          const active = waypoint.id === activeWaypointId
          return (
            <li key={waypoint.id} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 transition-colors ${
                  active ? 'border-glow bg-glow' : 'border-hull-edge bg-abyss'
                }`}
              />
              <a
                href={`#${waypoint.id}`}
                aria-current={active ? 'true' : undefined}
                className={`group block font-telemetry text-[11px] uppercase tracking-widest transition-colors ${
                  active ? 'text-glow' : 'text-haze hover:text-foam'
                }`}
              >
                {waypoint.label}
                <span className="block text-[10px] normal-case tracking-normal text-hull-edge">
                  {formatDistance(waypoint.distanceKm)}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
