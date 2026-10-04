import { experience } from '../content/experience'
import { formatElapsed, formatMonthRange } from '../lib/format'
import Section, { Panel, Tag } from '../ui/Section'

export default function Experience() {
  return (
    <Section
      id="experience"
      title="Flight log"
      lead="Each posting as a mission: what it was for, and what went wrong that I had to fix."
    >
      <ol className="space-y-5">
        {experience.map((mission) => (
          <li key={mission.id}>
            <Panel>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-telemetry text-[10px] uppercase tracking-widest text-glow/80">
                    {mission.designation}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-foam">
                    {mission.role}
                  </h3>
                  <p className="text-sm text-haze">{mission.organisation}</p>
                </div>
                <p className="font-telemetry text-[11px] text-haze">
                  {formatMonthRange(mission.start, mission.end)}
                  <span className="block text-hull-edge">
                    MET {formatElapsed(mission.start, mission.end)}
                  </span>
                </p>
              </div>

              <MissionList label="Objectives" items={mission.objectives} />
              <MissionList label="Anomalies resolved" items={mission.anomalies} />

              <div className="mt-4 flex flex-wrap gap-1.5">
                {mission.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Panel>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function MissionList({ label, items }) {
  if (items.length === 0) return null

  return (
    <div className="mt-4">
      <p className="font-telemetry text-[10px] uppercase tracking-widest text-hull-edge">{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-haze">
            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-glow/70" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
