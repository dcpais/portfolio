/**
 * Scene features that are built but switched off. Each is kept rather than
 * deleted because it is expected to come back in some reworked form; flip a
 * flag to true to bring one back without touching the components themselves.
 */
export const sceneFeatures = {
  /** Brass submarine porthole framing the hero. Off: the circular opening
   *  leaves too little usable width on an ultrawide display. */
  porthole: false,

  /** Flat planet sprites and the per-section landmark bodies. Off: the 2D
   *  planet look is being reconsidered. */
  planets: false,

  /** Head-tracked and pointer-driven off-axis camera. Off: the effect reads as
   *  too strong. With this off the camera sits still and centred, which gives
   *  the same framing as an on-axis viewer. */
  parallax: false,
}
