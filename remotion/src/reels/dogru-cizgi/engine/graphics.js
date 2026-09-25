// Flat graphics (screen pixels): listing cards for the noise, map pins,
// and the key that turns.

import { mulberry, resample, withAlpha, concat } from './math.js';
import { sampleStrokes } from './svg.js';
import { W, KEY_SVG } from './shapes.js';

/* ── Listing cards ─────────────────────────────────────────────────────────
   A card is the unit of the problem. Its outline is what the line becomes
   (50 points, so the line can snap back); what is printed on it — a photo
   well with a building, a price, an address rule — is drawn separately. */
const OUTLINE_SVG = 'M 14 0 L 136 0 A 14 14 0 0 1 150 14 L 150 176 A 14 14 0 0 1 136 190 L 14 190 A 14 14 0 0 1 0 176 L 0 14 A 14 14 0 0 1 14 0 Z';
const WELL = 'M 10 10 L 140 10 L 140 104 L 10 104 Z';
// buildings in the photo well: 0 the house (both hero cards), 1 an apartment
// block, 2 two terraced houses, 3 a low villa with a flat roof
const BUILDINGS = [
  ['M 44 92 L 44 60 L 75 36 L 106 60 L 106 92 Z', 'M 68 92 L 68 72 L 82 72 L 82 92', 'M 88 64 L 98 64 L 98 74 L 88 74 Z'],
  ['M 52 92 L 52 26 L 98 26 L 98 92 Z', 'M 60 36 L 70 36 M 80 36 L 90 36 M 60 50 L 70 50 M 80 50 L 90 50 M 60 64 L 70 64 M 80 64 L 90 64', 'M 70 92 L 70 80 L 80 80 L 80 92'],
  ['M 32 92 L 32 58 L 54 42 L 76 58 L 98 42 L 120 58 L 120 92 Z', 'M 76 58 L 76 92', 'M 48 92 L 48 76 L 58 76 L 58 92 M 94 92 L 94 76 L 104 76 L 104 92'],
  ['M 26 92 L 26 60 L 124 60 L 124 92 Z', 'M 20 60 L 130 60', 'M 40 72 L 70 72 L 70 84 L 40 84 Z M 88 92 L 88 72 L 104 72 L 104 92'],
];
const RULE = 'M 14 170 L 88 170';
export const CARD_PTS = 50;
export const CARD_COUNT = 18;

let _card = null;
export const cardLocal = () => {
  if (_card) return _card;
  _card = resample(withAlpha(sampleStrokes(OUTLINE_SVG, 2)[0].map(([x, y]) => [x - 75, y - 95, 0])), CARD_PTS);
  return _card;
};
const _detail = {};
export const cardDetail = (b) => {
  if (_detail[b]) return _detail[b];
  const strokes = [WELL, ...BUILDINGS[b], RULE].flatMap((d) => sampleStrokes(d, 2).map((st) => withAlpha(st.map(([x, y]) => [x - 75, y - 95, 0]))));
  _detail[b] = resample(concat(...strokes), 220);
  return _detail[b];
};
/* where the price sits on a card, in card-local pixels */
export const PRICE_AT = [-61, 50];

/* The noise, composed: two cards side by side in the middle — the same house
   at two prices — and the rest wound round them on a golden-angle spiral,
   turning slowly, nearer in the middle and falling away in depth outward. */
export const CARD_CENTER = [540, 690];
const PRICES = ['£96.000', '£1.200/ay', '£310.000', '£750/ay', '£142.000', '£2.100/ay', '£205.000', '£88.000', '£167.000', '£950/ay', '£275.000', '£1.450/ay', '£128.000', '£199.000', '£620/ay', '£350.000'];
export const CARDS = (() => {
  const r = mulberry(777);
  const out = [
    { x: 372, y: 670, rot: -0.07, s: 1.08, z: 3.2e4, hero: true, b: 0, price: '£185.000', seed: 11 },
    { x: 708, y: 682, rot: 0.06, s: 1.08, z: 3.0e4, hero: true, b: 0, price: '£240.000', seed: 23 },
  ];
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < CARD_COUNT - 2; i++) {
    const t = i / (CARD_COUNT - 3);
    const ang = 0.9 + i * GA, rad = 280 + 200 * Math.sqrt(t);
    out.push({
      x: CARD_CENTER[0] + Math.cos(ang) * rad,
      y: CARD_CENTER[1] + Math.sin(ang) * rad * 0.82,
      rot: 0.35 * Math.sin(ang * 1.7) + (r() - 0.5) * 0.18,
      s: 0.8 - 0.24 * t + (r() - 0.5) * 0.04,
      z: (0.2 - t) * 0.35e5,
      hero: false, b: 1 + (i % 3), price: PRICES[i], seed: r() * 1000,
      fake: i % 3 === 1,
    });
  }
  // two hand-placed nudges so no price is covered
  out[11].y -= 40; out[11].x -= 12; out[17].y -= 40; out[17].x += 10;
  out[16].y -= 24;
  return out;
})();

/* ── Map pin ─────────────────────────────────────────────────────────────── */
const PIN_SVG = 'M 0 0 C -6 -14 -21 -26 -21 -42 A 21 21 0 1 1 21 -42 C 21 -26 6 -14 0 0 Z';
const PIN_DOT = 'M 0 -49 A 7 7 0 1 1 0 -35 A 7 7 0 1 1 0 -49';
const PIN_CHECK = 'M -9 -42 L -3 -35 L 10 -51';
let _pin = null;
export const pinGlyph = () => {
  if (_pin) return _pin;
  _pin = {
    body: sampleStrokes(PIN_SVG, 1.5)[0],
    dot: sampleStrokes(PIN_DOT, 1.5)[0],
    check: sampleStrokes(PIN_CHECK, 1)[0],
  };
  return _pin;
};

/* ── The key, alone ─────────────────────────────────────────────────────────
   Drawn about its shaft axis so it can turn: every x offset from the axis is
   scaled by cos(θ), which reads as a quarter turn in a lock. */
let _key = null;
export const keyLocal = () => {
  if (_key) return _key;
  // KEY_SVG is laid out on the hands; recentre it on the shaft (x = 560)
  const strokes = KEY_SVG.flatMap((d) => sampleStrokes(d, 1.5).map((s) => withAlpha(s.map(([x, y]) => [x - 560, y - 722, 0]))));
  // (KEY_SVG is authored in the hands' box; the key's own frame is centred on its shaft)
  _key = resample(concat(...strokes), 300);
  return _key;
};
export const KEY_CENTER = [W / 2, 750];   // the bit ends on the brand line, in its keyhole
