// Stroke builders for 3D line drawings: boxes with face data (so hidden edges
// can be drawn the way an architect draws them — faint, not absent), circles,
// densified polylines, and joined drawings that remember which stroke every
// vertex belongs to.

import { v3 } from './math.js';

/** A stroke: points, optional faces [{n, c}] for hidden-line tests. */
export const S = (pts, faces = null, tag = null) => ({ pts, faces, tag });

export const densify = (pts, step) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const A = pts[i], B = pts[i + 1];
    const n = Math.max(1, Math.ceil(v3.len(v3.sub(B, A)) / step));
    for (let k = 0; k < n; k++) out.push(v3.lerp(A, B, k / n));
  }
  out.push(pts[pts.length - 1]);
  return out;
};

/** Twelve edges of an axis-aligned box, each tagged with its two faces. */
export const box = ([x0, y0, z0], [x1, y1, z1], opts = {}) => {
  const c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
  const F = {
    px: { n: [1, 0, 0], c: [x1, c[1], c[2]] }, nx: { n: [-1, 0, 0], c: [x0, c[1], c[2]] },
    py: { n: [0, 1, 0], c: [c[0], y1, c[2]] }, ny: { n: [0, -1, 0], c: [c[0], y0, c[2]] },
    pz: { n: [0, 0, 1], c: [c[0], c[1], z1] }, nz: { n: [0, 0, -1], c: [c[0], c[1], z0] },
  };
  const P = (x, y, z) => [x ? x1 : x0, y ? y1 : y0, z ? z1 : z0];
  const e = (a, b, f1, f2) => S([P(...a), P(...b)], [F[f1], F[f2]], opts.tag);
  const edges = [
    // bottom ring
    e([0, 0, 1], [1, 0, 1], 'ny', 'pz'), e([1, 0, 1], [1, 0, 0], 'ny', 'px'),
    e([1, 0, 0], [0, 0, 0], 'ny', 'nz'), e([0, 0, 0], [0, 0, 1], 'ny', 'nx'),
    // verticals
    e([0, 0, 1], [0, 1, 1], 'nx', 'pz'), e([1, 0, 1], [1, 1, 1], 'px', 'pz'),
    e([1, 0, 0], [1, 1, 0], 'px', 'nz'), e([0, 0, 0], [0, 1, 0], 'nx', 'nz'),
    // top ring
    e([0, 1, 1], [1, 1, 1], 'py', 'pz'), e([1, 1, 1], [1, 1, 0], 'py', 'px'),
    e([1, 1, 0], [0, 1, 0], 'py', 'nz'), e([0, 1, 0], [0, 1, 1], 'py', 'nx'),
  ];
  return opts.skipBottom ? edges.slice(4) : edges;
};

/** Circle in a plane: axis 'y' lies flat, 'z' faces the camera along z. */
export const circle = (c, r, axis = 'y', n = 48, from = 0, to = Math.PI * 2) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = from + ((to - from) * i) / n;
    const a = Math.cos(t) * r, b = Math.sin(t) * r;
    pts.push(axis === 'y' ? [c[0] + a, c[1], c[2] + b] : axis === 'z' ? [c[0] + a, c[1] + b, c[2]] : [c[0], c[1] + b, c[2] + a]);
  }
  return S(pts);
};

export const rectXY = (x0, y0, x1, y1, z) => S([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [x0, y0, z]]);
export const rectXZ = (x0, z0, x1, z1, y = 0) => S([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [x0, y, z0]]);
export const rectZY = (z0, y0, z1, y1, x) => S([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0], [x, y0, z0]]);
export const seg3 = (a, b, tag) => S([a, b], null, tag);

export const offset = (strokes, o) => strokes.map((s) => ({ ...s, pts: s.pts.map((q) => v3.add(q, o)), faces: s.faces ? s.faces.map((f) => ({ n: f.n, c: v3.add(f.c, o) })) : null }));

/**
 * Join strokes into one drawable polyline with pen lifts. Keeps, per vertex,
 * the index of the stroke it came from (−1 on a lift) so per-frame effects —
 * hidden-line fading, tagging — can be applied without re-building.
 */
export const joinStrokes = (strokes, step = 0.25) => {
  const p = [], a = [], sid = [];
  strokes.forEach((s, i) => {
    const d = densify(s.pts, step);
    if (p.length) { p.push(p[p.length - 1]); a.push(0); sid.push(-1); p.push(d[0]); a.push(0); sid.push(-1); }
    d.forEach((q) => { p.push(q); a.push(1); sid.push(i); });
  });
  // cumulative length for timing the pen (lifts count a little so jumps take a beat)
  const len = [0];
  for (let i = 1; i < p.length; i++) len.push(len[i - 1] + v3.len(v3.sub(p[i], p[i - 1])) * (sid[i] < 0 ? 0.08 : 1));
  const total = len[len.length - 1] || 1;
  return { p, a, sid, u: len.map((l) => l / total), strokes };
};

/** Hidden-line factor per stroke for a camera position: 1 visible, `faint` hidden. */
export const strokeVisibility = (strokes, camPos, faint = 0.16) => strokes.map((s) => {
  if (!s.faces) return 1;
  return s.faces.some((f) => v3.dot(f.n, v3.sub(camPos, f.c)) > 0) ? 1 : faint;
});
