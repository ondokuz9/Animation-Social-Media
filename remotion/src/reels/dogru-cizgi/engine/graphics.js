// Flat graphics (screen pixels): listing cards for the noise, map pins,
// and the key that turns.

import { mulberry, resample, withAlpha, concat } from './math.js';
import { sampleStrokes } from './svg.js';
import { W, KEY_SVG } from './shapes.js';

/* ── Listing cards ─────────────────────────────────────────────────────────
   A card is the unit of the problem: too many, half of them the same house,
   some of them not real. Portrait, 150 × 190, photo well, three text rules. */
const CARD_SVG = [
  'M 14 0 L 136 0 A 14 14 0 0 1 150 14 L 150 176 A 14 14 0 0 1 136 190 L 14 190 A 14 14 0 0 1 0 176 L 0 14 A 14 14 0 0 1 14 0 Z',
  'M 10 10 L 140 10 L 140 102 L 10 102 Z',
  // a house in the photo well: roof, walls, door — it is a listing, at a glance
  'M 44 88 L 44 58 L 75 34 L 106 58 L 106 88 Z', 'M 68 88 L 68 70 L 82 70 L 82 88',
  'M 14 122 L 122 122', 'M 14 142 L 96 142',
];
export const CARD_PTS = 50;
export const CARD_COUNT = 18;

let _card = null;
export const cardLocal = () => {
  if (_card) return _card;
  const strokes = CARD_SVG.flatMap((d) => sampleStrokes(d, 2).map((s) => withAlpha(s.map(([x, y]) => [x - 75, y - 95, 0]))));
  _card = resample(concat(...strokes), CARD_PTS);
  return _card;
};

/* Where each card lives in the noise: position, tilt, scale, depth. */
export const CARDS = (() => {
  const r = mulberry(777);
  const out = [];
  for (let i = 0; i < CARD_COUNT; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    out.push({
      x: 125 + col * 166 + (r() - 0.5) * 60,
      y: 470 + row * 226 + (r() - 0.5) * 60,
      rot: (r() - 0.5) * 0.5,
      s: 0.6 + r() * 0.36,
      z: (r() - 0.5) * 1.3e5,           // metres of depth in the A plane, for parallax
      dup: r() < 0.38,                   // the same house, listed again at another price
      seed: r() * 1000,
    });
  }
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
  const strokes = KEY_SVG.flatMap((d) => sampleStrokes(d, 1.5).map((s) => withAlpha(s.map(([x, y]) => [x - 560, y - 600, 0]))));
  // (KEY_SVG is authored in the hands' box; the key's own frame is centred on its shaft)
  _key = resample(concat(...strokes), 300);
  return _key;
};
export const KEY_CENTER = [W / 2, 750];   // the bit ends on the brand line, in its keyhole
