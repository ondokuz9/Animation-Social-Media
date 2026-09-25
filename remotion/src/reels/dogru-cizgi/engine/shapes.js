// Every shape the line becomes. Units: the world is in metres, y up, north −z.
// Screen shapes are in 1080×1920 pixels.

import cyprus from '../data/cyprus.json';
import { sampleStrokes } from './svg.js';
import { concat, withAlpha, resample } from './math.js';

export const W = 1080;
export const H = 1920;
export const FOV = (40 * Math.PI) / 180;
export const FOCAL = H / 2 / Math.tan(FOV / 2);

/* Map scale: the whole island ≈ 960px wide when seen from straight above. */
export const MAP_M_PER_PX = 240;
export const MAP_DIST = MAP_M_PER_PX * FOCAL;

const ORIGIN = [33.25, 35.13]; // lon, lat — roughly the island's middle
const KX = Math.cos((35.13 * Math.PI) / 180) * 111320;
const KY = 110950;
export const geo = (lon, lat) => [(lon - ORIGIN[0]) * KX, 0, -(lat - ORIGIN[1]) * KY];

/* Evlek's six cities, [lon, lat] — the same centres the product geocodes to
   (Evlak-Emlak src/lib/district-centers.ts CITY_CENTERS). */
export const CITIES = [
  { name: 'GÜZELYURT', ll: [32.99, 35.2] },
  { name: 'LEFKE', ll: [32.85, 35.11] },
  { name: 'LEFKOŞA', ll: [33.365, 35.185] },
  { name: 'GAZİMAĞUSA', ll: [33.94, 35.125] },
  { name: 'İSKELE', ll: [33.89, 35.285] },
  { name: 'GİRNE', ll: [33.319, 35.336] },
].map((c) => ({ ...c, p: geo(c.ll[0], c.ll[1]) }));
export const GIRNE = CITIES[CITIES.length - 1].p;

/* ── Screen ↔ A-plane ─────────────────────────────────────────────────────
   Act A happens in the vertical plane z = 0 seen by a level camera at
   MAP_DIST. One pixel there is MAP_M_PER_PX metres, so a screen design can be
   lifted into the world exactly. */
export const screenToA = ([sx, sy]) => [(sx - W / 2) * MAP_M_PER_PX, (H / 2 - sy) * MAP_M_PER_PX, 0];

/* ── Wordmark ───────────────────────────────────────────────────────────── */
// Evlak-Emlak src/lib/brand-v3.ts WORDMARK_PATHS — SACRED, upright, unchanged.
export const WORDMARK_PATHS = {
  E: 'M1281.6 419.207V458H1353.4V482H1254.4V419.201L1267.02 408.085L1281.6 419.207ZM1349.4 419.2H1281.69L1268.04 407.193L1281.66 395.2H1349.4V419.2ZM1266.1 407.376L1254.4 416.558V416.554L1263.45 407.5L1254.43 398.472L1266.1 407.376ZM1353.4 357H1281.6V395.2H1281.61L1267.23 406.484L1254.4 395.199V333H1353.4V357Z',
  v: 'M1415 442.942L1423.57 466.868L1418.5 435.872L1441.35 373.2H1469.95L1427.15 482H1403.95L1361.15 373.2H1389.75L1415 442.942Z',
  l: 'M1484.43 482V330.6H1510.63V482H1484.43Z',
  e: 'M1586.42 484.4C1575.22 484.4 1565.42 481.867 1557.02 476.8C1548.62 471.733 1542.08 464.867 1537.42 456.2C1532.75 447.533 1530.42 437.933 1530.42 427.4C1530.42 416.467 1532.75 406.8 1537.42 398.4C1542.22 389.867 1548.68 383.133 1556.82 378.2C1565.08 373.267 1574.28 370.8 1584.42 370.8C1592.95 370.8 1600.42 372.2 1606.82 375C1613.35 377.8 1618.88 381.667 1623.42 386.6C1627.95 391.533 1631.42 397.2 1633.82 403.6C1636.22 409.867 1637.42 416.667 1637.42 424C1637.42 425.867 1637.28 427.8 1637.02 429.8C1636.88 431.8 1636.55 433.533 1636.02 435H1552.02V415H1621.22L1608.82 424.4C1610.02 418.267 1609.68 412.8 1607.82 408C1606.08 403.2 1603.15 399.4 1599.02 396.6C1595.02 393.8 1590.15 392.4 1584.42 392.4C1578.95 392.4 1574.08 393.8 1569.82 396.6C1565.55 399.267 1562.28 403.267 1560.02 408.6C1557.88 413.8 1557.08 420.133 1557.62 427.6C1557.08 434.267 1557.95 440.2 1560.22 445.4C1562.62 450.467 1566.08 454.4 1570.62 457.2C1575.28 460 1580.62 461.4 1586.62 461.4C1592.62 461.4 1597.68 460.133 1601.82 457.6C1606.08 455.067 1609.42 451.667 1611.82 447.4L1633.02 457.8C1630.88 463 1627.55 467.6 1623.02 471.6C1618.48 475.6 1613.08 478.733 1606.82 481C1600.68 483.267 1593.88 484.4 1586.42 484.4Z',
  k: 'M1683.48 408.791L1667.73 432.858L1683.48 416.33L1724.68 373.2H1757.28L1717.08 417L1758.08 482H1728.08L1697.57 433.672L1683.48 448.799V482H1657.28V330.6H1683.48V408.791Z',
};
export const WORDMARK_VIEWBOX = [1230, 315, 550, 185];

/* Lockup geometry, in screen pixels. Frame 0 and frame 899 both show it. */
export const LOCKUP = { width: 600, cx: W / 2, cy: 846 };
export const lockupScale = LOCKUP.width / WORDMARK_VIEWBOX[2];
const wmToScreen = ([x, y]) => [
  LOCKUP.cx + (x - (WORDMARK_VIEWBOX[0] + WORDMARK_VIEWBOX[2] / 2)) * lockupScale,
  LOCKUP.cy + (y - (WORDMARK_VIEWBOX[1] + WORDMARK_VIEWBOX[3] / 2)) * lockupScale,
];

export const N = 900; // every morphing shape is resampled to this many points

let _wm = null;
/** The wordmark outline as one polyline (pen lifts between contours), screen px. */
export const wordmarkScreen = () => {
  if (_wm) return _wm;
  const strokes = [];
  for (const k of ['E', 'v', 'l', 'e', 'k']) {
    sampleStrokes(WORDMARK_PATHS[k], 0.8).forEach((s) => strokes.push(withAlpha(s.map(wmToScreen).map((q) => [q[0], q[1], 0]))));
  }
  _wm = resample(concat(...strokes), N);
  return _wm;
};

/** The horizon: a straight line across the frame at the optical centre. */
export const HORIZON_Y = H / 2;
export const horizonScreen = (x0 = 90, x1 = W - 90) => {
  const p = [];
  for (let i = 0; i < N; i++) p.push([x0 + ((x1 - x0) * i) / (N - 1), HORIZON_Y, 0]);
  return { p, a: p.map(() => 1) };
};

/* ── Cyprus ─────────────────────────────────────────────────────────────── */
let _coast = null;
/** Coastline, starting at the western cape and running clockwise (north
 *  coast first), so the line lays down west → east along the Kyrenia range. */
export const coastWorld = () => {
  if (_coast) return _coast;
  let ring = cyprus.island.slice();
  if (ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) ring.pop();
  // start at the westernmost point
  let wi = 0;
  ring.forEach((q, i) => { if (q[0] < ring[wi][0]) wi = i; });
  ring = ring.slice(wi).concat(ring.slice(0, wi));
  // make sure we travel north-east first (north coast before south)
  const nxt = ring[5], prv = ring[ring.length - 5];
  if (prv[1] > nxt[1]) ring = [ring[0], ...ring.slice(1).reverse()];
  ring.push(ring[0]);
  // Catmull-Rom smoothing: Natural Earth 10m is angular at this scale.
  const pts = [];
  const P = ring.map((q) => geo(q[0], q[1]));
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let s = 0; s < 6; s++) {
      const t = s / 6, t2 = t * t, t3 = t2 * t;
      pts.push([0, 2].reduce((acc, k) => {
        acc[k] = 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
        return acc;
      }, [0, 0, 0]));
    }
  }
  pts.push(P[P.length - 1]);
  _coast = resample(withAlpha(pts), N);
  return _coast;
};

export const dividerWorld = () => cyprus.divider.map((l) => l.map((q) => geo(q[0], q[1])));

/* ── Handshake (screen px) ──────────────────────────────────────────────── */
// A 1000 × 700 design box mapped onto the frame. Two sleeves meet; the upper
// hand's fingers wrap the lower; the lower thumb lies over the top.
// Anatomy, side view: the near hand (right) shows its back; the far hand's
// thumb lies over it, and the far hand's four fingers wrap round its lower
// edge onto the near side — which is what a real handshake shows the camera.
const finger = (x, by, ty, w = 34, tilt = 7) =>
  `M ${x} ${by} L ${x + tilt} ${ty + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w + tilt} ${ty + w / 2} L ${x + w} ${by - 2}`;
const HANDS_SVG = [
  // far (left) sleeve and cuff
  'M -60 350 L 236 300',
  'M -60 494 L 248 446',
  'M 236 300 L 248 446',
  'M 254 298 L 266 444',
  // far hand: wrist rising into the thumb, which lies over the near hand
  'M 266 298 C 300 290 330 276 356 262 C 392 244 440 232 486 232 C 514 232 530 246 522 260 C 514 274 492 276 468 278 C 446 280 432 284 420 292',
  // far hand: heel of the palm, running under
  'M 266 444 C 310 452 352 458 396 458',
  // near (right) sleeve and cuff
  'M 1060 250 L 776 270',
  'M 1060 396 L 788 418',
  'M 776 270 L 788 418',
  'M 758 270 L 770 418',
  // near hand: back of the hand, knuckles, closing round under
  'M 758 272 C 690 266 620 266 556 274 C 500 282 452 298 422 320 C 398 338 388 362 394 390 C 400 416 420 432 446 440',
  'M 770 418 C 700 430 620 440 540 450 C 500 454 470 450 446 440',
  // the far hand's four fingers, wrapping onto the back of the near hand
  finger(462, 452, 372),
  finger(502, 452, 358),
  finger(542, 448, 362),
  finger(582, 444, 378, 30),
];
// the key hangs from the clasp: ring, shaft, bit
export const KEY_SVG = [
  'M 560 486 A 30 30 0 1 1 560 546 A 30 30 0 1 1 560 486',
  'M 560 546 L 560 700',
  'M 560 650 L 588 650 L 588 664 L 574 664 L 574 678 L 588 678 L 588 692 L 560 692',
];
export const HANDS_BOX = { x: 40, y: 600, s: 1 };
export const handsToScreen = ([x, y]) => [HANDS_BOX.x + x * HANDS_BOX.s, HANDS_BOX.y + y * HANDS_BOX.s, 0];

let _hands = null;
export const handsScreen = () => {
  if (_hands) return _hands;
  const hand = HANDS_SVG.map((d) => withAlpha(sampleStrokes(d, 3)[0].map(handsToScreen)));
  const key = KEY_SVG.flatMap((d) => sampleStrokes(d, 3).map((s) => withAlpha(s.map(handsToScreen))));
  const all = concat(...hand, ...key);
  const handOnly = concat(...hand);
  _hands = { shape: resample(all, 2 * N), keyFrom: handOnly.p.length / all.p.length };
  return _hands;
};

