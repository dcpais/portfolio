import { profile } from '../content/profile'
import { experience } from '../content/experience'
import { projects, projectStatusLabels } from '../content/projects'
import { skillClusters } from '../content/skills'
import { certifications } from '../content/certifications'
import { formatMonthRange } from '../lib/format'
import ViewModeToggle from '../ui/ViewModeToggle'

/**
 * The same content as a plain document: no canvas, no camera, prints cleanly.
 * This is the version someone reads in thirty seconds on a locked-down laptop.
 */
export default function FlatView({ onResume }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <ViewModeToggle label="Resume mission" onClick={onResume} tone="glow" />

      <header>
        <h1 className="font-display text-3xl font-bold text-foam">{profile.siteName}</h1>
        <p className="mt-1 font-display text-lg text-sun">{profile.name}</p>
        <p className="mt-1 text-haze">{profile.role}</p>
        <p className="mt-4 leading-relaxed text-haze">{profile.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {profile.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-glow hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <Block title="About">
        {profile.bio.map((paragraph) => (
          <p key={paragraph} className="mb-3 leading-relaxed text-haze last:mb-0">
            {paragraph}
          </p>
        ))}
      </Block>

      <Block title="Experience">
        <ul className="space-y-6">
          {experience.map((mission) => (
            <li key={mission.id}>
              <h3 className="font-semibold text-foam">
                {mission.role} · <span className="font-normal text-haze">{mission.organisation}</span>
              </h3>
              <p className="text-sm text-hull-edge">
                {formatMonthRange(mission.start, mission.end)}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-haze">
                {[...mission.objectives, ...mission.anomalies].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Projects">
        <ul className="space-y-5">
          {projects.map((project) => (
            <li key={project.id}>
              <h3 className="font-semibold text-foam">
                <a href={project.repo} className="hover:underline">
                  {project.name}
                </a>
                <span className="ml-2 text-xs font-normal text-hull-edge">
                  {projectStatusLabels[project.status].label}
                </span>
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-haze">{project.summary}</p>
              <p className="mt-1 text-xs text-hull-edge">{project.stack.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Skills">
        <ul className="space-y-2">
          {skillClusters.map((cluster) => (
            <li key={cluster.id} className="text-sm">
              <span className="text-foam">{cluster.domain}: </span>
              <span className="text-haze">
                {cluster.stars.map((star) => star.name).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Certifications">
        <ul className="space-y-1.5 text-sm">
          {certifications.map((certification) => (
            <li key={certification.id} className="text-haze">
              <span className="text-foam">{certification.name}</span> — {certification.issuer},{' '}
              {certification.year}
            </li>
          ))}
        </ul>
      </Block>

      <footer className="mt-12 border-t border-hull-edge/40 pt-6 text-sm text-haze">
        <a href={`mailto:${profile.email}`} className="text-glow hover:underline">
          {profile.email}
        </a>
      </footer>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 font-telemetry text-[11px] uppercase tracking-[0.2em] text-hull-edge">
        {title}
      </h2>
      {children}
    </section>
  )
}
