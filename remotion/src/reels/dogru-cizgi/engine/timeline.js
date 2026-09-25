// The film as a function of the frame. `stateAt(frame)` returns everything the
// renderer needs; nothing is remembered between frames.

import {
  clamp, lerp, invLerp, seg, ease, hash, mulberry, v3, resample, morph, window, orbitCamera, makeProjector,
} from './math.js';
import {
  W, H, FOV, MAP_DIST, GIRNE, CITIES, LOCKUP, screenToA, wordmarkScreen, horizonScreen, coastWorld,
  dividerWorld, parcelWorld, PARCEL, houseWorld, HOUSE, interiorWorld, INTERIOR_WALL_Z, LAMP_WORLD,
  handsScreen, deedScreen, N,
} from './shapes.js';

export const FRAMES = 900;

/* Timing, in frames at 60 fps. Every beat of the film is named here. */
export const T = {
  hold: 12,
  unravel: [12, 58], fillOut: [12, 26], sloganOut: [12, 28],
  pluck: [52, 104],
  chaosIn: [70, 118], collapse: [118, 140],
  tilt: [140, 202], toCoast: [144, 210],
  graticule: [160, 204], divider: [196, 216],
  pins: 206, pinGap: 6,
  dive: [244, 288], coastOut: [256, 284], citiesOut: [244, 258],
  parcel: [276, 318], dims: [306, 326],
  riseCam: [318, 404], house: [332, 436],
  enter: [432, 484], enterAngles: [432, 466],
  interior: [466, 552], lamp: [546, 572],
  toHands: [572, 614], roomOut: [566, 588], keyGlint: [632, 660],
  toDeed: [666, 706],
  toHorizon: [726, 758], toWordmark: [764, 806],
  fillIn: [800, 818], outlineOut: [812, 830], sloganIn: [812, 830], urlIn: [820, 838],
};

export const LABELS = [
  { n: '01', t: 'ARSA', at: [280, 352] },
  { n: '02', t: 'YAPI', at: [352, 434] },
  { n: '03', t: 'EV', at: [488, 566] },
  { n: '04', t: 'ANLAŞMA', at: [586, 664] },
  { n: '05', t: 'TAPU', at: [676, 742] },
];

const aPlane = (s) => ({ p: s.p.map((q) => screenToA(q)), a: s.a });

/* ── Camera path ───────────────────────────────────────────────────────── */
const logLerp = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));
const HOUSE_T = [GIRNE[0], 3.2, GIRNE[2]];
const ROOM_T = [GIRNE[0], 1.5, GIRNE[2] + INTERIOR_WALL_Z];

export const cameraAt = (f) => {
  // A: level, looking at the vertical plane through the island's middle.
  let target = [0, 0, 0], dist = MAP_DIST, yaw = 0, pitch = 0;
  // B: tilt down until the horizon is a coastline seen from above.
  pitch = lerp(0, Math.PI / 2 - 1e-4, seg(f, ...T.tilt, ease.glide));
  // Dive to Girne: log-distance so every octave of scale takes the same time.
  const d = seg(f, ...T.dive, ease.inOut);
  target = v3.lerp([0, 0, 0], GIRNE, ease.settle(clamp(d * 1.25)));
  dist = logLerp(MAP_DIST, 78, d);
  // C→D: rise off the plan into an axonometric three-quarter view.
  const r = seg(f, ...T.riseCam, ease.glide);
  if (f >= T.riseCam[0]) {
    target = v3.lerp(GIRNE, HOUSE_T, r);
    dist = lerp(78, 40, r);
    pitch = lerp(Math.PI / 2 - 1e-4, 0.52, r);
    yaw = lerp(0, 0.62, r);
  }
  // E: square up to the door and go through it.
  if (f >= T.enter[0]) {
    const ea = seg(f, ...T.enterAngles, ease.glide);
    const ed = seg(f, ...T.enter, ease.inOut);
    target = v3.lerp(HOUSE_T, ROOM_T, ease.settle(clamp(ed * 1.4)));
    pitch = lerp(0.52, 0, ea);
    yaw = lerp(0.62 + (f - T.enter[0]) * 0, 0, ea);
    dist = logLerp(40, 7.4, ed);
    // a slow push after arriving, so the room never freezes
    dist *= 1 - 0.035 * seg(f, T.enter[1], T.toHands[0], ease.inOut);
  }
  // Slow drift in plan views so the map is never a still image.
  if (f >= T.tilt[1] && f < T.riseCam[1]) yaw += 0.05 * seg(f, T.tilt[1], T.riseCam[1], ease.inOut);
  return orbitCamera({ target, dist, yaw, pitch, fov: FOV });
};

/* Screen-space push for the graphic acts (F–H): a 2D camera. */
const screenPush = (f) => {
  if (f < T.toHands[0] || f >= T.toHorizon[0]) return 1;
  return 1 + 0.03 * seg(f, T.toHands[0], T.toHorizon[0], ease.inOut);
};
const pushScreen = (s, k) => (k === 1 ? s : { p: s.p.map((q) => [W / 2 + (q[0] - W / 2) * k, H / 2 + (q[1] - H / 2) * k, 0]), a: s.a });

/* ── Deformations ──────────────────────────────────────────────────────── */
/* The plucked string: first mode plus a little of the second, damped. */
const pluckOffset = (f, u) => {
  if (f < T.pluck[0] || f > T.pluck[1]) return 0;
  const t = (f - T.pluck[0]) / 60;
  const env = Math.exp(-t * 5.2);
  return (Math.sin(Math.PI * u) * Math.cos(t * 2 * Math.PI * 7.5) + 0.25 * Math.sin(2 * Math.PI * u) * Math.cos(t * 2 * Math.PI * 13)) * 26 * env;
};

/* Smooth deterministic noise along the line for the chaos. */
const wobble = (seed, u, f) => {
  let v = 0;
  for (let k = 1; k <= 4; k++) {
    const ph = hash(seed * 13.1 + k * 7.7) * Math.PI * 2;
    const sp = (hash(seed * 3.3 + k) - 0.5) * 0.12 * k;
    v += Math.sin(u * Math.PI * (1.2 + k * 1.7 + hash(seed + k) * 2) + ph + f * sp) / k;
  }
  return v;
};

const chaosAmount = (f) => {
  if (f < T.chaosIn[0] || f >= T.collapse[1]) return 0;
  if (f < T.collapse[0]) return seg(f, ...T.chaosIn, ease.settle);
  return 1 - seg(f, ...T.collapse, ease.snap);
};

export const GHOSTS = 34;

/* ── Pins ──────────────────────────────────────────────────────────────── */
const pinsAt = (f) => CITIES.map((c, i) => {
  const t0 = T.pins + i * T.pinGap;
  const fall = seg(f, t0, t0 + 10, ease.launch);
  const ripple = invLerp(t0 + 9, t0 + 40, f);
  const out = 1 - seg(f, ...T.citiesOut, ease.inOut);
  const isGirne = i === CITIES.length - 1;
  return { ...c, t0, fall, ripple, visible: f >= t0, alpha: isGirne ? 1 : out, labelAlpha: seg(f, t0 + 6, t0 + 18, ease.settle) * out, isGirne };
});

/* ── State ─────────────────────────────────────────────────────────────── */
export const stateAt = (frame) => {
  const f = frame;
  const cam = cameraAt(f);
  const project = makeProjector(cam, W, H);
  const s = {
    frame: f, cam, project, lines: [], ghosts: [], pins: null, labels: [], anchors: [],
    fill: 0, slogan: 0, url: 0, flash: 0, warm: 0, graticule: 0, divider: 0, gold: 0,
  };

  /* Lockup overlay (DOM) */
  s.fill = f < T.fillOut[1] ? 1 - seg(f, ...T.fillOut, ease.inOut) : seg(f, ...T.fillIn, ease.inOut);
  s.slogan = f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.sloganIn, ease.settle);
  s.url = f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.urlIn, ease.settle);
  if (f < T.hold || f >= FRAMES - 1) { s.fill = 1; s.slogan = 1; s.url = 1; }

  /* A — wordmark unravels into the horizon, is plucked, splits, collapses. */
  if (f < T.tilt[0] + 1) {
    const wm = wordmarkScreen();
    const hz = horizonScreen();
    const m = seg(f, ...T.unravel, ease.glide);
    let shape = morph(wm, hz, m, 0.55, ease.glide);
    const lineIn = seg(f, T.unravel[0], T.unravel[0] + 10, ease.inOut);
    const amt = chaosAmount(f);
    shape = {
      p: shape.p.map((q, i) => {
        const u = i / (N - 1);
        return [q[0], q[1] - pluckOffset(f, u) - wobble(0, u, f) * 70 * amt, 0];
      }),
      a: shape.a.map((a) => a * lineIn),
    };
    if (f >= T.hold) s.lines.push({ shape: aPlane(shape), space: 'world', width: 3, spark: m > 0.02 && m < 0.999 ? null : null });
    if (amt > 0) {
      for (let g = 0; g < GHOSTS; g++) {
        const r = mulberry(g * 977 + 11);
        const spread = (r() - 0.5) * 2;
        const amp = 60 + r() * 220;
        const born = hash(g + 0.5) * 0.5;
        const ga = clamp((amt - born) / 0.35);
        if (ga <= 0) continue;
        const pts = hz.p.filter((_, i) => i % 6 === 0).map((q, k, arr) => {
          const u = k / (arr.length - 1);
          const env = Math.sin(Math.PI * u) ** 0.6;
          return screenToA([q[0], q[1] + (spread * 180 + wobble(g + 1, u, f) * amp) * amt * env]);
        });
        s.ghosts.push({ pts, alpha: ga * 0.34 * (0.5 + 0.5 * r()) });
      }
    }
    // the snap: one frame of overexposure, decaying
    s.flash = Math.max(0, 1 - (f - T.collapse[1]) / 14) * (f >= T.collapse[1] ? 1 : 0);
  }

  /* B — the horizon lies down onto the island. */
  if (f > T.tilt[0] && f < T.parcel[1]) {
    const hz = aPlane(horizonScreen());
    const coast = coastWorld();
    const m = seg(f, ...T.toCoast, ease.glide);
    const shape = morph(hz, coast, m, 0.8, ease.inOut);
    const out = 1 - seg(f, ...T.coastOut, ease.inOut);
    s.lines.push({ shape: { p: shape.p, a: shape.a.map((a) => a * out) }, space: 'world', width: 3 });
    s.flash = Math.max(s.flash, Math.max(0, 1 - (f - T.collapse[1]) / 14));
  }
  s.graticule = seg(f, ...T.graticule, ease.inOut) * (1 - seg(f, T.dive[0], T.dive[0] + 26, ease.inOut));
  s.divider = seg(f, ...T.divider, ease.inOut) * (1 - seg(f, ...T.coastOut, ease.inOut));
  if (s.divider > 0) s.dividerLines = dividerWorld();
  if (f >= T.pins && f < T.parcel[0] + 10) s.pins = pinsAt(f);

  /* C — the pin lands and becomes the pen: the parcel. */
  if (f >= T.parcel[0] - 2) {
    // the tie line: from the survey point (where the pin landed) to the first corner
    const tieHead = seg(f, T.parcel[0], T.parcel[0] + 10, ease.inOut);
    const tieA = 0.4 * (1 - seg(f, T.parcel[1], T.parcel[1] + 24, ease.inOut));
    const fade = f >= T.enter[0] ? 1 - seg(f, T.enter[0], T.enter[0] + 30, ease.inOut) : 1;
    const dim = f >= T.riseCam[0] ? lerp(1, 0.55, seg(f, T.riseCam[0], T.riseCam[0] + 40)) : 1;
    if (tieA > 0) s.lines.push({ shape: { p: [GIRNE, v3.lerp(GIRNE, PARCEL[0], tieHead)], a: [tieA, tieA] }, space: 'world', width: 1.6, spark: tieHead < 1 ? v3.lerp(GIRNE, PARCEL[0], tieHead) : null });
    const shape = resample(parcelWorld(), 400);
    const head = seg(f, T.parcel[0] + 10, T.parcel[1], ease.inOut);
    const w = window(shape, 0, head, 0);
    if (f >= T.parcel[0] + 10) s.lines.push({ shape: { p: w.p, a: w.a.map((a) => a * fade * dim) }, space: 'world', width: 2.6, spark: head < 1 ? w.p[Math.round(head * (w.p.length - 1))] : null });
    const da = seg(f, ...T.dims, ease.settle) * fade * dim;
    if (da > 0) s.dims = { alpha: da };
  }

  /* D — the house, in one pen, braced by the X. */
  if (f >= T.house[0]) {
    const h = houseWorld();
    const n = h.len;
    const head = seg(f, ...T.house, (x) => ease.inOut(x) * 0.25 + x * 0.75);
    const shape = h.shape;
    const hi = head * (n - 1);
    // room out: once inside, only the walls that frame the room stay
    const out = 1 - seg(f, ...T.roomOut, ease.inOut);
    const a = shape.a.map((v, i) => (i <= hi ? v * out : 0));
    const [b0, b1] = [h.marks.brace1[0], h.marks.brace2[1]];
    const braceLit = seg(f, T.house[0] + ((b0 / n) * (T.house[1] - T.house[0])), T.house[0] + ((b1 / n) * (T.house[1] - T.house[0])) + 4, ease.settle);
    const gold = shape.p.map((_, i) => (i >= b0 && i <= b1 ? 1 : 0));
    const braceFlash = braceLit * Math.max(0.35, 1 - invLerp(T.house[0] + ((b1 / n) * (T.house[1] - T.house[0])), T.house[0] + ((b1 / n) * (T.house[1] - T.house[0])) + 36, f));
    s.lines.push({ shape: { p: shape.p, a }, space: 'world', width: 2.6, gold, goldAmount: braceFlash * out, spark: head < 1 && shape.a[Math.round(hi)] > 0.5 ? shape.p[Math.round(hi)] : null });
    s.braceFlash = braceFlash * (1 - invLerp(T.house[1], T.house[1] + 20, f));
  }

  /* E — inside: the room draws itself, the lamp comes on. */
  if (f >= T.interior[0] && f < T.toHands[1] + 1) {
    const room = interiorWorld();
    const head = seg(f, ...T.interior, (x) => ease.inOut(x) * 0.3 + x * 0.7);
    let shape = window(room, 0, head, 0);
    const lamp = seg(f, ...T.lamp, ease.settle);
    s.warm = lamp;
    const lampP = project(LAMP_WORLD);
    if (lampP) s.lamp = { x: lampP[0], y: lampP[1], a: lamp };
    if (f < T.toHands[0]) {
      s.lines.push({ shape, space: 'world', width: 2.8, spark: head < 1 && room.a[Math.round(head * (room.p.length - 1))] > 0.5 ? room.p[Math.round(head * (room.p.length - 1))] : null, warm: lamp });
    } else {
      // F — the room is re-drawn as a handshake (in screen space)
      const proj = { p: room.p.map((q) => { const r = project(q); return r ? [r[0], r[1], 0] : [W / 2, H / 2, 0]; }), a: shape.a };
      const hands = handsScreen();
      const m = seg(f, ...T.toHands, ease.inOut);
      const mm = morph(proj, hands.shape, m, 0.5, ease.glide);
      s.lines.push({ shape: pushScreen(mm, screenPush(f)), space: 'screen', width: 2.8, warm: lamp });
    }
  }
  if (f >= T.toHands[0]) s.warm = Math.max(s.warm * (1 - seg(f, T.toHands[0], T.toHands[1] + 20)), 0);

  if (f > T.toHands[1] && f < T.toHorizon[1] + 1) {
    const hands = handsScreen();
    const deed = deedScreen();
    const k = screenPush(f);
    const gold = hands.shape.p.map((_, i) => (i / (hands.shape.p.length - 1) >= hands.keyFrom ? 1 : 0));
    const glint = seg(f, ...T.keyGlint, ease.settle) * (1 - seg(f, T.keyGlint[1], T.toDeed[0] + 10, ease.inOut));
    if (f < T.toDeed[0]) {
      s.lines.push({ shape: pushScreen(hands.shape, k), space: 'screen', width: 2.8, gold, goldAmount: 0.85 + 0.15 * glint });
      s.keyGlint = glint;
    } else if (f < T.toHorizon[0]) {
      const m = seg(f, ...T.toDeed, ease.inOut);
      const mm = morph(hands.shape, deed, m, 0.85, ease.glide);
      s.lines.push({ shape: pushScreen(mm, k), space: 'screen', width: 2.6, gold: gold.map((g) => g * (1 - m)), goldAmount: 1 });
    } else {
      // G → H: the whole deed folds into its own signature line
      const hz = resample(horizonScreen(), deed.p.length);
      const m = seg(f, ...T.toHorizon, ease.inOut);
      const mm = morph(deed, hz, m, 0.25, ease.glide);
      s.lines.push({ shape: mm, space: 'screen', width: 3 });
    }
  }

  /* H — the horizon ties itself back into the name. */
  if (f >= T.toHorizon[1]) {
    const wm = wordmarkScreen();
    const hz = horizonScreen();
    const m = seg(f, ...T.toWordmark, ease.glide);
    const shape = morph(hz, wm, m, 0.55, ease.glide);
    const out = 1 - seg(f, ...T.outlineOut, ease.inOut);
    const echo = f < T.toWordmark[0] ? pluckEcho(f) : 0;
    s.lines.push({
      shape: { p: shape.p.map((q, i) => [q[0], q[1] - echo * Math.sin(Math.PI * (i / (N - 1))), 0]), a: shape.a.map((a) => a * out) },
      space: 'screen', width: 3,
    });
  }
  if (f >= FRAMES - 1) s.lines = [];

  /* Chapter labels */
  s.labels = LABELS.map((l) => ({ ...l, a: seg(f, l.at[0], l.at[0] + 14, ease.settle) * (1 - seg(f, l.at[1] - 12, l.at[1], ease.inOut)), y: (1 - seg(f, l.at[0], l.at[0] + 18, ease.settle)) * 14 })).filter((l) => l.a > 0.001);
  return s;
};

const pluckEcho = (f) => {
  const t = (f - T.toHorizon[1]) / 60;
  return Math.sin(t * 2 * Math.PI * 7) * 10 * Math.exp(-t * 7);
};

export { LOCKUP };
