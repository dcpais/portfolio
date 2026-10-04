import { skillClusters } from '../content/skills'
import Section, { Panel } from '../ui/Section'

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Star chart"
      lead="Grouped by domain, sized by how confidently I would be held to them."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {skillClusters.map((cluster) => (
          <Panel key={cluster.id}>
            <p className="font-display text-lg font-semibold text-foam">{cluster.constellation}</p>
            <p className="font-telemetry text-[10px] uppercase tracking-widest text-hull-edge">
              {cluster.domain}
            </p>

            <ul className="mt-4 space-y-2.5">
              {cluster.stars.map((star) => (
                <li key={star.name} className="flex items-center gap-3">
                  <Star brightness={star.brightness} />
                  <span className="text-sm text-haze">{star.name}</span>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Section>
  )
}

function Star({ brightness }) {
  const diameter = 4 + brightness * 7

  return (
    <span
      aria-hidden="true"
      className="shrink-0 rounded-full bg-glow"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity: 0.35 + brightness * 0.65,
        boxShadow: `0 0 ${brightness * 10}px rgba(77, 227, 230, ${brightness * 0.8})`,
      }}
    />
  )
}
