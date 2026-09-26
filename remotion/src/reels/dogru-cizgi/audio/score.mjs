// "Doğru Çizgi" — the score and the sound design, synthesised.
//
//   node src/reels/dogru-cizgi/audio/score.mjs out/dogru-cizgi_score_f32.wav
//
// Every cue is a frame of the film (60 fps) taken from engine/timeline.js;
// F(n) turns a frame into seconds. The piece is written as the picture is
// told: a plucked string, noise that tightens into dissonance, a snap into
// one clear note ("doğru"), a map breathing open, a search that becomes a
// melody, a house drawn in pencil, rooms with their own air, a handshake, a
// key in a lock, and the name. The tail is folded back onto the head, so
// the film loops without a seam in the sound either.

import fs from 'node:fs';
import { SR, mulberry, mtof, clamp, smooth, db, makeBus, write, env, ramp, Biquad, reverb, delay, mixInto, wav } from './dsp.mjs';

const FPS = 60, DUR = 24, TAIL = 7;
const N = (DUR + TAIL) * SR;
const F = (n) => n / FPS;
const rnd = mulberry(20260925);
const TAU = Math.PI * 2;

const music = makeBus(N), sfx = makeBus(N), send = makeBus(N), long = makeBus(N), sub = makeBus(N);
/* sidechain: the music dips under the big moments */
const duck = new Float32Array(N).fill(1);
const duckAt = (t, depth, att = 0.01, rel = 0.6) => {
  const s0 = Math.round((t - att) * SR);
  for (let i = 0; i < (att + rel * 4) * SR; i++) {
    const k = s0 + i; if (k < 0 || k >= N) continue;
    const tt = i / SR;
    const g = tt < att ? 1 - depth * (tt / att) : 1 - depth * Math.exp(-(tt - att) / rel);
    duck[k] = Math.min(duck[k], g);
  }
};
/* write to a bus and to the reverb send together */
const put = (bus, t0, dur, pan, gain, fn, wet = 0.25) => {
  write(bus, t0, dur, pan, gain, fn);
  if (wet > 0) write(send, t0, dur, pan, gain * wet, fn);
};

/* ── Instruments ─────────────────────────────────────────────────────────── */
const noise = () => rnd() * 2 - 1;

/* Piano-like: stretched partials, each decaying at its own rate, and a felt thump. */
const piano = (t0, m, vel = 1, pan = 0, dur = 3.5, bus = music, wet = 0.35) => {
  const f = mtof(m), B = 0.00035;
  const parts = Array.from({ length: 9 }, (_, k) => ({ f: f * (k + 1) * Math.sqrt(1 + B * (k + 1) ** 2), a: 1 / (k + 1) ** 1.25, d: 1 / (0.55 + 0.45 * (k + 1)) * (1 + 24 / f), ph: rnd() * TAU }));
  const hp = new Biquad().set('bp', 900, 0.8);
  put(bus, t0, dur, pan, 0.16 * vel, (t) => {
    let v = 0;
    for (const p of parts) v += p.a * Math.sin(TAU * p.f * t + p.ph) * Math.exp(-t / (p.d * 1.8));
    const att = Math.min(1, t / 0.004);
    return v * att * (t > dur - 0.25 ? (dur - t) / 0.25 : 1) + hp.run(noise()) * Math.exp(-t / 0.012) * 0.25;
  }, wet);
};

/* Bell: inharmonic FM, bright strike, long glassy tail. */
const bell = (t0, m, vel = 1, pan = 0, dur = 5, ratio = 3.5, bus = music, wet = 0.5) => {
  const f = mtof(m);
  put(bus, t0, dur, pan, 0.12 * vel, (t) => {
    const I = 2.2 * Math.exp(-t / 0.35);
    return Math.sin(TAU * f * t + I * Math.sin(TAU * f * ratio * t)) * Math.min(1, t / 0.002) * Math.exp(-t / (dur * 0.28));
  }, wet);
};

/* Glass / marimba: fundamental and a fourth partial, quick. */
const glass = (t0, m, vel = 1, pan = 0, bus = music, wet = 0.45) => {
  const f = mtof(m);
  put(bus, t0, 1.6, pan, 0.14 * vel, (t) => (Math.sin(TAU * f * t) * Math.exp(-t / 0.5) + 0.35 * Math.sin(TAU * f * 4.02 * t) * Math.exp(-t / 0.08)) * Math.min(1, t / 0.0015), wet);
};

/* Plucked string (Karplus–Strong), with a pitch bend for the pluck. */
const pluck = (t0, m, vel = 1, pan = 0, dur = 3, bend = 0, bus = music, bright = 0.5) => {
  const f = mtof(m);
  const n = Math.round(SR / f);
  const buf = new Float32Array(n).map(() => noise());
  let idx = 0, last = 0;
  put(bus, t0, dur, pan, 0.22 * vel, (t) => {
    const y = buf[idx];
    const nx = (idx + 1) % n;
    const v = (buf[idx] + buf[nx]) * 0.5 * (0.9965 + bright * 0.003);
    buf[idx] = v * (1 - bright * 0.2) + last * bright * 0.2; last = v;
    // a bend: read a little faster at first, like a string pulled up to pitch
    idx = (idx + 1 + (bend > 0 && rnd() < bend * Math.exp(-t * 3) ? 1 : 0)) % n;
    return y * (t > dur - 0.3 ? (dur - t) / 0.3 : 1);
  }, 0.3);
};

/* Pad: detuned band-limited saws through a moving low-pass. */
const pad = (t0, t1, notes, { vel = 1, cut0 = 600, cut1 = 2200, att = 1.2, rel = 1.6, pan = 0, detune = 0.09, bus = music, wet = 0.45, bright = 22 } = {}) => {
  const dur = t1 - t0 + rel;
  notes.forEach((m, ni) => {
    for (let v = 0; v < 3; v++) {
      const f = mtof(m + (v - 1) * detune), ph = rnd() * TAU;
      const H = Math.min(bright, Math.floor(9000 / f));
      const lp = new Biquad(); let c = 0;
      const p = pan + (v - 1) * 0.5 + (ni - notes.length / 2) * 0.08;
      put(bus, t0, dur, p, (0.05 * vel) / Math.sqrt(notes.length), (t) => {
        if ((c++ & 31) === 0) lp.set('lp', cut0 + (cut1 - cut0) * smooth(t / (t1 - t0)) + 180 * Math.sin(t * 0.9 + ni), 0.8);
        let s = 0;
        for (let h = 1; h <= H; h++) s += Math.sin(TAU * f * h * t + ph * h) / h;
        const e = t < att ? smooth(t / att) : t > t1 - t0 ? Math.max(0, 1 - (t - (t1 - t0)) / rel) : 1;
        return lp.run(s) * e;
      }, wet);
    }
  });
};

/* Sub impact: a sine dropping in pitch with a transient. */
const boom = (t0, vel = 1, f0 = 62, f1 = 34, dur = 2.2) => {
  let ph = 0;
  write(sub, t0, dur, 0, 0.9 * vel, (t) => { const f = f1 + (f0 - f1) * Math.exp(-t / 0.12); ph += (TAU * f) / SR; return Math.sin(ph) * Math.min(1, t / 0.003) * Math.exp(-t / (dur * 0.3)); });
  const bp = new Biquad().set('bp', 180, 0.7);
  write(sfx, t0, 0.12, 0, 0.6 * vel, (t) => bp.run(noise()) * Math.exp(-t / 0.018));
};

/* Filtered noise gesture: whoosh / riser / swell, with a moving band. */
const whoosh = (t0, dur, { f0 = 300, f1 = 3000, q = 1.2, vel = 1, pan0 = -0.6, pan1 = 0.6, shape = 'arc', type = 'bp', bus = sfx, wet = 0.3 } = {}) => {
  const bq = new Biquad(); let c = 0;
  put(bus, t0, dur, (t) => pan0 + (pan1 - pan0) * (t / dur), 0.5 * vel, (t) => {
    const x = t / dur;
    if ((c++ & 15) === 0) bq.set(type, f0 * (f1 / f0) ** x, q);
    const e = shape === 'rise' ? x ** 2.2 : shape === 'fall' ? (1 - x) ** 2 : Math.sin(Math.PI * x) ** 1.6;
    return bq.run(noise()) * e;
  }, wet);
};

/* A reversed swell — the air breathing in before a hit. */
const suck = (tHit, dur, vel = 1) => {
  const hp = new Biquad().set('hp', 1800, 0.7);
  put(sfx, tHit - dur, dur, 0, 0.35 * vel, (t) => hp.run(noise()) * (t / dur) ** 3, 0.6);
};

/* Ticks, clicks, blips. */
const tick = (t0, f = 2600, vel = 1, pan = 0, len = 0.012, bus = sfx) => write(bus, t0, len * 5, pan, 0.18 * vel, (t) => Math.sin(TAU * f * t) * Math.exp(-t / len));
const click = (t0, vel = 1, pan = 0, f = 3200) => {
  const bp = new Biquad().set('bp', f, 2.2);
  write(sfx, t0, 0.05, pan, 0.5 * vel, (t) => bp.run(noise()) * Math.exp(-t / 0.006));
};

/* Paper: a short crisp flick. */
const paper = (t0, vel = 1, pan = 0) => {
  const bp = new Biquad().set('bp', 2800 + rnd() * 2400, 0.9);
  const len = 0.05 + rnd() * 0.06;
  put(sfx, t0, len * 3, pan, 0.2 * vel, (t) => bp.run(noise()) * Math.sin(Math.PI * clamp(t / len)) ** 0.6 * (1 + 0.6 * Math.sin(t * 900)), 0.2);
};

/* Electrical shorting: gated square bursts, bit-reduced. */
const glitch = (t0, dur, vel = 1, pan = 0) => {
  const bp = new Biquad().set('bp', 1400, 0.8);
  let gate = 0, f = 300, ph = 0;
  write(sfx, t0, dur, pan, 0.16 * vel, (t, i) => {
    if (i % 480 === 0) { gate = rnd() < 0.55 ? 1 : 0; f = 180 + rnd() * 1600; }
    ph += f / SR;
    const sq = (ph % 1) < 0.5 ? 1 : -1;
    return Math.round(bp.run(sq * gate + noise() * 0.3) * 6) / 6 * Math.sin(Math.PI * t / dur);
  });
};

/* Pencil on paper: grains of bright noise. */
const pencil = (t0, dur, vel = 1, pan = 0) => {
  const bp = new Biquad().set('bp', 4200, 0.9), hp = new Biquad().set('hp', 1500);
  let g = 0, gt = 0;
  write(sfx, t0, dur, pan, 0.07 * vel, (t, i) => {
    if (i % 960 === 0) { gt = 0.3 + rnd() * 0.7; }
    g += (gt - g) * 0.002;
    return hp.run(bp.run(noise())) * g * Math.sin(Math.PI * t / dur) ** 0.5 * (0.7 + 0.3 * Math.sin(t * 40 + rnd()));
  });
};

/* Sea: low swell and a hiss of foam, in slow waves. */
const sea = (t0, dur, vel = 1) => {
  const lp = new Biquad().set('lp', 500, 0.6), hp = new Biquad().set('hp', 2500, 0.6);
  const lp2 = new Biquad().set('lp', 500, 0.6), hp2 = new Biquad().set('hp', 2500, 0.6);
  write(long, t0, dur, -0.5, 0.2 * vel, (t) => { const w = 0.5 + 0.5 * Math.sin(TAU * t / 4.2); return (lp.run(noise()) * (0.4 + 0.6 * w) + hp.run(noise()) * 0.3 * w ** 3) * smooth(t / 1.2) * smooth((dur - t) / 1.5); });
  write(long, t0, dur, 0.5, 0.2 * vel, (t) => { const w = 0.5 + 0.5 * Math.sin(TAU * (t + 1.6) / 4.9); return (lp2.run(noise()) * (0.4 + 0.6 * w) + hp2.run(noise()) * 0.3 * w ** 3) * smooth(t / 1.2) * smooth((dur - t) / 1.5); });
};

/* Room tone: a filtered hum of air, per room. */
const room = (t0, dur, f, vel = 1) => {
  const bp = new Biquad().set('bp', f, 0.5);
  write(long, t0, dur, 0, 0.09 * vel, (t) => bp.run(noise()) * smooth(t / 0.5) * smooth((dur - t) / 0.6));
};

/* A door: a soft wooden creak and a latch. */
const door = (t0, vel = 1) => {
  click(t0, 0.5 * vel, -0.2, 1800);
  const bp = new Biquad().set('bp', 520, 6);
  let ph = 0;
  put(sfx, t0 + 0.04, 0.5, -0.1, 0.12 * vel, (t) => { const f = 70 + 40 * t + 8 * Math.sin(t * 90); ph += f / SR; const x = (ph % 1) < 0.08 ? 1 : 0; return bp.run(x + noise() * 0.05) * Math.sin(Math.PI * t / 0.5); }, 0.35);
};

/* Cloth: the rustle of sleeves meeting. */
const cloth = (t0, dur, vel = 1, pan = 0) => {
  const bp = new Biquad().set('bp', 2200, 0.7);
  write(sfx, t0, dur, pan, 0.14 * vel, (t) => bp.run(noise()) * Math.sin(Math.PI * t / dur) * (0.6 + 0.4 * Math.sin(t * 55)));
};

/* The lock: two metal transients and a body. */
const lock = (t0, vel = 1) => {
  const a = new Biquad().set('bp', 3300, 14), b = new Biquad().set('bp', 5200, 18), c = new Biquad().set('bp', 1400, 6);
  put(sfx, t0, 0.35, 0.05, 0.9 * vel, (t) => { const x = t < 0.002 ? noise() : noise() * 0.02; return a.run(x) * 1.2 + b.run(x) * 0.8 + c.run(x) * 0.6 * Math.exp(-t / 0.05); }, 0.4);
  put(sfx, t0 + 0.028, 0.25, -0.05, 0.6 * vel, (t) => { const x = t < 0.0015 ? noise() : 0; return a.run(x) + b.run(x) * 1.1; }, 0.4);
  write(sfx, t0, 0.2, 0, 0.5 * vel, (t) => Math.sin(TAU * 150 * t) * Math.exp(-t / 0.04));
};

/* Rising glass: the agent's line drawing what they show. */
const shimmer = (t0, dur, m0, m1, vel = 1, pan = 0) => {
  let ph = 0, ph2 = 0;
  put(music, t0, dur + 0.8, pan, 0.07 * vel, (t) => {
    const x = clamp(t / dur), f = mtof(m0 + (m1 - m0) * smooth(x));
    ph += f / SR; ph2 += (f * 2.005) / SR;
    const e = Math.min(1, t / 0.05) * (t > dur ? Math.exp(-(t - dur) / 0.25) : 1);
    return (Math.sin(TAU * ph) + 0.4 * Math.sin(TAU * ph2)) * e;
  }, 0.7);
};

/* Ostinato: muted plucks, for the noise act. */
const mute = (t0, m, vel = 1, pan = 0) => {
  const f = mtof(m), lp = new Biquad().set('lp', 900 + vel * 1200, 1.2);
  write(music, t0, 0.25, pan, 0.1 * vel, (t) => { let s = 0; for (let h = 1; h < 8; h++) s += Math.sin(TAU * f * h * t) / h; return lp.run(s) * Math.min(1, t / 0.002) * Math.exp(-t / 0.06); });
};

/* ── The piece ───────────────────────────────────────────────────────────── */
// D major; the noise act sits on D with a flattened second pulling against it.
const D2 = 38, A2 = 45, B2 = 47, D3 = 50, E3 = 52, Fs3 = 54, G3 = 55, A3 = 57, B3 = 59, D4 = 62, E4 = 64, Fs4 = 66, G4 = 67, A4 = 69, B4 = 71, Cs5 = 73, D5 = 74, E5 = 76, Fs5 = 78, A5 = 81, D6 = 86;

/* 0 — the name sinks into its line: a soft inhale, the string drawn tight */
whoosh(F(6), F(20), { f0: 2400, f1: 500, vel: 0.35, shape: 'fall', type: 'bp', pan0: 0, pan1: 0 });
{ let ph = 0; put(music, F(6), F(22), 0, 0.05, (t) => { const f = 110 + 110 * smooth(t / F(20)); ph += f / SR; return Math.sin(TAU * ph) * smooth(t / 0.15); }, 0.3); }

/* 1 — the pluck: a low string, bent up to pitch */
pluck(F(24), D2, 1.0, 0, 3.4, 0.6);
pluck(F(24.5), D3, 0.6, 0.15, 2.6, 0.4);
boom(F(24), 0.35, 80, 42, 1.2);

/* 2 — the cards: flicks of paper as each one forms, a counter rolling up */
for (let i = 0; i < 18; i++) paper(F(32 + rnd() * 30), 0.7 + rnd() * 0.5, (rnd() - 0.5) * 1.6);
whoosh(F(28), F(40), { f0: 600, f1: 5200, vel: 0.5, shape: 'arc', pan0: -0.8, pan1: 0.8 });
for (let f = 52; f < 104; f += 2 + (f - 52) / 18) tick(F(f), 3400 + rnd() * 600, 0.28, 0.6);

/* the tension: a drone on D with E♭ rubbing against it, and a pulse */
pad(F(30), F(212), [D2, D3, 51, A3], { vel: 0.8, cut0: 300, cut1: 1400, att: 1.4, rel: 0.05, bright: 10 });
{
  const pat = [D3, 51, A3, D4, 51, A3, 58, A3];
  for (let s = 0, t = F(40); t < F(206); s++, t += 0.125) {
    const build = smooth((t - F(40)) / (F(206) - F(40)));
    mute(t, pat[s % 8] + (s % 16 >= 8 ? 12 : 0), 0.45 + 0.7 * build, s % 2 ? 0.45 : -0.45);
  }
}
/* "Hangisi doğru?": the question hangs; a riser climbs under it */
whoosh(F(128), F(210) - F(128), { f0: 200, f1: 7000, vel: 0.6, shape: 'rise', type: 'bp', q: 2, pan0: 0, pan1: 0, wet: 0.4 });
{ let ph = 0; put(music, F(140), F(210) - F(140), 0, 0.05, (t) => { const f = mtof(D3) * 2 ** (t / (F(210) - F(140)) * 1.0); ph += f / SR; return ((ph % 1) * 2 - 1) * smooth(t / 1.2); }, 0.4); }
/* the fakes short out */
glitch(F(176), F(26), 0.9, -0.5);
glitch(F(184), F(18), 0.7, 0.5);
/* the breath in, a beat of silence, and the snap */
suck(F(212), 0.5, 1);
duckAt(F(210), 0.95, 0.02, 0.9);
boom(F(214), 1.1, 70, 32, 2.6);
[D3, A3, D4, Fs4, A4, D5].forEach((m, k) => bell(F(214) + k * 0.004, m, 0.7 - k * 0.05, (k - 2.5) * 0.25, 6, 3.5, music, 0.7));
piano(F(214), D2, 0.9, 0, 4);
/* "doğru": the one note that stays */
put(music, F(214), F(300) - F(214), 0, 0.055, (t) => (Math.sin(TAU * mtof(A4) * t) + 0.3 * Math.sin(TAU * mtof(A5) * t)) * Math.min(1, t / 0.01) * (0.6 + 0.4 * Math.exp(-t / 0.6)) * smooth((F(300) - F(214) - t) / 1.2), 0.6);
shimmer(F(224), F(28), A4, A5, 0.7, 0);

/* 3 — the island: the line lies down; the map breathes open */
whoosh(F(256), F(62), { f0: 900, f1: 250, vel: 0.35, shape: 'arc', pan0: 0.4, pan1: -0.4, wet: 0.5 });
pad(F(262), F(440), [D3, A3, E4, Fs4], { vel: 0.9, cut0: 500, cut1: 2600, att: 1.6, rel: 1.6, bright: 12 });
[D5, E5, Fs5, A5, B4 + 12, Fs5].forEach((m, i) => glass(F(318 + i * 3), m, 0.8, -0.6 + i * 0.24));
bell(F(340), Fs5 + 12, 0.5, 0.1, 3.5);
/* into Girne */
whoosh(F(356), F(70), { f0: 180, f1: 2400, vel: 0.85, shape: 'arc', q: 0.8, pan0: -0.3, pan1: 0.3, wet: 0.35 });
boom(F(420), 0.3, 55, 38, 1.4);
pencil(F(404), F(56), 0.6, -0.3);

/* 4 — the search: a pulse returns, clean now, and becomes a line of melody */
pad(F(436), F(512), [B2, Fs3, A3, D4], { vel: 0.85, cut0: 700, cut1: 2000, att: 0.8, rel: 0.8 });
pad(F(512), F(560), [G3 - 12, D3, Fs3, B3], { vel: 0.85, cut0: 900, cut1: 2200, att: 0.4, rel: 0.6 });
pad(F(560), F(610), [A2, E3, A3, Cs5 - 12], { vel: 0.85, cut0: 1100, cut1: 2400, att: 0.3, rel: 0.6 });
pad(F(610), F(700), [D3, A3, D4, Fs4], { vel: 0.95, cut0: 1200, cut1: 2800, att: 0.3, rel: 1.2 });
{
  const arp = (t0, t1, notes) => { for (let t = t0, k = 0; t < t1; t += 0.2, k++) piano(t, notes[k % notes.length], 0.32 + 0.1 * (k % 4 === 0), k % 2 ? 0.35 : -0.35, 1.2, music, 0.3); };
  arp(F(446), F(512), [B3, D4, Fs4, D4]);
  arp(F(512), F(560), [B3, D4, G4, D4]);
  arp(F(560), F(606), [A3, Cs5 - 12, E4, A4]);
}
for (let c = 0; c < 23; c++) tick(F(446 + (c * 64) / 23 + rnd() * 1.2), 1800 + rnd() * 500, 0.55, 0.1, 0.008);
for (let i = 0; i < 12; i++) glass(F(506 + i * 2), [D6, A5, Fs5, E5][i % 4] + 12 * (i % 3 === 0), 0.3, (rnd() - 0.5) * 1.4, sfx, 0.3);
/* the sweep: a sonar ring across the town */
{ put(sfx, F(526), 2.2, 0, 0.08, (t) => Math.sin(TAU * 1180 * t) * Math.exp(-t / 0.5) * Math.min(1, t / 0.01), 0.9); }
whoosh(F(526), F(30), { f0: 400, f1: 3000, vel: 0.35, shape: 'arc', pan0: -0.9, pan1: 0.9 });
/* the check: the listing is the one */
bell(F(564), A5, 0.8, 0, 4.5, 2.0);
bell(F(570), D6, 0.9, 0.05, 5, 2.0);
boom(F(566), 0.35, 70, 45, 1.4);
duckAt(F(564), 0.35, 0.02, 0.6);
/* "Doğru ilan." */
piano(F(606), D2, 0.8, 0, 3.5);
piano(F(606), A2, 0.5, 0.1, 3.5);

/* 5 — down onto the plot, and the house drawn in pencil */
whoosh(F(690), F(76), { f0: 3000, f1: 220, vel: 0.7, shape: 'arc', q: 0.9, pan0: 0.3, pan1: -0.3, wet: 0.35 });
{ let ph = 0; put(music, F(738), F(24), 0, 0.06, (t) => { const f = mtof(D5) * 2 ** (-smooth(t / F(24))); ph += f / SR; return Math.sin(TAU * ph) * Math.sin(Math.PI * t / F(24)); }, 0.6); }
pad(F(700), F(840), [B2, Fs3, B3, D4], { vel: 0.9, cut0: 600, cut1: 1800, att: 1.0, rel: 0.8 });
pad(F(840), F(870), [G3 - 12, D3, G3, B3], { vel: 0.9, cut0: 900, cut1: 2000, att: 0.4, rel: 0.4 });
pad(F(866), F(930), [A2, E3, A3, Cs5 - 12], { vel: 0.9, cut0: 1000, cut1: 2400, att: 0.3, rel: 0.6 });
pencil(F(760), F(84), 1.0, 0.2);
pencil(F(780), F(60), 0.6, -0.4);
for (let i = 0; i < 9; i++) tick(F(762 + i * 9 + rnd() * 3), 1500 + rnd() * 800, 0.3, (rnd() - 0.5), 0.02);
[Fs4, A4, D5, Cs5, B4, A4].forEach((m, i) => piano(F(772 + i * 14), m, 0.4, 0.2, 2.2));

/* 6 — the agent and the door */
door(F(866), 1);
room(F(866), F(80), 380, 0.8);
shimmer(F(854), F(18), D5, A5, 0.8, 0.3);
bell(F(868), Fs5, 0.35, -0.2, 3, 2.0);
pad(F(924), F(1030), [D3, A3, D4, Fs4], { vel: 1, cut0: 1000, cut1: 3000, att: 0.8, rel: 0.8 });
whoosh(F(914), F(44), { f0: 500, f1: 1600, vel: 0.35, shape: 'arc' });

/* 7 — the tour: a melody on piano over strings; each room its own air */
{
  const mel = [[936, Fs4], [952, A4], [968, D5], [996, Cs5], [1012, B4], [1036, A4], [1052, B4], [1068, D5], [1096, E5], [1124, Fs5], [1150, E5], [1166, D5]];
  mel.forEach(([f, m], i) => piano(F(f), m, 0.55, 0.15 * Math.sin(i), 2.8, music, 0.4));
}
room(F(944), F(90), 260, 0.9);
click(F(976), 0.35, -0.3, 2400); bell(F(978), A5 + 12, 0.18, -0.3, 2.5);
shimmer(F(982), F(18), Fs4, D5, 0.9, -0.3);
pad(F(1030), F(1110), [B2, Fs3, B3, D4], { vel: 0.95, cut0: 1000, cut1: 2600, att: 0.6, rel: 0.6 });
room(F(1036), F(74), 600, 0.8);
shimmer(F(1078), F(18), A4, Fs5, 0.9, 0.3);
whoosh(F(1098), F(28), { f0: 600, f1: 2200, vel: 0.45, shape: 'arc', pan0: -0.5, pan1: 0.5 });
/* the terrace: the sea, the sun, strings open */
sea(F(1104), F(1200) - F(1104));
pad(F(1110), F(1188), [G3 - 12, D3, G3, B3, D4], { vel: 1.1, cut0: 1300, cut1: 3600, att: 0.6, rel: 0.5, bright: 14 });
pad(F(1150), F(1188), [D5, Fs5], { vel: 0.5, cut0: 3000, cut1: 5000, att: 0.8, rel: 0.4, detune: 0.05 });
shimmer(F(1142), F(18), D5, A5, 1, 0.4);

/* 8 — the handshake */
pad(F(1188), F(1286), [A2, E3, A3, Cs5 - 12, E4], { vel: 1, cut0: 1200, cut1: 3200, att: 0.4, rel: 0.2 });
cloth(F(1198), F(26), 0.9, -0.3);
cloth(F(1204), F(22), 0.8, 0.35);
boom(F(1228), 0.45, 60, 40, 1.6);
piano(F(1228), A2, 0.7, 0, 3);
bell(F(1236), E5 + 12, 0.35, 0.1, 3, 2.0);
// the key drops from the clasp on its ring: a small metal jingle that follows its swing
[[0, 1], [3, 0.7], [15, 0.45], [30, 0.25], [45, 0.12]].forEach(([d, v], i) => [4150, 5870, 7930].forEach((fq, j) => tick(F(1228 + d) + j * 0.004, fq * (1 + 0.013 * i), v * (0.9 - j * 0.2), 0.12, 0.018 + 0.01 * j)));
/* the key comes forward, turns (ratchet), and clicks — the largest moment */
whoosh(F(1248), F(22), { f0: 500, f1: 4000, vel: 0.5, shape: 'rise', pan0: 0, pan1: 0 });
for (let i = 0; i < 4; i++) click(F(1270 + i * 4), 0.35 + i * 0.08, 0.05, 2600 + i * 200);
suck(F(1286), 0.45, 1.1);
duckAt(F(1284), 0.97, 0.02, 1.2);
lock(F(1286), 1);
boom(F(1286), 1.2, 72, 30, 3);
[D2, D3, A3, D4, Fs4, A4, D5, Fs5].forEach((m, k) => bell(F(1286) + k * 0.006, m, 0.8 - k * 0.05, (k - 3.5) * 0.22, 7, 3.5, music, 0.8));
pad(F(1288), F(1440) + 4, [D2, D3, A3, E4, Fs4, A4], { vel: 1, cut0: 900, cut1: 3200, att: 0.25, rel: 3, bright: 14 });

/* 9 — the key lies down; the name; the sonic logo */
{ let ph = 0; put(music, F(1290), F(20), 0, 0.05, (t) => { const f = mtof(A5) * 2 ** (-smooth(t / F(20))); ph += f / SR; return Math.sin(TAU * ph) * Math.sin(Math.PI * t / F(20)); }, 0.6); }
whoosh(F(1300), F(24), { f0: 1800, f1: 400, vel: 0.3, shape: 'arc', pan0: 0, pan1: 0 });
/* Evlek: A – D – F♯, rising: "doğru" resolved */
[[1310, A4], [1321, D5], [1332, Fs5]].forEach(([f, m], i) => { bell(F(f), m, 0.75, (i - 1) * 0.3, 6, 2.0, music, 0.8); piano(F(f), m, 0.6, (i - 1) * 0.3, 4.5, music, 0.5); });
bell(F(1348), A5 + 12, 0.35, 0.2, 4, 3.5);
put(music, F(1340), 3.5, 0, 0.03, (t) => Math.sin(TAU * mtof(Fs5 + 12) * t) * Math.exp(-t / 1.2) * Math.min(1, t / 0.4), 0.9);

/* the bass: a warm low line under every chord, so the room is full */
const bass = (t0, t1, m, vel = 1) => {
  const f = mtof(m), d = t1 - t0;
  write(sub, t0, d + 0.4, 0, 0.32 * vel, (t) => (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * 2 * f * t) + 0.12 * Math.sin(TAU * 3 * f * t)) * smooth(t / 0.18) * (t > d ? Math.max(0, 1 - (t - d) / 0.4) : 1));
};
[[F(30), F(206), 26, 0.3], [F(262), F(436), 38, 0.5], [F(436), F(512), 35, 0.8], [F(512), F(560), 31, 0.8], [F(560), F(606), 33, 0.8], [F(606), F(700), 38, 0.85],
 [F(700), F(840), 35, 0.8], [F(840), F(866), 31, 0.8], [F(866), F(930), 33, 0.85], [F(930), F(1030), 38, 0.85], [F(1030), F(1110), 35, 0.8], [F(1110), F(1188), 31, 0.85],
 [F(1188), F(1280), 33, 0.9], [F(1288), F(1440) + 3, 26, 0.9]].forEach(([a, b, m, v]) => bass(a, b, m, v));
/* a felt pulse through the tour: the walk of someone showing you round */
for (let t = F(930); t < F(1186); t += 60 / 84) {
  write(sub, t, 0.3, 0, 0.35, (x) => Math.sin(TAU * (48 + 30 * Math.exp(-x / 0.03)) * x) * Math.exp(-x / 0.09));
}
/* crescendo into the snap: the pulse gains a low beat */
for (let t = F(120); t < F(206); t += 0.25) {
  const b = (t - F(120)) / (F(206) - F(120));
  write(sub, t, 0.3, 0, 0.3 + 0.5 * b, (x) => Math.sin(TAU * (50 + 40 * Math.exp(-x / 0.02)) * x) * Math.exp(-x / 0.08));
}
/* air: a high shimmer that opens at the snap and at the name */
const air = (t0, dur, vel = 1) => { const hp = new Biquad().set('hp', 7000, 0.7), hp2 = new Biquad().set('hp', 7000, 0.7); write(long, t0, dur, -0.6, 0.12 * vel, (t) => hp.run(noise()) * Math.exp(-t / (dur * 0.35)) * Math.min(1, t / 0.01)); write(long, t0, dur, 0.6, 0.12 * vel, (t) => hp2.run(noise()) * Math.exp(-t / (dur * 0.35)) * Math.min(1, t / 0.01)); };
air(F(214), 3, 1); air(F(566), 2, 0.6); air(F(1286), 4, 1.2); air(F(1310), 3, 0.6);

/* ── Mix ─────────────────────────────────────────────────────────────────── */
/* a beat of silence before each big hit: everything already sounding is cut */
const gate = new Float32Array(N).fill(1);
for (const [hit, len] of [[F(214), 0.13], [F(1286), 0.11]]) {
  const a = Math.round((hit - len - 0.05) * SR), b = Math.round(hit * SR);
  for (let i = a; i < b; i++) gate[i] = Math.min(gate[i], i < a + 0.05 * SR ? 1 - (i - a) / (0.05 * SR) : 0.03);
}
for (const bus of [music, sfx, long, send, sub]) for (let i = 0; i < N; i++) { bus.L[i] *= gate[i]; bus.R[i] *= gate[i]; }
const hall = reverb(send, { room: 0.9, damp: 0.2, width: 1, pre: 0.025 });
// the echo only carries the highs: no bass repeats
const sendHi = makeBus(N);
{ const a = new Biquad().set('hp', 500, 0.7), b = new Biquad().set('hp', 500, 0.7); for (let i = 0; i < N; i++) { sendHi.L[i] = a.run(send.L[i]); sendHi.R[i] = b.run(send.R[i]); } }
const echo = delay(sendHi, 0.375, 0.28, 0.16, 3200);
const out = makeBus(N);
/* the level the music rides at: tense and building, open, intimate in the house, full at the end */
const ride = (t) => db(ramp(t, [[0, -8], [0.6, -7], [3.3, 0], [3.7, 0], [4.8, -6], [7.3, -5], [9.3, -3], [10.3, -2], [11.7, -6], [14.3, -4], [15.6, -6], [19.2, -5], [20.4, -3], [21.35, -2], [21.45, 0], [23.3, -1.5], [24, -8]]));
const subLp = new Biquad().set('lp', 140, 0.7), hiL = new Biquad().set('hp', 28), hiR = new Biquad().set('hp', 28);
const shL = new Biquad().set('shelf', 4200, 0.7, 6.5), shR = new Biquad().set('shelf', 4200, 0.7, 6.5);
for (let i = 0; i < N; i++) {
  const rd = ride((i % (DUR * SR)) / SR), d = duck[i] * rd;
  const s = subLp.run(sub.L[i] + sub.R[i]) * 0.5;
  let l = music.L[i] * db(-1) * d + sfx.L[i] * db(-3) * rd + long.L[i] * db(-8) * (0.5 + 0.5 * d) + hall.L[i] * db(-4) * rd + echo.L[i] * db(-12) + s * rd;
  let r = music.R[i] * db(-1) * d + sfx.R[i] * db(-3) * rd + long.R[i] * db(-8) * (0.5 + 0.5 * d) + hall.R[i] * db(-4) * rd + echo.R[i] * db(-12) + s * rd;
  out.L[i] = shL.run(hiL.run(l)); out.R[i] = shR.run(hiR.run(r));
}
/* the loop: what rings past the last frame lands on the first */
const L = DUR * SR;
for (let i = 0; i < TAIL * SR; i++) { out.L[i] += out.L[L + i]; out.R[i] += out.R[L + i]; }
/* gentle glue: soft saturation; then make-up gain (argv[3], dB) into a
   look-ahead limiter with a -1.5 dBFS ceiling, so loudness can be set to the
   platform target without clipping */
const makeup = db(Number(process.argv[3] || 0));
for (let i = 0; i < L; i++) { out.L[i] = (Math.tanh(out.L[i] * 1.2) / 1.2) * makeup; out.R[i] = (Math.tanh(out.R[i] * 1.2) / 1.2) * makeup; }
{
  const ceil = db(-1.5), look = Math.round(0.005 * SR), relK = Math.exp(-1 / (0.12 * SR));
  const need = new Float32Array(L);
  for (let i = 0; i < L; i++) { const p = Math.max(Math.abs(out.L[i]), Math.abs(out.R[i])); need[i] = p > ceil ? ceil / p : 1; }
  // minimum over the look-ahead window, then smooth release
  const gmin = new Float32Array(L);
  for (let i = 0; i < L; i++) { let m = 1; for (let k = i; k < Math.min(L, i + look); k++) if (need[k] < m) m = need[k]; gmin[i] = m; }
  let g = 1;
  for (let i = 0; i < L; i++) { g = gmin[i] < g ? gmin[i] : 1 - (1 - g) * relK; if (g > 1) g = 1; out.L[i] *= g; out.R[i] *= g; }
}
let peak = 0; for (let i = 0; i < L; i++) peak = Math.max(peak, Math.abs(out.L[i]), Math.abs(out.R[i]));

const dst = process.argv[2] || 'out/dogru-cizgi_score_f32.wav';
fs.writeFileSync(dst, wav(out, L));
console.log(`wrote ${dst}: ${DUR}s, ${SR} Hz, make-up ${process.argv[3] || 0} dB, peak ${(20 * Math.log10(peak)).toFixed(2)} dBFS`);
