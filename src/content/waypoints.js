const MOON_DISTANCE_KM = 384_400
const ASTRONOMICAL_UNIT_KM = 149_597_870

export const AU_IN_KM = ASTRONOMICAL_UNIT_KM

export const waypoints = [
  { id: 'launch', label: 'Launch pad', designation: 'PAD-39A', distanceKm: 0 },
  { id: 'about', label: 'Low Earth orbit', designation: 'LEO', distanceKm: 408 },
  { id: 'experience', label: 'Lunar transit', designation: 'FLIGHT LOG', distanceKm: MOON_DISTANCE_KM },
  { id: 'projects', label: 'Asteroid belt', designation: 'PROBE ARRAY', distanceKm: 2.2 * ASTRONOMICAL_UNIT_KM },
  { id: 'skills', label: 'Open sky', designation: 'STAR CHART', distanceKm: 9.5 * ASTRONOMICAL_UNIT_KM },
  { id: 'certifications', label: 'Kuiper belt', designation: 'PATCH LOCKER', distanceKm: 42 * ASTRONOMICAL_UNIT_KM },
  { id: 'contact', label: 'Heliopause', designation: 'UPLINK', distanceKm: 123 * ASTRONOMICAL_UNIT_KM },
]

export function findWaypoint(id) {
  return waypoints.find((waypoint) => waypoint.id === id)
}
