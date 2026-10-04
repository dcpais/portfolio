import { waypoints } from '../content/waypoints'
import { profile } from '../content/profile'

export default function MobileNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-hull-edge/50 bg-abyss/85 backdrop-blur md:hidden">
      <p className="px-4 pt-3 font-display text-sm font-bold text-foam">{profile.siteName}</p>
      <nav aria-label="Sections" className="overflow-x-auto">
        <ul className="flex gap-4 px-4 py-2.5">
          {waypoints.map((waypoint) => (
            <li key={waypoint.id} className="shrink-0">
              <a
                href={`#${waypoint.id}`}
                className="font-telemetry text-[10px] uppercase tracking-widest text-haze"
              >
                {waypoint.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
