// Renderer. Lines are light, so they are accumulated additively on black
// layers and composited over the ground:
//   · motion blur — several sub-frame states inside a 180° shutter, summed
//   · depth of field — three layers by circle of confusion, blurred apart
//   · bloom — a half-resolution copy of all light, blurred wide and tight
// Everything is CPU canvas; no GPU, so every run gives the same pixels.

import { clamp, lerp, mulberry } from './math.js';
import { W, H, geo } from './shapes.js';
import { pinGlyph } from './graphics.js';

export const INK = {
  ground: [10, 37, 64],      // Akdeniz Navy #0A2540
  deep: [3, 12, 24],
  core: [236, 244, 252],
  glow: [110, 160, 255],     // cobalt, lifted — the only blue that glows
  gold: [201, 161, 87],      // Champagne #C9A157
  goldHot: [255, 222, 160],
  warm: [255, 190, 118],
  ok: [96, 206, 150],        // Success #2D8B5C, lifted to read as light
};
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

let buf = null;
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const canvases = () => {
  if (buf) return buf;
  buf = { layers: [mk(W, H), mk(W, H), mk(W, H)], glow: mk(W / 2, H / 2), grain: [] };
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

/* ── Lines into layers ─────────────────────────────────────────────────── */
const LEVELS = 10;
const drawLines = (layers, s, weight) => {
  const focus = s.cam.dist;
  for (const l of s.lines) {
    const { p, a } = l.shape;
    const pts = new Array(p.length);
    for (let i = 0; i < p.length; i++) {
      const near = a[i] > 0.004 || (i > 0 && a[i - 1] > 0.004) || (i < p.length - 1 && a[i + 1] > 0.004);
      if (!near) { pts[i] = null; continue; }
      pts[i] = l.space === 'screen' ? [p[i][0], p[i][1], focus] : s.project(p[i]);
    }
    // buckets: layer × alpha level × width level × colour class
    const buckets = new Map();
    for (let i = 1; i < pts.length; i++) {
      const A = pts[i - 1], B = pts[i];
      if (!A || !B) continue;
      let al = Math.min(a[i - 1], a[i]);
      if (al < 0.01) continue;
      const z = (A[2] + B[2]) / 2;
      let layer = 0, wz = 1, fade = 1;
      if (l.tilt) {
        // tilt-shift: a band of focus through the middle of the frame
        const dy = Math.abs((A[1] + B[1]) / 2 - H * 0.52) / H;
        layer = dy < 0.16 ? 0 : dy < 0.3 ? 1 : 2;
      } else if (l.space === 'world' && !l.depthFree) {
        const coc = Math.abs(1 - focus / z);
        layer = coc < 0.45 ? 0 : coc < 0.85 ? 1 : 2;
        wz = clamp(Math.sqrt(focus / z), 0.55, 1.7);
      }
      // lines about to pass through the lens dissolve instead of smearing
      if (l.nearFade && l.space === 'world') fade = clamp((Math.min(A[2], B[2]) - l.nearFade) / l.nearFade);
      al *= fade;
      if (al < 0.01) continue;
      const gold = l.gold && (l.gold[i] > 0.5 || l.gold[i - 1] > 0.5) ? 1 : 0;
      const key = `${layer}|${Math.round(al * LEVELS)}|${Math.round(wz * 5)}|${gold}`;
      let b = buckets.get(key);
      if (!b) { b = { layer, al: Math.round(al * LEVELS) / LEVELS, wz: Math.round(wz * 5) / 5, gold, path: new Path2D() }; buckets.set(key, b); }
      b.path.moveTo(A[0], A[1]);
      b.path.lineTo(B[0], B[1]);
    }
    const base = l.warm ? mix(INK.core, [255, 232, 200], l.warm) : INK.core;
    const clipQuads = l.clip ? l.clip.map((q) => q.map((c) => s.project(c))).filter((q) => q.every(Boolean)) : null;
    for (const b of buckets.values()) {
      const ctx = layers[b.layer].getContext('2d');
      ctx.save();
      if (clipQuads) {
        const cp = new Path2D();
        clipQuads.forEach((q) => { cp.moveTo(q[0][0], q[0][1]); q.slice(1).forEach((c) => cp.lineTo(c[0], c[1])); cp.closePath(); });
        ctx.clip(cp);
      }
      const col = b.gold ? mix(base, INK.goldHot, l.goldAmount ?? 1) : base;
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = rgba(col, b.al * weight);
      ctx.lineWidth = l.width * 0.8 * b.wz;
      ctx.stroke(b.path);
      ctx.restore();
    }
  }
};

/* ── Pins and listing markers (into the sharp layer, so they bloom) ────── */
const glyph = (ctx, pts, x, y, sc, col, a, w = 2) => {
  ctx.strokeStyle = rgba(col, a);
  ctx.lineWidth = w;
  ctx.beginPath();
  pts.forEach(([px, py], i) => { const X = x + px * sc, Y = y + py * sc; if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); });
  ctx.stroke();
};

const drawPins = (ctx, s) => {
  const G = pinGlyph();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const p of s.pins) {
    const r = s.project(p.p);
    if (!r) continue;
    const [x, y] = r;
    if (p.ripple > 0 && p.ripple < 1) {
      for (const k of [0, 0.3]) {
        const t = clamp(p.ripple - k);
        if (t <= 0) continue;
        ctx.strokeStyle = rgba(INK.glow, (1 - t) * 0.7 * p.a);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(x, y, 6 + t * 64, (6 + t * 64) * 0.9, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
    const sc = p.isG ? 0.95 + 0.35 * p.lift : 0.8;
    const yy = y - (1 - p.drop) * 150;
    const col = p.isG ? mix(INK.core, INK.goldHot, p.lift) : INK.core;
    glyph(ctx, G.body, x, yy, sc, col, p.a * p.drop);
    glyph(ctx, G.dot, x, yy, sc, col, p.a * p.drop, 1.6);
  }
  for (const m of s.markers) {
    const r = s.project(m.p);
    if (!r) continue;
    const sc = 0.9 * m.pop * m.grow;
    if (sc <= 0.01) continue;
    const col = m.chosen ? mix(INK.core, INK.goldHot, 0.35) : INK.core;
    glyph(ctx, G.body, r[0], r[1], sc, col, m.a, m.chosen ? 2.4 : 1.8);
    if (m.chosen && m.check > 0) {
      const n = Math.max(2, Math.round(G.check.length * m.check));
      glyph(ctx, G.check.slice(0, n), r[0], r[1], sc, INK.ok, m.a, 2.6);
    } else glyph(ctx, G.dot, r[0], r[1], sc, col, m.a, 1.4);
  }
  for (const ring of s.rings) {
    for (const [k, al] of [[1, 1], [0.965, 0.45], [0.93, 0.2]]) {
      ctx.strokeStyle = rgba(INK.glow, ring.a * al);
      ctx.lineWidth = 2;
      ctx.beginPath();
      let st = false;
      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * Math.PI * 2;
        const q = s.project([ring.c[0] + Math.cos(t) * ring.r * k, 0, ring.c[2] + Math.sin(t) * ring.r * k]);
        if (!q) { st = false; continue; }
        if (!st) { ctx.moveTo(q[0], q[1]); st = true; } else ctx.lineTo(q[0], q[1]);
      }
      ctx.stroke();
    }
  }
};

/* ── Ground-plane cartography, drawn once from the centre sub-frame ─────── */
const cartography = (ctx, s) => {
  if (s.graticule > 0) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(INK.glow, 0.13 * s.graticule);
    ctx.setLineDash([2, 9]);
    const line = (a, b) => {
      ctx.beginPath();
      let st = false;
      for (let i = 0; i <= 24; i++) {
        const q = s.project([lerp(a[0], b[0], i / 24), 0, lerp(a[2], b[2], i / 24)]);
        if (!q) { st = false; continue; }
        if (!st) { ctx.moveTo(q[0], q[1]); st = true; } else ctx.lineTo(q[0], q[1]);
      }
      ctx.stroke();
    };
    for (let lon = 32.0; lon <= 34.75; lon += 0.25) line(geo(lon, 34.4), geo(lon, 35.9));
    for (let lat = 34.5; lat <= 35.75; lat += 0.25) line(geo(31.8, lat), geo(34.8, lat));
    ctx.restore();
  }
  if (s.dividerLines && s.divider > 0) {
    ctx.save();
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 7]);
    ctx.strokeStyle = rgba(INK.core, 0.36 * s.divider);
    for (const l of s.dividerLines) {
      ctx.beginPath();
      l.forEach((q, i) => { const r = s.project(q); if (!r) return; if (i === 0) ctx.moveTo(r[0], r[1]); else ctx.lineTo(r[0], r[1]); });
      ctx.stroke();
    }
    ctx.restore();
  }
};

const spark = (ctx, x, y, k = 1, color = INK.glow) => {
  if (k <= 0.01) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, 90 * k);
  g.addColorStop(0, rgba([255, 255, 255], 0.95));
  g.addColorStop(0.08, rgba(mix(color, [255, 255, 255], 0.5), 0.5));
  g.addColorStop(0.35, rgba(color, 0.12));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - 90 * k, y - 90 * k, 180 * k, 180 * k);
  const fl = ctx.createLinearGradient(x - 150 * k, y, x + 150 * k, y);
  fl.addColorStop(0, rgba(color, 0));
  fl.addColorStop(0.5, rgba([255, 255, 255], 0.4));
  fl.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = fl;
  ctx.fillRect(x - 150 * k, y - 0.75, 300 * k, 1.5);
};

/* ── Frame ─────────────────────────────────────────────────────────────── */
export const SHUTTER = [-0.25, -0.083, 0.083, 0.25];
export const SHUTTER_FAST = Array.from({ length: 12 }, (_, i) => -0.25 + (0.5 * i) / 11);

export const drawFrame = (ctx, stateAt, frame, still = false, pre = null, fast = false) => {
  const { layers, glow, grain } = canvases();
  const s = pre || stateAt(frame);
  const subs = still ? [s] : (fast ? SHUTTER_FAST : SHUTTER).map((o) => stateAt(frame + o));

  for (const L of layers) { const c = L.getContext('2d'); c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H); }
  subs.forEach((st) => drawLines(layers, st, 1 / subs.length));
  drawPins(layers[0].getContext('2d'), s);

  /* Ground. */
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  const bg = ctx.createRadialGradient(W / 2, H * 0.47, 60, W / 2, H * 0.5, H * 0.75);
  bg.addColorStop(0, rgba(mix(INK.ground, [22, 58, 96], 0.55), 1));
  bg.addColorStop(0.55, rgba(INK.ground, 1));
  bg.addColorStop(1, rgba(INK.deep, 1));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Sunset: the only time the ground itself takes colour. */
  if (s.sky > 0 && s.sun) {
    const sp = s.project(s.sun);
    const sy = sp ? sp[1] : H / 2, sx = sp ? sp[0] : W * 0.7;
    ctx.globalCompositeOperation = 'lighter';
    const band = ctx.createLinearGradient(0, sy - 760, 0, sy + 420);
    band.addColorStop(0, rgba(INK.warm, 0));
    band.addColorStop(0.62, rgba(INK.warm, 0.2 * s.sky));
    band.addColorStop(0.66, rgba(INK.gold, 0.1 * s.sky));
    band.addColorStop(1, rgba(INK.gold, 0));
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, W, H);
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 620);
    sg.addColorStop(0, rgba(INK.warm, 0.34 * s.sky));
    sg.addColorStop(1, rgba(INK.warm, 0));
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
  if (s.warm > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const wg = ctx.createRadialGradient(W / 2, H * 0.44, 0, W / 2, H * 0.44, 900);
    wg.addColorStop(0, rgba(INK.warm, 0.3 * s.warm));
    wg.addColorStop(1, rgba(INK.warm, 0));
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }

  cartography(ctx, s);

  /* Bloom from all the light. */
  const gx = glow.getContext('2d');
  gx.globalCompositeOperation = 'source-over';
  gx.filter = 'none';
  gx.clearRect(0, 0, glow.width, glow.height);
  gx.globalCompositeOperation = 'lighter';
  for (const L of layers) gx.drawImage(L, 0, 0, glow.width, glow.height);

  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'blur(28px)';
  ctx.globalAlpha = Math.min(1, 0.9 + s.flash * 1.4);
  ctx.drawImage(glow, 0, 0, W, H);
  if (s.flash > 0.3) ctx.drawImage(glow, 0, 0, W, H);
  ctx.filter = 'blur(7px)';
  ctx.globalAlpha = 0.75;
  ctx.drawImage(glow, 0, 0, W, H);

  /* Depth of field, far to near. */
  ctx.globalAlpha = 1;
  ctx.filter = 'blur(5px)';
  ctx.drawImage(layers[2], 0, 0);
  ctx.filter = 'blur(1.8px)';
  ctx.drawImage(layers[1], 0, 0);
  ctx.filter = 'none';
  ctx.drawImage(layers[0], 0, 0);

  /* Pen heads. */
  for (const l of s.lines) {
    if (!l.spark) continue;
    const r = l.space === 'world' ? s.project(l.spark) : l.spark;
    if (r) spark(ctx, r[0], r[1], 1, l.warm ? INK.warm : INK.glow);
  }
  for (const p of s.pins) if (p.isG && p.lift > 0) { const r = s.project(p.p); if (r) spark(ctx, r[0], r[1] - 40, 0.6 * p.lift * p.a, INK.gold); }
  for (const m of s.markers) if (m.chosen && m.check > 0) { const r = s.project(m.p); if (r) spark(ctx, r[0], r[1] - 40 * m.grow, 0.8 * m.check * m.a, INK.ok); }
  if (s.glint > 0) spark(ctx, 600, 1090, 1.2 * s.glint, INK.gold);
  if (s.lamp && s.lamp.a > 0) {
    const r = s.project(s.lamp.p);
    if (r) {
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(r[0], r[1], 0, r[0], r[1], 700);
      g.addColorStop(0, rgba(INK.warm, 0.3 * s.lamp.a));
      g.addColorStop(0.4, rgba(INK.gold, 0.08 * s.lamp.a));
      g.addColorStop(1, rgba(INK.gold, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      spark(ctx, r[0], r[1], 1.1 * s.lamp.a, INK.warm);
    }
  }

  /* The click: a ring and eight short ticks, like light off a turning lock. */
  if (s.click) {
    const { t, x, y } = s.click;
    ctx.strokeStyle = rgba(INK.goldHot, (1 - t) * 0.9);
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(x, y, 24 + t * 240, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const r0 = 40 + t * 120, r1 = r0 + 26 * (1 - t);
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke();
    }
    spark(ctx, x, y, 1.4 * (1 - t), INK.gold);
  }

  if (s.flash > 0) {
    ctx.fillStyle = rgba(mix(INK.glow, [255, 255, 255], 0.4), 0.1 * s.flash);
    ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = 'source-over';

  /* Vignette and grain. */
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(1,6,14,0.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  const tile = grain[Math.floor(frame) % 4];
  const r = mulberry(Math.floor(frame) * 31 + 7);
  const ox = Math.floor(r() * 256), oy = Math.floor(r() * 256);
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.07;
  for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  return s;
};
