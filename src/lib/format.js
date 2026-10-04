import { AU_IN_KM } from '../content/waypoints'

const wholeNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function formatDistance(km) {
  if (km < 1_000_000) return `${wholeNumber.format(Math.round(km))} km`
  return `${(km / AU_IN_KM).toFixed(2)} AU`
}

export function formatVelocity(lightFraction) {
  if (lightFraction < 0.0001) return '0.0000c'
  return `${lightFraction.toFixed(4)}c`
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseYearMonth(value) {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

export function formatMonth(value) {
  if (!value) return 'present'
  const { year, month } = parseYearMonth(value)
  return `${MONTH_LABELS[month - 1]} ${year}`
}

export function formatMonthRange(start, end) {
  return `${formatMonth(start)} — ${formatMonth(end)}`
}

export function formatElapsed(start, end) {
  const from = parseYearMonth(start)
  const to = end ? parseYearMonth(end) : currentYearMonth()
  const months = (to.year - from.year) * 12 + (to.month - from.month)
  const years = Math.floor(months / 12)
  const remainder = months % 12
  if (years === 0) return `${remainder} mo`
  if (remainder === 0) return `${years} y`
  return `${years} y ${remainder} mo`
}

function currentYearMonth() {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}
