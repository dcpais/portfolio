import { findWaypoint } from '../content/waypoints'
import { formatDistance } from '../lib/format'
import { useInView } from '../hooks/useInView'

export default function Section({ id, title, lead, children }) {
  const waypoint = findWaypoint(id)
  const [sectionRef, inView] = useInView()

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative mx-auto max-w-4xl scroll-mt-20 px-6 py-24 md:py-32 ${
        inView ? 'animate-rise-in' : 'opacity-0'
      }`}
    >
      <p className="mb-3 font-telemetry text-[11px] uppercase tracking-[0.2em] text-glow">
        {waypoint.designation}
        <span className="text-hull-edge"> · {formatDistance(waypoint.distanceKm)}</span>
      </p>
      <h2 className="font-display text-4xl font-bold text-foam md:text-5xl">{title}</h2>
      {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-haze">{lead}</p>}
      <div className="mt-10">{children}</div>
    </section>
  )
}

export function Panel({ children, className = '' }) {
  return (
    <div
      className={`rounded-blob border-2 border-hull-edge/60 bg-hull/50 p-6 shadow-[0_6px_0_rgba(26,11,61,0.5)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function Tag({ children }) {
  return (
    <span className="rounded-full border-2 border-hull-edge/70 bg-hull-light/50 px-2.5 py-0.5 font-telemetry text-[10px] uppercase tracking-wider text-haze">
      {children}
    </span>
  )
}
