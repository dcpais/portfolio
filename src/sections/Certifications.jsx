import { certifications } from '../content/certifications'
import Section from '../ui/Section'

export default function Certifications() {
  return (
    <Section
      id="certifications"
      title="Patch locker"
      lead="One patch per completed mission, in the tradition of programmes with far larger budgets."
    >
      <ul className="flex flex-wrap justify-center gap-8 sm:justify-start">
        {certifications.map((certification) => (
          <li key={certification.id}>
            <MissionPatch certification={certification} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function MissionPatch({ certification }) {
  const { accent } = certification
  const patch = (
    <div
      className="flex h-44 w-44 flex-col items-center justify-center rounded-full border-4 p-5 text-center transition-transform duration-300 hover:scale-105 hover:rotate-3"
      style={{
        borderColor: accent,
        background: `radial-gradient(circle at 50% 30%, ${accent}26, #0a0e15 70%)`,
        boxShadow: `inset 0 0 18px ${accent}33`,
      }}
    >
      <p
        className="font-telemetry text-[9px] uppercase tracking-widest"
        style={{ color: accent }}
      >
        {certification.issuer}
      </p>
      <p className="mt-2 font-display text-sm font-semibold leading-tight text-foam">
        {certification.name}
      </p>
      <p className="mt-2 font-telemetry text-[10px] text-haze">{certification.year}</p>
    </div>
  )

  if (!certification.credentialUrl) return patch

  return (
    <a href={certification.credentialUrl} className="block rounded-full">
      {patch}
    </a>
  )
}
