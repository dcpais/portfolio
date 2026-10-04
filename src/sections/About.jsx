import { profile } from '../content/profile'
import Section, { Panel } from '../ui/Section'

const DOSSIER_ROWS = [
  ['Callsign', profile.callsign],
  ['Role', profile.role],
  ['Station', profile.location],
]

export default function About() {
  return (
    <Section id="about" title="Crew dossier" lead={profile.tagline}>
      <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
        <Panel>
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-haze last:mb-0">
              {paragraph}
            </p>
          ))}
        </Panel>

        <Panel className="font-telemetry text-[11px]">
          <dl>
            {DOSSIER_ROWS.map(([label, value]) => (
              <div key={label} className="mb-3 last:mb-0">
                <dt className="uppercase tracking-widest text-hull-edge">{label}</dt>
                <dd className="mt-0.5 text-foam">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-5 space-y-1.5 border-t border-hull-edge/50 pt-4">
            {profile.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="uppercase tracking-widest text-glow transition-colors hover:text-foam"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  )
}
