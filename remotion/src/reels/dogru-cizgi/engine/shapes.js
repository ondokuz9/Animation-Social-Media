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
/** World ground point → [lat, lon], for the coordinate readout. */
export const ungeo = ([x, , z]) => [-z / KY + ORIGIN[1], x / KX + ORIGIN[0]];

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
export const LOCKUP = { width: 600, cx: W / 2, cy: 822 };
/* The brand line: it sits under the name, and the whole film is made of it. */
export const LINE_Y = 962;
export const BRAND_LINE = [W / 2 - 300, W / 2 + 300];
export const brandLineScreen = (n = 900) => {
  const p = [];
  for (let i = 0; i < n; i++) p.push([BRAND_LINE[0] + ((BRAND_LINE[1] - BRAND_LINE[0]) * i) / (n - 1), LINE_Y, 0]);
  return { p, a: p.map(() => 1) };
};
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
// Drawn as a clean side view. The agent's arm (suit sleeve, shirt cuff)
// comes from the left; the thumb lies over the buyer's hand. The buyer's arm
// comes from the right; their fingers curl round under the agent's palm, and
// the agent's fingertips show below the buyer's hand — the grip.
const HANDS_SVG = [
  // 0–5 · agent: sleeve (two edges and a cuff seam), shirt cuff, hand with thumb over, palm
  'M -80 452 C 60 430 190 402 296 386',
  'M -80 604 C 70 584 200 552 300 530',
  'M 296 386 C 292 430 294 486 300 530  M 232 398 C 230 436 232 492 238 544',
  'M 296 386 L 324 382 C 322 428 324 480 328 522 L 300 530',
  'M 324 384 C 356 372 394 352 432 338 C 470 326 514 320 548 326 C 572 331 578 350 560 358 C 536 368 500 366 470 372 C 452 376 440 382 430 388',
  'M 328 520 C 364 526 402 526 438 518',
  // 6–11 · buyer: sleeve, cuff seam, back of the hand, knuckles, the underside
  'M 1080 292 C 960 298 840 310 728 322',
  'M 1080 452 C 960 456 840 462 722 470',
  'M 728 322 C 724 372 722 424 722 470  M 792 316 C 788 366 786 418 786 464',
  'M 728 324 C 670 324 612 332 562 346',
  'M 722 470 C 660 484 590 490 530 486',
  'M 562 346 C 556 352 552 356 548 358  M 640 330 C 646 342 648 356 646 368  M 600 336 C 606 348 608 362 606 374',
  // 12–15 · the grip: the buyer's curled fingers, and the agent's fingertips below
  'M 470 372 C 452 392 444 424 452 452 C 462 480 492 492 530 486',
  'M 500 366 C 484 392 480 420 488 446  M 532 364 C 518 390 516 416 522 440',
  'M 438 518 C 452 530 474 534 492 528 C 502 524 504 514 498 506',
  'M 492 528 C 510 540 534 542 552 534 C 562 528 562 518 556 512  M 552 534 C 570 544 592 544 606 536 C 614 530 612 522 606 518',
];
// the key hangs from the clasp: a real cylinder key. The bow is a house (with
// a bevel, a small door and a hole for the ring), then a collar and a blade
// with a milled groove and cut bitting, ending in a pointed tip.
export const KEY_SVG = [
  'M 560 588 L 615 633 L 615 686 Q 615 693 608 693 L 512 693 Q 505 693 505 686 L 505 633 Z',
  'M 560 601 L 603 636 L 603 682 L 517 682 L 517 636 Z',
  'M 553 620 A 7 7 0 0 0 567 620 A 7 7 0 0 0 553 620',
  'M 551 682 L 551 664 A 9 9 0 0 1 569 664 L 569 682',
  'M 538 693 L 582 693 L 582 704 L 538 704 Z',
  'M 546 704 L 546 834 L 558 848 L 566 848 L 575 834 L 575 822 L 567 812 L 575 802 L 575 790 L 568 780 L 575 770 L 575 758 L 566 748 L 575 738 L 575 726 L 569 718 L 575 710 L 575 704',
  'M 553 712 L 553 830',
];
export const HANDS_BOX = { x: 40, y: 430, s: 1 };
export const handsToScreen = ([x, y]) => [HANDS_BOX.x + x * HANDS_BOX.s, HANDS_BOX.y + y * HANDS_BOX.s, 0];

/* The handshake in two people: the agent's hand (from the right) and the
   buyer's (from the left, thumb over, fingers wrapping). */
let _parts = null;
export const handsParts = () => {
  if (_parts) return _parts;
  // every sub-path of a stroke, joined with pen lifts
  const toS = (d) => concat(...sampleStrokes(d, 3).map((st) => withAlpha(st.map(handsToScreen))));
  // the agent's hand comes from the left (thumb over); the buyer's from the right;
  // the agent's fingers close over the buyer's hand last — the grip
  const agent = [0, 1, 2, 3, 4, 5].map((i) => toS(HANDS_SVG[i]));
  const buyer = [6, 7, 8, 9, 10, 11].map((i) => toS(HANDS_SVG[i]));
  const fingers = [12, 13, 14, 15].map((i) => toS(HANDS_SVG[i]));
  const key = KEY_SVG.flatMap((d) => sampleStrokes(d, 3).map((st) => withAlpha(st.map(handsToScreen))));
  _parts = { agent: resample(concat(...agent), N), buyer: resample(concat(...buyer), N), fingers: resample(concat(...fingers), 240), key: resample(concat(...key), 520), grip: handsToScreen([400, 452]) };
  return _parts;
};

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

