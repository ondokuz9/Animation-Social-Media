// "Doğru Çizgi" — the film as a pure function of (fractional) frame.
// 24 s, 1440 frames at 60 fps.
//
//   the name sinks into its gold line · the line is plucked and bursts into
//   listings — the same house at two prices · "Hangisi doğru?" · the fakes
//   short out, everything snaps into one line, and "doğru" stays on it ·
//   the line lies down as the island · Girne · a search · "Doğru ilan." ·
//   the pin unfolds into its plot, the house is drawn on it ·
//   "Doğru emlakçı." — the agent shows you round · on the terrace the agent
//   offers a hand, a second hand takes it · the key turns and lies down as
//   the line · the name rises out of it again.

import {
  clamp, lerp, invLerp, seg, ease, hash, v3, resample, morph, concat, withAlpha,
  lookCamera, makeProjector, catmull3, noise1,
} from './math.js';
import {
  W, H, FOV, MAP_DIST, GIRNE, CITIES, screenToA, horizonScreen, coastWorld,
  dividerWorld, handsParts, handsToScreen, N, brandLineScreen, LINE_Y, ungeo,
} from './shapes.js';
import { town, MARKERS, HOUSE_O } from './town.js';
import { villa, G, U, DOOR, EYE, ROOM, local as L } from './villa.js';
import { strokeVisibility, S, joinStrokes } from './build.js';
import { cardLocal, cardDetail, CARDS, CARD_PTS, CARD_COUNT, CARD_CENTER, PRICE_AT, keyLocal, KEY_CENTER, pinGlyph } from './graphics.js';
import { agentDrawing } from './agent.js';

/* The key on its ring, hanging from the clasp: it drops as the grip closes and
   swings to rest about the ring's top (hands-box coordinates). */
const RING = { c: [560, 587], r: 34, top: [560, 553] };
const keyHang = (f, HP) => {
  const t0 = T.keyDrop;
  const appear = seg(f, t0 - 4, t0 + 6, ease.inOut);
  if (appear <= 0) return null;
  const pv = handsToScreen(RING.top);
  const th = f < t0 ? 0.2 : 0.2 * Math.exp(-(f - t0) / 15) * Math.cos((2 * Math.PI * (f - t0)) / 30);
  const dy = -26 * (1 - ease.settle(clamp((f - (t0 - 4)) / 12)));
  const c = Math.cos(th), sn = Math.sin(th);
  const rot = (q) => { const x = q[0] - pv[0], y = q[1] - pv[1]; return [pv[0] + x * c - y * sn, pv[1] + x * sn + y * c + dy, 0]; };
  const ringPts = [];
  for (let i = 0; i <= 48; i++) { const t = -Math.PI / 2 + (i / 48) * Math.PI * 2; ringPts.push(handsToScreen([RING.c[0] + Math.cos(t) * RING.r * 0.78, RING.c[1] + Math.sin(t) * RING.r])); }
  return {
    key: { p: HP.key.p.map(rot), a: HP.key.a.map((v) => v * appear) },
    ring: { p: ringPts.map(rot), a: ringPts.map(() => appear) },
  };
};

export const FRAMES = 1440;

/* The garden: the handshake happens on the horizon, in front of the sun. */
const MEET_X = 3.42, MEET_Z = -9.35, HAND_Y = 1.155;
const SUN_X = MEET_X;


/* ── Beats ───────────────────────────────────────────────────────────────── */
export const T = {
  hold: 6, sink: [6, 22], sloganOut: [6, 18], stretch: [6, 26], pluck: [24, 58],
  cardsForm: [30, 62], shortOut: [176, 200], antic: [184, 192], collapse: [190, 214],
  wordRide: [224, 252], wordSink: [252, 264],
  tilt: [258, 318], toCoast: [262, 324], graticule: [278, 314], divider: [318, 334],
  pins: 318, pinGap: 3, girneLift: [338, 356],
  dive: [356, 424], coastToTown: [382, 428], islandOut: [368, 398],
  townRoads: [404, 456], townBlocks: [410, 462],
  pill: [436, 568], typing: [446, 510],
  markers: 506, markerGap: 2, sweep: [526, 556], check: [556, 572], popover: [572, 692],
  houseDive: [690, 766], pinUnfold: [738, 760], parcelNote: [758, 812],
  exterior: [762, 842], riseCam: [766, 842],
  settle: [834, 884], doorOpen: [866, 890],
  tour: [884, 1440],
  shell: [926, 958], living: [934, 980], lampOn: [976, 996], kitchen: [1034, 1066], terrace: [1110, 1136],
  sunset: [1112, 1150],
  gripAt: 1198, handLock: [1208, 1220], toHands: [1210, 1232], sceneOut: [1206, 1226], keyDrop: 1230, keyGlint: [1236, 1248],
  toKey: [1249, 1270], handsOut: [1244, 1254], turn: [1270, 1286], click: 1286,
  keyToLine: [1290, 1310], rise: [1306, 1324], sloganIn: [1314, 1328], doğruGlint: [1340, 1362], urlIn: [1318, 1330], linePulse: [1372, 1424],
};

/* Words rise out of a line, letter by letter. The two chapter lines carry
   the pun: every big line in the film says "doğru". Editorial set: a mono
   kicker above, the line flush left, standing on its rule. */
export const HEROES = [
  { t: 'Doğru ilan.', gold: 'Doğru', rise: [606, 630], out: [672, 690] },
  { t: 'Doğru emlakçı.', gold: 'Doğru', rise: [866, 884], out: [910, 924] },
];
export const COPY = [{ t: "Kıbrıs'ta yüzlerce ilan.", rise: [34, 54], out: [100, 114] }];
export const TEXT_X = 96;
export const HERO_SIZE = 108, COPY_SIZE = 70;
/* Approximate advance widths for Hanken Grotesk (em). */
export const textWidth = (t, size, weight = 500) => [...t].reduce((w, ch) => w + (ch === ' ' ? 0.26 : /[ilıİ.'?]/.test(ch) ? 0.27 : /[mwMW]/.test(ch) ? 0.82 : /[A-ZĞŞÜÖÇ]/.test(ch) ? 0.64 : 0.55), 0) * size * (weight >= 600 ? 1.03 : 1);
export const HERO_Y = 1200;
export const PILL_Y = 1100;
/* the question enters only after the first line has fully left */
const PUN_IN = 118;

/* ── Camera ──────────────────────────────────────────────────────────────── */
const logLerp = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));
/* A flash that builds for a few frames and decays — never a one-frame step. */
const pulse = (f, at, rise, decay) => { if (f < at - rise) return 0; if (f < at) { const t = (f - at + rise) / rise; return t * t * (3 - 2 * t); } return Math.exp(-((f - at) / decay) * 2.3); };
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
  // A/B: a slow push through the card field
  dist *= 1 - 0.05 * seg(f, 54, 256, ease.inOut);
  yaw = 0.014 * seg(f, 54, 214, ease.inOut) - 0.014 * seg(f, 214, 290, ease.inOut);
  pitch = lerp(0, PIT, seg(f, ...T.tilt, ease.glide));
  yaw += 0.04 * seg(f, T.tilt[1], T.dive[0], ease.inOut);
  // into Girne: log zoom, turning so the coast settles level
  const d = seg(f, ...T.dive, ease.inOut);
  target = v3.lerp(target, GIRNE, ease.settle(clamp(d * 1.2)));
  dist = logLerp(dist, 3100, d);
  pitch = lerp(pitch, 1.2, seg(f, 396, 452, ease.glide));
  yaw = lerp(yaw, -0.12, seg(f, 380, 452, ease.glide));
  const t = seg(f, 440, T.houseDive[0], ease.inOut);
  dist = lerp(dist, dist * 0.82, t);
  yaw = lerp(yaw, -0.04, t);
  pitch = lerp(pitch, 1.1, t);
  // the chosen listing drifts to the middle while it is being chosen
  target = v3.lerp(target, HOUSE_O, 0.62 * seg(f, 510, 590, ease.inOut));
  // onto the chosen pin: it stays exactly at the centre of the frame
  const h = seg(f, ...T.houseDive, ease.inOut);
  target = v3.lerp(target, HOUSE_O, ease.settle(clamp(h * 1.3)));
  dist = logLerp(dist, 70, h);
  pitch = lerp(pitch, 1.18, h);
  yaw = lerp(yaw, 0, h);
  // rise into a three-quarter view of the house on its plot (framed a little high and smaller)
  const r = seg(f, ...T.riseCam, ease.glide);
  target = v3.lerp(target, v3.add(HOUSE_O, [0.8, 0.4, 0]), r);
  dist = lerp(dist, 56, r);
  pitch = lerp(pitch, 0.5, r);
  yaw = lerp(yaw, 0.58, r);
  // come down to the front door, where the agent waits
  const s = seg(f, ...T.settle, ease.inOut);
  target = v3.lerp(target, L(-2.2, 0.32, 6.0), s);
  dist = lerp(dist, 9.6, s);
  pitch = lerp(pitch, 0.12, s);
  yaw = lerp(yaw, 0.08, s);
  return orbit(target, dist, yaw, pitch);
};

/* The walked tour. Rooms get holds; moves between them follow the agent. */
let _tour = null;
const tour = () => {
  if (_tour) return _tour;
  const k0 = orbitAt(T.tour[0]);
  const knots = [
    [T.tour[0], k0.pos, k0.target],
    [914, k0.pos, k0.target],
    [936, L(-2.7, EYE, 10.0), L(-2.6, 1.3, 3)],
    [958, L(-2.5, EYE, 5.6), L(-2.3, 1.2, -4)],
    [972, L(-3.1, 1.8, 4.7), L(-2.3, 0.95, -4)],
    [1016, L(-3.05, 1.8, 4.5), L(-2.25, 0.95, -4)],
    [1048, L(-0.6, 1.75, 1.2), L(5.6, 1.0, -0.2)],
    [1100, L(-0.5, 1.75, 1.15), L(5.6, 1.0, -0.25)],
    [1124, L(3.2, 1.3, -3.4), L(3.8, 1.25, -30)],
    [1142, L(MEET_X, HAND_Y, -5.15), L(MEET_X, HAND_Y, -60)],
    [1440, L(MEET_X, HAND_Y, -5.15), L(MEET_X, HAND_Y, -60)],
  ];
  // look directions, not target points: targets at very different distances
  // make a spline of points swing behind the camera
  _tour = { knots, pos: knots.map((k) => k[1]), dir: knots.map((k) => v3.norm(v3.sub(k[2], k[1]))) };
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
    const pos = catmull3(tr.pos, s);
    const target = v3.add(pos, v3.mul(v3.norm(catmull3(tr.dir, s)), 6));
    // handheld: slow drift only, and none at all while something is being shown
    const lockW = [[972, 1016], [1056, 1100], [1140, 1440]].reduce((m, [a, b]) => Math.max(m, seg(f, a - 10, a, ease.inOut) * (1 - seg(f, b, b + 10, ease.inOut))), 0);
    const hh = 1 - lockW;
    const drift = [noise1(f / 70, 1) * 0.05 * hh, noise1(f / 85, 2) * 0.035 * hh, 0];
    c = { pos: v3.add(pos, [0, noise1(f / 60, 3) * 0.006 * hh, 0]), target: v3.add(target, drift), upHint: [0, 1, 0] };
    const b = seg(f, T.tour[0], T.tour[0] + 20, ease.inOut);
    if (b < 1) { const o = orbitAt(f); c = { pos: v3.lerp(o.pos, c.pos, b), target: v3.lerp(o.target, c.target, b), upHint: [0, 1, 0] }; }
  }
  const fov = lerp(FOV, (58 * Math.PI) / 180, seg(f, 920, 950, ease.inOut));
  return lookCamera({ ...c, fov });
};

/* ── The agent ────────────────────────────────────────────────────────────
   Local metres. The line draws the agent into each room and takes them out
   again — the same grammar that draws everything else. The right hand does
   every gesture (and offers the handshake); the left carries the tablet.
   Tracks are [frame, value] keys. Gestures have anticipation, overshoot and
   a breathing hold. */
const AGENT = [
  { // at the door, on its right: turns to it, ushers you in, steps aside
    span: [840, 944], path: [[-1.25, 6.0], [-0.9, 6.35]], walkFrom: 914, walkTo: 932, drawIn: [840, 864], drawOut: [928, 944],
    face: [[840, 0], [852, -0.25], [880, -0.2], [900, -0.1]], yaw: [[840, 0], [852, 0], [858, -0.8], [872, -0.8], [878, 0]],
    usher: [852, 884], shows: 'door',
  },
  { // living room: discovered by the sofa, looking out; turns to us; shows the sea
    // …then turns and leads the way out towards the kitchen: the camera follows him
    span: [944, 1036], path: [[-2.6, -0.2], [1.9, 0.1]], walkFrom: 1014, walkTo: 1036, drawIn: [944, 962], drawOut: [1026, 1036],
    face: [[944, -0.35], [962, -0.35], [974, 0], [1008, 0], [1018, 1]], yaw: [[944, -0.9], [964, -0.9], [972, 0], [978, 0], [982, -0.7], [1004, -0.7], [1010, 0]],
    present: [980, 1012], shows: 'glass',
    tilt: [[1004, 0], [1008, 0.1], [1014, 0]],
  },
  { // kitchen: walks to the end of the island, shows it
    span: [1036, 1110], path: [[4.4, 1.1], [3.8, 0.6]], walkFrom: 1036, walkTo: 1068, drawIn: [1036, 1052], drawOut: [1098, 1110],
    face: [[1036, 0], [1068, 0], [1076, -0.1]], yaw: [[1036, 0], [1072, 0], [1076, -0.7], [1098, -0.7]],
    present: [1076, 1102], shows: 'island',
    tilt: [[1098, 0], [1102, 0.12], [1108, 0]],
  },
  { // the garden: walks out ahead, shows the sea and the sun, then turns to the buyer and offers a hand
    span: [1110, 1236], path: [[2.1, -9.5], [MEET_X - 0.52, MEET_Z]], walkFrom: 1110, walkTo: 1142, drawIn: [1110, 1126],
    face: [[1142, 1], [1150, 0.62], [1166, 0.62], [1178, 1]], yaw: [[1110, 0], [1144, 0], [1150, -0.4], [1166, -0.4], [1174, 0]],
    tilt: [[1178, 0], [1186, 0.08], [1194, 0.03]],
    present: [1144, 1168], offer: [1182, 1236], shows: 'sun',
  },
];
/* The buyer: walks in from the kitchen side, stops facing the agent, takes the hand. */
const BUYER = [
  { buyer: true, span: [1146, 1236], path: [[MEET_X + 1.8, MEET_Z + 0.25], [MEET_X + 0.52, MEET_Z]], walkFrom: 1150, walkTo: 1180, drawIn: [1146, 1147],
    face: [[1146, -1]], yaw: [[1146, 0], [1176, 0], [1182, 0.25], [1190, 0]], tilt: [[1182, 0], [1190, -0.06], [1196, 0]],
    offer: [1183, 1236] },
];
const track = (keys, f, def = 0) => {
  if (!keys) return def;
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) if (f < keys[i + 1][0]) return lerp(keys[i][1], keys[i + 1][1], ease.inOut((f - keys[i][0]) / (keys[i + 1][0] - keys[i][0])));
  return keys[keys.length - 1][1];
};
/* A gesture: 6 frames of anticipation, an 16-frame rise with 7% overshoot,
   a hold that breathes, a 12-frame release. */
const gest = (f, w, hold = false) => {
  if (!w || f < w[0] - 6 || f > w[1]) return 0;
  if (f < w[0]) return -0.12 * Math.sin((Math.PI * (f - w[0] + 6)) / 6);
  const t = clamp((f - w[0]) / 16);
  const up = ease.inOut(t) + 0.07 * Math.sin(Math.PI * clamp((f - w[0] - 11) / 13));
  const breathe = t >= 1 ? 0.015 * Math.sin((f - w[0]) * 0.105) : 0;
  return (up + breathe) * (hold ? 1 : 1 - seg(f, w[1] - 12, w[1], ease.inOut));
};
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
const figureAt = (LIST) => (f, cam) => {
  const k = LIST.find((a) => f >= a.span[0] && f < a.span[1]);
  if (!k) return null;
  const moving = k.path.length > 1;
  const start = k.walkFrom ?? k.span[0], end = k.walkTo ?? k.span[1];
  // root speed and stride come from one ease, and the walk ends in double support
  const wt = moving ? ease.inOut(seg(f, start, end, (x) => x)) : 0;
  const q = pathAt(k.path, wt);
  const tot = q[2] || 0;
  const steps = Math.max(1, Math.round(tot / 0.66));
  const walkEnv = moving ? Math.min(seg(f, start, start + 6), 1 - seg(f, end - 4, end)) : 0;
  const pos = L(q[0], 0, q[1]);
  let facing = track(k.face, f, 0);
  if (moving && f > start && f < end) {
    const q2 = pathAt(k.path, clamp(wt + 0.02));
    const dir = [q2[0] - q[0], 0, q2[1] - q[1]];
    const side = v3.dot(dir, cam.r), depth = v3.dot(dir, cam.f);
    if (Math.abs(side) + Math.abs(depth) > 1e-6) {
      const wf = clamp((side / (Math.abs(side) + Math.abs(depth) * 0.6)) * 1.3, -1, 1);
      // never walk at a half-turned angle: commit to profile or stay frontal
      const committed = Math.abs(wf) > 0.45 ? Math.sign(wf) : 0;
      facing = lerp(facing, committed, walkEnv);
    }
  }
  const offer = k.offer ? gest(f, k.offer, true) : 0;
  const showW = k.present || k.usher;
  return {
    pos,
    drawIn: k.drawIn ? seg(f, ...k.drawIn, ease.inOut) : 1,
    drawOut: k.drawOut ? seg(f, ...k.drawOut, ease.inOut) : 0,
    pose: {
      facing, phase: Math.PI * steps * wt, walk: walkEnv,
      present: gest(f, k.present), usher: gest(f, k.usher), offer,
      yaw: track(k.yaw, f, 0), tilt: track(k.tilt, f, 0) + (k.offer ? 0.03 * Math.sin(Math.PI * seg(f, k.offer[0] + 14, k.offer[0] + 24)) : 0),
      breath: Math.sin(f * 0.026 + (k.buyer ? 1.7 : 0)), weight: 1, buyer: !!k.buyer,
    },
    shows: k.shows, showK: showW ? gest(f, showW) : 0, showT: showW ? seg(f, showW[0] + 2, showW[0] + 20, (x) => x) : 0,
  };
};

export const agentAt = figureAt(AGENT);
const buyerAt = figureAt(BUYER);

const agentWorld = (ag, cam) => {
  const rh = v3.norm([cam.r[0], 0, cam.r[2]]);
  const toW = ([x, y]) => v3.add(ag.pos, [rh[0] * x * 0.0098, y * 0.0098, rh[2] * x * 0.0098]);
  const d = agentDrawing(ag.pose);
  const out = d.map((st) => ({ pts: st.pts.map(toW), w: st.w, part: st.part, fill: st.fill }));
  out.hand = toW(d.hand);
  out.badge = toW(d.badge);
  return out;
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const aPlane = (s) => ({ p: s.p.map((q) => screenToA(q)), a: s.a });
const heat = (a, u, head, base = 0.8) => a * (base + (1 - base) * Math.exp(-Math.max(0, head - u) / 0.035));
const firstAtOrAfter = (u, x) => { let i = 0; while (i < u.length - 1 && u[i] < x) i++; return i; };
/* The pluck: a clear standing wave, three decaying cycles. */
const pluckOffset = (f, u) => {
  if (f < T.pluck[0] || f > T.pluck[1]) return 0;
  const t = (f - T.pluck[0]) / 60;
  const att = clamp((f - T.pluck[0]) / 3);
  return (Math.sin(Math.PI * u) * Math.cos(t * 2 * Math.PI * 5.2) + 0.3 * Math.sin(2 * Math.PI * u) * Math.cos(t * 2 * Math.PI * 9)) * 46 * att * Math.exp(-t * 4.2);
};
/* A card's placement at frame f: the spiral turns slowly about the two
   hero cards, which only breathe. Returns a local → screen mapper. */
const cardXform = (i, f) => {
  const c = CARDS[i];
  const sw = c.hero ? 0 : 0.85 * seg(f, 30, 214, (x) => x * (0.6 + 0.4 * x));
  const cx = CARD_CENTER[0] + (c.x - CARD_CENTER[0]) * Math.cos(sw) - (c.y - CARD_CENTER[1]) * Math.sin(sw);
  const cy = CARD_CENTER[1] + (c.x - CARD_CENTER[0]) * Math.sin(sw) + (c.y - CARD_CENTER[1]) * Math.cos(sw);
  const k = c.hero ? 0.35 : 1;
  const drift = [noise1(f / 44 + c.seed, 1) * 22 * k, noise1(f / 52 + c.seed, 2) * 26 * k];
  const rot = c.rot + sw + noise1(f / 60 + c.seed, 3) * 0.09 * k;
  const cr = Math.cos(rot), sr = Math.sin(rot);
  return ([x, y]) => [cx + drift[0] + (x * cr - y * sr) * c.s, cy + drift[1] + (x * sr + y * cr) * c.s, 0];
};
const cardShape = (i, f) => { const m = cardXform(i, f); return cardLocal().p.map(m); };
const liftCard = (pts, i) => pts.map((q) => v3.add(screenToA(q), [0, 0, CARDS[i].z]));
const hline = (x0, x1, y, n = 60) => { const p = []; for (let i = 0; i < n; i++) p.push([lerp(x0, x1, i / (n - 1)), y, 0]); return p; };
/* What the agent shows, as world paths the line can draw along. */
const FEATURES = {
  door: () => [L(DOOR.x0, 0.02, G.z1 + 0.04), L(DOOR.x0, DOOR.h, G.z1 + 0.04), L(DOOR.x1, DOOR.h, G.z1 + 0.04), L(DOOR.x1, 0.02, G.z1 + 0.04)],
  // the two middle panes of the glass wall — the ones in frame, with the sea behind
  glass: () => [L(-4.85, 0.1, G.z0 + 0.02), L(-4.85, 2.9, G.z0 + 0.02), L(-1.35, 2.9, G.z0 + 0.02), L(-1.35, 0.1, G.z0 + 0.02), L(-4.85, 0.1, G.z0 + 0.02)],
  island: () => [L(3.25, 0.98, -3.02), L(3.25, 0.98, 0.22), L(3.25, 0.9, 0.22)],
  sun: () => Array.from({ length: 17 }, (_, i) => { const t = Math.PI * (i / 16); return L(SUN_X + Math.cos(t) * 230, EYE + Math.sin(t) * 225, -2600); }),
};
const collapseLine = () => { const p = hline(90, W - 90, HERO_Y, N); return { p, a: p.map(() => 1) }; };

/* The plot the pin lands on. */
export const PARCEL = [[-10.5, 10.5], [10.8, 11.6], [10.2, -12.2], [-10.9, -11.4]].map(([x, z]) => L(x, 0, z));
const PARCEL_PTS = (() => {
  const out = [];
  for (let i = 0; i < PARCEL.length; i++) for (let k = 0; k < 40; k++) out.push(v3.lerp(PARCEL[i], PARCEL[(i + 1) % PARCEL.length], k / 40));
  out.push(PARCEL[0]);
  return out;
})();

/* The site plan around the plot, the way a landscape architect draws it:
   palms as stars, trees as scalloped rounds, contours, the street, the shore.
   Each point carries its distance from the house, so it can be revealed outward. */
let _site = null;
const site = () => {
  if (_site) return _site;
  const st = [];
  const ring = (cx, cz, r, n, fn) => { const p = []; for (let i = 0; i <= n; i++) { const u = (i / n) * Math.PI * 2; const k = fn ? fn(u) : 1; p.push([cx + Math.cos(u) * r * k, cz + Math.sin(u) * r * k]); } return p; };
  // palms: nine curved fronds from a crown
  for (const [x, z, r] of [[-8.6, 7.8, 1.7], [8.9, 8.4, 1.5], [-8.8, -8.6, 1.8], [8.4, -9.4, 1.6], [2.6, -11.0, 1.4], [-3.4, -10.8, 1.5]]) {
    for (let k = 0; k < 9; k++) { const u = (k / 9) * Math.PI * 2 + x; st.push([[x, z], [x + Math.cos(u + 0.25) * r * 0.55, z + Math.sin(u + 0.25) * r * 0.55], [x + Math.cos(u) * r, z + Math.sin(u) * r]]); }
    st.push(ring(x, z, 0.18, 8));
  }
  // trees outside the plot: scalloped crowns
  for (const [x, z, r] of [[-13.4, 3.2, 1.6], [13.6, -3.8, 1.8], [-13.2, -6.4, 1.3], [13.2, 6.4, 1.4], [-5, 14.5, 1.3], [6.5, 15, 1.5]]) {
    st.push(ring(x, z, r, 48, (u) => 1 + 0.09 * Math.cos(u * 7)));
    st.push(ring(x, z, 0.15, 6));
  }
  // contours up the hill to the south, and the street
  for (const [z0, amp] of [[17.5, 1.2], [21, 1.6], [25, 2.0], [30, 2.4]]) st.push(Array.from({ length: 41 }, (_, i) => { const x = -34 + i * 1.7; return [x, z0 + amp * Math.sin(x / 7 + z0)]; }));
  st.push([[-34, 12.6], [34, 13.4]], [[-34, 15.4], [34, 16.2]]);
  // the shore to the north, with two lines of surf
  for (const [z0, am] of [[-23, 1], [-25.2, 0.8], [-27.4, 0.6]]) st.push(Array.from({ length: 41 }, (_, i) => { const x = -34 + i * 1.7; return [x, z0 + am * Math.sin(x / 5 + z0) - 2 * Math.exp(-(((x - 2) / 9) ** 2))]; }));
  const p = [], a = [], d = [];
  st.forEach((pts) => pts.forEach(([x, z], i) => { const q = L(x, 0.02, z); p.push(q); a.push(i === 0 ? 0 : 1); d.push(Math.hypot(x, z)); }));
  _site = { p, a, d };
  return _site;
};

/* The stretch of island coast around Girne — it becomes the town's coast. */
let _local = null;
const localCoast = () => {
  if (_local) return _local;
  const c = coastWorld();
  const idx = c.p.map((q, i) => [i, Math.hypot(q[0] - GIRNE[0], q[2] - GIRNE[2])]).filter(([, d]) => d < 14000).map(([i]) => i);
  const i0 = idx[0], i1 = idx[idx.length - 1];
  _local = { range: [i0, i1], shape: resample({ p: c.p.slice(i0, i1 + 1), a: c.a.slice(i0, i1 + 1) }, 400) };
  return _local;
};

/* ── Volume: planes, hatching, lit windows ────────────────────────────────
   The line drawing gets what an architect's drawing has: planes that take a
   little light by their orientation, roofs hatched, windows lit from inside. */
const LIGHT = v3.norm([0.55, 0.8, 0.25]);
const INK_WARM = [255, 172, 92];
const quad = (pts, n) => ({ q: pts.map(([x, y, z]) => L(x, y, z)), n, c: L(...[0, 1, 2].map((k) => pts.reduce((m, p) => m + p[k], 0) / pts.length)) });
const MASS_FACES = [
  // ground floor: roof (two parts, around the upper floor), four walls
  quad([[U.x1, G.h, G.z0], [G.x1, G.h, G.z0], [G.x1, G.h, G.z1], [U.x1, G.h, G.z1]], [0, 1, 0]),
  quad([[G.x0, G.h, G.z0], [U.x1, G.h, G.z0], [U.x1, G.h, U.z0], [G.x0, G.h, U.z0]], [0, 1, 0]),
  quad([[G.x0, 0, G.z1], [G.x1, 0, G.z1], [G.x1, G.h, G.z1], [G.x0, G.h, G.z1]], [0, 0, 1]),
  quad([[G.x0, 0, G.z0], [G.x1, 0, G.z0], [G.x1, G.h, G.z0], [G.x0, G.h, G.z0]], [0, 0, -1]),
  quad([[G.x1, 0, G.z0], [G.x1, 0, G.z1], [G.x1, G.h, G.z1], [G.x1, G.h, G.z0]], [1, 0, 0]),
  quad([[G.x0, 0, G.z0], [G.x0, 0, G.z1], [G.x0, G.h, G.z1], [G.x0, G.h, G.z0]], [-1, 0, 0]),
  // upper floor
  quad([[U.x0, G.h + U.h, U.z0], [U.x1, G.h + U.h, U.z0], [U.x1, G.h + U.h, U.z1], [U.x0, G.h + U.h, U.z1]], [0, 1, 0]),
  quad([[U.x0, G.h, U.z1], [U.x1, G.h, U.z1], [U.x1, G.h + U.h, U.z1], [U.x0, G.h + U.h, U.z1]], [0, 0, 1]),
  quad([[U.x0, G.h, U.z0], [U.x1, G.h, U.z0], [U.x1, G.h + U.h, U.z0], [U.x0, G.h + U.h, U.z0]], [0, 0, -1]),
  quad([[U.x1, G.h, U.z0], [U.x1, G.h, U.z1], [U.x1, G.h + U.h, U.z1], [U.x1, G.h + U.h, U.z0]], [1, 0, 0]),
  quad([[U.x0, G.h, U.z0], [U.x0, G.h, U.z1], [U.x0, G.h + U.h, U.z1], [U.x0, G.h + U.h, U.z0]], [-1, 0, 0]),
];
const zS = G.z1 + 0.02;
const WINDOWS = [
  quad([[2.4, 0.9, zS], [6.2, 0.9, zS], [6.2, 2.4, zS], [2.4, 2.4, zS]], [0, 0, 1]),
  quad([[-6.2, 0.9, zS], [-4.4, 0.9, zS], [-4.4, 2.4, zS], [-6.2, 2.4, zS]], [0, 0, 1]),
  quad([[-6.2, G.h + 0.9, zS], [0.8, G.h + 0.9, zS], [0.8, G.h + 2.2, zS], [-6.2, G.h + 2.2, zS]], [0, 0, 1]),
  quad([[G.x1 + 0.02, 0.9, -3.5], [G.x1 + 0.02, 0.9, 1.5], [G.x1 + 0.02, 2.4, 1.5], [G.x1 + 0.02, 2.4, -3.5]], [1, 0, 0]),
];
const DOORWAY = quad([[DOOR.x0, 0, zS], [DOOR.x1, 0, zS], [DOOR.x1, DOOR.h, zS], [DOOR.x0, DOOR.h, zS]], [0, 0, 1]);
const SPILL = quad([[DOOR.x0, 0.004, G.z1], [DOOR.x1, 0.004, G.z1], [DOOR.x1 + 0.9, 0.004, G.z1 + 3.8], [DOOR.x0 - 0.9, 0.004, G.z1 + 3.8]], [0, 1, 0]);
const POOL = quad([[-6.35, -0.04, -6.25], [-2.05, -0.04, -6.25], [-2.05, -0.04, -9.15], [-6.35, -0.04, -9.15]], [0, 1, 0]);
const GLAZING = [
  quad([[-6.6, 0.1, G.z0], [0.4, 0.1, G.z0], [0.4, 2.9, G.z0], [-6.6, 2.9, G.z0]], [0, 0, 1]),
  quad([[1.5, 0, G.z0], [6.5, 0, G.z0], [6.5, 2.7, G.z0], [1.5, 2.7, G.z0]], [0, 0, 1]),
];
const faceVisible = (fc, cam) => v3.dot(fc.n, v3.sub(cam.pos, fc.c)) > 0;

/* Diagonal hatching across a rectangle on a level plane (metres, local). */
const hatchRect = (x0, x1, z0, z1, y, gap) => {
  const out = [];
  for (let c = z0 - x1; c <= z1 - x0; c += gap) {
    // points on x − z = −c … i.e. z = x + c
    const xa = Math.max(x0, z0 - c), xb = Math.min(x1, z1 - c);
    if (xb - xa > 0.05) out.push(S([L(xa, y, xa + c), L(xb, y, xb + c)], null, 'hatch'));
  }
  return out;
};
let _hatch = null;
const hatches = () => {
  if (_hatch) return _hatch;
  _hatch = {
    roofs: joinStrokes([
      ...hatchRect(U.x1, G.x1, G.z0, G.z1, G.h + 0.01, 0.42),
      ...hatchRect(U.x0, U.x1, U.z0, U.z1, G.h + U.h + 0.01, 0.42),
      ...hatchRect(G.x0, U.x1, G.z0, U.z0, G.h + 0.01, 0.42),
    ], 0.6),
    // terrace decking, boards running along the house
    deck: joinStrokes(Array.from({ length: 15 }, (_, i) => S([L(-7.4, 0.003, G.z0 - 0.3 - i * 0.32), L(7.9, 0.003, G.z0 - 0.3 - i * 0.32)], null, 'deck')), 0.5),
  };
  return _hatch;
};
/* Line weights by what a stroke is: the mass is drawn heaviest. */
const TAG_W = { mass: 1.3, parapet: 0.8, wall: 0.85, path: 0.7, canopy: 0.9, water: 0.55 };
let _near = null;
const nearDoor = (ex) => {
  if (_near) return _near;
  const dc = L((DOOR.x0 + DOOR.x1) / 2, 0, G.z1);
  _near = ex.strokes.map((st) => {
    const c = st.pts.reduce((m, q) => v3.add(m, v3.mul(q, 1 / st.pts.length)), [0, 0, 0]);
    return Math.abs(c[0] - dc[0]) < 1.6 && Math.abs(c[2] - dc[2]) < 1.6 && c[1] < 2.9;
  });
  return _near;
};
let _exW = null;
const _minY = new Map();
const strokeMinY = (g) => {
  if (_minY.has(g)) return _minY.get(g);
  const m = g.strokes.map((st) => Math.min(...st.pts.map((q) => q[1] - HOUSE_O[1])));
  _minY.set(g, m);
  return m;
};
const exteriorWeights = (ex) => {
  if (_exW) return _exW;
  _exW = ex.sid.map((sid) => (sid < 0 ? 1 : TAG_W[ex.strokes[sid].tag] ?? 0.72));
  return _exW;
};

/* Dimension lines, the way a surveyor draws a plot: offset from the edge,
   with extension lines and slashed ends. */
const dimLine = (A, B, centre, off = 1.9) => {
  const d = v3.norm(v3.sub(B, A));
  let n = [-d[2], 0, d[0]];
  const mid = v3.lerp(A, B, 0.5);
  if (v3.dot(n, v3.sub(mid, centre)) < 0) n = v3.mul(n, -1);
  const at = (P, k) => v3.add(P, v3.mul(n, k));
  const A1 = at(A, off), B1 = at(B, off);
  const sl = v3.mul(v3.norm(v3.add(d, n)), 0.4);
  const strokes = [
    [A1, B1],
    [at(A, 0.5), at(A, off + 0.4)], [at(B, 0.5), at(B, off + 0.4)],
    [v3.sub(A1, sl), v3.add(A1, sl)], [v3.sub(B1, sl), v3.add(B1, sl)],
  ];
  return { strokes, mid: v3.lerp(A1, B1, 0.5) };
};

/* HUD: chapters, and a result count that narrows from many to one. */
export const CHAPTERS = [[0, '01', 'İLAN'], [258, '02', 'HARİTA'], [436, '03', 'ARAMA'], [690, '04', 'EV'], [1188, '05', 'ANAHTAR']];
export const HUD_END = 1276;
const countAt = (f) => {
  let n = 348 * seg(f, 52, 104, ease.inOut);
  n = lerp(n, 216, seg(f, 176, 206, ease.inOut));      // the duplicates fall away
  n = lerp(n, 58, seg(f, 456, 472, ease.inOut));       // "Girne"
  n = lerp(n, 9, seg(f, 488, 512, ease.inOut));        // "deniz manzarası"
  n = lerp(n, 1, seg(f, 556, 574, ease.inOut));        // the one
  return Math.round(n);
};

/* ── Frame state ─────────────────────────────────────────────────────────── */
export const stateAt = (frame) => {
  const f = frame;
  const cam = cameraAt(f);
  const project = makeProjector(cam, W, H);
  const s = {
    frame: f, cam, project, lines: [], pins: [], markers: [], rings: [], tags: [],
    heroes: [], copy: [], prices: [], pun: null, pill: null, popover: null, note: null, faces: [], rays: [], nodes: [], chroma: 0, dims: [],
    wordRise: 0, slogan: 0, url: 0, glint: 0, flash: 0, warm: 0, sky: 0, graticule: 0, divider: 0, scrims: [],
  };
  const V = villa();
  const TW = town();

  let agentStrokes = null;
  /* The agent (and, in the garden, the buyer). Both are still computed during
     the push-in: the close-up starts from where their hands are. */
  const agAll = f >= 840 && f < T.toHands[1] + 2 ? agentAt(f, cam) : null;
  const byAll = f >= 1140 && f < T.toHands[1] + 2 ? buyerAt(f, cam) : null;
  const ag = f < T.toHands[1] ? agAll : null;
  const figureLine = (fig, sts, id) => {
    const p = [], a = [], wv = [], parts = [];
    sts.forEach((st) => {
      if (p.length) { p.push(p[p.length - 1], st.pts[0]); a.push(0, 0); wv.push(1, 1); }
      const i0 = p.length;
      st.pts.forEach((q) => {
        // a figure rises out of the floor line and goes back into it
        const h = (q[1] - fig.pos[1]) / 1.8;
        const vis = h <= Math.min(fig.drawIn, 1 - fig.drawOut) * 1.08 - 0.04 ? 1 : 0;
        p.push(q); a.push(Math.min(1, st.w) * vis);
        wv.push(st.w < 0.7 ? 0.55 : 1);
      });
      parts.push({ i0, i1: p.length - 1, fill: st.fill });
    });
    return { id, hue: 'warm', occlude: true, parts, tone: 0.045, shape: { p, a }, wv, space: 'world', width: 2.8, nearFade: 0.6, depthFree: true };
  };
  if (ag) {
    agentStrokes = agentWorld(ag, cam);
    if (f < T.handLock[0]) {
      s.lines.push(figureLine(ag, agentStrokes, 'agent'));
      // the Evlek pin on the lapel catches the light when the agent is named
      const pinK = Math.min(ag.drawIn, 1 - ag.drawOut) * (0.35 + 0.65 * pulse(f, 872, 8, 40));
      if (pinK > 0.02) s.nodes.push({ p: agentStrokes.badge, k: 0.45 * pinK, col: [120, 230, 170] });
      // the mark that verified the listing is the one the agent wears
      {
        const rh = v3.norm([cam.r[0], 0, cam.r[2]]), b = agentStrokes.badge;
        const at = (x, y) => v3.add(b, [rh[0] * x, y, rh[2] * x]);
        const ck = [at(-0.035, 0.0), at(-0.012, -0.024), at(0.04, 0.03)];
        const pts = [], al = [];
        const draw = f < 900 ? seg(f, 866, 880, ease.inOut) : 1;
        for (let i = 0; i <= 12; i++) { const t = i / 12, q = t < 0.4 ? v3.lerp(ck[0], ck[1], t / 0.4) : v3.lerp(ck[1], ck[2], (t - 0.4) / 0.6); pts.push(q); al.push(t <= draw ? Math.min(ag.drawIn, 1 - ag.drawOut) : 0); }
        s.lines.push({ hue: 'ok', shape: { p: pts, a: al }, space: 'world', width: 2.2, depthFree: true, nearFade: 0.6 });
      }
      // what the agent shows answers the gesture: the thing itself lights up,
      // its own outline traced in gold — no line is thrown across the room
      if (ag.shows && ag.showK > 0.02) {
        const feat = FEATURES[ag.shows]();
        const pts = [];
        for (let i = 1; i < feat.length; i++) for (let k = i === 1 ? 0 : 1; k <= 14; k++) pts.push(v3.lerp(feat[i - 1], feat[i], k / 14));
        const head = ease.inOut(ag.showT) * (pts.length - 1);
        const glow = Math.min(1, ag.showK * 1.25);
        const al = pts.map((_, i) => (i <= head ? glow * (0.55 + 0.45 * Math.exp(-(head - i) / 18)) : 0));
        s.lines.push({ hue: 'gold', shape: { p: pts, a: al }, space: 'world', width: 2.6, depthFree: true, nearFade: 0.4, spark: ag.showT < 1 ? pts[Math.floor(head)] : null, sparkK: 0.45 });
        // and a little light gathers in the open hand
        s.nodes.push({ p: agentStrokes.hand, k: 0.3 * glow, col: [255, 214, 150] });
      }
    }
  }
  if (byAll && f < T.handLock[0]) s.lines.push(figureLine(byAll, agentWorld(byAll, cam), 'buyer'));
  let gripScreen = null;
  if (agAll && f > T.gripAt - 20) {
    const hw = agentWorld(agAll, cam).hand, r = project(hw);
    if (r) gripScreen = [r[0], r[1]];
    const k = pulse(f, T.gripAt, 6, 34) * (1 - seg(f, T.handLock[0], T.toHands[1], ease.inOut));
    if (k > 0.01) s.nodes.push({ p: hw, k: 1.3 * k, col: [255, 226, 170] });
  }

  /* The lockup: the name above its gold line. Frame 0 is the last frame. */
  const lockup = f < T.hold || f >= FRAMES - 1;
  s.wordRise = lockup ? 1 : f < T.sink[1] ? 1 - seg(f, ...T.sink, ease.launch) : seg(f, ...T.rise, ease.settle);
  s.slogan = lockup ? 1 : f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.sloganIn, ease.settle);
  s.url = lockup ? 1 : f < T.sloganOut[1] ? 1 - seg(f, ...T.sloganOut, ease.inOut) : seg(f, ...T.urlIn, ease.settle);
  s.sloganGlint = lockup ? 0 : pulse(f, T.doğruGlint[0] + 8, 8, 20);
  if (lockup || f >= T.keyToLine[1] || f < T.stretch[0]) {
    const t = (f - T.keyToLine[1]) / 60;
    const echo = !lockup && f >= T.keyToLine[1] && f < T.rise[1] ? Math.sin(t * 2 * Math.PI * 6) * 6 * Math.exp(-t * 6) : 0;
    const bl = brandLineScreen(200);
    // a slow light travelling along the line during the hold
    const lp = !lockup && f >= T.linePulse[0] && f < T.linePulse[1] ? seg(f, ...T.linePulse, ease.inOut) : -1;
    s.lines.push({ brand: true, hue: 'gold', shape: { p: bl.p.map((q, i) => [q[0], q[1] - echo * Math.sin((Math.PI * i) / 199), 0]), a: bl.a }, space: 'screen', width: 3.6, spark: lp >= 0 && lp < 1 ? [lerp(bl.p[0][0], bl.p[199][0], lp), LINE_Y] : null, sparkK: 0.5 });
  }

  /* A · B — stretch, pluck, burst into cards, short out the fakes, snap */
  if (f >= T.stretch[0] && f < T.tilt[0] + 1) {
    let line = morph(brandLineScreen(), horizonScreen(), seg(f, ...T.stretch, ease.glide), 0.2, ease.glide);
    line = { p: line.p.map((q, i) => [q[0], q[1] - pluckOffset(f, i / (N - 1)), 0]), a: line.a };
    const form = seg(f, ...T.cardsForm, (x) => x);
    const back = seg(f, ...T.collapse, (x) => x);
    const antic = seg(f, ...T.antic, ease.inOut) * (1 - seg(f, T.collapse[0], T.collapse[0] + 6));
    const target = collapseLine();
    if (f < T.cardsForm[0]) s.lines.push({ hue: 'gold', shape: aPlane(line), space: 'world', width: 3.4 });
    else if (f < T.collapse[1]) {
      const p = [], a = [], dp = [], da = [];
      for (let i = 0; i < CARD_COUNT; i++) {
        const slice = { p: line.p.slice(i * CARD_PTS, (i + 1) * CARD_PTS).map(screenToA), a: line.a.slice(i * CARD_PTS, (i + 1) * CARD_PTS) };
        const to = { p: target.p.slice(i * CARD_PTS, (i + 1) * CARD_PTS).map(screenToA), a: target.a.slice(i * CARD_PTS, (i + 1) * CARD_PTS) };
        const mi = ease.settle(clamp(form * 1.45 - hash(i + 3) * 0.45));
        const bi = ease.snap(clamp(back * 1.25 - hash(i + 9) * 0.25));
        // anticipation: the field breathes out before it snaps in
        const breatheOut = ([x, y]) => [540 + (x - 540) * (1 + 0.04 * antic), 960 + (y - 960) * (1 + 0.04 * antic), 0];
        const m = cardXform(i, f);
        const card = { p: liftCard(cardLocal().p.map((q) => breatheOut(m(q))), i), a: cardLocal().a };
        const final = morph(morph(slice, card, mi, 0, (x) => x), to, bi, 0, (x) => x);
        final.a[0] *= Math.max(1 - mi, bi);
        // the fakes short out before the snap: they flicker and dim
        const c = CARDS[i];
        const short = c.fake ? seg(f, ...T.shortOut, (x) => x) * (1 - bi) : 0;
        const flick = short > 0 ? (Math.floor(f / 2 + i) % 3 === 0 ? 0.15 : 1) * (1 - 0.55 * short) : 1;
        const lvl = (c.hero ? 1 : 0.62) * flick;
        for (let k = 0; k < final.a.length; k++) final.a[k] *= lerp(1, lvl, seg(f, 58, 80, ease.inOut) * (1 - bi));
        p.push(...final.p); a.push(...final.a);
        // what is printed on it: the building, the price — gone before the snap
        const dv = clamp((mi - 0.8) * 5) * (1 - seg(f, T.collapse[0] - 8, T.collapse[0] + 2, ease.inOut)) * lvl;
        if (dv > 0.01) {
          if (dp.length) { dp.push(dp[dp.length - 1]); da.push(0); }
          const D = cardDetail(c.b);
          D.p.forEach((q, k) => { dp.push(v3.add(screenToA(breatheOut(m(q))), [0, 0, c.z])); da.push(k === 0 ? 0 : D.a[k] * dv); });
          const P0 = project(v3.add(screenToA(breatheOut(m(PRICE_AT))), [0, 0, c.z]));
          const P1 = project(v3.add(screenToA(breatheOut(m([PRICE_AT[0] + 40, PRICE_AT[1]]))), [0, 0, c.z]));
          if (P0 && P1) s.prices.push({ x: P0[0], y: P0[1], ang: Math.atan2(P1[1] - P0[1], P1[0] - P0[0]), sc: Math.hypot(P1[0] - P0[0], P1[1] - P0[1]) / 40, a: dv, text: c.price, hero: c.hero });
        }
      }
      s.lines.push({ hue: back > 0.5 ? 'gold' : undefined, shape: { p, a }, space: 'world', width: 2.6 });
      if (dp.length) s.lines.push({ shape: { p: dp, a: da }, space: 'world', width: 1.6, core: false });
    } else {
      // the one line, gold, carrying "doğru" up to the horizon
      const ride = seg(f, ...T.wordRide, ease.glide);
      const y = lerp(HERO_Y, 960, ride);
      const p = hline(90, W - 90, y, N);
      s.lines.push({ hue: 'gold', shape: aPlane({ p, a: p.map(() => 1) }), space: 'world', width: 3.4 });
    }
  }

  /* The pun: "Hangisi doğru?" — at the snap, only "doğru" stays on the line. */
  if (f >= PUN_IN && f < T.wordSink[1] + 2) {
    s.pun = {
      rise: seg(f, PUN_IN, PUN_IN + 22, ease.settle),
      drop: seg(f, T.collapse[1] - 2, T.collapse[1] + 10, ease.launch),
      center: seg(f, T.collapse[1] + 4, T.wordRide[0] + 6, ease.inOut),
      gold: seg(f, T.collapse[1] - 4, T.collapse[1] + 4, ease.inOut),
      y: lerp(HERO_Y, 960, seg(f, ...T.wordRide, ease.glide)),
      sink: seg(f, ...T.wordSink, ease.launch),
      // the name hangs under the line the word stands on
      brand: seg(f, T.collapse[1] + 8, T.collapse[1] + 28, ease.settle),
    };
    if (f < T.collapse[0]) {
      const draw = seg(f, PUN_IN - 4, PUN_IN + 12, ease.settle);
      const p = hline(W / 2 - 330 * draw, W / 2 + 330 * draw, HERO_Y);
      s.lines.push({ shape: { p, a: p.map(() => 0.85) }, space: 'screen', width: 2.4 });
    }
  }

  /* C — the horizon lies down onto the island; six cities */
  if (f > T.tilt[0] && f < T.islandOut[1]) {
    const shape = morph(aPlane(horizonScreen()), coastWorld(), seg(f, ...T.toCoast, ease.glide), 0.8, ease.inOut);
    // away from Girne the island fades; around Girne it carries on as the town's coast
    const [i0, i1] = localCoast().range;
    const away = seg(f, ...T.islandOut, ease.inOut);
    const cut = f >= T.coastToTown[0];
    s.lines.push({ hue: 'gold', shape: { p: shape.p, a: shape.a.map((a, i) => (cut && i >= i0 && i <= i1 ? 0 : a * (1 - away))) }, space: 'world', width: 3.2 });
  }
  if (f >= T.coastToTown[0] && f < T.exterior[1]) {
    const tc = TW.coastMain;
    const m = seg(f, ...T.coastToTown, ease.inOut);
    const out = 1 - seg(f, T.houseDive[0] + 28, T.houseDive[0] + 72, ease.inOut);
    const shape = m < 1 ? morph(localCoast().shape, tc, m, 0.3, ease.inOut) : tc;
    s.lines.push({ hue: 'gold', shape: { p: shape.p, a: shape.a.map((v) => v * out) }, space: 'world', width: 3.0, tilt: true });
  }
  s.graticule = seg(f, ...T.graticule, ease.inOut) * (1 - seg(f, T.dive[0], T.dive[0] + 30, ease.inOut));
  s.divider = seg(f, ...T.divider, ease.inOut) * (1 - seg(f, T.dive[0], T.dive[0] + 30, ease.inOut));
  if (s.divider > 0) s.dividerLines = dividerWorld();
  if (f >= T.pins && f < T.dive[1] + 30) {
    CITIES.forEach((c, i) => {
      const t0 = T.pins + i * T.pinGap;
      if (f < t0) return;
      const isG = i === CITIES.length - 1;
      const lift = seg(f, ...T.girneLift, ease.settle);
      const out = isG ? 1 - seg(f, T.dive[1] + 6, T.dive[1] + 30, ease.inOut) : 1 - seg(f, T.dive[0], T.dive[0] + 22, ease.inOut);
      s.pins.push({
        name: c.name, p: c.p, isG, drop: seg(f, t0, t0 + 14, ease.settle),
        ripple: invLerp(t0 + 8, t0 + 44, f), a: out * (isG ? 1 : lerp(1, 0.35, lift)), label: seg(f, t0 + 6, t0 + 20, ease.settle) * out * (isG ? 1 : lerp(1, 0.4, lift)),
        lift: isG ? lift : 0,
      });
    });
  }

  /* D — Girne draws itself; a search; one listing is the one */
  if (f >= T.townRoads[0] && f < T.exterior[1]) {
    const out = 1 - seg(f, T.houseDive[0] + 28, T.houseDive[0] + 72, ease.inOut);
    const hb2 = seg(f, T.coastToTown[1] - 10, T.coastToTown[1] + 16, ease.inOut);
    s.lines.push({ shape: { p: TW.harbour.p, a: TW.harbour.a.map((v, i) => (TW.harbour.u[i] <= hb2 ? v * out : 0)) }, space: 'world', width: 2.2, tilt: true });
    const hr = seg(f, ...T.townRoads, ease.inOut);
    s.lines.push({ shape: { p: TW.roads.p, a: TW.roads.a.map((v, i) => (TW.roads.u[i] <= hr ? v * 0.5 * out : 0)) }, space: 'world', width: 1.5, tilt: true });
    const hb = seg(f, ...T.townBlocks, ease.inOut);
    // neighbours stay a little longer than the town, so the landing has a street
    const outN = 1 - seg(f, T.pinUnfold[1], T.pinUnfold[1] + 30, ease.inOut);
    s.lines.push({ shape: { p: TW.blocks.p, a: TW.blocks.a.map((v, i) => { const sid = TW.blocks.sid[i]; if (sid < 0) return 0; const near = sid >= TW.blocksNearFrom; return v * (near ? 0.4 * outN : 0.3 * out) * clamp((hb - hash(sid) * 0.7) / 0.3); }) }, space: 'world', width: 1, tilt: true });
    // the buildings take a little tone, so the town reads as built, not outlined
    TW.blocks.strokes.forEach((st, k) => {
      const near = k >= TW.blocksNearFrom;
      const aa = clamp((hb - hash(k) * 0.7) / 0.3) * (near ? 0.07 * outN : 0.05 * out) * (1 - seg(f, T.houseDive[0] + 4, T.houseDive[0] + 34, ease.inOut));
      if (aa > 0.003) s.faces.push({ p: st.pts.slice(0, 4), col: [150, 190, 255], a: aa });
    });
    const sweepR = 2300 * seg(f, ...T.sweep, ease.inOut);
    MARKERS.forEach((m, i) => {
      const t0 = T.markers + i * T.markerGap;
      if (f < t0) return;
      const dist = Math.hypot(m.p[0] - GIRNE[0], m.p[2] - GIRNE[2]);
      const hit = f >= T.sweep[0] ? clamp(1 - Math.abs(sweepR - dist) / 260) : 0;
      const dim = m.chosen ? 1 : lerp(1, 0.22, seg(f, T.sweep[0] + 8, T.sweep[1], ease.inOut));
      const mo = m.chosen ? 1 - seg(f, T.pinUnfold[0], T.pinUnfold[0] + 2) : out;
      s.markers.push({
        p: m.p, chosen: m.chosen, a: Math.min(1, dim + hit * 0.8) * mo,
        pop: seg(f, t0, t0 + 18, (x) => ease.settle(x) + Math.sin(x * Math.PI) * 0.22 * (1 - x)),
        check: m.chosen ? seg(f, ...T.check, ease.inOut) : 0,
        // the chosen pin grows with the camera as we come down onto it
        grow: m.chosen ? (1 + 0.5 * seg(f, T.check[0] - 6, T.check[1] + 6, ease.settle)) * lerp(1, 2.6, seg(f, T.houseDive[0] + 20, T.pinUnfold[0], ease.inOut)) : 1,
      });
    });
    if (f >= T.sweep[0] && f < T.sweep[1] + 16) s.rings.push({ c: GIRNE, r: sweepR, a: 0.6 * (1 - seg(f, T.sweep[1] - 10, T.sweep[1] + 16)) });
    if (f >= T.pill[0] && f < T.pill[1]) {
      s.pill = {
        a: seg(f, T.pill[0], T.pill[0] + 18, ease.settle) * (1 - seg(f, T.pill[1] - 14, T.pill[1], ease.inOut)),
        draw: seg(f, T.pill[0], T.pill[0] + 20, ease.inOut), typed: seg(f, ...T.typing, (x) => x),
        caret: f < T.typing[1] + 4 || Math.floor(f / 16) % 2 === 0,
      };
      s.scrims.push({ y: PILL_Y + 52, h: 150, a: s.pill.a * 0.7 });
    }
    if (f >= T.popover[0] && f < T.popover[1]) {
      const r = project(HOUSE_O);
      if (r) s.popover = { x: r[0], y: r[1], a: seg(f, T.popover[0], T.popover[0] + 16, ease.settle) * (1 - seg(f, T.popover[1] - 14, T.popover[1], ease.inOut)), sweep: seg(f, T.popover[0] + 20, T.popover[0] + 56, ease.inOut) };
    }
  }

  /* E — the pin comes down and plants itself; the plot opens out of that point,
     the site is drawn around it, and the house rises out of its footprint. */
  const LAND = T.pinUnfold[0] + 12;
  if (f >= T.pinUnfold[0] - 10 && f < T.sceneOut[1]) {
    const fade = 1 - seg(f, 826, 856, ease.inOut);
    // the pin drops onto its tip
    if (f >= T.pinUnfold[0] && f < LAND + 3) {
      const c = project(HOUSE_O);
      if (c) {
        const dr = seg(f, T.pinUnfold[0] - 6, LAND, (x) => x * x * x);
        const sc = 1.15 * 1.5 * 2.6 * (1 - 0.9 * dr);
        const al = 1 - seg(f, LAND - 1, LAND + 3, ease.inOut);
        const G = pinGlyph();
        const put = (pts, alpha) => { const p = pts.map(([x, y]) => [c[0] + x * sc, c[1] + y * sc, 0]); return { p, a: p.map(() => alpha) }; };
        s.lines.push({ hue: 'gold', shape: put(G.body, al), space: 'screen', width: 3.0 });
        s.lines.push({ hue: 'ok', shape: put(G.check, al), space: 'screen', width: 3.0 });
      }
    }
    // impact: rings go out over the ground
    for (let k = 0; k < 3; k++) {
      const t = (f - LAND - k * 5) / 28;
      if (t <= 0 || t >= 1) continue;
      const r = 1.2 + 17 * (1 - (1 - t) ** 3), p = [];
      for (let i = 0; i <= 72; i++) { const u = (i / 72) * Math.PI * 2; p.push(L(Math.cos(u) * r, 0.02, Math.sin(u) * r)); }
      s.lines.push({ hue: 'gold', shape: { p, a: p.map(() => 0.75 * (1 - t) ** 1.6 * (k === 0 ? 1 : 0.55)) }, space: 'world', width: 2.0, core: false });
    }
    // the plot opens from the point, overshoots a little, settles; its corners are pegged
    const g = seg(f, LAND, LAND + 18, ease.settle);
    if (g > 0) {
      const pp = PARCEL_PTS.map((q) => v3.add(HOUSE_O, v3.mul(v3.sub(q, HOUSE_O), g)));
      s.lines.push({ hue: 'gold', shape: { p: pp, a: pp.map(() => fade * lerp(1, 0.6, seg(f, T.exterior[0], T.exterior[0] + 40))) }, space: 'world', width: 2.8, nearFade: 1 });
      s.faces.push({ p: PARCEL.map((q) => v3.add(HOUSE_O, v3.mul(v3.sub(q, HOUSE_O), g))), col: INK_WARM, a: 0.045 * g * fade });
      PARCEL.forEach((q, k) => {
        const pk = seg(f, LAND + 14 + k * 2, LAND + 20 + k * 2, ease.settle) * fade;
        if (pk <= 0) return;
        const d = 0.7 * pk, pts = [v3.add(q, [-d, 0.02, 0]), v3.add(q, [d, 0.02, 0]), q, v3.add(q, [0, 0.02, -d]), v3.add(q, [0, 0.02, d]), q, v3.add(q, [0, 1.1 * pk, 0])];
        s.lines.push({ hue: 'gold', shape: { p: pts, a: [pk, pk, 0, pk, pk, 0, pk] }, space: 'world', width: 2.0 });
      });
    }
    // the site, drawn outward from where the pin landed: trees, palms, contours, the street, the shore
    const reach = (f - LAND) * 1.4;
    if (reach > 0) {
      const sa = 0.34 * fade;
      const SITE = site();
      s.lines.push({ shape: { p: SITE.p, a: SITE.a.map((v, i) => v * sa * clamp((reach - SITE.d[i]) / 3)) }, space: 'world', width: 1.4, core: false, nearFade: 1 });
    }
    // surveyor's dimension lines along two sides of the plot
    const dd = seg(f, T.parcelNote[0] - 6, T.parcelNote[0] + 20, ease.inOut);
    const dOut = 1 - seg(f, T.parcelNote[1] - 6, T.parcelNote[1] + 14, ease.inOut);
    if (dd > 0 && dOut > 0) {
      const centre = L(0, 0, 0);
      const dims = [dimLine(PARCEL[0], PARCEL[1], centre), dimLine(PARCEL[1], PARCEL[2], centre)];
      const p = [], a = [];
      dims.forEach((dm) => dm.strokes.forEach(([A, B], k) => {
        if (p.length) { p.push(p[p.length - 1], A); a.push(0, 0); }
        const n = 16;
        for (let i = 0; i <= n; i++) { p.push(v3.lerp(A, B, i / n)); a.push((k === 0 ? (i / n <= dd ? 1 : 0) : dd > 0.6 ? 1 : 0) * dOut * 0.8); }
      }));
      s.lines.push({ shape: { p, a }, space: 'world', width: 1.5, core: false });
    }
  }

  if (f >= T.exterior[0] && f < T.sceneOut[1]) {
    const rel = v3.sub(cam.pos, HOUSE_O);
    const inside = rel[2] < G.z1 && rel[2] > G.z0 && rel[1] < G.h && Math.abs(rel[0]) < G.x1;
    const vis = strokeVisibility(V.exterior.strokes, cam.pos, 0.08).map((v) => (inside ? 0.3 : v));
    const he = seg(f, T.exterior[0], T.exterior[1] - 30, (x) => ease.inOut(x) * 0.3 + x * 0.7);
    // the house rises out of its footprint behind a glowing section plane
    const HB = 6.4 * seg(f, T.exterior[0] + 8, T.exterior[0] + 54, ease.inOut);
    const building = HB > 0 && HB < 6.39;
    const sceneOut = 1 - seg(f, ...T.sceneOut, ease.inOut);
    const ex = V.exterior;
    // construction first, the way a drawing is set out: long guides along the
    // walls of the plan and up from the corners, then the mass is drawn on them
    const gIn = seg(f, T.exterior[0] - 6, T.exterior[0] + 18, ease.inOut), gOut = seg(f, T.exterior[0] + 44, T.exterior[1] - 4, ease.inOut);
    if (gIn > 0 && gOut < 1) {
      const p = [], a = [];
      const guide = (A, B, d0) => {
        if (p.length) { p.push(p[p.length - 1], A); a.push(0, 0); }
        const t = seg(f, T.exterior[0] - 6 + d0, T.exterior[0] + 14 + d0, ease.inOut);
        for (let i = 0; i <= 24; i++) { p.push(v3.lerp(A, B, i / 24)); a.push(Math.abs(i / 24 - 0.5) * 2 <= t ? 0.34 * (1 - gOut) : 0); }
      };
      guide(L(G.x0, 0, -15), L(G.x0, 0, 15), 0); guide(L(G.x1, 0, -15), L(G.x1, 0, 15), 3);
      guide(L(-15, 0, G.z0), L(15, 0, G.z0), 2); guide(L(-15, 0, G.z1), L(15, 0, G.z1), 5);
      guide(L(U.x1, 0, -15), L(U.x1, 0, 15), 6);
      [[G.x0, G.z1], [G.x1, G.z1], [G.x1, G.z0]].forEach(([x, z], k) => guide(L(x, -0.5, z), L(x, 8.5, z), 8 + k * 2));
      s.lines.push({ shape: { p, a }, space: 'world', width: 1.2, core: false, nearFade: 1.2 });
    }
    // at the door the drawing pulls focus: the façade recedes, the doorway stays
    const recede = seg(f, 846, 874, ease.inOut) * (1 - seg(f, 912, 940, ease.inOut));
    const nd = nearDoor(ex);
    const minY = strokeMinY(ex);
    const oy = HOUSE_O[1];
    s.lines.push({
      shape: {
        p: building ? ex.p.map((q) => (q[1] - oy > HB ? [q[0], oy + HB, q[2]] : q)) : ex.p,
        a: ex.a.map((v, i) => (ex.u[i] <= he && ex.sid[i] >= 0 && (!building || minY[ex.sid[i]] <= HB + 0.01) ? heat(v, ex.u[i], he) * vis[ex.sid[i]] * sceneOut * (nd[ex.sid[i]] ? 1 : 1 - 0.68 * recede) : 0)),
      },
      wv: exteriorWeights(ex), space: 'world', width: 2.4, spark: he > 0 && he < 1 ? ex.p[firstAtOrAfter(ex.u, he)] : null, nearFade: 1.2,
    });
    // the section plane: the footprint at the height the house has reached, in gold
    if (building) {
      const fp = HB <= G.h ? [[G.x0, G.z0], [G.x1, G.z0], [G.x1, G.z1], [G.x0, G.z1], [G.x0, G.z0]] : [[U.x0, U.z0], [U.x1, U.z0], [U.x1, U.z1], [U.x0, U.z1], [U.x0, U.z0]];
      const pts = [];
      fp.forEach(([x, z], i) => { if (i) for (let k = 1; k <= 12; k++) pts.push(L(lerp(fp[i - 1][0], x, k / 12), HB, lerp(fp[i - 1][1], z, k / 12))); else pts.push(L(x, HB, z)); });
      const sk = Math.sin(Math.PI * clamp(HB / 6.4)) * 0.6 + 0.4;
      s.lines.push({ hue: 'gold', shape: { p: pts, a: pts.map(() => sk) }, space: 'world', width: 2.6, nearFade: 1.2 });
      s.faces.push({ p: fp.slice(0, 4).map(([x, z]) => L(x, HB, z)), col: INK_WARM, a: 0.08 * sk });
    }
    // volume: planes take light by orientation once their edges are down
    const vol = seg(HB, 5.6, 6.4, ease.inOut) * seg(he, 0.18, 0.55, ease.inOut) * sceneOut * (inside ? 0 : 1) * (1 - seg(f, 840, 866, ease.inOut));
    if (vol > 0) {
      for (const fc of MASS_FACES) if (faceVisible(fc, cam)) s.faces.push({ p: fc.q, col: [150, 190, 255], a: vol * (0.012 + 0.05 * Math.max(0, v3.dot(fc.n, LIGHT))) });
      const hr = hatches().roofs;
      const hp = seg(he, 0.35, 0.95, (x) => x);
      s.lines.push({ shape: { p: hr.p, a: hr.a.map((v, i) => (hr.u[i] <= hp ? v * 0.3 * vol : 0)) }, space: 'world', width: 1.1, nearFade: 1.2, core: false });
    }
    // someone is home: the windows are lit
    const lit = seg(HB, 6.0, 6.4, ease.inOut) * seg(he, 0.72, 1, ease.inOut) * sceneOut * (inside ? 0 : 1) * (1 - recede) * ease.inOut(clamp((rel[2] - G.z1 - 0.8) / 3.0));
    if (lit > 0) for (const w of WINDOWS) if (faceVisible(w, cam)) s.faces.push({ p: w.q, col: INK_WARM, a: 0.36 * lit, a2: 0.1 * lit, grad: [v3.lerp(w.q[0], w.q[1], 0.5), v3.lerp(w.q[2], w.q[3], 0.5)] });
    const pool = seg(HB, 6.0, 6.4, ease.inOut) * seg(he, 0.85, 1, ease.inOut) * sceneOut;
    if (pool > 0 && faceVisible(POOL, cam)) s.faces.push({ p: POOL.q, col: [80, 200, 182], a: 0.1 * pool, a2: 0.02 * pool, grad: [v3.lerp(POOL.q[0], POOL.q[1], 0.5), v3.lerp(POOL.q[2], POOL.q[3], 0.5)] });
    // the door opens and the light comes out to meet you
    // …and eases away as we walk through it, so it never fills the lens
    const spill = seg(f, T.doorOpen[0], T.doorOpen[1] + 6, ease.inOut) * sceneOut * ease.inOut(clamp((rel[2] - G.z1 - 3.0) / 3.5));
    if (spill > 0 && !inside) {
      if (faceVisible(DOORWAY, cam)) s.faces.push({ p: DOORWAY.q, col: INK_WARM, a: 0.14 * spill, a2: 0.03 * spill, grad: [v3.lerp(DOORWAY.q[0], DOORWAY.q[1], 0.5), v3.lerp(DOORWAY.q[2], DOORWAY.q[3], 0.5)] });
      s.faces.push({ p: SPILL.q, col: INK_WARM, a: 0.11 * spill, grad: [v3.lerp(SPILL.q[0], SPILL.q[1], 0.5), v3.lerp(SPILL.q[2], SPILL.q[3], 0.5)] });
    }
    // the door, on its hinge
    const th = seg(f, ...T.doorOpen, ease.settle) * 1.5;
    const hn = ROOM.hinge, wd = DOOR.x1 - DOOR.x0;
    const edge = [hn[0] + Math.cos(th) * wd, hn[1], hn[2] - Math.sin(th) * wd];
    const up = (q, h) => [q[0], q[1] + h, q[2]];
    const doorA = seg(f, T.exterior[1] - 20, T.exterior[1], ease.inOut) * sceneOut;
    const hx = v3.lerp(hn, edge, 0.86);
    const dp = [hn, edge, up(edge, DOOR.h), up(hn, DOOR.h), hn, hn, up(hx, 0.95), up(hx, 1.1)];
    const da = [1, 1, 1, 1, 1, 0, 0, 1];
    s.lines.push({ shape: { p: dp.flatMap((q, i) => (i === 0 ? [q] : [0.25, 0.5, 0.75, 1].map((t) => v3.lerp(dp[i - 1], q, t)))), a: da.flatMap((v, i) => (i === 0 ? [v] : [v, v, v, v])).map((v) => v * doorA) }, space: 'world', width: 2.2, nearFade: 2.4 });

    const sun = seg(f, ...T.sunset, ease.inOut);
    const lampOn = seg(f, ...T.lampOn, ease.settle);
    for (const [name, span, width, base] of [['shell', T.shell, 1.4, 0.4], ['living', T.living, 2.4, 1], ['kitchen', T.kitchen, 2.4, 1], ['terrace', T.terrace, 2.3, 1]]) {
      const g = V.rooms[name];
      const hg = seg(f, ...span, (x) => ease.inOut(x) * 0.35 + x * 0.65);
      if (hg <= 0) continue;
      const gv = strokeVisibility(g.strokes, cam.pos, 0.18);
      s.lines.push({
        shape: { p: g.p, a: g.a.map((v, i) => (g.u[i] <= hg && g.sid[i] >= 0 ? heat(v, g.u[i], hg, 0.85) * base * gv[g.sid[i]] * sceneOut : 0)) },
        space: 'world', width, spark: hg < 1 ? g.p[firstAtOrAfter(g.u, hg)] : null,
        warm: name === 'living' ? lampOn * 0.55 : sun * 0.5, nearFade: 0.5,
      });
    }
    if (lampOn > 0) s.lamp = { p: ROOM.lamp, a: lampOn * sceneOut * (1 - seg(f, 1040, 1070, ease.inOut)) };
    // the terrace boards: long lines that give the last room its depth
    const dk = seg(f, T.terrace[0] - 6, T.terrace[1] + 6, ease.inOut);
    if (dk > 0) {
      const D = hatches().deck;
      s.lines.push({ shape: { p: D.p, a: D.a.map((v, i) => (D.u[i] <= dk ? v * 0.26 * sceneOut : 0)) }, space: 'world', width: 1.2, warm: sun * 0.6, nearFade: 0.5, core: false });
    }
    // glass: a faint reflection, until we pass through it
    if (inside) for (const g of GLAZING) if (faceVisible(g, cam)) s.faces.push({ p: g.q, col: [150, 190, 255], a: 0.045 * seg(f, 930, 960, ease.inOut) * sceneOut * clamp((rel[2] - G.z0 - 0.3) / 1.2), grad: [v3.lerp(g.q[2], g.q[3], 0.5), v3.lerp(g.q[0], g.q[1], 0.5)] });

    // the sea: framed by the glass, opening out as we step through it
    const seaA = seg(f, 930, 970, ease.inOut) * sceneOut;
    if (seaA > 0) {
      const far = -2600;
      const hzW = [];
      for (let x = -4000; x <= 4000; x += 40) hzW.push(L(x, EYE, far));
      const glass = [
        [L(-6.6, 0.1, G.z0), L(0.4, 0.1, G.z0), L(0.4, 2.9, G.z0), L(-6.6, 2.9, G.z0)],
        [L(1.5, 0, G.z0), L(6.5, 0, G.z0), L(6.5, 2.7, G.z0), L(1.5, 2.7, G.z0)],
      ];
      const open = clamp((G.z0 + 0.4 - rel[2]) / 1.0);
      const clip = open >= 1 ? null : glass;
      const both = (shape, extra) => {
        s.lines.push({ ...extra, shape: { p: shape.p, a: shape.a.map((v) => v * (clip ? 1 - open : 1)) }, clip });
        if (clip && open > 0) s.lines.push({ ...extra, shape: { p: shape.p, a: shape.a.map((v) => v * open) } });
      };
      // the horizon is part of the one gold line
      both({ p: hzW, a: hzW.map(() => seaA) }, { space: 'world', width: 3.0, depthFree: true, hue: 'gold' });
      for (const [zf, al] of [[-1500, 0.3], [-800, 0.28], [-480, 0.24], [-340, 0.2]]) {
        const pts = [];
        for (let x = -1400; x <= 1400; x += 40) pts.push(L(x, -32, zf));
        both({ p: pts, a: pts.map(() => al * seaA) }, { space: 'world', width: 1.3, depthFree: true, warm: sun });
      }
      if (sun * seaA > 0) {
        // a big low sun and its path on the water, in the direction the agent points
        const SX = SUN_X, R = 230;
        const disc = [];
        for (let i = 0; i <= 64; i++) { const t = Math.PI * (i / 64); disc.push(L(SX + Math.cos(t) * R, EYE + Math.sin(t) * R * 0.98, far)); }
        both({ p: disc, a: disc.map(() => sun * seaA) }, { space: 'world', width: 2.6, depthFree: true, hue: 'gold' });
        for (let k = 0; k < 9; k++) {
          const zf = -330 - k * 260, w = 18 + k * 22, y = -31.9;
          const cx = 3.3 + (SX - 3.3) * ((-zf) / 2600);
          const pts = [L(cx - w, y, zf), L(cx + w, y, zf)];
          both({ p: pts, a: pts.map(() => sun * seaA * (0.25 + 0.5 * hash(k + Math.floor(f / 7)))) }, { space: 'world', width: 1.6, depthFree: true, hue: 'gold' });
        }
      }
    }
    const tag = (name, p, a0, a1) => { const a = seg(f, a0, a0 + 16, ease.settle) * (1 - seg(f, a1 - 14, a1, ease.inOut)); if (a > 0) s.tags.push({ name, p, a }); };

  }
  /* Gulls over the cove: three, slow, wings beating out of step. */
  if (f > 1116 && f < T.sceneOut[1]) {
    const ga = seg(f, 1116, 1140, ease.inOut) * (1 - seg(f, T.sceneOut[0], T.sceneOut[1] - 6, ease.inOut)) * seg(f, ...T.sunset, ease.inOut);
    for (const [x0, y0, sp, sz, ph] of [[180, 520, 0.9, 1, 0], [700, 430, -0.6, 0.8, 2.1], [860, 600, -0.8, 0.65, 4.2]]) {
      const x = x0 + sp * (f - 1116), y = y0 + 6 * Math.sin((f - 1116) / 23 + ph);
      const fl = Math.sin((f - 1116) / 4.2 + ph), w = 22 * sz;
      const p = [];
      for (let i = 0; i <= 12; i++) { const t = i / 12 * 2 - 1, u = Math.abs(t); p.push([x + t * w, y - fl * 9 * sz * u + Math.sin(u * Math.PI) * 5 * sz * (1 - 0.6 * fl) - (u < 0.2 ? 0 : 0), 0]); }
      s.lines.push({ shape: { p, a: p.map(() => 0.55 * ga) }, space: 'screen', width: 1.6, core: false });
    }
  }
  s.sun = L(SUN_X, EYE + 60, -2600);
  s.sky = seg(f, ...T.sunset, ease.inOut) * (1 - seg(f, T.toKey[0], T.keyToLine[1], ease.inOut));

  /* F — the two hands met on the horizon; the camera pushes in on them until
     they are the close-up handshake, and the key drops from the clasp. */
  const HP = handsParts();
  if (f >= T.handLock[0] && f < T.toKey[1] + 1) {
    const toScreen = (q) => { const r = project(q); return r ? [r[0], r[1], 0] : [W / 2, H / 2, 0]; };
    /* A push-in, not a morph: the handshake drawing is the agent's own offered
       arm seen closer. It starts at the size, angle and place of that arm in the
       garden and the camera closes in on it, so no line ever scrambles. */
    const armInfo = (() => {
      if (!agAll) return null;
      const sts = agentWorld(agAll, cam);
      const hs = toScreen(sts.hand);
      let far = hs, fd = 0;
      sts.filter((st) => st.part === 'armR').forEach((st) => st.pts.forEach((q) => { const r = toScreen(q); const d = Math.hypot(r[0] - hs[0], r[1] - hs[1]); if (d > fd) { fd = d; far = r; } }));
      return { hs, len: fd, ang: Math.atan2(hs[1] - far[1], hs[0] - far[0]) };
    })();
    const B0 = HP.agent.p[0], big = { len: Math.hypot(HP.grip[0] - B0[0], HP.grip[1] - B0[1]), ang: Math.atan2(HP.grip[1] - B0[1], HP.grip[0] - B0[0]) };
    const zz = seg(f, ...T.toHands, ease.inOut);
    const s0 = armInfo ? armInfo.len / big.len : 1;
    const zs = s0 * Math.pow(1 / s0, zz);                      // a dolly: scale grows geometrically
    const a0 = armInfo ? armInfo.hs : HP.grip;
    const an = armInfo ? (armInfo.ang - big.ang) * (1 - zz) : 0;
    // a true zoom about a fixed point P: the hand lands on the clasp exactly when the scale reaches 1
    let ax, ay;
    if (Math.abs(s0 - 1) > 0.05) {
      const P = [(HP.grip[0] * s0 - a0[0]) / (s0 - 1), (HP.grip[1] * s0 - a0[1]) / (s0 - 1)], g = zs / s0;
      ax = P[0] + (a0[0] - P[0]) * g; ay = P[1] + (a0[1] - P[1]) * g;
    } else { ax = lerp(a0[0], HP.grip[0], zz); ay = lerp(a0[1], HP.grip[1], zz); }
    const k = 1 + 0.025 * seg(f, T.toHands[1], T.toKey[0], ease.inOut);
    const ca = Math.cos(an), sa = Math.sin(an);
    const place = (q) => {
      const dx = (q[0] - HP.grip[0]) * zs, dy = (q[1] - HP.grip[1]) * zs;
      const X = ax + dx * ca - dy * sa, Y = ay + dx * sa + dy * ca;
      return [W / 2 + (X - W / 2) * k, 830 + (Y - 830) * k, 0];
    };
    const handsOut = 1 - seg(f, ...T.handsOut, ease.inOut);
    const bigIn = seg(f, T.handLock[0] + 2, T.handLock[0] + 12, ease.inOut);
    // both figures dissolve from the clasp outward; their offered arms hand over to the close-up
    const armOut = 1 - bigIn;
    const dissolve = (fig, id) => {
      const sts = agentWorld(fig, cam);
      const hs = toScreen(sts.hand);
      const p = [], a = [];
      sts.forEach((st) => {
        if (p.length) { p.push(p[p.length - 1], st.pts[0]); a.push(0, 0); }
        const isArm = st.part === 'armR' || st.part === 'handR';
        st.pts.forEach((q) => {
          const r = toScreen(q); const d = Math.min(1, Math.hypot(r[0] - hs[0], r[1] - hs[1]) / 700);
          p.push(q);
          a.push(st.w * (isArm ? armOut : 1 - seg(f, T.handLock[0] + 2 + d * 8, T.handLock[0] + 8 + d * 10, ease.inOut)));
        });
      });
      s.lines.push({ id, hue: 'warm', occlude: true, shape: { p, a }, space: 'world', width: 2.8, depthFree: true });
    };
    if (f < T.toHands[1]) { if (agAll) dissolve(agAll, 'agentBody'); if (byAll) dissolve(byAll, 'buyerBody'); }
    const wid = 2.8 * Math.min(1, 0.55 + 0.45 * zz);
    const hv = handsOut * bigIn;
    s.lines.push({ hue: 'warm', shape: { p: HP.agent.p.map(place), a: HP.agent.a.map((v) => v * hv) }, space: 'screen', width: wid });
    s.lines.push({ hue: 'warm', shape: { p: HP.buyer.p.map(place), a: HP.buyer.a.map((v) => v * hv) }, space: 'screen', width: wid });
    // the grip tightens once as the close-up lands
    const sq = 1 + 0.03 * Math.sin(Math.PI * seg(f, T.toHands[1] - 4, T.toHands[1] + 8));
    s.lines.push({ hue: 'warm', shape: { p: HP.fingers.p.map((q) => { const r = place(q); return [540 + (r[0] - 540) * sq, 830 + (r[1] - 830) * sq, 0]; }), a: HP.fingers.a.map((v) => v * hv) }, space: 'screen', width: wid });
    // the key drops from the clasp on its ring as the grip closes, and swings to rest
    if (f < T.toKey[0]) {
      const kh = keyHang(f, HP);
      if (kh) {
        s.lines.push({ hue: 'gold', shape: { p: kh.key.p.map(place), a: kh.key.a }, space: 'screen', width: 3.0 });
        s.lines.push({ hue: 'gold', shape: { p: kh.ring.p.map(place), a: kh.ring.a }, space: 'screen', width: 2.4 });
      }
    }
    s.glint = seg(f, ...T.keyGlint, ease.settle) * (1 - seg(f, T.keyGlint[1], T.toKey[0], ease.inOut));
  }

  /* G — the key comes forward, turns, clicks, then lies down as the line */
  if (f >= T.toKey[0] && f < T.keyToLine[1]) {
    const key = keyLocal();
    // a half turn in the lock: edge-on at the middle, face-on again at the click
    const th = seg(f, ...T.turn, (x) => ease.settle(x) + Math.sin(x * Math.PI) * 0.04) * Math.PI;
    const sc = 2.3;
    let place = key.p.map(([x, y]) => [KEY_CENTER[0] + x * Math.cos(th) * sc, KEY_CENTER[1] + y * sc, 0]);
    const k = 1.025;
    const kh = keyHang(T.toKey[0] - 1, HP);
    const kSrc = { p: kh.key.p.map((q) => [W / 2 + (q[0] - W / 2) * k, 830 + (q[1] - 830) * k, 0]), a: HP.key.a };
    const ringA = 1 - seg(f, T.toKey[0], T.toKey[0] + 8, ease.inOut);
    if (ringA > 0) s.lines.push({ hue: 'gold', shape: { p: kh.ring.p.map((q) => [W / 2 + (q[0] - W / 2) * k, 830 + (q[1] - 830) * k, 0]), a: kh.ring.a.map((v) => v * ringA) }, space: 'screen', width: 2.4 });
    let shape = morph(kSrc, { p: place, a: key.a }, seg(f, ...T.toKey, ease.inOut), 0.04, (x) => x);
    if (f >= T.keyToLine[0]) {
      // the key lies down: a quarter turn onto the line, the bow fading, then it is the line
      const t = seg(f, ...T.keyToLine, ease.inOut);
      const rot = (Math.PI / 2) * clamp(t * 1.4);
      const len = lerp(sc, 600 / 214, clamp(t * 1.4));
      const cx = lerp(KEY_CENTER[0], W / 2, clamp(t * 1.4)), cy = lerp(KEY_CENTER[1], LINE_Y, clamp(t * 1.4));
      const rotated = key.p.map(([x, y]) => { const X = x * Math.cos(th) * (1 - t), Y = y + 7; return [cx + (X * Math.cos(rot) - Y * Math.sin(rot)) * len, cy + (X * Math.sin(rot) + Y * Math.cos(rot)) * len, 0]; });
      const ringFade = key.p.map(([, y], i) => (y < -30 ? 1 - clamp(t * 2) : 1) * key.a[i]);
      shape = morph({ p: rotated, a: ringFade }, brandLineScreen(key.p.length), clamp((t - 0.55) / 0.45), 0.2, ease.inOut);
    }
    s.lines.push({ hue: 'gold', shape, space: 'screen', width: 3.4 });
    const c = f - T.click;
    // the click builds over four frames rather than arriving in one
    s.click = c >= -4 && c < 36 ? { t: Math.max(0, c) / 36, on: ease.inOut(clamp((c + 4) / 5)), x: KEY_CENTER[0], y: KEY_CENTER[1] - 78 * sc } : null;
  }
  s.flash = Math.max(pulse(f, T.collapse[1], 5, 22) * 0.55, pulse(f, T.click, 3, 22) * 0.3, pulse(f, T.gripAt, 6, 26) * 0.36);
  s.warm = Math.max(s.warm, pulse(f, T.click, 6, 50) * 0.6, pulse(f, T.gripAt, 7, 70) * 0.85);
  if (lockup) { s.lines = s.lines.filter((l) => l.brand); s.flash = 0; s.warm = 0; s.sky = 0; }

  /* Typography: words rise out of lines — flush left, on a gold rule */
  const wordLine = (x0, x1, y, a, hue = 'gold', width = 3.0) => { const p = hline(x0, x1, y); s.lines.push({ hue, shape: { p, a: p.map(() => a) }, space: 'screen', width }); };
  for (const h of HEROES) {
    if (f < h.rise[0] - 4 || f > h.out[1] + 2) continue;
    const draw = seg(f, h.rise[0] - 4, h.rise[0] + 12, ease.settle);
    const close = seg(f, h.out[1] - 10, h.out[1] + 2, ease.inOut);
    const len = textWidth(h.t, HERO_SIZE, 700) + 28;
    wordLine(TEXT_X + len * close, TEXT_X + len * draw, HERO_Y, 1);
    s.heroes.push({ ...h, rise: seg(f, ...h.rise, ease.settle), sink: seg(f, ...h.out, ease.launch), kick: seg(f, h.rise[0] + 6, h.rise[0] + 22, ease.settle) * (1 - seg(f, h.out[0] - 6, h.out[0] + 6, ease.inOut)) });
    s.scrims.push({ y: HERO_Y - 80, h: 240, a: draw * (1 - close) * 0.75 });
  }
  for (const c of COPY) {
    if (f < c.rise[0] - 4 || f > c.out[1] + 2) continue;
    const draw = seg(f, c.rise[0] + 2, c.rise[0] + 16, ease.settle);
    const close = seg(f, c.out[1] - 8, c.out[1] + 2, ease.inOut);
    const len = textWidth(c.t, COPY_SIZE, 600) + 24;
    wordLine(TEXT_X + len * close, TEXT_X + len * draw, HERO_Y, 0.85, undefined, 2.4);
    s.copy.push({ ...c, rise: seg(f, ...c.rise, ease.settle), sink: seg(f, ...c.out, ease.launch), kick: seg(f, c.rise[0] + 4, c.rise[0] + 18, ease.settle) * (1 - seg(f, c.out[0] - 8, c.out[0] + 4, ease.inOut)) });
  }

  /* Moments are marked with light: a burst of thin rays. */
  const burst = (x, y, at, { r1 = 700, n = 90, a = 0.8, rise = 3, decay = 34, seed = 1, col } = {}) => {
    const k = pulse(f, at, rise, decay);
    if (k > 0.004) s.rays.push({ x, y, a: a * k, grow: seg(f, at - rise, at + 16, ease.settle), r0: 4, r1, n, rot: 0.02 * (f - at) / 60, seed, col });
  };
  if (!lockup) {
    burst(W / 2, HERO_Y, T.collapse[1], { r1: 820, n: 110, a: 0.6, rise: 6, seed: 11 });
    const hp = project(HOUSE_O);
    if (hp && f > T.check[0] - 10 && f < T.check[1] + 60) burst(hp[0], hp[1] - 60, T.check[0] + 10, { r1: 380, n: 64, a: 0.75, rise: 8, decay: 40, seed: 5 });
    if (f > T.click - 10) burst(KEY_CENTER[0], KEY_CENTER[1] - 78 * 2.3, T.click, { r1: 900, n: 120, a: 0.62, rise: 5, decay: 24, seed: 9 });
    // the handshake: the biggest light in the film, from the clasp, in front of the sun
    if (gripScreen && f > T.gripAt - 8 && f < T.gripAt + 80) {
      burst(gripScreen[0], gripScreen[1], T.gripAt, { r1: 1500, n: 170, a: 0.95, rise: 7, decay: 46, seed: 21 });
      burst(gripScreen[0], gripScreen[1], T.gripAt + 3, { r1: 700, n: 60, a: 0.5, rise: 6, decay: 22, seed: 23 });
    }
  }
  /* The hardest moves split the light a little, like a lens under stress. */
  s.chroma = lockup ? 0 : Math.max(
    3.2 * Math.sin(Math.PI * seg(f, 364, 420, ease.inOut)),
    2.8 * Math.sin(Math.PI * seg(f, 700, 760, ease.inOut)),
    3.5 * pulse(f, T.collapse[1], 5, 12),
    2.5 * pulse(f, T.click, 4, 10),
    3.2 * pulse(f, T.gripAt, 5, 12),
  );

  /* Ground: a compass behind the first act and the last card. It spins off
     true north as the noise arrives, and snaps back on "doğru". */
  const ringA = f < 320 ? 1 - seg(f, T.tilt[0], T.tilt[0] + 40, ease.inOut) : seg(f, 1334, 1392, ease.inOut);
  s.bg = {
    mottle: 1, dust: 0.9, ring: ringA, x: W / 2, y: LINE_Y, r: 430,
    rot: lockup ? 0 : 0.3 * seg(f, 40, 118, ease.inOut) * (1 - seg(f, T.collapse[1] - 8, T.collapse[1] + 6, ease.snap)),
  };

  /* HUD: chapter, progress, where we are, how many are left. */
  if (!lockup && f > 20 && f < HUD_END + 26) {
    let ci = 0;
    CHAPTERS.forEach(([at], i) => { if (f >= at) ci = i; });
    const tgt = f < T.tour[0] ? orbitAt(f).target : cam.pos;
    const [lat, lon] = ungeo(tgt);
    const n = f >= 52 ? countAt(f) : null;
    s.hud = {
      a: seg(f, 22, 46, ease.inOut) * (1 - seg(f, HUD_END, HUD_END + 22, ease.inOut)),
      draw: seg(f, 22, 62, ease.inOut),
      ci, ct: seg(f, CHAPTERS[ci][0], CHAPTERS[ci][0] + 16, ease.settle),
      prog: clamp(f / HUD_END),
      lat, lon,
      n, one: n === 1, label: f < CHAPTERS[2][0] ? 'İLAN' : 'SONUÇ', countA: f >= 52 ? seg(f, 52, 64, ease.inOut) * (1 - seg(f, 700, 724, ease.inOut)) : 0,
    };
  }
  return s;
};

export const isFast = () => false;
