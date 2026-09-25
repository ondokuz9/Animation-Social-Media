// "Doğru Çizgi" — the film as a pure function of (fractional) frame.
// 24 s, 1440 frames at 60 fps.
//
//   the name sinks into its line · the line becomes a hundred listings ·
//   they collapse into one line · the line lies down as the island ·
//   ARA — Girne, a search · BUL — the one listing · the pin lands on its
//   plot, the house rises · GEZ — the agent shows you round ·
//   ANLAŞ — the agent's hand becomes a handshake · TAŞIN — the key turns ·
//   the line, and the name rises out of it again.

import {
  clamp, lerp, invLerp, seg, ease, hash, v3, resample, morph, concat, withAlpha,
  lookCamera, makeProjector, catmull3, noise1,
} from './math.js';
import {
  W, H, FOV, MAP_DIST, GIRNE, CITIES, screenToA, horizonScreen, coastWorld,
  dividerWorld, handsScreen, N, brandLineScreen,
} from './shapes.js';
import { town, MARKERS, HOUSE_O } from './town.js';
import { villa, G, DOOR, EYE, ROOM, local as L } from './villa.js';
import { strokeVisibility } from './build.js';
import { cardLocal, CARDS, CARD_PTS, CARD_COUNT, keyLocal, KEY_CENTER, pinGlyph } from './graphics.js';
import { agentDrawing } from './agent.js';

export const FRAMES = 1440;

/* ── Beats ───────────────────────────────────────────────────────────────── */
export const T = {
  hold: 16, sink: [16, 40], sloganOut: [16, 32], stretch: [26, 68], pluck: [64, 116],
  cardsForm: [96, 128], collapse: [200, 224],
  tilt: [224, 290], toCoast: [228, 296], graticule: [244, 286], divider: [292, 312],
  pins: 294, pinGap: 6, girneLift: [344, 364],
  dive: [362, 436], mapOut: [428, 452],
  townCoast: [398, 452], townRoads: [410, 468], townBlocks: [420, 476],
  pill: [448, 566], typing: [464, 508],
  markers: 470, markerGap: 3, sweep: [516, 552], check: [552, 570], popover: [572, 650],
  houseDive: [640, 716], pinToParcel: [690, 716], parcelNote: [714, 780],
  exterior: [716, 800], riseCam: [720, 800],
  settle: [792, 842], agentIn: [800, 826], wave: [826, 852], doorOpen: [848, 876],
  tour: [842, 1440],
  shell: [900, 940], living: [912, 964], lampOn: [950, 972], kitchen: [1000, 1040], terrace: [1066, 1100],
  sunset: [1084, 1128],
  toHands: [1162, 1204], sceneOut: [1160, 1188], keyGlint: [1214, 1240],
  toKey: [1252, 1280], handsOut: [1252, 1272], turn: [1282, 1300], click: 1300,
  keyToLine: [1306, 1332], rise: [1332, 1358], sloganIn: [1352, 1368], urlIn: [1358, 1374],
};

/* Words that rise out of the line. `dock` sends the line to the corner,
   where it stays as the chapter mark. */
export const HEROES = [
  { t: 'ARA', n: '01', rise: [430, 452], out: [508, 530], dock: [526, 558] },
  { t: 'BUL', n: '02', rise: [558, 580], out: [614, 634], dock: [630, 700] },
  { t: 'GEZ', n: '03', rise: [812, 834], out: [866, 886], dock: [882, 1158] },
  { t: 'ANLAŞ', n: '04', rise: [1178, 1200], out: [1228, 1248] },
  { t: 'TAŞIN', n: '05', rise: [1262, 1284], out: [1306, 1322] },
];
export const COPY = [
  { t: 'Yüzlerce ilan.', rise: [104, 124], out: [156, 168] },
  { t: 'Hangisi doğru?', rise: [166, 186], out: [206, 222] },
];
export const HERO_Y = 1352;
export const CORNER = { x: 84, y: 268 };

/* ── Camera ──────────────────────────────────────────────────────────────── */
const logLerp = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));
const PIT = Math.PI / 2 - 0.0015;

const orbit = (target, dist, yaw, pitch) => {
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const pos = [target[0] + dist * cp * Math.sin(yaw), target[1] + dist * sp, target[2] + dist * cp * Math.cos(yaw)];
  const fwd = [-Math.sin(yaw), 0, -Math.cos(yaw)];
  const k = clamp(pitch / (Math.PI / 2));
  return { pos, target, upHint: v3.norm(v3.lerp([0, 1, 0], fwd, k * k)) };
};

const orbitAt = (f) => {
  let target = [0, 0, 0], dist = MAP_DIST, yaw = 0, pitch = 0;
  dist *= 1 - 0.04 * seg(f, 90, 224, ease.inOut);
  yaw = 0.014 * seg(f, 90, 224, ease.inOut) - 0.014 * seg(f, 224, 270, ease.inOut);
  pitch = lerp(0, PIT, seg(f, ...T.tilt, ease.glide));
  yaw += 0.05 * seg(f, T.tilt[1], T.dive[1], ease.inOut);
  const d = seg(f, ...T.dive, ease.inOut);
  target = v3.lerp(target, GIRNE, ease.settle(clamp(d * 1.2)));
  dist = logLerp(dist, 3100, d);
  pitch = lerp(pitch, 1.2, seg(f, 410, 470, ease.glide));
  yaw = lerp(yaw, -0.2, seg(f, 410, 480, ease.glide));
  const t = seg(f, 440, T.houseDive[0], ease.inOut);
  dist = lerp(dist, dist * 0.8, t);
  yaw = lerp(yaw, -0.06, t);
  pitch = lerp(pitch, 1.1, t);
  // BUL: the frame leans toward the one listing
  target = v3.lerp(target, HOUSE_O, 0.55 * seg(f, 540, 640, ease.inOut));
  // onto the chosen pin: it stays exactly at the centre of the frame
  const h = seg(f, ...T.houseDive, ease.inOut);
  target = v3.lerp(target, HOUSE_O, ease.settle(clamp(h * 1.3)));
  dist = logLerp(dist, 70, h);
  pitch = lerp(pitch, 1.18, h);
  yaw = lerp(yaw, 0, h);
  // rise into a three-quarter view of the house on its plot
  const r = seg(f, ...T.riseCam, ease.glide);
  target = v3.lerp(target, v3.add(HOUSE_O, [0, 2.2, 0]), r);
  dist = lerp(dist, 50, r);
  pitch = lerp(pitch, 0.48, r);
  yaw = lerp(yaw, 0.6, r);
  // come down to the front door, where the agent waits
  const s = seg(f, ...T.settle, ease.inOut);
  target = v3.lerp(target, L(-3.0, 1.25, 6.0), s);
  dist = lerp(dist, 10.5, s);
  pitch = lerp(pitch, 0.1, s);
  yaw = lerp(yaw, 0.06, s);
  return orbit(target, dist, yaw, pitch);
};

let _tour = null;
const tour = () => {
  if (_tour) return _tour;
  const k0 = orbitAt(T.tour[0]);
  const knots = [
    [T.tour[0], k0.pos, k0.target],
    [872, L(-2.7, EYE, 10.2), L(-2.6, 1.35, 3)],
    [906, L(-2.5, EYE, 5.6), L(-2.4, 1.3, -4)],
    [940, L(-3.1, 1.8, 4.7), L(-2.0, 0.95, -4)],
    [990, L(-2.9, 1.78, 4.1), L(-1.9, 0.95, -4)],
    [1026, L(-0.6, 1.75, 1.2), L(7, 1.0, 1.0)],
    [1056, L(-0.2, 1.75, 1.0), L(7, 1.0, 0.8)],
    [1086, L(3.0, EYE, -3.6), L(4.0, 1.35, -20)],
    [1112, L(3.0, EYE, -6.2), L(8, EYE, -60)],
    [1136, L(3.1, EYE, -6.5), L(8, EYE, -60)],
    [1160, L(3.3, 1.58, -6.5), L(3.95, 1.2, -9.2)],
    [1440, L(3.35, 1.58, -6.6), L(3.95, 1.2, -9.2)],
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
    const pos = catmull3(tr.pos, s), target = catmull3(tr.tgt, s);
    const d = v3.len(v3.sub(target, pos));
    const drift = [noise1(f / 38, 1) * 0.01 * d, noise1(f / 45, 2) * 0.007 * d, 0];
    c = { pos: v3.add(pos, [0, noise1(f / 22, 3) * 0.01, 0]), target: v3.add(target, drift), upHint: [0, 1, 0] };
    const b = seg(f, T.tour[0], T.tour[0] + 16, ease.inOut);
    if (b < 1) { const o = orbitAt(f); c = { pos: v3.lerp(o.pos, c.pos, b), target: v3.lerp(o.target, c.target, b), upHint: [0, 1, 0] }; }
  }
  const fov = lerp(FOV, (58 * Math.PI) / 180, seg(f, 880, 912, ease.inOut));
  return lookCamera({ ...c, fov });
};

/* ── The agent's day ─────────────────────────────────────────────────────
   Local metres. Between rooms the agent is off camera — and, as on any film
   set, already waiting in the next one. */
const AGENT = [
  { span: [800, 862], path: [[-3.8, 6.3]], wave: [826, 852], side: 1 },
  { span: [862, 926], path: [[-3.8, 6.3], [-2.5, 5.5], [-2.6, 4.1], [-4.2, 3.1]], out: [904, 918] },
  { span: [926, 998], path: [[0.3, -2.6], [-0.7, -3.1]], walkTo: 962, in: [926, 936], present: [968, 996], side: -1 },
  { span: [998, 1064], path: [[5.9, 2.2], [5.3, 1.5]], walkTo: 1030, in: [998, 1008], present: [1034, 1062], side: -1 },
  { span: [1066, 1210], path: [[4.5, -8.2], [4.0, -9.2]], walkTo: 1100, in: [1066, 1076], present: [1106, 1130], side: -1, offer: [1134, 1158] },
];
const pathAt = (path, t) => {
  if (path.length === 1) return [path[0][0], path[0][1], 0];
  const lens = [];
  let tot = 0;
  for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); lens.push(l); tot += l; }
  let d = clamp(t) * tot;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) { const u = clamp(d / lens[i]); return [lerp(path[i][0], path[i + 1][0], u), lerp(path[i][1], path[i + 1][1], u), tot]; }
    d -= lens[i];
  }
  return [path[path.length - 1][0], path[path.length - 1][1], tot];
};
const walkCurve = (x) => ease.inOut(x) * 0.15 + x * 0.85;
export const agentAt = (f, cam) => {
  const k = AGENT.find((a) => f >= a.span[0] && f < a.span[1]);
  if (!k) return null;
  const end = k.walkTo ?? k.span[1];
  const moving = k.path.length > 1;
  const wt = moving ? seg(f, k.span[0], end, (x) => x) : 0;
  const walkEnv = moving ? Math.min(seg(f, k.span[0], k.span[0] + 8), 1 - seg(f, end - 8, end)) : 0;
  const q = pathAt(k.path, walkCurve(wt));
  const q2 = pathAt(k.path, walkCurve(clamp(wt + 0.03)));
  const pos = L(q[0], 0, q[1]);
  let facing = 0;
  if (moving && walkEnv > 0) {
    const dir = [q2[0] - q[0], 0, q2[1] - q[1]];
    const side = v3.dot(dir, cam.r), depth = v3.dot(dir, cam.f);
    if (Math.abs(side) + Math.abs(depth) > 1e-6) facing = clamp((side / (Math.abs(side) + Math.abs(depth) * 0.8)) * 1.2, -1, 1) * walkEnv;
  }
  const dist = q[2] * walkCurve(wt);
  const alpha = (k.in ? seg(f, ...k.in) : 1) * (k.out ? 1 - seg(f, ...k.out) : 1);
  const g = (w) => (w ? seg(f, w[0], w[0] + 14, ease.settle) * (1 - seg(f, w[1] - 10, w[1], ease.inOut)) : 0);
  const offer = k.offer ? seg(f, k.offer[0], k.offer[0] + 18, ease.settle) : 0;
  return {
    pos, alpha,
    pose: { facing, phase: (Math.PI * dist) / 0.72, walk: walkEnv, present: g(k.present), wave: g(k.wave), offer, side: offer > 0 ? 1 : (k.side ?? 1), hold: 1 - offer },
  };
};

const agentWorld = (ag, cam) => {
  const rh = v3.norm([cam.r[0], 0, cam.r[2]]);
  return agentDrawing(ag.pose).map((st) => ({ pts: st.pts.map(([x, y]) => v3.add(ag.pos, [rh[0] * x * 0.0098, y * 0.0098, rh[2] * x * 0.0098])), w: st.w }));
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const aPlane = (s) => ({ p: s.p.map((q) => screenToA(q)), a: s.a });
const heat = (a, u, head, base = 0.8) => a * (base + (1 - base) * Math.exp(-Math.max(0, head - u) / 0.035));
const firstAtOrAfter = (u, x) => { let i = 0; while (i < u.length - 1 && u[i] < x) i++; return i; };
const pluckOffset = (f, u) => {
  if (f < T.pluck[0] || f > T.pluck[1]) return 0;
  const t = (f - T.pluck[0]) / 60;
  return (Math.sin(Math.PI * u) * Math.cos(t * 2 * Math.PI * 7.5) + 0.25 * Math.sin(2 * Math.PI * u) * Math.cos(t * 2 * Math.PI * 13)) * 24 * Math.exp(-t * 5.4);
};
const cardShape = (i, f) => {
  const c = CARDS[i];
  const drift = [noise1(f / 50 + c.seed, 1) * 14, noise1(f / 60 + c.seed, 2) * 18];
  const rot = c.rot + noise1(f / 80 + c.seed, 3) * 0.08;
  const cr = Math.cos(rot), sr = Math.sin(rot);
  return cardLocal().p.map(([x, y]) => [c.x + drift[0] + (x * cr - y * sr) * c.s, c.y + drift[1] + (x * sr + y * cr) * c.s, 0]);
};
const liftCard = (pts, i) => pts.map((q) => v3.add(screenToA(q), [0, 0, CARDS[i].z]));
const hline = (x0, x1, y, n = 60) => { const p = []; for (let i = 0; i < n; i++) p.push([lerp(x0, x1, i / (n - 1)), y, 0]); return p; };

/* The plot the pin lands on. */
export const PARCEL = [[-10.5, 10.5], [10.8, 11.6], [10.2, -12.2], [-10.9, -11.4]].map(([x, z]) => L(x, 0, z));
export const PARCEL_AREA = (() => {
  let a = 0;
  for (let i = 0; i < PARCEL.length; i++) { const p = PARCEL[i], q = PARCEL[(i + 1) % PARCEL.length]; a += p[0] * q[2] - q[0] * p[2]; }
  return Math.abs(a / 2);
})();
const PARCEL_PTS = (() => {
  const out = [];
  for (let i = 0; i < PARCEL.length; i++) for (let k = 0; k < 40; k++) out.push(v3.lerp(PARCEL[i], PARCEL[(i + 1) % PARCEL.length], k / 40));
  out.push(PARCEL[0]);
  return out;
})();

/* ── Frame state ─────────────────────────────────────────────────────────── */
export const stateAt = (frame) => {
  const f = frame;
  const cam = cameraAt(f);
  const project = makeProjector(cam, W, H);
  const s = {
    frame: f, cam, project, lines: [], pins: [], markers: [], rings: [], tags: [],
    heroes: [], copy: [], corner: null, pill: null, popover: null, note: null,
    wordRise: 0, slogan: 0, url: 0, flash: 0, warm: 0, sky: 0, graticule: 0, divider: 0, scrim: 0,
  };
  const V = villa();
  const TW = town();

  /* The lockup: the name above its line. Frame 0 is the last frame. */
  const lockup = f < T.hold || f >= FRAMES - 1;
  s.wordRise = lockup ? 1 : f < T.sink[1] ? 1 - seg(f, ...T.sink, ease.launch) : seg(f, ...T.rise, ease.settle);
  s.slogan = lockup ? 1 : f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.sloganIn, ease.settle);
  s.url = lockup ? 1 : f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.urlIn, ease.settle);
  if (lockup || f >= T.keyToLine[1] || f < T.stretch[0]) {
    const t = (f - T.keyToLine[1]) / 60;
    const echo = !lockup && f >= T.keyToLine[1] && f < T.rise[1] ? Math.sin(t * 2 * Math.PI * 6) * 7 * Math.exp(-t * 6) : 0;
    const bl = brandLineScreen(200);
    s.lines.push({ brand: true, shape: { p: bl.p.map((q, i) => [q[0], q[1] - echo * Math.sin((Math.PI * i) / 199), 0]), a: bl.a }, space: 'screen', width: 3 });
  }

  /* A · B — the line stretches to the horizon, is plucked, becomes cards */
  if (f >= T.stretch[0] && f < T.tilt[0] + 1) {
    let line = morph(brandLineScreen(), horizonScreen(), seg(f, ...T.stretch, ease.glide), 0.2, ease.glide);
    line = { p: line.p.map((q, i) => [q[0], q[1] - pluckOffset(f, i / (N - 1)), 0]), a: line.a };
    const form = seg(f, ...T.cardsForm, (x) => x);
    const back = seg(f, ...T.collapse, (x) => x);
    if (f < T.cardsForm[0]) s.lines.push({ shape: aPlane(line), space: 'world', width: 3 });
    else {
      const p = [], a = [];
      for (let i = 0; i < CARD_COUNT; i++) {
        const slice = { p: line.p.slice(i * CARD_PTS, (i + 1) * CARD_PTS).map(screenToA), a: line.a.slice(i * CARD_PTS, (i + 1) * CARD_PTS) };
        const mi = ease.settle(clamp(form * 1.45 - hash(i + 3) * 0.45));
        const bi = ease.snap(clamp(back * 1.3 - hash(i + 9) * 0.3));
        const card = { p: liftCard(cardShape(i, f), i), a: cardLocal().a };
        const final = morph(morph(slice, card, mi, 0, (x) => x), slice, bi, 0, (x) => x);
        final.a[0] *= Math.max(1 - mi, bi);
        p.push(...final.p); a.push(...final.a);
        const live = Math.min(mi, 1 - bi);
        if (CARDS[i].dup && live > 0.3) {
          const k = Math.floor(f / 3);
          if (hash(k * 7.1 + i) > 0.35) {
            const off = [(hash(k + i) - 0.5) * 26, (hash(k * 1.7 + i) - 0.5) * 20];
            s.lines.push({ shape: { p: liftCard(cardShape(i, f - 7).map((q) => [q[0] + off[0], q[1] + off[1], 0]), i), a: cardLocal().a.map((v) => v * 0.34 * live) }, space: 'world', width: 1.4 });
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
    const shape = morph(aPlane(horizonScreen()), coastWorld(), seg(f, ...T.toCoast, ease.glide), 0.8, ease.inOut);
    const out = 1 - seg(f, ...T.mapOut, ease.inOut);
    s.lines.push({ shape: { p: shape.p, a: shape.a.map((a) => a * out) }, space: 'world', width: 3 });
    s.flash = Math.max(s.flash, Math.max(0, 1 - (f - T.collapse[1]) / 16));
  }
  s.graticule = seg(f, ...T.graticule, ease.inOut) * (1 - seg(f, T.dive[0], T.dive[0] + 30, ease.inOut));
  s.divider = seg(f, ...T.divider, ease.inOut) * (1 - seg(f, T.dive[0], T.dive[0] + 30, ease.inOut));
  if (s.divider > 0) s.dividerLines = dividerWorld();
  if (f >= T.pins && f < T.dive[1]) {
    CITIES.forEach((c, i) => {
      const t0 = T.pins + i * T.pinGap;
      if (f < t0) return;
      const isG = i === CITIES.length - 1;
      const out = isG ? 1 - seg(f, T.dive[1] - 30, T.dive[1], ease.inOut) : 1 - seg(f, T.dive[0], T.dive[0] + 24, ease.inOut);
      s.pins.push({
        name: c.name, p: c.p, isG, drop: seg(f, t0, t0 + 14, ease.settle),
        ripple: invLerp(t0 + 8, t0 + 44, f), a: out, label: seg(f, t0 + 6, t0 + 20, ease.settle) * out,
        lift: isG ? seg(f, ...T.girneLift, ease.settle) : 0,
      });
    });
  }

  /* D — ARA · BUL: Girne draws itself; a search; one listing is the one */
  if (f >= T.townCoast[0] && f < T.exterior[1]) {
    const out = 1 - seg(f, T.houseDive[0] + 10, T.houseDive[0] + 44, ease.inOut);
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
      const dim = m.chosen ? 1 : lerp(1, 0.22, seg(f, T.sweep[0] + 8, T.sweep[1], ease.inOut));
      const mo = m.chosen ? 1 - seg(f, T.pinToParcel[0], T.pinToParcel[0] + 2) : out;
      s.markers.push({
        p: m.p, chosen: m.chosen, a: Math.min(1, dim + hit * 0.8) * mo,
        pop: seg(f, t0, t0 + 18, (x) => ease.settle(x) + Math.sin(x * Math.PI) * 0.22 * (1 - x)),
        check: m.chosen ? seg(f, ...T.check, ease.inOut) : 0,
        grow: m.chosen ? 1 + 0.5 * seg(f, T.check[0] - 6, T.check[1] + 6, ease.settle) : 1,
      });
    });
    if (f >= T.sweep[0] && f < T.sweep[1] + 16) s.rings.push({ c: GIRNE, r: sweepR, a: 0.55 * (1 - seg(f, T.sweep[1] - 10, T.sweep[1] + 16)) });
    if (f >= T.pill[0] && f < T.pill[1]) {
      s.pill = {
        a: seg(f, T.pill[0], T.pill[0] + 18, ease.settle) * (1 - seg(f, T.pill[1] - 14, T.pill[1], ease.inOut)),
        draw: seg(f, T.pill[0], T.pill[0] + 20, ease.inOut), typed: seg(f, ...T.typing, (x) => x),
        caret: f < T.typing[1] + 4 || Math.floor(f / 16) % 2 === 0,
      };
    }
    if (f >= T.popover[0] && f < T.popover[1]) {
      const r = project(HOUSE_O);
      if (r) s.popover = { x: r[0], y: r[1], a: seg(f, T.popover[0], T.popover[0] + 16, ease.settle) * (1 - seg(f, T.popover[1] - 14, T.popover[1], ease.inOut)) };
    }
  }

  /* E — the pin lands on its plot; the house rises on it */
  if (f >= T.pinToParcel[0] && f < T.sceneOut[1]) {
    const fade = 1 - seg(f, 880, 910, ease.inOut);
    const m = seg(f, ...T.pinToParcel, ease.inOut);
    if (m < 1) {
      const c = project(HOUSE_O);
      const sc = 0.9 * 1.5;
      const pin = resample(withAlpha(pinGlyph().body.map(([x, y]) => [c[0] + x * sc, c[1] + y * sc, 0])), PARCEL_PTS.length);
      const proj = { p: PARCEL_PTS.map((q) => { const r = project(q); return r ? [r[0], r[1], 0] : [c[0], c[1], 0]; }), a: PARCEL_PTS.map(() => 1) };
      s.lines.push({ shape: morph(pin, proj, m, 0, ease.inOut), space: 'screen', width: 2.6 });
    } else {
      s.lines.push({ shape: { p: PARCEL_PTS, a: PARCEL_PTS.map(() => fade * lerp(1, 0.55, seg(f, T.exterior[0], T.exterior[0] + 40))) }, space: 'world', width: 2.4, nearFade: 1 });
    }
    const na = seg(f, T.parcelNote[0], T.parcelNote[0] + 14, ease.settle) * (1 - seg(f, T.parcelNote[1] - 12, T.parcelNote[1], ease.inOut));
    if (na > 0) { const r = project(v3.lerp(PARCEL[0], PARCEL[1], 0.5)); if (r) s.note = { x: r[0], y: r[1], a: na, text: `ARSA · ${Math.round(PARCEL_AREA)} m²` }; }
  }

  if (f >= T.exterior[0] && f < T.sceneOut[1]) {
    const rel = v3.sub(cam.pos, HOUSE_O);
    const inside = rel[2] < G.z1 && rel[2] > G.z0 && rel[1] < G.h && Math.abs(rel[0]) < G.x1;
    const vis = strokeVisibility(V.exterior.strokes, cam.pos, 0.14).map((v) => (inside ? 0.3 : v));
    const he = seg(f, ...T.exterior, (x) => ease.inOut(x) * 0.3 + x * 0.7);
    const sceneOut = 1 - seg(f, ...T.sceneOut, ease.inOut);
    const ex = V.exterior;
    s.lines.push({
      shape: { p: ex.p, a: ex.a.map((v, i) => (ex.u[i] <= he && ex.sid[i] >= 0 ? heat(v, ex.u[i], he) * vis[ex.sid[i]] * sceneOut : 0)) },
      space: 'world', width: 2.3, spark: he > 0 && he < 1 ? ex.p[firstAtOrAfter(ex.u, he)] : null, nearFade: 1.2,
    });
    // the door, on its hinge
    const th = seg(f, ...T.doorOpen, ease.settle) * 1.5;
    const hn = ROOM.hinge, wd = DOOR.x1 - DOOR.x0;
    const edge = [hn[0] + Math.cos(th) * wd, hn[1], hn[2] - Math.sin(th) * wd];
    const up = (q, h) => [q[0], q[1] + h, q[2]];
    const doorA = seg(f, T.exterior[1] - 20, T.exterior[1], ease.inOut) * sceneOut;
    const hx = v3.lerp(hn, edge, 0.86);
    const dp = [hn, edge, up(edge, DOOR.h), up(hn, DOOR.h), hn, hn, up(hx, 0.95), up(hx, 1.1)];
    const da = [1, 1, 1, 1, 1, 0, 0, 1];
    s.lines.push({ shape: { p: dp.flatMap((q, i) => (i === 0 ? [q] : [0.25, 0.5, 0.75, 1].map((t) => v3.lerp(dp[i - 1], q, t)))), a: da.flatMap((v, i) => (i === 0 ? [v] : [v, v, v, v])).map((v) => v * doorA) }, space: 'world', width: 2.2, nearFade: 0.9 });

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
    if (lampOn > 0) s.lamp = { p: ROOM.lamp, a: lampOn * sceneOut * (1 - seg(f, 1010, 1040, ease.inOut)) };

    const onTerrace = rel[2] < G.z0;
    const seaA = seg(f, 900, 940, ease.inOut) * sceneOut;
    if (seaA > 0) {
      const far = -2600;
      const hzW = [];
      for (let x = -4000; x <= 4000; x += 40) hzW.push(L(x, EYE, far));
      const clip = onTerrace ? null : [
        [L(-6.6, 0.1, G.z0), L(0.4, 0.1, G.z0), L(0.4, 2.9, G.z0), L(-6.6, 2.9, G.z0)],
        [L(1.5, 0, G.z0), L(6.5, 0, G.z0), L(6.5, 2.7, G.z0), L(1.5, 2.7, G.z0)],
      ];
      s.lines.push({ shape: { p: hzW, a: hzW.map(() => seaA) }, space: 'world', width: 2.6, clip, depthFree: true, warm: sun });
      for (const [zf, al] of [[-420, 0.35], [-190, 0.28], [-90, 0.22]]) {
        const pts = [];
        for (let x = -1400; x <= 1400; x += 40) pts.push(L(x, -32, zf));
        s.lines.push({ shape: { p: pts, a: pts.map(() => al * seaA) }, space: 'world', width: 1.4, clip, depthFree: true, warm: sun });
      }
      if (sun * seaA > 0) {
        const disc = [];
        for (let i = 0; i <= 40; i++) { const t = Math.PI * (i / 40); disc.push(L(900 + Math.cos(t) * 70, EYE + Math.sin(t) * 70, far)); }
        s.lines.push({ shape: { p: disc, a: disc.map(() => sun * seaA) }, space: 'world', width: 2.4, clip, depthFree: true, warm: 1 });
      }
    }
    const tag = (name, p, a0, a1) => { const a = seg(f, a0, a0 + 16, ease.settle) * (1 - seg(f, a1 - 14, a1, ease.inOut)); if (a > 0) s.tags.push({ name, p, a }); };
    tag('SALON', ROOM.salon, 936, 996);
    tag('MUTFAK', L(3.3, 0.95, -1.4), 1030, 1062);
    tag('TERAS', L(2.0, 0.02, -9.4), 1100, 1134);
  }
  s.sun = L(900, EYE + 20, -2600);
  s.sky = seg(f, ...T.sunset, ease.inOut) * (1 - seg(f, T.toKey[0], T.keyToLine[1], ease.inOut));

  /* The agent */
  const ag = f >= T.agentIn[0] && f < T.toHands[1] ? agentAt(f, cam) : null;
  let agentStrokes = null;
  if (ag) {
    agentStrokes = agentWorld(ag, cam);
    if (f < T.toHands[0]) {
      const drawn = seg(f, T.agentIn[0], T.agentIn[1] + 6, ease.inOut);
      const p = [], a = [];
      agentStrokes.forEach((st, j) => {
        if (p.length) { p.push(p[p.length - 1], st.pts[0]); a.push(0, 0); }
        st.pts.forEach((q, qi) => { p.push(q); a.push(ag.alpha * st.w * ((j + qi / st.pts.length) / agentStrokes.length <= drawn ? 1 : 0)); });
      });
      s.lines.push({ shape: { p, a }, space: 'world', width: 2.5, warm: 0.55, nearFade: 0.6, depthFree: true });
    }
  }

  /* F — ANLAŞ: the agent's offered hand becomes the handshake */
  const hands = handsScreen();
  if (f >= T.toHands[0] && f < T.toKey[1] + 1) {
    const gold = hands.shape.p.map((_, i) => (i / (hands.shape.p.length - 1) >= hands.keyFrom ? 1 : 0));
    const glint = seg(f, ...T.keyGlint, ease.settle) * (1 - seg(f, T.keyGlint[1], T.toKey[0], ease.inOut));
    let shape = hands.shape;
    if (f < T.toHands[1]) {
      const src = agentStrokes
        ? resample(concat(...agentStrokes.map((st) => withAlpha(st.pts.map((q) => { const r = project(q); return r ? [r[0], r[1], 0] : [W / 2, H / 2, 0]; })))), hands.shape.p.length)
        : resample(horizonScreen(), hands.shape.p.length);
      shape = morph(src, hands.shape, seg(f, ...T.toHands, ease.inOut), 0.4, ease.glide);
    }
    const handsOut = 1 - seg(f, ...T.handsOut, ease.inOut);
    const k = 1 + 0.025 * seg(f, T.toHands[1], T.toKey[0], ease.inOut);
    const p = shape.p.map((q) => [W / 2 + (q[0] - W / 2) * k, 830 + (q[1] - 830) * k, 0]);
    const keyGone = f >= T.toKey[0];
    s.lines.push({ shape: { p, a: shape.a.map((v, i) => (gold[i] ? (keyGone ? 0 : v) : v * handsOut)) }, space: 'screen', width: 2.8, gold, goldAmount: 0.9 + 0.1 * glint, warm: 0.45 });
    s.glint = glint;
  }

  /* G — TAŞIN: the key comes forward, turns, clicks, and becomes the line */
  if (f >= T.toKey[0] && f < T.keyToLine[1]) {
    const key = keyLocal();
    const th = seg(f, ...T.turn, (x) => ease.settle(x) + Math.sin(x * Math.PI) * 0.06) * (Math.PI / 2) * 0.9;
    const sc = 2.3;
    const place = key.p.map(([x, y]) => [KEY_CENTER[0] + x * Math.cos(th) * sc, KEY_CENTER[1] + y * sc, 0]);
    const n = hands.shape.p.length, from = Math.floor(hands.keyFrom * (n - 1)), k = 1.025;
    const kSrc = resample({ p: hands.shape.p.slice(from).map((q) => [W / 2 + (q[0] - W / 2) * k, 830 + (q[1] - 830) * k, 0]), a: hands.shape.a.slice(from) }, key.p.length);
    let shape = morph(kSrc, { p: place, a: key.a }, seg(f, ...T.toKey, ease.inOut), 0.2, ease.glide);
    if (f >= T.keyToLine[0]) shape = morph({ p: place, a: key.a }, brandLineScreen(key.p.length), seg(f, ...T.keyToLine, ease.inOut), 0.35, ease.glide);
    s.lines.push({ shape, space: 'screen', width: 3, gold: shape.p.map(() => 1), goldAmount: 1 - seg(f, ...T.keyToLine, ease.inOut) });
    const c = f - T.click;
    s.click = c >= 0 && c < 36 ? { t: c / 36, x: KEY_CENTER[0], y: KEY_CENTER[1] - 84 * sc } : null;
    s.flash = Math.max(s.flash, c >= 0 ? Math.max(0, 1 - c / 20) * 0.7 : 0);
    s.warm = Math.max(s.warm, c >= 0 ? Math.max(0, 1 - c / 40) : 0);
  }
  if (lockup) { s.lines = s.lines.filter((l) => l.brand); s.flash = 0; s.warm = 0; s.sky = 0; }

  /* Typography: words rise out of lines; lines carry them to the corner */
  const wordLine = (x0, x1, y, a) => { const p = hline(x0, x1, y); s.lines.push({ shape: { p, a: p.map(() => a) }, space: 'screen', width: 2.4 }); };
  for (const h of HEROES) {
    if (f < h.rise[0] - 4 || f > (h.dock ? h.dock[1] : h.out[1]) + 2) continue;
    const draw = seg(f, h.rise[0] - 4, h.rise[0] + 12, ease.settle);
    const rise = seg(f, ...h.rise, ease.settle);
    const sink = seg(f, ...h.out, ease.launch);
    const half = 70 + h.t.length * 58;
    if (f < h.out[1]) {
      const close = h.dock ? 0 : seg(f, h.out[1] - 10, h.out[1] + 2, ease.inOut);
      wordLine(W / 2 - half * draw * (1 - close), W / 2 + half * draw * (1 - close), HERO_Y, 1);
      s.heroes.push({ t: h.t, n: h.n, rise, sink });
      s.scrim = Math.max(s.scrim, draw * (1 - sink));
    }
    if (h.dock && f >= h.out[1] - 6) {
      const fly = seg(f, h.out[1] - 6, h.dock[0] + 10, ease.glide);
      const hold = 1 - seg(f, h.dock[1] - 12, h.dock[1], ease.inOut);
      wordLine(lerp(W / 2 - half, CORNER.x + 58, fly), lerp(W / 2 + half, CORNER.x + 112, fly), lerp(HERO_Y, CORNER.y, fly), hold);
      if (fly > 0.6) s.corner = { n: h.n, t: h.t, a: seg(f, h.dock[0], h.dock[0] + 16, ease.settle) * hold };
    }
  }
  for (const c of COPY) {
    if (f < c.rise[0] - 4 || f > c.out[1] + 2) continue;
    const draw = seg(f, c.rise[0] - 4, c.rise[0] + 12, ease.settle);
    const close = seg(f, c.out[1] - 8, c.out[1] + 2, ease.inOut);
    wordLine(W / 2 - 290 * draw * (1 - close), W / 2 + 290 * draw * (1 - close), HERO_Y, 0.8);
    s.copy.push({ t: c.t, rise: seg(f, ...c.rise, ease.settle), sink: seg(f, ...c.out, ease.launch) });
    s.scrim = Math.max(s.scrim, draw * 0.7);
  }
  return s;
};

/* Where the picture moves fast enough to need more shutter samples. */
export const FAST = [T.stretch, T.cardsForm, T.collapse, T.tilt, T.dive, T.houseDive, T.riseCam, [842, 920], [990, 1030], [1056, 1112], [1136, 1160], T.toKey, T.turn, T.keyToLine];
export const isFast = (f) => FAST.some(([a, b]) => f >= a - 4 && f <= b + 4);
