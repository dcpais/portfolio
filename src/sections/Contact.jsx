import { profile } from '../content/profile'
import Section, { Panel } from '../ui/Section'

export default function Contact() {
  return (
    <Section
      id="contact"
      title="Uplink"
      lead="This is as far out as the site goes. Messages from here still arrive quickly."
    >
      <Panel className="text-center">
        <p className="mx-auto max-w-lg leading-relaxed text-haze">
          I am open to new work and happy to talk about anything on this page.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="mt-7 inline-block rounded-full border-2 border-glow bg-glow/15 px-8 py-3 font-display text-sm font-semibold text-glow transition-transform hover:scale-105"
        >
          Transmit
        </a>

        <p className="mt-4 font-telemetry text-[10px] uppercase tracking-widest text-hull-edge">
          Signal delay at this range: 17 h 04 m · by email, rather less
        </p>
      </Panel>
    </Section>
  )
}
