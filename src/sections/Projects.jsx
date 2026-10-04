import { projects, projectStatusLabels } from '../content/projects'
import Section, { Panel, Tag } from '../ui/Section'

const STATUS_TONES = {
  active: 'text-glow border-glow/50',
  dormant: 'text-haze border-hull-edge',
  'under-construction': 'text-sun border-sun/50',
  'lost-contact': 'text-sun border-sun/50',
}

export default function Projects() {
  return (
    <Section
      id="projects"
      title="Probe array"
      lead="Things I have built and launched. Status is honest — not everything out here is still transmitting."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Panel key={project.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-telemetry text-[10px] uppercase tracking-widest text-hull-edge">
                  {project.designation}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-foam">{project.name}</h3>
              </div>
              <StatusBadge status={project.status} />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-haze">{project.summary}</p>
            <p className="mt-3 text-sm leading-relaxed text-haze/80">{project.detail}</p>

            {project.poweringThisSite && (
              <p className="mt-3 font-telemetry text-[10px] uppercase tracking-widest text-glow">
                Currently running as this page's window
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>

            <div className="mt-5 flex gap-4 border-t border-hull-edge/40 pt-4 font-telemetry text-[11px] uppercase tracking-widest">
              <a href={project.repo} className="text-glow transition-colors hover:text-foam">
                Source ↗
              </a>
              {project.demo && (
                <a href={project.demo} className="text-glow transition-colors hover:text-foam">
                  Live ↗
                </a>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  )
}

function StatusBadge({ status }) {
  const descriptor = projectStatusLabels[status]

  return (
    <span
      title={descriptor.signal}
      className={`shrink-0 rounded-full border px-2 py-0.5 font-telemetry text-[10px] uppercase tracking-wider ${STATUS_TONES[status]}`}
    >
      {descriptor.label}
    </span>
  )
}
