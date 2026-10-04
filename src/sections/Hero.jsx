import { profile } from '../content/profile'

export default function Hero() {
  return (
    <section
      id="launch"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Full width now the porthole frame is switched off. */}
      <div className="w-full max-w-2xl">
        <p className="mb-4 font-telemetry text-[10px] uppercase tracking-[0.3em] text-glow">
          {profile.callsign} · Hatch open
        </p>

        <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-foam drop-shadow-[0_4px_0_rgba(26,11,61,0.6)] md:text-6xl">
          {profile.siteName}
        </h1>

        <p className="mt-4 font-display text-base font-medium text-sun">
          {profile.name} · {profile.role}
        </p>

        <p className="mt-5 text-sm leading-relaxed text-haze md:text-base">{profile.tagline}</p>

        <a
          href="#about"
          className="mt-8 inline-block rounded-full border-2 border-sun bg-sun/15 px-7 py-2.5 font-display text-sm font-semibold text-sun transition-transform hover:scale-105"
        >
          Dive in
        </a>
      </div>

      <p
        aria-hidden="true"
        className="absolute bottom-8 animate-bob font-telemetry text-[10px] uppercase tracking-[0.25em] text-hull-edge"
      >
        ↓ scroll to leave the hull
      </p>
    </section>
  )
}
