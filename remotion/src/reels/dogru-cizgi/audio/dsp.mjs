// Small deterministic DSP kit for the "Doğru Çizgi" score. No samples, no
// libraries: every sound is synthesised here, so the soundtrack is as
// reproducible (and as licence-free) as the picture.

export const SR = 48000;

export const mulberry = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const db = (d) => 10 ** (d / 20);

/* A stereo bus. */
export const makeBus = (n) => ({ L: new Float32Array(n), R: new Float32Array(n) });

/* Write a mono voice into a bus with equal-power panning.
   fn(t, i) returns the sample; pan may be a number or a function of t. */
export const write = (bus, t0, dur, pan, gain, fn) => {
  const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
  const len = bus.L.length;
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k < 0 || k >= len) continue;
    const t = i / SR;
    const v = fn(t, i) * gain;
    if (v === 0) continue;
    const p = typeof pan === 'function' ? pan(t) : pan;
    const a = ((clamp(p, -1, 1) + 1) * Math.PI) / 4;
    bus.L[k] += v * Math.cos(a);
    bus.R[k] += v * Math.sin(a);
  }
};

/* Attack / hold / exponential-decay envelope, and a linear-segment one. */
export const env = (t, a, d, sustain = 0, rel = 0, dur = Infinity) => {
  let v = t < a ? t / a : sustain + (1 - sustain) * Math.exp(-(t - a) / d);
  if (t > dur) v *= Math.max(0, 1 - (t - dur) / Math.max(rel, 1e-4));
  return v;
};
export const ramp = (t, pts) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t < pts[i][0]) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; return v0 + (v1 - v0) * smooth((t - t0) / (t1 - t0)); }
  return pts[pts.length - 1][1];
};

/* RBJ biquad, coefficients refreshable per sample block. */
export class Biquad {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set('lp', 1000, 0.707); }
  set(type, f, q = 0.707, gainDb = 0) {
    const w = (2 * Math.PI * clamp(f, 10, SR * 0.45)) / SR, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (type === 'bp') { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (type === 'shelf') {
      // high shelf (RBJ), S = 1
      const A = 10 ** (gainDb / 40), sq = 2 * Math.sqrt(A) * (s / 2) * Math.SQRT2;
      b0 = A * ((A + 1) + (A - 1) * c + sq); b1 = -2 * A * ((A - 1) + (A + 1) * c); b2 = A * ((A + 1) + (A - 1) * c - sq);
      a0 = (A + 1) - (A - 1) * c + sq; a1 = 2 * ((A - 1) - (A + 1) * c); a2 = (A + 1) - (A - 1) * c - sq;
    }
    else { const A = 10 ** (gainDb / 40); b0 = 1 + al * A; b1 = -2 * c; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * c; a2 = 1 - al / A; }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0;
    return this;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

/* Freeverb (Jezar), stereo. */
class Comb { constructor(n) { this.b = new Float32Array(n); this.i = 0; this.f = 0; } run(x, fb, damp) { const o = this.b[this.i]; this.f = o * (1 - damp) + this.f * damp; this.b[this.i] = x + this.f * fb; this.i = (this.i + 1) % this.b.length; return o; } }
class AP { constructor(n) { this.b = new Float32Array(n); this.i = 0; } run(x) { const o = this.b[this.i]; const y = -x + o; this.b[this.i] = x + o * 0.5; this.i = (this.i + 1) % this.b.length; return y; } }
export const reverb = (bus, { room = 0.86, damp = 0.35, width = 1, pre = 0.02 } = {}) => {
  const k = SR / 44100;
  const C = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], A = [556, 441, 341, 225];
  const mk = (sp) => ({ c: C.map((n) => new Comb(Math.round((n + sp) * k))), a: A.map((n) => new AP(Math.round((n + sp) * k))) });
  const l = mk(0), r = mk(23);
  const n = bus.L.length, out = makeBus(n), pd = Math.round(pre * SR);
  const fb = room * 0.28 + 0.7;
  for (let i = 0; i < n; i++) {
    const j = i - pd;
    const x = j >= 0 ? (bus.L[j] + bus.R[j]) * 0.015 : 0;
    let yl = 0, yr = 0;
    for (const c of l.c) yl += c.run(x, fb, damp);
    for (const c of r.c) yr += c.run(x, fb, damp);
    for (const a of l.a) yl = a.run(yl);
    for (const a of r.a) yr = a.run(yr);
    out.L[i] = yl * (0.5 + width / 2) + yr * (0.5 - width / 2);
    out.R[i] = yr * (0.5 + width / 2) + yl * (0.5 - width / 2);
  }
  return out;
};

/* A stereo feedback delay (ping-pong). */
export const delay = (bus, time, fb = 0.35, mix = 0.3, lp = 4000) => {
  const n = bus.L.length, d = Math.round(time * SR), out = makeBus(n);
  const fl = new Biquad().set('lp', lp), fr = new Biquad().set('lp', lp);
  for (let i = 0; i < n; i++) {
    const dl = i >= d ? out.R[i - d] : 0, dr = i >= d ? out.L[i - d] : 0;
    out.L[i] = fl.run(bus.L[i] * mix + dl * fb);
    out.R[i] = fr.run(bus.R[i] * mix + dr * fb);
  }
  return out;
};

export const mixInto = (dst, src, g = 1) => { for (let i = 0; i < dst.L.length; i++) { dst.L[i] += src.L[i] * g; dst.R[i] += src.R[i] * g; } };

/* 32-bit float WAV writer. */
export const wav = (bus, n) => {
  const data = Buffer.alloc(n * 8);
  for (let i = 0; i < n; i++) { data.writeFloatLE(bus.L[i], i * 8); data.writeFloatLE(bus.R[i], i * 8 + 4); }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
};
