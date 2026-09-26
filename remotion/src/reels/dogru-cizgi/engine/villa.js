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
  // the mass first — the house reads at once — then the garden wall and path
  const firstMass = s.filter((st) => st.tag === 'mass'), rest = s.filter((st) => st.tag !== 'mass');
  return loc([...firstMass, ...rest]).map((st, i) => ({ ...st, order: i }));
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
  // terrace edge: a low stone wall onto the garden (no rail across the view)
  s.push(S([[-7.5, 0, -10], [8, 0, -10]]), S([[-7.5, 0.42, -10], [8, 0.42, -10]]), S([[-7.5, 0.42, -10.35], [8, 0.42, -10.35]]));
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
  ], [-5.35, 0, -1.25], X));
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

/* The garden, the cove and the headland: what the agent walks the buyer out to.
   Elevations on planes facing the house, like a landscape architect's drawing. */
const frond = (b, t, c, w) => {
  // a palm frond as a narrow leaf: out along one curve, back along the other
  const [bx, by] = b, [tx, ty] = t, [cx, cy] = c;
  const nx = -(ty - by), ny = tx - bx, l = Math.hypot(nx, ny) || 1;
  const ox = (nx / l) * w, oy = (ny / l) * w;
  return `M ${bx} ${by} Q ${cx + ox} ${cy + oy} ${tx} ${ty} Q ${cx - ox} ${cy - oy} ${bx} ${by}`;
};
const palm = (h, lean, fs = 1) => {
  const top = [lean, -h];
  const d = [`M -15 0 C -12 ${-h * 0.35} ${lean * 0.4 - 8} ${-h * 0.7} ${top[0] - 8} ${top[1]}`, `M 15 0 C 17 ${-h * 0.35} ${lean * 0.4 + 10} ${-h * 0.7} ${top[0] + 8} ${top[1]}`];
  // the ringed trunk
  for (let k = 1; k < 13; k++) {
    const t = k / 13, y = -h * t, x = lean * t * t * 0.9, w = 15 - 7 * t;
    d.push(`M ${x - w} ${y + 3} Q ${x} ${y - 4} ${x + w} ${y + 3}`);
  }
  const [X, Y] = top;
  const F = [[-230, 40, -120, -70], [-190, -70, -90, -110], [-60, -170, -40, -120], [70, -175, 30, -130], [210, -80, 110, -110], [250, 50, 140, -60], [-110, 150, -60, 20], [120, 150, 70, 10]];
  const Fs = F.map((v) => v.map((q) => q * fs));
  for (const [dx, dy, cx, cy] of Fs) d.push(frond([X, Y], [X + dx, Y + dy], [X + cx, Y + cy], 13 * fs));
  // a few fronds carry a midrib
  for (const [dx, dy, cx, cy] of [Fs[0], Fs[4], Fs[5]]) d.push(`M ${X} ${Y} Q ${X + cx} ${Y + cy} ${X + dx} ${Y + dy}`);
  return d;
};
const gardenStrokes = () => {
  const s = [];
  const Xu = [1, 0, 0];
  // palms frame the view to the sea: one each side, a smaller one further out
  s.push(...flat(palm(360, 70, 0.72), [0.75, 0, -14.2], Xu));
  s.push(...flat(palm(320, -60, 0.66), [6.15, 0, -12.6], Xu));
  // shrubs on the wall at the edges of the view
  for (const [x, z, w] of [[1.15, -10.45, 0.9], [4.75, -10.45, 0.8]]) {
    s.push(...flat([`M 0 0 C 0 -36 ${w * 22} -58 ${w * 46} -48 C ${w * 60} -76 ${w * 100} -70 ${w * 108} -40 C ${w * 132} -48 ${w * 150} -20 ${w * 142} 0`], [x, 0.42, z], Xu));
  }
  // the lawn's edge, where the garden falls away to the cove
  s.push(S([[-9, 0, -18], [-3, 0, -18.6], [3, 0, -18.3], [10, 0, -17.6]]));
  // the cove below: shoreline, two lines of surf, a scatter of sand
  const SEA = -32;
  const shore = [], surf1 = [], surf2 = [];
  for (let x = -420; x <= 420; x += 20) {
    const bay = 30 * Math.exp(-(((x - 20) / 160) ** 2));
    shore.push([x, SEA, -250 + bay + 5 * Math.sin(x / 37)]);
    surf1.push([x, SEA, -266 + bay * 0.9 + 4 * Math.sin(x / 23 + 1)]);
    surf2.push([x, SEA, -284 + bay * 0.8 + 5 * Math.sin(x / 29 + 2)]);
  }
  s.push(S(shore, null, 'shore'), S(surf1, null, 'surf'), S(surf2, null, 'surf'));
  for (let i = 0; i < 70; i++) {
    const x = -300 + ((i * 97) % 600), z = -240 + ((i * 53) % 9) * 1.2 + 26 * Math.exp(-(((x - 20) / 160) ** 2));
    s.push(S([[x, SEA, z], [x + 2.2, SEA, z]], null, 'sand'));
  }
  // a headland to the west, going blue with distance
  s.push(S([[-900, SEA, -600], [-760, SEA + 14, -640], [-620, SEA + 40, -700], [-470, SEA + 52, -760], [-360, SEA + 38, -800], [-250, SEA + 10, -850], [-170, SEA, -880]], null, 'headland'));
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
      terrace: joinStrokes(gardenStrokes(), 0.06),
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
  lamp: L(-5.35 + 0.96, 2.2, -1.25),
  door: L((DOOR.x0 + DOOR.x1) / 2, 1.2, G.z1),
  hinge: L(DOOR.x0, 0, G.z1),
};
export const local = L;
