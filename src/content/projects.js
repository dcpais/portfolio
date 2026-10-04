export const projects = [
  {
    id: 'projection-sim',
    name: 'Projection Sim',
    designation: 'PROBE-01',
    status: 'active',
    summary:
      'An off-axis projection simulator that fakes real depth on a flat screen by tracking your head through the webcam and moving the 3D camera to match.',
    detail:
      'MediaPipe Face Landmarker estimates head position from the webcam feed; interocular distance stands in for depth. That position drives an asymmetric camera frustum, so the monitor behaves like a window into the scene behind it.',
    stack: ['React Three Fiber', 'Three.js', 'MediaPipe', 'Vite'],
    repo: 'https://github.com/dcpais/projection-sim',
    demo: null,
    poweringThisSite: true,
  },
  {
    id: 'versus-web-games',
    name: 'Versus Web Games',
    designation: 'PROBE-02',
    status: 'active',
    summary: 'A collection of head-to-head browser games with a shared backend for matchmaking and live play.',
    detail: 'Placeholder — describe the netcode, the game loop, and what was hard about keeping two clients in sync.',
    stack: ['React', 'Node.js', 'WebSockets'],
    repo: 'https://github.com/dcpais/versus-web-games',
    demo: null,
  },
  {
    id: 'jstris-ai',
    name: 'Jstris AI',
    designation: 'PROBE-03',
    status: 'under-construction',
    summary: 'A bot that plays Tetris. Currently a skeleton with ambitions.',
    detail:
      'Placeholder — note the search strategy and heuristics once they exist. A live demo of the bot playing belongs here.',
    stack: ['Python'],
    repo: 'https://github.com/dcpais/jstris-AI',
    demo: null,
  },
  {
    id: 'portfolio',
    name: 'This Porthole',
    designation: 'PROBE-04',
    status: 'active',
    summary: 'The site you are currently looking through. The window effect is Probe-01 wearing a different hat.',
    detail:
      'A fixed 3D background renders the view outside the hull while the content scrolls over it as ordinary HTML, so the whole thing still works as a plain document with the effects switched off.',
    stack: ['React', 'React Three Fiber', 'Tailwind'],
    repo: 'https://github.com/dcpais/portfolio',
    demo: null,
  },
]

export const projectStatusLabels = {
  active: { label: 'Active', signal: 'Signal nominal' },
  dormant: { label: 'Dormant', signal: 'Last contact logged' },
  'under-construction': { label: 'Pre-launch', signal: 'Still on the pad' },
  'lost-contact': { label: 'Lost contact', signal: 'No signal' },
}
