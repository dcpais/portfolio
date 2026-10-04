// brightness: 0..1, drives star size and glow on the constellation map.
// Review these against how you would actually rate yourself in an interview.
export const skillClusters = [
  {
    id: 'interfacia',
    constellation: 'Interfacia',
    domain: 'Interfaces',
    stars: [
      { name: 'React', brightness: 0.95 },
      { name: 'JavaScript', brightness: 0.95 },
      { name: 'HTML & CSS', brightness: 0.85 },
      { name: 'Tailwind', brightness: 0.8 },
      { name: 'TypeScript', brightness: 0.6 },
    ],
  },
  {
    id: 'tessellatrix',
    constellation: 'Tessellatrix',
    domain: 'Graphics & simulation',
    stars: [
      { name: 'Three.js', brightness: 0.8 },
      { name: 'React Three Fiber', brightness: 0.8 },
      { name: 'WebGL', brightness: 0.5 },
      { name: 'MediaPipe', brightness: 0.6 },
      { name: 'Linear algebra', brightness: 0.7 },
    ],
  },
  {
    id: 'servitor',
    constellation: 'Servitor',
    domain: 'Backend & data',
    stars: [
      { name: 'Node.js', brightness: 0.7 },
      { name: 'Python', brightness: 0.8 },
      { name: 'WebSockets', brightness: 0.6 },
      { name: 'SQL', brightness: 0.55 },
      { name: 'REST APIs', brightness: 0.7 },
    ],
  },
  {
    id: 'fabrica',
    constellation: 'Fabrica',
    domain: 'Tooling',
    stars: [
      { name: 'Git', brightness: 0.85 },
      { name: 'Vite', brightness: 0.75 },
      { name: 'Linux', brightness: 0.65 },
      { name: 'Docker', brightness: 0.45 },
    ],
  },
]
