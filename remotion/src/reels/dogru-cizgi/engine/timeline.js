// "Doğru Çizgi" — the film as a pure function of (fractional) frame.
// ARA · BUL · GEZ · ANLAŞ · TAŞIN. 20 s, 1200 frames at 60 fps.

import {
  clamp, lerp, invLerp, seg, ease, hash, v3, resample, morph,
  lookCamera, makeProjector, catmull3, noise1,
} from './math.js';
import {
  W, FOV, MAP_DIST, GIRNE, CITIES, screenToA, wordmarkScreen, horizonScreen, coastWorld,
  dividerWorld, handsScreen, N,
} from './shapes.js';
import { town, MARKERS, HOUSE_O } from './town.js';
import { villa, G, DOOR, EYE, ROOM, FIGURE_AT, FIGURE_H, local as L } from './villa.js';
import { strokeVisibility } from './build.js';
import { cardLocal, CARDS, CARD_PTS, CARD_COUNT, keyLocal, KEY_CENTER } from './graphics.js';

export const FRAMES = 1200;

/* ── Beats ───────────────────────────────────────────────────────────────── */
export const T = {
  hold: 12, fillOut: [12, 26], sloganOut: [12, 28], unravel: [14, 62], pluck: [58, 112],
  cardsForm: [98, 132], cardsLive: [132, 176], collapse: [176, 200],
  tilt: [200, 266], toCoast: [204, 272], graticule: [220, 262], divider: [262, 282],
  pins: 272, pinGap: 7, girneLift: [318, 338],
  dive: [336, 404], mapOut: [382, 410],
  townCoast: [372, 426], townRoads: [384, 446], townBlocks: [396, 452],
  markers: 428, markerGap: 3, sweep: [458, 500], check: [496, 516],
  houseDive: [520, 588], markerOut: [524, 548], exterior: [532, 624],
  settle: [588, 640], figure: [600, 630], welcome: [630, 652], doorOpen: [640, 676],
  tour: [640, 900], figureOut: [684, 704],
  shell: [696, 736], living: [712, 766], lampOn: [752, 776], kitchen: [790, 834], terrace: [850, 886],
  sunset: [836, 884],
  toHands: [902, 950], sceneOut: [900, 930], keyGlint: [960, 990],
  toKey: [1000, 1030], handsOut: [1000, 1022], turn: [1032, 1052], click: 1052,
  keyToLine: [1058, 1086], toWordmark: [1088, 1130],
  fillIn: [1126, 1142], outlineOut: [1136, 1152], sloganIn: [1136, 1154], urlIn: [1144, 1162],
};

/* Where the picture moves fast enough to need more shutter samples. */
export const FAST = [T.unravel, [T.cardsForm[0], T.cardsForm[1]], T.collapse, T.tilt, T.dive, T.houseDive, [640, 720], [790, 812], [826, 892], T.toHands, T.toKey, T.turn, T.keyToLine, T.toWordmark];
export const isFast = (f) => FAST.some(([a, b]) => f >= a - 4 && f <= b + 4);

export const LABELS = [
  { n: '01', t: 'ARA', at: [404, 470] },
  { n: '02', t: 'BUL', at: [472, 542] },
  { n: '03', t: 'GEZ', at: [604, 892] },
  { n: '04', t: 'ANLAŞ', at: [906, 998] },
  { n: '05', t: 'TAŞIN', at: [1006, 1082] },
];

/* ── Camera ──────────────────────────────────────────────────────────────── */
const logLerp = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));
const PIT = Math.PI / 2 - 0.0015;

const orbit = (target, dist, yaw, pitch) => {
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const pos = [target[0] + dist * cp * Math.sin(yaw), target[1] + dist * sp, target[2] + dist * cp * Math.cos(yaw)];
  const fwd = [-Math.sin(yaw), 0, -Math.cos(yaw)];
  const k = clamp(pitch / (Math.PI / 2));
  const upHint = v3.norm(v3.lerp([0, 1, 0], fwd, k * k));
  return { pos, target, upHint };
};

/* Orbit parameters through the map/town/house acts. */
const orbitAt = (f) => {
  let target = [0, 0, 0], dist = MAP_DIST, yaw = 0, pitch = 0;
  // A/B: a slow dolly so the cards separate in depth
  dist *= 1 - 0.04 * seg(f, 96, 200, ease.inOut);
  yaw = 0.014 * seg(f, 96, 200, ease.inOut) - 0.014 * seg(f, 200, 250, ease.inOut);
  // C: tip over onto the island
  pitch = lerp(0, PIT, seg(f, ...T.tilt, ease.glide));
  yaw += 0.05 * seg(f, T.tilt[1], T.dive[1], ease.inOut);
  // dive into Girne; tip back to a three-quarter view as we arrive
  const d = seg(f, ...T.dive, ease.inOut);
  target = v3.lerp(target, GIRNE, ease.settle(clamp(d * 1.2)));
  dist = logLerp(dist, 3100, d);
  pitch = lerp(pitch, 1.2, seg(f, 372, 430, ease.glide));
  yaw = lerp(yaw, -0.2, seg(f, 372, 440, ease.glide));
  // D: the town breathes
  const t = seg(f, 404, T.houseDive[0], ease.inOut);
  dist = lerp(dist, dist * 0.8, t);
  yaw = lerp(yaw, -0.06, t);
  pitch = lerp(pitch, 1.08, t);
  // E: into the chosen listing
  const h = seg(f, ...T.houseDive, ease.inOut);
  target = v3.lerp(target, v3.add(HOUSE_O, [0, 2.4, 0]), ease.settle(clamp(h * 1.15)));
  dist = logLerp(dist, 52, h);
  pitch = lerp(pitch, 0.5, seg(f, T.houseDive[0] + 20, T.houseDive[1], ease.glide));
  yaw = lerp(yaw, 0.62, seg(f, T.houseDive[0] + 10, T.houseDive[1] + 20, ease.glide));
  // settle at the front door, beside the agent
  const s = seg(f, ...T.settle, ease.inOut);
  target = v3.lerp(target, L(-3.5, 1.25, 6.0), s);
  dist = lerp(dist, 10.5, s);
  pitch = lerp(pitch, 0.12, s);
  yaw = lerp(yaw, 0.08, s);
  return orbit(target, dist, yaw, pitch);
};

/* The tour: knots walked at the pace of a person being shown round. */
let _tour = null;
const tour = () => {
  if (_tour) return _tour;
  const k0 = orbitAt(T.tour[0]);
  const knots = [
    [T.tour[0], k0.pos, k0.target],
    [682, L(-2.5, EYE, 11), L(-2.5, 1.4, 3)],
    [706, L(-2.5, EYE, 5.6), L(-2.7, 1.35, -4)],
    [740, L(-3.1, 1.8, 4.7), L(-3.2, 0.85, -4)],
    [772, L(-3.0, 1.78, 4.1), L(-3.1, 0.85, -4)],
    [808, L(-0.6, 1.75, 1.2), L(7, 1.0, -0.7)],
    [826, L(-0.2, 1.75, 1.0), L(7, 1.0, -0.8)],
    [864, L(3.0, EYE, -3.4), L(3.0, 1.35, -20)],
    [890, L(3.0, EYE, -7.3), L(2.6, EYE, -60)],
    [900, L(3.0, EYE, -7.5), L(2.6, EYE, -60)],
    [1000, L(3.0, EYE, -7.8), L(2.6, EYE, -60)],
  ];
  _tour = { knots, pos: knots.map((k) => k[1]), tgt: knots.map((k) => k[2]) };
  return _tour;
};
const tourS = (f) => {
  const K = tour().knots;
  const raw = (g) => {
    if (g <= K[0][0]) return 0;
    for (let i = 0; i < K.length - 1; i++) if (g < K[i + 1][0]) return i + (g - K[i][0]) / (K[i + 1][0] - K[i][0]);
    return K.length - 1;
  };
  // average over a window so the pace never jerks at a knot
  let acc = 0;
  for (let k = -6; k <= 6; k++) acc += raw(f + k * 2.5);
  return acc / 13;
};

export const cameraAt = (f) => {
  let c;
  if (f < T.tour[0]) c = orbitAt(f);
  else {
    const tr = tour();
    const s = tourS(f);
    const pos = catmull3(tr.pos, s);
    const target = catmull3(tr.tgt, s);
    // handheld: a person walking, not a dolly
    const d = v3.len(v3.sub(target, pos));
    const drift = [noise1(f / 38, 1) * 0.012 * d, noise1(f / 45, 2) * 0.008 * d, 0];
    c = { pos: v3.add(pos, [0, noise1(f / 22, 3) * 0.012, 0]), target: v3.add(target, drift), upHint: [0, 1, 0] };
    // blend in from the orbit so the hand-off is invisible
    const b = seg(f, T.tour[0], T.tour[0] + 16, ease.inOut);
    if (b < 1) {
      const o = orbitAt(f);
      c = { pos: v3.lerp(o.pos, c.pos, b), target: v3.lerp(o.target, c.target, b), upHint: [0, 1, 0] };
    }
  }
  // wider lens inside, the way interiors are photographed
  const fov = lerp(FOV, (58 * Math.PI) / 180, seg(f, 684, 720, ease.inOut));
  return lookCamera({ ...c, fov });
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const aPlane = (s) => ({ p: s.p.map((q) => screenToA(q)), a: s.a });
const heat = (a, u, head, base = 0.8) => a * (base + (1 - base) * Math.exp(-Math.max(0, head - u) / 0.035));

const pluckOffset = (f, u) => {
  if (f < T.pluck[0] || f > T.pluck[1]) return 0;
  const t = (f - T.pluck[0]) / 60;
  const env = Math.exp(-t * 5.2);
  return (Math.sin(Math.PI * u) * Math.cos(t * 2 * Math.PI * 7.5) + 0.25 * Math.sin(2 * Math.PI * u) * Math.cos(t * 2 * Math.PI * 13)) * 26 * env;
};

/* Card placement at a time — each card drifts on its own slow noise and,
   if it is a duplicate, is shadowed by a copy that won't sit still. */
const cardShape = (i, f) => {
  const c = CARDS[i];
  const loc = cardLocal();
  const drift = [noise1(f / 50 + c.seed, 1) * 14, noise1(f / 60 + c.seed, 2) * 18];
  const rot = c.rot + noise1(f / 80 + c.seed, 3) * 0.08;
  const cr = Math.cos(rot), sr = Math.sin(rot);
  return loc.p.map(([x, y]) => [c.x + drift[0] + (x * cr - y * sr) * c.s, c.y + drift[1] + (x * sr + y * cr) * c.s, 0]);
};
const liftCard = (pts, i) => pts.map((q) => v3.add(screenToA(q), [0, 0, CARDS[i].z]));

const firstAtOrAfter = (u, x) => { let i = 0; while (i < u.length - 1 && u[i] < x) i++; return i; };

/* ── Frame state ─────────────────────────────────────────────────────────── */
export const stateAt = (frame) => {
  const f = frame;
  const cam = cameraAt(f);
  const project = makeProjector(cam, W, 1920);
  const s = {
    frame: f, cam, project, lines: [], pins: [], markers: [], rings: [], tags: [], labels: [],
    fill: 0, slogan: 0, url: 0, flash: 0, warm: 0, sky: 0, graticule: 0, divider: 0,
  };
  const V = villa();
  const TW = town();

  /* Lockup (DOM) */
  s.fill = f < T.fillOut[1] ? 1 - seg(f, ...T.fillOut, ease.inOut) : seg(f, ...T.fillIn, ease.inOut);
  s.slogan = f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.sloganIn, ease.settle);
  s.url = f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.urlIn, ease.settle);
  if (f < T.hold || f >= FRAMES - 1) { s.fill = 1; s.slogan = 1; s.url = 1; }

  /* A · B — wordmark → horizon → listing cards → one line */
  if (f >= T.hold && f < T.tilt[0] + 1) {
    const hz = horizonScreen();
    let line = morph(wordmarkScreen(), hz, seg(f, ...T.unravel, ease.glide), 0.55, ease.glide);
    const lineIn = seg(f, T.unravel[0], T.unravel[0] + 10, ease.inOut);
    line = { p: line.p.map((q, i) => [q[0], q[1] - pluckOffset(f, i / (N - 1)), 0]), a: line.a.map((a) => a * lineIn) };
    const form = seg(f, ...T.cardsForm, (x) => x);
    const back = seg(f, ...T.collapse, (x) => x);
    if (f < T.cardsForm[0]) s.lines.push({ shape: aPlane(line), space: 'world', width: 3 });
    else {
      // the line folds into cards, slice by slice; then snaps back straight
      const p = [], a = [];
      for (let i = 0; i < CARD_COUNT; i++) {
        const slice = { p: line.p.slice(i * CARD_PTS, (i + 1) * CARD_PTS).map(screenToA), a: line.a.slice(i * CARD_PTS, (i + 1) * CARD_PTS) };
        const lag = hash(i + 3) * 0.45;
        const mi = ease.settle(clamp(form * 1.45 - lag));
        const bi = ease.snap(clamp(back * 1.3 - hash(i + 9) * 0.3));
        const card = { p: liftCard(cardShape(i, f), i), a: cardLocal().a };
        const formed = morph(slice, card, mi, 0, (x) => x);
        const final = morph(formed, slice, bi, 0, (x) => x);
        final.a[0] = final.a[0] * Math.max(1 - mi, bi); // connectors fade while they are cards
        p.push(...final.p); a.push(...final.a);
        // duplicates: a copy that flickers a few pixels off — the same house listed twice
        const live = Math.min(mi, 1 - bi);
        if (CARDS[i].dup && live > 0.3) {
          const k = Math.floor(f / 3);
          if (hash(k * 7.1 + i) > 0.35) {
            const off = [(hash(k + i) - 0.5) * 26, (hash(k * 1.7 + i) - 0.5) * 20];
            const dup = cardShape(i, f - 7).map((q) => [q[0] + off[0], q[1] + off[1], 0]);
            s.lines.push({ shape: { p: liftCard(dup, i), a: cardLocal().a.map((v) => v * 0.34 * live) }, space: 'world', width: 1.4 });
          }
        }
      }
      while (p.length < N) { p.push(screenToA(line.p[p.length])); a.push(line.a[a.length]); }
      s.lines.push({ shape: { p, a }, space: 'world', width: 2.6 });
    }
    s.flash = f >= T.collapse[1] ? Math.max(0, 1 - (f - T.collapse[1]) / 16) : 0;
  }

  /* C — the horizon lies down onto the island; six cities */
  if (f > T.tilt[0] && f < T.mapOut[1]) {
    const hz = aPlane(horizonScreen());
    const m = seg(f, ...T.toCoast, ease.glide);
    const shape = morph(hz, coastWorld(), m, 0.8, ease.inOut);
    const out = 1 - seg(f, ...T.mapOut, ease.inOut);
    s.lines.push({ shape: { p: shape.p, a: shape.a.map((a) => a * out) }, space: 'world', width: 3 });
    s.flash = Math.max(s.flash, Math.max(0, 1 - (f - T.collapse[1]) / 16));
  }
  s.graticule = seg(f, ...T.graticule, ease.inOut) * (1 - seg(f, ...T.mapOut, ease.inOut));
  s.divider = seg(f, ...T.divider, ease.inOut) * (1 - seg(f, ...T.mapOut, ease.inOut));
  if (s.divider > 0) s.dividerLines = dividerWorld();
  if (f >= T.pins && f < T.dive[1]) {
    CITIES.forEach((c, i) => {
      const t0 = T.pins + i * T.pinGap;
      if (f < t0) return;
      const isG = i === CITIES.length - 1;
      const out = isG ? 1 - seg(f, T.dive[0] + 34, T.dive[1], ease.inOut) : 1 - seg(f, ...T.mapOut, ease.inOut);
      s.pins.push({
        name: c.name, p: c.p, isG,
        drop: seg(f, t0, t0 + 14, ease.settle),
        ripple: invLerp(t0 + 8, t0 + 44, f), a: out, label: seg(f, t0 + 6, t0 + 20, ease.settle) * out,
        lift: isG ? seg(f, ...T.girneLift, ease.settle) : 0,
      });
    });
  }

  /* D — Girne: the town draws, the listings stand up, one is the one */
  if (f >= T.townCoast[0] && f < T.exterior[1]) {
    const out = 1 - seg(f, T.houseDive[0] + 20, T.houseDive[0] + 50, ease.inOut);
    const hc = seg(f, ...T.townCoast, ease.inOut);
    s.lines.push({ shape: { p: TW.coast.p, a: TW.coast.a.map((v, i) => (TW.coast.u[i] <= hc ? heat(v, TW.coast.u[i], hc) * out : 0)) }, space: 'world', width: 2.4, tilt: true });
    const hr = seg(f, ...T.townRoads, ease.inOut);
    s.lines.push({ shape: { p: TW.roads.p, a: TW.roads.a.map((v, i) => (TW.roads.u[i] <= hr ? v * 0.5 * out : 0)) }, space: 'world', width: 1.5, tilt: true });
    const hb = seg(f, ...T.townBlocks, ease.inOut);
    s.lines.push({ shape: { p: TW.blocks.p, a: TW.blocks.a.map((v, i) => { const sid = TW.blocks.sid[i]; return sid < 0 ? 0 : v * 0.3 * out * clamp((hb - hash(sid) * 0.7) / 0.3); }) }, space: 'world', width: 1, tilt: true });
    const sweepR = 2300 * seg(f, ...T.sweep, ease.inOut);
    MARKERS.forEach((m, i) => {
      const t0 = T.markers + i * T.markerGap;
      if (f < t0) return;
      const dist = Math.hypot(m.p[0] - GIRNE[0], m.p[2] - GIRNE[2]);
      const hit = f >= T.sweep[0] ? clamp(1 - Math.abs(sweepR - dist) / 260) : 0;
      const dim = m.chosen ? 1 : lerp(1, 0.26, seg(f, T.sweep[0] + 10, T.sweep[1], ease.inOut));
      const mo = m.chosen ? 1 - seg(f, ...T.markerOut, ease.inOut) : out;
      s.markers.push({
        p: m.p, chosen: m.chosen, a: Math.min(1, dim + hit * 0.8) * mo,
        pop: seg(f, t0, t0 + 18, (x) => ease.settle(x) + Math.sin(x * Math.PI) * 0.22 * (1 - x)),
        check: m.chosen ? seg(f, ...T.check, ease.inOut) : 0,
        grow: m.chosen ? 1 + 0.55 * seg(f, T.check[0] - 6, T.check[1] + 6, ease.settle) : 1,
      });
    });
    if (f >= T.sweep[0] && f < T.sweep[1] + 16) s.rings.push({ c: GIRNE, r: sweepR, a: 0.55 * (1 - seg(f, T.sweep[1] - 10, T.sweep[1] + 16)) });
  }

  /* E · F — the house: drawn from the pin, then shown round by the agent */
  if (f >= T.exterior[0] && f < T.sceneOut[1]) {
    const rel = v3.sub(cam.pos, HOUSE_O);
    const inside = rel[2] < G.z1 && rel[2] > G.z0 && rel[1] < G.h && Math.abs(rel[0]) < G.x1;
    const vis = strokeVisibility(V.exterior.strokes, cam.pos, inside ? 0.3 : 0.14).map((v) => (inside ? 0.3 : v));
    const he = seg(f, ...T.exterior, (x) => ease.inOut(x) * 0.3 + x * 0.7);
    const sceneOut = 1 - seg(f, ...T.sceneOut, ease.inOut);
    const ex = V.exterior;
    s.lines.push({
      shape: { p: ex.p, a: ex.a.map((v, i) => (ex.u[i] <= he && ex.sid[i] >= 0 ? heat(v, ex.u[i], he) * vis[ex.sid[i]] * sceneOut : 0)) },
      space: 'world', width: 2.3, spark: he > 0 && he < 1 ? ex.p[firstAtOrAfter(ex.u, he)] : null, nearFade: 1.2,
    });
    // the door, on its hinge
    const th = seg(f, ...T.doorOpen, ease.settle) * 1.5;
    const hn = ROOM.hinge;
    const wd = DOOR.x1 - DOOR.x0;
    const edge = [hn[0] + Math.cos(th) * wd, hn[1], hn[2] - Math.sin(th) * wd];
    const up = (q, h) => [q[0], q[1] + h, q[2]];
    const doorA = seg(f, T.exterior[1] - 20, T.exterior[1], ease.inOut) * sceneOut;
    const hx = v3.lerp(hn, edge, 0.86);
    s.lines.push({ shape: { p: [hn, edge, up(edge, DOOR.h), up(hn, DOOR.h), hn, hn, up(hx, 0.95), up(hx, 1.1)].flatMap((q, i, arr) => (i === 0 ? [q] : [v3.lerp(arr[i - 1], q, 0.25), v3.lerp(arr[i - 1], q, 0.5), v3.lerp(arr[i - 1], q, 0.75), q])), a: [1, 1, 1, 1, 1, 0, 0, 1].flatMap((v, i) => (i === 0 ? [v] : [v, v, v, v])).map((v) => v * doorA) }, space: 'world', width: 2.2, nearFade: 0.9 });
    // the rooms, each drawn as we arrive in it
    const sun = seg(f, ...T.sunset, ease.inOut);
    const lampOn = seg(f, ...T.lampOn, ease.settle);
    for (const [name, span, width, base] of [['shell', T.shell, 1.6, 0.42], ['living', T.living, 2.7, 1], ['kitchen', T.kitchen, 2.7, 1], ['terrace', T.terrace, 2.6, 1]]) {
      const g = V.rooms[name];
      const hg = seg(f, ...span, (x) => ease.inOut(x) * 0.35 + x * 0.65);
      if (hg <= 0) continue;
      const gv = strokeVisibility(g.strokes, cam.pos, 0.18);
      s.lines.push({
        shape: { p: g.p, a: g.a.map((v, i) => (g.u[i] <= hg && g.sid[i] >= 0 ? heat(v, g.u[i], hg, 0.85) * base * gv[g.sid[i]] * sceneOut : 0)) },
        space: 'world', width, spark: hg < 1 ? g.p[firstAtOrAfter(g.u, hg)] : null,
        warm: name === 'living' ? lampOn * 0.55 : sun * 0.6, nearFade: 0.5,
      });
    }
    if (lampOn > 0) s.lamp = { p: ROOM.lamp, a: lampOn * sceneOut * (1 - seg(f, 800, 830, ease.inOut)) };
    // the agent: a figure by the door who turns to welcome you in
    const fa = seg(f, ...T.figure, ease.inOut) * (1 - seg(f, ...T.figureOut, ease.inOut));
    if (fa > 0) {
      const pose = seg(f, ...T.welcome, ease.settle);
      const rh = v3.norm([cam.r[0], 0, cam.r[2]]);
      const k = FIGURE_H / 580;
      const toW = ([x, y]) => v3.add(FIGURE_AT, v3.add(v3.mul(rh, (x - 100) * k), [0, (600 - y) * k, 0]));
      const drawn = seg(f, T.figure[0], T.figure[1] + 8, ease.inOut);
      const p = [], a = [];
      V.figure.down.forEach((st, j) => {
        const b = V.figure.open[j];
        const n = Math.max(st.length, b.length);
        const A = resample({ p: st.map((q) => [q[0], q[1], 0]), a: st.map(() => 1) }, n);
        const B = resample({ p: b.map((q) => [q[0], q[1], 0]), a: b.map(() => 1) }, n);
        const pts = morph(A, B, pose, 0, (x) => x).p.map(toW);
        if (p.length) { p.push(p[p.length - 1], pts[0]); a.push(0, 0); }
        pts.forEach((q, qi) => { p.push(q); a.push(qi / pts.length <= drawn * 1.3 - j * 0.15 ? fa : 0); });
      });
      s.lines.push({ shape: { p, a }, space: 'world', width: 2.3, warm: 0.35, nearFade: 0.9 });
    }
    // the sea, the horizon and the sun — seen through the glass until you step out
    const onTerrace = rel[2] < G.z0;
    const seaA = seg(f, 704, 744, ease.inOut) * sceneOut;
    if (seaA > 0) {
      const far = -2600;
      const hzW = [];
      for (let x = -4000; x <= 4000; x += 40) hzW.push(L(x, EYE, far));
      const clip = onTerrace ? null : [
        [L(-6.6, 0.1, G.z0), L(0.4, 0.1, G.z0), L(0.4, 2.9, G.z0), L(-6.6, 2.9, G.z0)],
        [L(1.5, 0, G.z0), L(6.5, 0, G.z0), L(6.5, 2.7, G.z0), L(1.5, 2.7, G.z0)],
      ];
      s.horizonWorld = hzW;
      s.lines.push({ shape: { p: hzW, a: hzW.map(() => seaA) }, space: 'world', width: 2.6, clip, depthFree: true, warm: sun });
      for (const [zf, al] of [[-420, 0.35], [-190, 0.28], [-90, 0.22]]) {
        const pts = [];
        for (let x = -1400; x <= 1400; x += 40) pts.push(L(x, -32, zf));
        s.lines.push({ shape: { p: pts, a: pts.map(() => al * seaA) }, space: 'world', width: 1.4, clip, depthFree: true, warm: sun });
      }
      const sa = sun * seaA;
      if (sa > 0) {
        const disc = [];
        for (let i = 0; i <= 40; i++) { const t = Math.PI * (i / 40); disc.push(L(420 + Math.cos(t) * 70, EYE + Math.sin(t) * 70, far)); }
        s.lines.push({ shape: { p: disc, a: disc.map(() => sa) }, space: 'world', width: 2.4, clip, depthFree: true, warm: 1 });
      }
      s.sun = L(420, EYE + 20, far);
      s.sky = sun * (1 - seg(f, T.toKey[0], T.keyToLine[1], ease.inOut));
    }
    // room tags, set in the plan like a drawing's annotations
    const tag = (name, p, a0, a1) => { const a = seg(f, a0, a0 + 16, ease.settle) * (1 - seg(f, a1 - 14, a1, ease.inOut)); if (a > 0) s.tags.push({ name, p, a }); };
    tag('SALON', ROOM.salon, 738, 796);
    tag('MUTFAK', ROOM.mutfak, 812, 856);
    tag('TERAS', ROOM.teras, 870, 904);
  }
  if (f >= T.sunset[0]) {
    s.sky = Math.max(s.sky, seg(f, ...T.sunset, ease.inOut) * (1 - seg(f, T.toKey[0], T.keyToLine[1], ease.inOut)));
    if (!s.sun) s.sun = L(420, EYE + 20, -2600);
  }

  /* G — ANLAŞ: the sea horizon becomes two hands; a key between them */
  const hands = handsScreen();
  if (f >= T.toHands[0] && f < T.toKey[1] + 1) {
    const hzP = (s.horizonWorld || []).map((q) => { const r = project(q); return r ? [r[0], r[1], 0] : null; }).filter(Boolean);
    const gold = hands.shape.p.map((_, i) => (i / (hands.shape.p.length - 1) >= hands.keyFrom ? 1 : 0));
    const glint = seg(f, ...T.keyGlint, ease.settle) * (1 - seg(f, T.keyGlint[1], T.toKey[0], ease.inOut));
    let shape = hands.shape;
    if (f < T.toHands[1]) {
      const src = hzP.length > 2 ? resample({ p: hzP, a: hzP.map(() => 1) }, hands.shape.p.length) : resample(horizonScreen(), hands.shape.p.length);
      shape = morph(src, hands.shape, seg(f, ...T.toHands, ease.inOut), 0.5, ease.glide);
    }
    const handsOut = 1 - seg(f, ...T.handsOut, ease.inOut);
    const k = 1 + 0.025 * seg(f, T.toHands[1], T.toKey[0], ease.inOut);
    const p = shape.p.map((q) => [W / 2 + (q[0] - W / 2) * k, 1000 + (q[1] - 1000) * k, 0]);
    // after the hand-off the key is carried by act H; here only the hands remain
    const keyGone = f >= T.toKey[0];
    s.lines.push({ shape: { p, a: shape.a.map((v, i) => (gold[i] ? (keyGone ? 0 : v) : v * handsOut)) }, space: 'screen', width: 2.8, gold, goldAmount: 0.9 + 0.1 * glint, warm: 0.45 });
    s.glint = glint;
  }

  /* H — TAŞIN: the key comes forward, turns, clicks, and lets go */
  if (f >= T.toKey[0] && f < T.keyToLine[1] + 1) {
    const key = keyLocal();
    const th = seg(f, ...T.turn, (x) => ease.settle(x) + Math.sin(x * Math.PI) * 0.06) * (Math.PI / 2) * 0.9;
    const sc = 2.3;
    const place = key.p.map(([x, y]) => [KEY_CENTER[0] + x * Math.cos(th) * sc, KEY_CENTER[1] + y * sc, 0]);
    const n = hands.shape.p.length;
    const from = Math.floor(hands.keyFrom * (n - 1));
    const k = 1.025;
    const kSrc = resample({ p: hands.shape.p.slice(from).map((q) => [W / 2 + (q[0] - W / 2) * k, 1000 + (q[1] - 1000) * k, 0]), a: hands.shape.a.slice(from) }, key.p.length);
    let shape = morph(kSrc, { p: place, a: key.a }, seg(f, ...T.toKey, ease.inOut), 0.2, ease.glide);
    if (f >= T.keyToLine[0]) shape = morph({ p: place, a: key.a }, resample(horizonScreen(), key.p.length), seg(f, ...T.keyToLine, ease.inOut), 0.35, ease.glide);
    s.lines.push({ shape, space: 'screen', width: 3, gold: shape.p.map(() => 1), goldAmount: 1 - 0.8 * seg(f, ...T.keyToLine, ease.inOut) });
    const c = f - T.click;
    s.click = c >= 0 && c < 36 ? { t: c / 36, x: KEY_CENTER[0], y: KEY_CENTER[1] - 84 * sc } : null;
    s.flash = Math.max(s.flash, c >= 0 ? Math.max(0, 1 - c / 20) * 0.7 : 0);
    s.warm = Math.max(s.warm, c >= 0 ? Math.max(0, 1 - c / 40) : 0);
  }

  /* I — the line ties itself back into the name */
  if (f >= T.keyToLine[1]) {
    const m = seg(f, ...T.toWordmark, ease.glide);
    const shape = morph(horizonScreen(), wordmarkScreen(), m, 0.55, ease.glide);
    const out = 1 - seg(f, ...T.outlineOut, ease.inOut);
    const t = (f - T.keyToLine[1]) / 60;
    const echo = f < T.toWordmark[0] + 6 ? Math.sin(t * 2 * Math.PI * 7) * 9 * Math.exp(-t * 6) : 0;
    s.lines.push({ shape: { p: shape.p.map((q, i) => [q[0], q[1] - echo * Math.sin(Math.PI * (i / (N - 1))), 0]), a: shape.a.map((a) => a * out) }, space: 'screen', width: 3 });
  }
  if (f >= FRAMES - 1) s.lines = [];

  /* Kinetic chapter labels */
  s.labels = LABELS.map((l) => ({
    ...l,
    in: seg(f, l.at[0], l.at[0] + 24, (x) => x),
    out: seg(f, l.at[1] - 14, l.at[1], ease.inOut),
  })).filter((l) => l.in > 0 && l.out < 1);
  return s;
};
