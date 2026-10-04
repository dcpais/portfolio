const SPEED_OF_LIGHT_KMS = 299_792.458

export function lightFractionFromSpeed(kilometresPerSecond) {
  return Math.min(0.999, Math.abs(kilometresPerSecond) / SPEED_OF_LIGHT_KMS)
}

export function lorentzFactor(lightFraction) {
  const clamped = Math.min(0.999999, Math.abs(lightFraction))
  return 1 / Math.sqrt(1 - clamped * clamped)
}

/**
 * Seconds of proper time lost over `elapsedSeconds` travelled at `lightFraction`.
 * Genuinely correct, and genuinely negligible — that is the joke.
 */
export function timeDilationDebt(lightFraction, elapsedSeconds) {
  const factor = lorentzFactor(lightFraction)
  return elapsedSeconds * (1 - 1 / factor)
}

export function formatDebt(seconds) {
  if (seconds < 1e-6) return `${(seconds * 1e9).toFixed(0)} ns`
  if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(1)} µs`
  if (seconds < 1) return `${(seconds * 1e3).toFixed(2)} ms`
  return `${seconds.toFixed(3)} s`
}
