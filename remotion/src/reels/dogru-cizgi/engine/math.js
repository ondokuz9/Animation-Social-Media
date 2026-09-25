// Pure maths for "Doğru Çizgi". Nothing here reads the clock, the DOM or
// Math.random — every frame is a function of the frame number alone, which is
// what makes the render reproducible pixel for pixel.

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => clamp((v - a) / (b - a));
export const smooth = (t) => t * t * (3 - 2 * t);

/* Easing. The film has four motion words and only four:
   settle  — arrives and rests (most things)
   launch  — leaves with intent (the line leaving a shape)
   glide   — long camera moves, symmetric, no visible start or stop
   snap    — the one violent move: chaos collapsing into a straight line */
const bez = (x1, y1, x2, y2) => {
  const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, Cc = (a) => 3 * a;
  const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + Cc(a)) * t;
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + Cc(a);
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (calc(t, x1, x2) - x) / s;
    }
    return calc(clamp(t), y1, y2);
  };
};
export const ease = {
  settle: bez(0.16, 1, 0.3, 1),
  launch: bez(0.7, 0, 0.84, 0),
  glide: bez(0.65, 0, 0.35, 1),
  snap: bez(0.95, 0, 0.2, 1),
  inOut: bez(0.45, 0, 0.55, 1),
};

/** Map frame range to 0..1 with an easing. */
export const seg = (frame, a, b, fn = ease.glide) => fn(invLerp(a, b, frame));

/* Deterministic hash noise. */
export const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
export const mulberry = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* Vectors (arrays). */
export const v3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a) => Math.hypot(a[0], a[1], a[2]),
  norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  lerp: (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)],
};

/* ── Polylines ──────────────────────────────────────────────────────────────
   A shape is { p: [[x,y,z]…], a: [alpha…] }. Alpha 0 segments are pen lifts:
   they keep a shape one continuous polyline (so it can morph and be drawn on)
   while letting it jump between strokes without a visible line. */

export const cumulative = (pts) => {
  const s = [0];
  for (let i = 1; i < pts.length; i++) {
    const d = pts[i], e = pts[i - 1];
    s.push(s[i - 1] + Math.hypot(d[0] - e[0], d[1] - e[1], (d[2] || 0) - (e[2] || 0)));
  }
  return s;
};

/** Resample to n points evenly spaced by arc length. Pen-lift segments are
 *  weighted down so a long jump doesn't eat the point budget. */
export const resample = (shape, n) => {
  const { p, a } = shape;
  const w = [0];
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1], (p[i][2] || 0) - (p[i - 1][2] || 0));
    const lift = Math.min(a[i], a[i - 1]) < 0.01;
    w.push(w[i - 1] + d * (lift ? 0.15 : 1));
  }
  const total = w[w.length - 1] || 1;
  const out = [], oa = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (j < w.length - 1 && w[j] < target) j++;
    const t = (target - w[j - 1]) / ((w[j] - w[j - 1]) || 1);
    out.push(v3.lerp(p[j - 1], p[j], clamp(t)));
    // A pen lift is binary: never let it smear into a half-visible segment.
    const lift = Math.min(a[j], a[j - 1]) < 0.01;
    oa.push(lift ? 0 : lerp(a[j - 1], a[j], clamp(t)));
  }
  return { p: out, a: oa };
};

export const concat = (...shapes) => {
  const p = [], a = [];
  shapes.forEach((s, i) => {
    if (i > 0 && p.length) {
      // pen lift bridge between strokes
      p.push(p[p.length - 1]); a.push(0);
      p.push(s.p[0]); a.push(0);
    }
    s.p.forEach((q, k) => { p.push(q); a.push(s.a[k]); });
  });
  return { p, a };
};

export const mapShape = (s, fn) => ({ p: s.p.map(fn), a: s.a.slice() });
export const withAlpha = (pts, alpha = 1) => ({ p: pts, a: pts.map(() => alpha) });

/** Morph between two shapes with equal point counts. `stagger` delays points
 *  further along the path, so the change travels down the line like a wave. */
export const morph = (A, B, t, stagger = 0, fn = ease.glide) => {
  const n = A.p.length;
  const p = new Array(n), a = new Array(n);
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const lt = fn(clamp((t * (1 + stagger) - u * stagger)));
    p[i] = v3.lerp(A.p[i], B.p[i], lt);
    a[i] = lerp(A.a[i], B.a[i], lt);
  }
  return { p, a };
};

/** Visible window of a drawn-on shape: head and tail as 0..1 of arc length. */
export const window = (shape, tail, head, fade = 0.08) => {
  const n = shape.p.length;
  const a = shape.a.map((v, i) => {
    const u = i / (n - 1);
    if (u > head) return 0;
    const tf = fade > 0 ? clamp((u - tail) / fade) : u >= tail ? 1 : 0;
    return v * tf;
  });
  return { p: shape.p, a, head };
};

/* ── Camera ─────────────────────────────────────────────────────────────── */
/** Orbit camera: target, distance, yaw (rad, 0 = looking toward −z),
 *  pitch (rad, 0 = level, π/2 = straight down), roll-free. */
export const orbitCamera = ({ target, dist, yaw, pitch, fov }) => {
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const pos = [target[0] + dist * cp * Math.sin(yaw), target[1] + dist * sp, target[2] + dist * cp * Math.cos(yaw)];
  const f = v3.norm(v3.sub(target, pos));
  const r = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const u = v3.cross(r, f);
  return { pos, f, r, u, fov, dist };
};

export const makeProjector = (cam, W, H) => {
  const focal = H / 2 / Math.tan(cam.fov / 2);
  const near = cam.dist * 0.002;
  return (q) => {
    const d = v3.sub(q, cam.pos);
    const z = v3.dot(d, cam.f);
    if (z < near) return null;
    return [W / 2 + (v3.dot(d, cam.r) / z) * focal, H / 2 - (v3.dot(d, cam.u) / z) * focal, z];
  };
};

/* ── Look-at camera (tour) ─────────────────────────────────────────────────
   upHint lets the same camera go from a level view to straight down without
   flipping: blend it from +y to −z as the camera tips over. */
export const lookCamera = ({ pos, target, upHint = [0, 1, 0], fov }) => {
  const f = v3.norm(v3.sub(target, pos));
  const r = v3.norm(v3.cross(f, upHint));
  const u = v3.cross(r, f);
  return { pos, f, r, u, fov, dist: v3.len(v3.sub(target, pos)) };
};

/** Uniform Catmull-Rom through vec3 knots, s in [0, knots.length-1]. */
export const catmull3 = (K, s) => {
  const n = K.length - 1;
  const i = Math.min(n - 1, Math.max(0, Math.floor(s)));
  const t = clamp(s - i);
  const p0 = K[Math.max(0, i - 1)], p1 = K[i], p2 = K[i + 1], p3 = K[Math.min(n, i + 2)];
  const t2 = t * t, t3 = t2 * t;
  return [0, 1, 2].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3));
};

/** Smooth value noise in 1D, deterministic. */
export const noise1 = (x, seed = 0) => {
  const i = Math.floor(x), t = x - i;
  const a = hash(i + seed * 101.3), b = hash(i + 1 + seed * 101.3);
  return lerp(a, b, smooth(t)) * 2 - 1;
};
