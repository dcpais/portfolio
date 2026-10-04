/**
 * The backdrop is computed per fragment rather than baked into a texture.
 * A texture of any sane size has to be stretched across the whole view, and a
 * dark gradient quantised to 8 bits lands on only a few dozen distinct values,
 * which shows up as visible bands. A smooth curve plus a dither removes both.
 */

export const RADIAL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * One least-significant-bit of screen-space noise. Far too small to see, but it
 * scatters the quantisation boundary so a band becomes a soft stipple instead
 * of a hard edge.
 */
const DITHER = /* glsl */ `
  float ditherAmount(vec2 fragment) {
    return fract(sin(dot(fragment, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5;
  }
`

/**
 * Two colours eased by a single power curve. Deliberately not a multi-stop
 * gradient: every added stop is a slope discontinuity, and the eye reads those
 * as a drawn line across the sky.
 */
export const BACKDROP_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uCore;
  uniform vec3 uEdge;
  uniform float uAspect;
  uniform float uCurve;
  varying vec2 vUv;

  ${DITHER}

  void main() {
    vec2 offset = (vUv - 0.5) * 2.0;
    offset.x *= uAspect;
    float radius = clamp(length(offset) / uAspect, 0.0, 1.0);

    vec3 colour = mix(uCore, uEdge, pow(radius, uCurve));
    colour += ditherAmount(gl_FragCoord.xy) * (1.5 / 255.0);

    gl_FragColor = vec4(colour, 1.0);
  }
`

/** A soft additive glow: constant tint, alpha easing to nothing at the rim. */
export const CLOUD_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uTint;
  uniform float uStrength;
  varying vec2 vUv;

  ${DITHER}

  void main() {
    float radius = clamp(length((vUv - 0.5) * 2.0), 0.0, 1.0);
    float falloff = pow(1.0 - radius, 2.2);

    float alpha = falloff * uStrength + ditherAmount(gl_FragCoord.xy) * (1.5 / 255.0);
    gl_FragColor = vec4(uTint, max(alpha, 0.0));
  }
`

/**
 * Drifting cloud banks. Three things make this read as cloud rather than a
 * smooth patch of paint: the sample point is displaced by a second noise field
 * (domain warping), which curls and tears the edges; a separate finer noise
 * varies brightness inside each bank so it is not a flat mask; and the
 * thresholds come from measuring what the noise actually produces.
 */
export const FOG_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uTint;
  uniform float uStrength;
  uniform vec2 uOffset;
  uniform float uScale;
  varying vec2 vUv;

  ${DITHER}

  // No sin() here: sin-based hashes are slow and visibly banded on some GPUs.
  float hashAt(vec2 cell) {
    vec3 scattered = fract(vec3(cell.xyx) * vec3(0.1031, 0.1030, 0.0973));
    scattered += dot(scattered, scattered.yzx + 33.33);
    return fract((scattered.x + scattered.y) * scattered.z);
  }

  float valueNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 within = fract(point);
    vec2 eased = within * within * (3.0 - 2.0 * within);

    return mix(
      mix(hashAt(cell), hashAt(cell + vec2(1.0, 0.0)), eased.x),
      mix(hashAt(cell + vec2(0.0, 1.0)), hashAt(cell + vec2(1.0, 1.0)), eased.x),
      eased.y
    );
  }

  float fbm2(vec2 point) {
    float total = valueNoise(point) * 0.5;
    point = point * 2.07 + vec2(11.3, 7.1);
    return total + valueNoise(point) * 0.25;
  }

  float fbm5(vec2 point) {
    float total = 0.0;
    float amplitude = 0.5;

    for (int octave = 0; octave < 5; octave++) {
      total += valueNoise(point) * amplitude;
      point = point * 2.07 + vec2(11.3, 7.1);
      amplitude *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 point = vUv * uScale + uOffset;

    // Displacing the lookup by another noise field is what gives the banks
    // curled, torn edges instead of smooth bulges.
    vec2 warp = vec2(fbm2(point), fbm2(point + vec2(5.2, 1.3))) - 0.5;
    float bank = fbm5(point + warp * 1.2);

    // Measured against the real noise range rather than its theoretical one:
    // a narrow band here is what gives the banks defined, crinkled edges.
    float bands = smoothstep(0.38, 0.52, bank);

    // A much coarser field gates whole regions, so there are open stretches of
    // clear sky and dense stretches, instead of an even scatter of clouds.
    float macro = fbm2(point * 0.45 + vec2(31.0, 13.0));
    float cloud = bands * (0.3 + 0.7 * smoothstep(0.28, 0.58, macro));

    // Finer noise varies brightness within each bank so it is not a flat mask.
    float detail = fbm2(point * 2.6 + vec2(19.0, 4.0));
    float shaded = cloud * (0.45 + 0.9 * detail);

    float alpha = shaded * uStrength + ditherAmount(gl_FragCoord.xy) * (1.5 / 255.0);
    gl_FragColor = vec4(uTint, max(alpha, 0.0));
  }
`
