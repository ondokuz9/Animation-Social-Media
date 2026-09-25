// The house: a two-volume Mediterranean villa facing the sea (north, −z).
// Metres, local to HOUSE_O. Entrance on the south, living room and kitchen
// open onto a pergola terrace and a pool on the sea side.

import { v3 } from './math.js';
import { HOUSE_O } from './town.js';
import { S, box, circle, rectXY, rectXZ, rectZY, seg3, offset, joinStrokes } from './build.js';
import { sampleStrokes } from './svg.js';

export const O = HOUSE_O;
const L = (x, y, z) => v3.add(O, [x, y, z]);

/* Plan dimensions. */
export const G = { x0: -7, x1: 7, z0: -5, z1: 5, h: 3.2 };   // ground floor
export const U = { x0: -7, x1: 1.6, z0: -3.6, z1: 5, h: 3.0 }; // upper floor, set back from the sea
export const DOOR = { x0: -3.1, x1: -1.9, h: 2.3 };
export const EYE = 1.62;

const loc = (strokes) => offset(strokes, O);

/* ── Exterior ─────────────────────────────────────────────────────────── */
const exteriorStrokes = () => {
  const s = [];
  // garden wall along the street, broken by the gate
  s.push(S([[-9, 0, 9], [-3.5, 0, 9], [-3.5, 1.1, 9], [-9, 1.1, 9], [-9, 0, 9]], null, 'wall'));
  s.push(S([[-1.5, 0, 9], [9, 0, 9], [9, 1.1, 9], [-1.5, 1.1, 9], [-1.5, 0, 9]], null, 'wall'));
  // path from gate to door
  s.push(S([[-3.2, 0, 9], [-3.2, 0, 5]], null, 'path'), S([[-1.8, 0, 9], [-1.8, 0, 5]], null, 'path'));
  // ground volume
  s.push(...box([G.x0, 0, G.z0], [G.x1, G.h, G.z1], { tag: 'mass' }));
  // upper volume + a thin parapet line on both roofs
  s.push(...box([U.x0, G.h, U.z0], [U.x1, G.h + U.h, U.z1], { tag: 'mass', skipBottom: true }));
  s.push(S([[U.x1, G.h + 0.25, G.z0], [G.x1, G.h + 0.25, G.z0], [G.x1, G.h + 0.25, G.z1], [U.x1, G.h + 0.25, G.z1]], null, 'parapet'));
  // south façade: door, windows; upper floor: a long horizontal window
  s.push(rectXY(DOOR.x0, 0, DOOR.x1, DOOR.h, G.z1 + 0.01));
  s.push(rectXY(2.4, 0.9, 6.2, 2.4, G.z1 + 0.01), seg3([4.3, 0.9, G.z1 + 0.01], [4.3, 2.4, G.z1 + 0.01]));
  s.push(rectXY(-6.2, 0.9, -4.4, 2.4, G.z1 + 0.01));
  s.push(rectXY(-6.2, G.h + 0.9, 0.8, G.h + 2.2, U.z1 + 0.01));
  for (const x of [-4.4, -2.6, -0.9]) s.push(seg3([x, G.h + 0.9, U.z1 + 0.01], [x, G.h + 2.2, U.z1 + 0.01]));
  // east side window
  s.push(rectZY(-3.5, 0.9, 1.5, 2.4, G.x1 + 0.01));
  // canopy over the door
  s.push(S([[-3.6, 2.6, G.z1], [-3.6, 2.6, G.z1 + 1.4], [-1.4, 2.6, G.z1 + 1.4], [-1.4, 2.6, G.z1]], null, 'canopy'));
  return loc(s).map((st, i) => ({ ...st, order: i }));
};

/* The sea side: glazing, pergola, pool, rail. Drawn with the exterior and
   seen again from inside. */
const seaSideStrokes = () => {
  const s = [];
  const zN = G.z0 - 0.01;
  // living room glazing: frame + mullions
  s.push(rectXY(-6.6, 0.1, 0.4, 2.9, zN));
  for (let x = -6.6 + 1.75; x < 0.4; x += 1.75) s.push(seg3([x, 0.1, zN], [x, 2.9, zN]));
  // kitchen sliding doors
  s.push(rectXY(1.5, 0, 6.5, 2.7, zN), seg3([4, 0, zN], [4, 2.7, zN]));
  // pergola: four posts, two beams, a rhythm of slats
  const pz0 = -9.2, pz1 = G.z0;
  for (const [x, z] of [[-0.8, pz0], [6.8, pz0]]) s.push(seg3([x, 0, z], [x, 2.9, z]));
  s.push(seg3([-0.8, 2.9, pz0], [6.8, 2.9, pz0]), seg3([-0.8, 2.9, pz0], [-0.8, 2.9, pz1]), seg3([6.8, 2.9, pz0], [6.8, 2.9, pz1]));
  for (let x = -0.4; x < 6.8; x += 0.55) s.push(seg3([x, 3.0, pz0 - 0.15], [x, 3.0, pz1]));
  // terrace edge and glass rail
  s.push(S([[-7.5, 0, -10], [8, 0, -10]]), S([[-7.5, 1.0, -10], [8, 1.0, -10]]));
  for (let x = -7.5; x <= 8; x += 2.2) s.push(seg3([x, 0, -10], [x, 1.0, -10]));
  // pool: coping and water, with three lines of reflected light
  s.push(rectXZ(-6.6, -9.4, -1.8, -6.0, 0.001), rectXZ(-6.35, -9.15, -2.05, -6.25, -0.05));
  for (const z of [-8.4, -7.6, -6.9]) s.push(S([[-5.8, -0.05, z], [-4.6, -0.05, z + 0.08], [-3.4, -0.05, z - 0.05], [-2.4, -0.05, z + 0.04]], null, 'water'));
  // two loungers on the terrace
  for (const x of [-99]) {
    const prof = [[0, 0.3, -6.1], [0, 0.35, -7.4], [0, 0.85, -8.0]];
    s.push(S(prof.map(([, y, z]) => [x, y, z])), S(prof.map(([, y, z]) => [x + 0.75, y, z])));
    s.push(seg3([x, 0.3, -6.1], [x + 0.75, 0.3, -6.1]), seg3([x, 0.85, -8.0], [x + 0.75, 0.85, -8.0]));
    s.push(seg3([x, 0, -6.2], [x, 0.3, -6.2]), seg3([x + 0.75, 0, -6.2], [x + 0.75, 0.3, -6.2]));
  }
  return loc(s);
};

/* ── Interior ─────────────────────────────────────────────────────────
   The room shell is true 3D and kept faint; the furniture is drawn as clean
   elevations on planes set into the room — the way an interior perspective
   is drawn by hand. Moving the camera gives real parallax between them. */

/** SVG line art (cm, y down, floor at y = 0) laid on a vertical plane. */
const flat = (paths, origin, u, step = 2) => paths.flatMap((d) => sampleStrokes(d, step).map((st) => S(st.map(([x, y]) => v3.add(origin, [u[0] * x * 0.01, -y * 0.01, u[2] * x * 0.01])))));

const shellStrokes = () => {
  const s = [];
  s.push(rectXZ(G.x0 + 0.02, G.z0 + 0.02, G.x1 - 0.02, G.z1 - 0.02, 0.005));
  for (const [x, z] of [[G.x0 + 0.02, G.z0 + 0.02], [G.x1 - 0.02, G.z0 + 0.02], [G.x0 + 0.02, G.z1 - 0.02], [G.x1 - 0.02, G.z1 - 0.02]]) s.push(seg3([x, 0, z], [x, G.h, z]));
  s.push(seg3([G.x0, G.h - 0.02, G.z0 + 0.02], [G.x1, G.h - 0.02, G.z0 + 0.02]), seg3([G.x1 - 0.02, G.h - 0.02, G.z0], [G.x1 - 0.02, G.h - 0.02, G.z1]));
  s.push(seg3([1, G.h - 0.3, G.z0], [1, G.h - 0.3, G.z1]));
  return loc(s);
};

const livingStrokes = () => {
  const X = [1, 0, 0];
  const s = [];
  // rug and coffee table: real 3D, the floor is what gives the room depth
  s.push(rectXZ(-5.4, -3.4, -1.2, -0.6, 0.01), rectXZ(-5.2, -3.2, -1.4, -0.8, 0.01));
  s.push(...box([-3.9, 0.3, -2.4], [-2.5, 0.36, -1.5], { tag: 'table' }));
  for (const [x, z] of [[-3.8, -2.3], [-2.6, -2.3], [-3.8, -1.6], [-2.6, -1.6]]) s.push(seg3([x, 0, z], [x, 0.3, z]));
  // sofa, seen from behind, facing the sea
  s.push(...flat([
    'M 0 -6 L 0 -58 Q 0 -70 12 -70 L 20 -70 L 20 -6',
    'M 280 -6 L 280 -58 Q 280 -70 268 -70 L 260 -70 L 260 -6',
    'M 20 -70 L 20 -88 Q 20 -98 32 -98 L 248 -98 Q 260 -98 260 -88 L 260 -70',
    'M 36 -98 Q 86 -112 138 -100', 'M 142 -100 Q 196 -112 246 -98',
    'M 0 -6 L 280 -6', 'M 14 -6 L 14 0', 'M 266 -6 L 266 0',
  ], [-4.6, 0, -0.35], X));
  // arc floor lamp
  s.push(...flat([
    'M -20 0 L 20 0', 'M 0 0 L 0 -150 C 0 -212 44 -234 96 -226',
    'M 76 -224 C 78 -250 114 -250 116 -224 Z',
  ], [-1.3, 0, -1.9], X));
  // a tall plant in the corner by the glass
  s.push(...flat([
    'M 8 0 L 0 -48 L 60 -48 L 52 0 Z',
    'M 30 -48 C 18 -100 -6 -126 -34 -134 C -14 -112 8 -88 30 -48',
    'M 30 -48 C 36 -104 56 -136 90 -150 C 74 -118 54 -90 30 -48',
    'M 30 -48 C 22 -110 28 -150 38 -176 C 50 -146 48 -100 30 -48',
    'M 30 -48 C 8 -86 -2 -104 -8 -118',
  ], [-6.5, 0, -4.4], X));
  // a side table with a vase
  s.push(...flat(['M 0 -52 L 44 -52', 'M 6 -52 L 6 0', 'M 38 -52 L 38 0', 'M 14 -52 C 10 -66 14 -76 22 -80 C 30 -76 34 -66 30 -52'], [-5.2, 0, -0.3], X));
  return loc(s);
};

const kitchenStrokes = () => {
  const Z = [0, 0, 1];
  const s = [];
  // the run along the east wall: base, worktop, doors, hood, wall cabinets
  s.push(...flat([
    'M 0 0 L 0 -88 M 620 -88 L 620 0',
    'M -4 -88 L 624 -88 L 624 -95 L -4 -95 Z',
    'M 124 -8 L 124 -82', 'M 248 -8 L 248 -82', 'M 372 -8 L 372 -82', 'M 496 -8 L 496 -82',
    'M 100 -76 L 112 -76', 'M 136 -76 L 148 -76', 'M 360 -76 L 384 -76', 'M 484 -76 L 508 -76',
    'M 0 -150 L 250 -150 L 250 -232 L 0 -232 Z', 'M 125 -150 L 125 -232',
    'M 370 -150 L 620 -150 L 620 -232 L 370 -232 Z', 'M 495 -150 L 495 -232',
    'M 280 -232 L 340 -232 L 340 -178 L 368 -152 L 252 -152 L 280 -178 Z',
  ], [6.94, 0, -3.8], Z));
  // island, with its thick top
  s.push(...flat([
    'M 0 0 L 0 -90 M 300 -90 L 300 0 M 0 0 L 300 0',
    'M -12 -90 L 312 -90 L 312 -98 L -12 -98 Z',
    'M 100 -8 L 100 -84', 'M 200 -8 L 200 -84',
  ], [3.25, 0, -2.9], Z));
  // three stools in front of it
  const stool = (x) => [`M ${x - 20} -72 L ${x + 20} -72`, `M ${x - 18} -72 Q ${x} -62 ${x + 18} -72`, `M ${x - 14} -70 L ${x - 22} 0`, `M ${x + 14} -70 L ${x + 22} 0`, `M ${x - 18} -26 L ${x + 18} -26`];
  s.push(...flat([...stool(60), ...stool(150), ...stool(240)], [2.75, 0, -2.9], Z));
  // pendants over the island
  const pend = (x) => [`M ${x} -320 L ${x} -234`, `M ${x - 22} -210 Q ${x - 22} -234 ${x} -234 Q ${x + 22} -234 ${x + 22} -210 Z`];
  s.push(...flat([...pend(60), ...pend(150), ...pend(240)], [3.7, 0, -2.9], Z));
  return loc(s);
};

const terraceStrokes = () => {
  const s = [];
  const N = [0, 0, -1];
  // two loungers, in profile, facing the sea
  for (const x of [0.2, 1.8]) s.push(...flat(['M 0 -78 L 44 -34 L 196 -34', 'M 6 -84 L 48 -40 L 196 -40', 'M 30 -34 L 30 0', 'M 180 -34 L 180 0'], [x, 0, -5.9], N));
  // an olive tree in a planter at the rail
  s.push(...flat([
    'M 0 0 L 0 -50 L 90 -50 L 90 0 Z',
    'M 44 -50 C 38 -92 52 -120 44 -152',
    'M 44 -152 C 2 -160 -10 -200 20 -216 C 28 -244 72 -246 82 -216 C 114 -204 104 -162 62 -152 Z',
    'M 30 -186 C 44 -176 56 -182 66 -196',
  ], [5.6, 0, -9.7], [1, 0, 0]));
  return loc(s);
};

/* ── The agent (a scale figure, the way architects put people in drawings) ─ */
// 200 × 600 box, feet at y = 600. Two poses share point counts so they morph.
const FIGURE = {
  body: 'M 100 88 C 124 88 136 100 138 122 L 146 330 L 128 334 L 124 596 L 106 596 L 100 392 L 94 596 L 76 596 L 72 334 L 54 330 L 62 122 C 64 100 76 88 100 88',
  head: 'M 100 20 A 32 32 0 1 1 100 84 A 32 32 0 1 1 100 20',
  armDown: 'M 132 124 C 140 180 146 250 150 320',
  armOpen: 'M 132 124 C 170 150 206 176 246 196',
};
export const FIGURE_H = 1.78;
export const FIGURE_AT = L(-4.4, 0, 6.3);

let _v = null;
export const villa = () => {
  if (_v) return _v;
  const ext = exteriorStrokes();
  const sea = seaSideStrokes();
  const fig = (arm) => ['head', 'body', arm].map((k) => sampleStrokes(FIGURE[k], 3)[0]);
  _v = {
    exterior: joinStrokes([...ext, ...sea], 0.18),
    rooms: {
      shell: joinStrokes(shellStrokes(), 0.15),
      living: joinStrokes(livingStrokes(), 0.06),
      kitchen: joinStrokes(kitchenStrokes(), 0.06),
      terrace: joinStrokes(terraceStrokes(), 0.06),
    },
    figure: { down: fig('armDown'), open: fig('armOpen') },
  };
  return _v;
};

/* Room tags and key points, world coordinates. */
export const ROOM = {
  salon: L(-3.2, 0.02, -3.0),
  mutfak: L(5.0, 0.02, 1.2),
  teras: L(2.9, 0.02, -8.9),
  lamp: L(-1.3 + 0.96, 2.2, -1.9),
  door: L((DOOR.x0 + DOOR.x1) / 2, 1.2, G.z1),
  hinge: L(DOOR.x0, 0, G.z1),
};
export const local = L;
