// Girne, the neighbourhood scale (metres around the city centre). This is a
// drawing of a coastal town — sea to the north, a harbour, roads that follow
// the coast — not a survey. Street geometry is stylised on purpose.

import { mulberry, v3 } from './math.js';
import { GIRNE } from './shapes.js';
import { S, joinStrokes } from './build.js';

const at = (x, z) => [GIRNE[0] + x, 0, GIRNE[2] + z];

const coastZ = (x) => -620 + 35 * Math.sin(x / 210) + 18 * Math.sin(x / 67 + 1);
const HARBOUR_R = 110;

/* Coastline with the harbour basin cut into it, west → east. */
const coastStrokes = () => {
  const pts = [];
  for (let x = -1900; x <= 1900; x += 15) {
    let z = coastZ(x);
    if (Math.abs(x) < HARBOUR_R) z += Math.sqrt(HARBOUR_R ** 2 - x * x) * 0.8;
    pts.push(at(x, z));
  }
  const z0 = coastZ(-HARBOUR_R), z1 = coastZ(HARBOUR_R);
  const west = [], east = [];
  for (let k = 0; k <= 16; k++) {
    const t = k / 16;
    west.push(at(-HARBOUR_R + 70 * Math.sin(t * 1.4), z0 - 130 * t));
    east.push(at(HARBOUR_R - 50 * Math.sin(t * 1.2), z1 - 115 * t));
  }
  return [S(pts, null, 'coast'), S(west, null, 'coast'), S(east, null, 'coast')];
};

/* Roads: a coastal road, a ring road, and lanes running up the hill. */
const ROADS = (() => {
  const r = [];
  const line = (fn, a, b, step = 20) => { const p = []; for (let t = a; t <= b; t += step) p.push(fn(t)); return p; };
  r.push(line((x) => at(x, coastZ(x) + 140), -1900, 1900));
  r.push(line((x) => at(x, 250 + 60 * Math.sin(x / 400)), -1900, 1900));
  for (const x0 of [-940, -400, 230, 830]) r.push(line((z) => at(x0 + 22 * Math.sin(z / 260 + x0), z), coastZ(x0) + 140, 820));
  r.push(line((t) => at(-1500 + t * 2600, 700 - t * 560 + 40 * Math.sin(t * 7)), 0, 1, 0.01));
  return r;
})();

export const HOUSE_LOCAL = [180, -330];
export const HOUSE_O = at(...HOUSE_LOCAL);

/* Buildings: small footprints between the roads, the texture of a town. */
const blocks = () => {
  const rnd = mulberry(4242);
  const roadPts = ROADS.flat();
  const out = [];
  let tries = 0;
  while (out.length < 520 && tries < 20000) {
    tries++;
    const x = (rnd() - 0.5) * 3600, z = -560 + rnd() * 1400;
    if (z < coastZ(x) + 70) continue;
    const c = at(x, z);
    if (Math.hypot(x - HOUSE_LOCAL[0], z - HOUSE_LOCAL[1]) < 30) continue;
    let near = false;
    for (let i = 0; i < roadPts.length; i += 2) {
      if (Math.hypot(roadPts[i][0] - c[0], roadPts[i][2] - c[2]) < 30) { near = true; break; }
    }
    if (near) continue;
    const w = 16 + rnd() * 34, d = 14 + rnd() * 26, ang = (rnd() - 0.5) * 0.5;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const corner = (u, v) => [c[0] + u * ca - v * sa, 0, c[2] + u * sa + v * ca];
    out.push(S([corner(-w / 2, -d / 2), corner(w / 2, -d / 2), corner(w / 2, d / 2), corner(-w / 2, d / 2), corner(-w / 2, -d / 2)], null, 'block'));
  }
  const near = mulberry(99);
  for (let i = 0; i < 26; i++) {
    const ang = (i / 26) * Math.PI * 2 + near() * 0.2, rr = 34 + near() * 60;
    const x = HOUSE_LOCAL[0] + Math.cos(ang) * rr, z = HOUSE_LOCAL[1] + Math.sin(ang) * rr;
    const c = at(x, z), w = 14 + near() * 12, d = 12 + near() * 10;
    out.push(S([[c[0] - w / 2, 0, c[2] - d / 2], [c[0] + w / 2, 0, c[2] - d / 2], [c[0] + w / 2, 0, c[2] + d / 2], [c[0] - w / 2, 0, c[2] + d / 2], [c[0] - w / 2, 0, c[2] - d / 2]], null, 'block'));
  }
  return out;
};

let _town = null;
export const town = () => {
  if (_town) return _town;
  _town = {
    coast: joinStrokes(coastStrokes(), 8),
    roads: joinStrokes(ROADS.map((p) => S(p, null, 'road')), 10),
    blocks: joinStrokes(blocks(), 6),
  };
  return _town;
};

/* Listings on the map: where the pins stand. The last one is the house. */
export const MARKERS = [
  [-1180, -150], [-760, 130], [-450, -300], [-90, 390], [450, -440], [690, 170],
  [1060, -250], [1330, 430], [-1000, 540], [300, 580], [-300, 60], HOUSE_LOCAL,
].map(([x, z], i) => ({ p: at(x, z), i, chosen: i === 11 }));

export const coastAt = (x) => at(x, coastZ(x));
export { at as townAt };
