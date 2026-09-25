// Canvas renderer. Light is built in passes: a wide soft bloom, a tight halo,
// then the core stroke — the way an emissive filament actually reads on a
// sensor. All passes are CPU canvas operations; no GPU, so every run matches.

import { clamp, lerp, mulberry } from './math.js';
import { W, H, GIRNE, PARCEL, geo } from './shapes.js';

export const INK = {
  ground: [10, 37, 64],      // Akdeniz Navy #0A2540
  deep: [3, 12, 24],
  core: [240, 246, 252],
  glow: [110, 160, 255],     // cobalt, lifted — the only blue that glows
  gold: [201, 161, 87],      // Champagne #C9A157
  warm: [255, 196, 120],
};
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

let buf = null;
const canvases = () => {
  if (buf) return buf;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  buf = { glow: mk(W / 2, H / 2), grain: [] };
  // four fixed grain tiles, chosen per frame by a hash — film grain that is
  // identical on every render
  for (let g = 0; g < 4; g++) {
    const c = mk(256, 256);
    const x = c.getContext('2d');
    const img = x.createImageData(256, 256);
    const r = mulberry(1000 + g);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.floor(r() * 255);
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    buf.grain.push(c);
  }
  return buf;
};

/* Project a shape; return runs of 2D points grouped for stroking. */
const projectShape = (line, project, focusZ) => {
  const out = [];
  const { p, a } = line.shape;
  for (let i = 0; i < p.length; i++) {
    if (line.space === 'screen') { out.push({ x: p[i][0], y: p[i][1], z: 1, a: a[i], g: line.gold ? line.gold[i] : 0 }); continue; }
    const r = project(p[i]);
    out.push(r ? { x: r[0], y: r[1], z: r[2] / focusZ, a: a[i], g: line.gold ? line.gold[i] : 0 } : null);
  }
  return out;
};

/* Stroke a projected polyline with per-vertex alpha, batched by alpha level. */
const strokeRuns = (ctx, pts, color, width, scale = 1, depthWidth = true, goldColor = null, goldAmt = 0) => {
  const LEVELS = 12;
  const buckets = new Map();
  for (let i = 1; i < pts.length; i++) {
    const A = pts[i - 1], B = pts[i];
    if (!A || !B) continue;
    const al = Math.min(A.a, B.a);
    if (al < 0.01) continue;
    const zf = depthWidth ? clamp(1 / Math.sqrt(Math.max(A.z, 0.05)), 0.45, 1.8) : 1;
    const gold = goldColor && goldAmt > 0 && (A.g > 0.5 || B.g > 0.5) ? 1 : 0;
    const key = `${Math.round(al * LEVELS)}|${Math.round(zf * 4)}|${gold}`;
    if (!buckets.has(key)) buckets.set(key, { al: Math.round(al * LEVELS) / LEVELS, zf: Math.round(zf * 4) / 4, gold, path: new Path2D() });
    const b = buckets.get(key);
    b.path.moveTo(A.x * scale, A.y * scale);
    b.path.lineTo(B.x * scale, B.y * scale);
  }
  for (const b of buckets.values()) {
    const c = b.gold ? mix(color, goldColor, goldAmt) : color;
    ctx.strokeStyle = rgba(c, b.al);
    ctx.lineWidth = width * b.zf * scale;
    ctx.stroke(b.path);
  }
};

const graticule = (ctx, s) => {
  if (s.graticule <= 0) return;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(INK.glow, 0.10 * s.graticule);
  ctx.setLineDash([2, 10]);
  const line = (a, b) => {
    const steps = 24;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const q = s.project([lerp(a[0], b[0], i / steps), 0, lerp(a[2], b[2], i / steps)]);
      if (!q) { started = false; continue; }
      if (!started) { ctx.moveTo(q[0], q[1]); started = true; } else ctx.lineTo(q[0], q[1]);
    }
    ctx.stroke();
  };
  for (let lon = 32.0; lon <= 34.75; lon += 0.25) line(geo(lon, 34.4), geo(lon, 35.9));
  for (let lat = 34.5; lat <= 35.75; lat += 0.25) line(geo(31.8, lat), geo(34.8, lat));
  ctx.restore();
};

const divider = (ctx, s) => {
  if (!s.dividerLines || s.divider <= 0) return;
  ctx.save();
  ctx.lineWidth = 1.4;
  ctx.setLineDash([3, 7]);
  ctx.strokeStyle = rgba(INK.core, 0.34 * s.divider);
  for (const l of s.dividerLines) {
    ctx.beginPath();
    l.forEach((q, i) => { const r = s.project(q); if (!r) return; if (i === 0) ctx.moveTo(r[0], r[1]); else ctx.lineTo(r[0], r[1]); });
    ctx.stroke();
  }
  ctx.restore();
};

const spark = (ctx, x, y, k = 1, color = INK.glow) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, 90 * k);
  g.addColorStop(0, rgba([255, 255, 255], 0.95));
  g.addColorStop(0.08, rgba(mix(color, [255, 255, 255], 0.5), 0.55));
  g.addColorStop(0.35, rgba(color, 0.14));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - 90 * k, y - 90 * k, 180 * k, 180 * k);
  // a thin horizontal flare, like a lens catching a point of light
  const fl = ctx.createLinearGradient(x - 140 * k, y, x + 140 * k, y);
  fl.addColorStop(0, rgba(color, 0));
  fl.addColorStop(0.5, rgba([255, 255, 255], 0.45));
  fl.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = fl;
  ctx.fillRect(x - 140 * k, y - 0.75, 280 * k, 1.5);
};

const pins = (ctx, s) => {
  if (!s.pins) return;
  for (const p of s.pins) {
    if (!p.visible) continue;
    const r = s.project(p.p);
    if (!r) continue;
    const [x, y] = r;
    p.screen = [x, y];
    // the drop: a short streak of light falling onto the city
    if (p.fall < 1) {
      const y0 = y - 220 * (1 - p.fall) - 60;
      const gr = ctx.createLinearGradient(x, y0 - 90, x, y0);
      gr.addColorStop(0, rgba(INK.glow, 0));
      gr.addColorStop(1, rgba(INK.core, 0.9 * p.alpha));
      ctx.strokeStyle = gr; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y0 - 90); ctx.lineTo(x, y0); ctx.stroke();
    } else {
      // landed: a ring spreads on the ground like a drop on water
      if (p.ripple > 0 && p.ripple < 1) {
        for (const k of [0, 0.35]) {
          const t = clamp(p.ripple - k);
          if (t <= 0) continue;
          ctx.strokeStyle = rgba(INK.glow, (1 - t) * 0.6 * p.alpha);
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(x, y, 8 + t * 70, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.fillStyle = rgba(INK.core, p.alpha);
      ctx.beginPath(); ctx.arc(x, y, p.isGirne ? 4.5 : 3.5, 0, Math.PI * 2); ctx.fill();
      if (p.isGirne) spark(ctx, x, y, 0.7);
    }
  }
};

export const drawFrame = (ctx, s) => {
  const { glow, grain } = canvases();
  const focusZ = s.cam.dist;

  /* Ground: navy, deepening to the corners. */
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'none';
  const bg = ctx.createRadialGradient(W / 2, H * 0.47, 60, W / 2, H * 0.5, H * 0.75);
  bg.addColorStop(0, rgba(mix(INK.ground, [22, 58, 96], 0.55), 1));
  bg.addColorStop(0.55, rgba(INK.ground, 1));
  bg.addColorStop(1, rgba(INK.deep, 1));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // warm grade when the lamp is on
  if (s.warm > 0 && s.lamp) {
    const wg = ctx.createRadialGradient(s.lamp.x, s.lamp.y, 0, s.lamp.x, s.lamp.y, 900);
    wg.addColorStop(0, rgba(INK.warm, 0.34 * s.warm));
    wg.addColorStop(0.35, rgba(INK.gold, 0.12 * s.warm));
    wg.addColorStop(1, rgba(INK.gold, 0));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }

  graticule(ctx, s);
  divider(ctx, s);

  /* Collect every visible stroke once. */
  const runs = s.lines.map((l) => ({ l, pts: projectShape(l, s.project, focusZ) }));
  const ghostRuns = s.ghosts.map((g) => g.pts.map((q) => { const r = s.project(q); return r ? { x: r[0], y: r[1], z: 1, a: g.alpha } : null; }));

  /* Bloom pass at half resolution. */
  const gx = glow.getContext('2d');
  gx.globalCompositeOperation = 'source-over';
  gx.clearRect(0, 0, glow.width, glow.height);
  gx.lineCap = 'round'; gx.lineJoin = 'round';
  for (const { l, pts } of runs) {
    const col = l.warm ? mix(INK.glow, INK.warm, l.warm * 0.8) : INK.glow;
    strokeRuns(gx, pts, col, l.width * 2.6, 0.5, l.space === 'world', INK.gold, l.goldAmount || 0);
  }
  for (const pts of ghostRuns) strokeRuns(gx, pts, INK.glow, 5, 0.5, false);

  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'blur(26px)';
  ctx.globalAlpha = 0.55 + s.flash * 1.1;
  ctx.drawImage(glow, 0, 0, W, H);
  ctx.filter = 'blur(6px)';
  ctx.globalAlpha = 0.5;
  ctx.drawImage(glow, 0, 0, W, H);
  ctx.filter = 'none';
  ctx.globalAlpha = 1;

  /* Core strokes. */
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const pts of ghostRuns) strokeRuns(ctx, pts, mix(INK.core, INK.glow, 0.5), 1.1, 1, false);
  for (const { l, pts } of runs) {
    const col = l.warm ? mix(INK.core, [255, 236, 206], l.warm) : INK.core;
    strokeRuns(ctx, pts, col, l.width * 0.78, 1, l.space === 'world', [255, 222, 160], l.goldAmount || 0);
  }

  /* Pen heads. */
  for (const { l } of runs) {
    if (!l.spark) continue;
    const r = l.space === 'world' ? s.project(l.spark) : l.spark;
    if (r) spark(ctx, r[0], r[1], 1, l.warm ? INK.warm : INK.glow);
  }
  pins(ctx, s);
  if (s.lamp && s.warm > 0) spark(ctx, s.lamp.x, s.lamp.y + 30, 1.6 * s.warm, INK.warm);

  /* Snap flash. */
  if (s.flash > 0) {
    ctx.fillStyle = rgba(mix(INK.glow, [255, 255, 255], 0.4), 0.10 * s.flash);
    ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = 'source-over';

  /* Vignette. */
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(1,6,14,0.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  /* Grain. */
  const tile = grain[s.frame % 4];
  const r = mulberry(s.frame * 31 + 7);
  const ox = Math.floor(r() * 256), oy = Math.floor(r() * 256);
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.07;
  for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  return { pins: s.pins };
};

/* Screen positions of the parcel's edges, for the dimension labels (DOM). */
export const parcelDims = (s) => PARCEL.map((A, i) => {
  const B = PARCEL[(i + 1) % PARCEL.length];
  const len = Math.hypot(B[0] - A[0], B[2] - A[2]);
  const mid = [(A[0] + B[0]) / 2, 0, (A[2] + B[2]) / 2];
  // push the label outward from the parcel's centre
  const c = [GIRNE[0] + 0.9, 0, GIRNE[2] - 0.4];
  const out = [mid[0] - c[0], 0, mid[2] - c[2]];
  const ol = Math.hypot(out[0], out[2]) || 1;
  const q = s.project([mid[0] + (out[0] / ol) * 3.2, 0, mid[2] + (out[2] / ol) * 3.2]);
  const a = s.project(A), b = s.project(B);
  return q && a && b ? { x: q[0], y: q[1], len, angle: Math.atan2(b[1] - a[1], b[0] - a[0]) } : null;
}).filter(Boolean);
