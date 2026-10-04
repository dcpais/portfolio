export const palette = {
  abyss: '#050418',

  // Backdrop gradient, darkest at the rim. Kept deliberately dim so the stars
  // carry the image rather than competing with the sky behind them.
  backdropCore: '#0b0f38',
  backdropEdge: '#02030e',

  // Deliberately dim shades for the additive sky layers. The vivid violet,
  // coral and glow below are UI accents — reusing them here blows the sky out,
  // because additive blending turns their brightness into pure added light.
  nebulaBlue: '#3b2775',
  nebulaRed: '#6b0b33',
  nebulaGreen: '#17616b',
  fogCool: '#4a3a86',
  fogWarm: '#6b4a9e',
  hull: '#2a1a5e',
  hullLight: '#3d2a7a',
  outline: '#1a0b3d',
  brassLight: '#ffd75e',
  brass: '#f0a830',
  brassDark: '#b96d1f',
  glass: '#8fd8ff',
  foam: '#eaf2ff',
  glow: '#4de3e6',
  coral: '#e30050',
  ember: '#e32e01',
  sun: '#fbbe00',
  mint: '#5ce6a5',
  violet: '#9b6dff',
}

export const planetPalettes = [
  { body: '#e30050', crater: '#a8003a', ring: null },
  { body: '#fbbe00', crater: '#c98f00', ring: '#ffd75e' },
  { body: '#4de3e6', crater: '#2aa6b5', ring: null },
  { body: '#9b6dff', crater: '#6b45c4', ring: '#c9aaff' },
  { body: '#5ce6a5', crater: '#2fa878', ring: null },
  { body: '#e32e01', crater: '#a81f00', ring: null },
]

export const cometColors = ['#4de3e6', '#ffd75e', '#e30050', '#9b6dff']
