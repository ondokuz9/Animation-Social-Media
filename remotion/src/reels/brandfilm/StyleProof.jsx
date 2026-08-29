// Evlek brand film — STYLE PROOF v2 (5.0s · 300 frames · 1080×1920 · 60fps)
//
// v1 → v2, from Onur's review:
//   · the cadastral parcel sketch under the wordmark is GONE ("aşağıya saçma
//     sapan arazi çizme") — the scene is the wordmark, the two lines, the wave.
//   · the assembly is richer: every glyph now breaks into THREE pieces along
//     two parallel 45° stencil cuts, adjacent pieces travelling in opposite
//     directions, each with its own small delay, rotation, and a shadow that
//     starts lifted (paper in the air) and settles flat (paper on the page).
//
// The systems on trial: PAPER (static turbulence ground) · SNAP (stop-motion
// flight, continuous landing) · LIGHT ("EV" catches one narrow sun band).

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, T, SANS, f, at, tp, pulse, ease, trUpper } from '../../brand/tokens.js';
import { WORDMARK_PATHS, WORDMARK_VIEW_BOX, GLYPHS } from './wordmark.js';

export const STYLEPROOF_SECONDS = 5.0;
export const STYLEPROOF_FRAMES = f(STYLEPROOF_SECONDS);

const COBALT = C.cobalt;
const NAVY = C.navy;
const GOLD = C.gold;
const PAPER = C.cream;

/* ── timeline (seconds) ──────────────────────────────────────────────────
   0.00  cover: cut-paper pieces of all five glyphs scattered on the page
   0.05  E closes (three pieces, outer→middle)          each snap = a beat
   0.38  v · 0.62 l · 0.82 e · 1.04 k
   1.50  the word breathes once
   1.75  type: "adanın ölçülü parçası."
   2.95  "içinde ev var." — and at 3.15 the light crosses E+v
   4.05  evlek.app pill drops onto the wave
   4.40  still: the last 36 frames are the poster and the loop point.   */

const LETTER_TIMES = [0.05, 0.38, 0.62, 0.82, 1.04];
const LETTER_DUR = [0.34, 0.26, 0.22, 0.24, 0.28];

/* Stop-motion quantiser: flight happens in 3-frame holds; the last 20% runs
   continuous so the landing can overshoot and settle like a spring. */
const stopmo = (p) => (p >= 0.8 ? p : Math.round((p / 0.8) * 5) / 5 * 0.8);

/* One glyph in three pieces, split along two parallel 45° stencil cuts.
   Adjacent pieces travel in opposite directions along the cut normal, so the
   letter closes like a shutter rather than a simple halving. Clip polygons
   overlap by 1px: at rest the glyph is seamless — the gap exists only as
   displacement, never as geometry. */
const CUTS = [-38, 38];
const N = 4000;
const bandPoints = (cx, cy, oTop, oBot) => {
  // region between the 45° lines  y = cy - (x - cx) + o,  oTop above, oBot below
  const top = oTop === null
    ? [[cx - N, cy + N - 900], [cx + N, cy - N - 900]]
    : [[cx - N, cy + N + oTop - 1], [cx + N, cy - N + oTop - 1]];
  const bot = oBot === null
    ? [[cx + N, cy - N + 900], [cx - N, cy + N + 900]]
    : [[cx + N, cy - N + oBot + 1], [cx - N, cy + N + oBot + 1]];
  return [...top, ...bot].map((p) => p.join(',')).join(' ');
};

const PIECES = [
  { clip: (cx, cy) => bandPoints(cx, cy, null, CUTS[0]), dirSign: -1, delay: 0.00, dist: 150, rot: -5 },
  { clip: (cx, cy) => bandPoints(cx, cy, CUTS[0], CUTS[1]), dirSign: 1, delay: 0.05, dist: 195, rot: 4 },
  { clip: (cx, cy) => bandPoints(cx, cy, CUTS[1], null), dirSign: -1, delay: 0.10, dist: 150, rot: -3 },
];

const CutGlyph = ({ d, cx, cy, t, t0, dur, fill, idx }) => {
  const landP = tp(t, t0 + 0.1, t0 + dur + 0.1, ease.out);
  const snap = pulse(t, t0 + dur + 0.1, 0.14);
  const scale = 1 + snap * 0.03;
  const uid = `cg-${idx}`;
  // Direction of travel: the cut normal (1,1)/√2, flipped per piece; the whole
  // glyph's normal is mirrored on even letters so the word doesn't drift.
  const mir = idx % 2 === 0 ? 1 : -1;
  const nx = mir * Math.SQRT1_2, ny = mir * Math.SQRT1_2;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <defs>
        {PIECES.map((pc, i) => (
          <clipPath key={i} id={`${uid}-${i}`}><polygon points={pc.clip(cx, cy)} /></clipPath>
        ))}
      </defs>
      {PIECES.map((pc, i) => {
        const pRaw = tp(t, t0 + pc.delay, t0 + pc.delay + dur, ease.out);
        const p = stopmo(pRaw);
        const D = pc.dist * (1 - p) * pc.dirSign;
        // shadow: lifted while flying (7px, faint), flat once landed (2.6px)
        const sOff = 7 - 4.4 * p;
        const sOp = 0.07 + 0.07 * p;
        return (
          <g key={i}
             transform={`translate(${nx * D} ${ny * D}) rotate(${pc.rot * (1 - p)} ${cx} ${cy})`}>
            <g clipPath={`url(#${uid}-${i})`}>
              <path d={d} fill={NAVY} opacity={sOp} transform={`translate(${sOff * 0.7} ${sOff})`} />
              <path d={d} fill={fill} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

/* Three specks of paper dust on a snap — 10 frames, then gone. */
const Dust = ({ t, t0, x, y }) => {
  const p = tp(t, t0, t0 + 0.18, ease.out);
  if (p <= 0 || p >= 1) return null;
  const specks = [[-14, -20, 2.6], [10, -26, 2.0], [20, -10, 1.6]];
  return (
    <g opacity={1 - p}>
      {specks.map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx * (0.4 + p)} cy={y + dy * (0.4 + p)} r={r} fill={NAVY} opacity={0.35} />
      ))}
    </g>
  );
};

/* Typewriter with the grey "wet ink" lead character. */
const TypeOn = ({ t, t0, cps = 26, text, style, lead = 2 }) => {
  const n = Math.max(0, Math.floor((t - t0) * cps));
  if (n <= 0) return <div style={{ ...style, opacity: 0 }}>{text}</div>;
  const done = text.slice(0, Math.min(n, text.length));
  const dark = done.slice(0, Math.max(0, done.length - lead));
  const grey = done.slice(Math.max(0, done.length - lead));
  return (
    <div style={style}>
      <span>{dark}</span>
      <span style={{ opacity: 0.35 }}>{grey}</span>
    </div>
  );
};

export const StyleProof = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;

  const W = 780, WM_X = 150, WM_Y = 640;
  const cam = 1.018 - 0.018 * tp(t, 0, 4.6, ease.out);

  // Light sweep 3.15 → 3.70 across E+v only: narrow, blurred, once.
  const sweep = tp(t, 3.15, 3.7, ease.inOut);
  const sweepX = 1230 + (1500 - 1230) * sweep - 55;

  const pillIn = at(frame, 4.05, 0.24);
  const pillSnap = pulse(t, 4.29, 0.12);
  const waveIn = at(frame, 0.0, 0.8);

  return (
    <AbsoluteFill style={{ background: PAPER, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>

        {/* paper: two static turbulence layers + a breath of vignette */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920"
             style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <filter id="tooth"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.05 0" /></filter>
            <filter id="blotch"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="11" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.028 0" /></filter>
            <radialGradient id="vig" cx="50%" cy="42%" r="75%">
              <stop offset="62%" stopColor={NAVY} stopOpacity="0" />
              <stop offset="100%" stopColor={NAVY} stopOpacity="0.055" />
            </radialGradient>
          </defs>
          <rect width="1080" height="1920" filter="url(#blotch)" />
          <rect width="1080" height="1920" filter="url(#tooth)" />
          <rect width="1080" height="1920" fill="url(#vig)" />
        </svg>

        {/* the wordmark, closing from its own stencil pieces */}
        <div style={{ position: 'absolute', left: WM_X, top: WM_Y, width: W }}>
          <svg width={W} height={185 * (W / 550)} viewBox={WORDMARK_VIEW_BOX}>
            {GLYPHS.map((g, i) => (
              <CutGlyph key={g.id} d={WORDMARK_PATHS[g.id]} cx={g.cx} cy={g.cy}
                        t={t} t0={LETTER_TIMES[i]} dur={LETTER_DUR[i]} fill={COBALT} idx={i} />
            ))}
            {GLYPHS.map((g, i) => (
              <Dust key={g.id} t={t} t0={LETTER_TIMES[i] + LETTER_DUR[i] + 0.1}
                    x={g.cx} y={g.cy + 60} />
            ))}
            <defs>
              <linearGradient id="sun" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={GOLD} stopOpacity="0" />
                <stop offset="0.5" stopColor={GOLD} stopOpacity="0.85" />
                <stop offset="1" stopColor={GOLD} stopOpacity="0" />
              </linearGradient>
              <clipPath id="evOnly">
                <path d={WORDMARK_PATHS.E} /><path d={WORDMARK_PATHS.v} />
              </clipPath>
              <filter id="sunBlur"><feGaussianBlur stdDeviation="10" /></filter>
            </defs>
            {sweep > 0 && sweep < 1 && (
              <g clipPath="url(#evOnly)">
                <rect x={sweepX} y={290} width={64} height={240}
                      transform={`rotate(-22 ${sweepX + 32} 410)`}
                      fill="url(#sun)" opacity={0.5} filter="url(#sunBlur)" />
                <rect x={sweepX + 14} y={290} width={26} height={240}
                      transform={`rotate(-22 ${sweepX + 32} 410)`}
                      fill="#FFFFFF" opacity={0.28} filter="url(#sunBlur)" />
              </g>
            )}
          </svg>
        </div>

        {/* the two lines of meaning */}
        <TypeOn t={t} t0={1.75} cps={24} text="adanın ölçülü parçası."
                style={{ ...T.mono, position: 'absolute', left: 0, right: 0, top: 962,
                         textAlign: 'center', color: NAVY, fontSize: 34, letterSpacing: '0.02em' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1030, textAlign: 'center',
                      ...T.mono, fontSize: 30, color: NAVY,
                      opacity: tp(t, 2.95, 3.35) * 0.82 }}>
          {'içinde '}
          <span style={{ background: GOLD, color: NAVY, fontWeight: 700,
                         padding: '1px 10px 3px', borderRadius: 8 }}>ev</span>
          {' var.'}
        </div>

        {/* the wave and the pill — the grid's own furniture, quieter */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920"
             style={{ position: 'absolute', inset: 0, opacity: waveIn }}>
          <path d="M0 1560 C 200 1512, 420 1596, 620 1552 C 800 1512, 950 1560, 1080 1532 L1080 1920 L0 1920 Z"
                fill={COBALT} opacity={0.94} />
          <path d="M0 1588 C 220 1544, 430 1622, 640 1580 C 820 1544, 960 1588, 1080 1562 L1080 1920 L0 1920 Z"
                fill={NAVY} opacity={0.18} />
        </svg>
        <div style={{
          position: 'absolute', left: '50%', top: 1420,
          transform: `translate(-50%, ${(1 - pillIn) * -30}px) scale(${1 + pillSnap * 0.05}) rotate(-2deg)`,
          opacity: pillIn,
          background: C.white, color: COBALT, borderRadius: 999,
          padding: '16px 34px', fontFamily: SANS, fontWeight: 700, fontSize: 34,
          boxShadow: '0 10px 28px rgba(10,37,64,0.18)',
          border: '2px solid rgba(10,37,64,0.06)',
        }}>
          evlek.app
        </div>

        {/* mono eyebrow — present from frame 0 so the cover frame is a poster */}
        <div style={{ ...T.monoSm, position: 'absolute', left: 0, right: 0, top: 300,
                      textAlign: 'center', color: NAVY, opacity: 0.55 }}>
          {trUpper('kuzey kıbrıs')}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
