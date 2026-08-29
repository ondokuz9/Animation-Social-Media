// Evlek brand film — STYLE PROOF (6.0s · 360 frames · 1080×1920 · 60fps)
//
// Purpose: prove the film's visual language on one scene before the 30s hero
// is built. Four systems are on trial here, in order of appearance:
//
//   1  PAPER      cream ground with real tooth (two static turbulence layers —
//                 static on purpose: animated grain shimmers, paper does not)
//   2  SNAP       the wordmark assembles from its own 45° stencil pieces.
//                 Entries are quantised to 3-frame steps (stop-motion, a hand
//                 placing cut paper), the landing is continuous (a machine
//                 finishing the job). The mix of the two is the signature.
//   3  LINE       a cadastral parcel draws itself out of the wordmark's cut
//                 angle: 45° first, then orthogonal — survey discipline.
//   4  LIGHT      "EV" catches a warm light sweep once. Not a glow: a band of
//                 sunlight passing across cut paper. (Onur: "ışık gibiyse olur")
//
// Palette decision (answers "navy derken sosyal mavimiz mi?"): the film lives
// where the Instagram grid lives, so CObalt #2F5CFF is the brand voice (word-
// mark, wave, pill) on cream paper; NAVY #0A2540 is ink (lines, small type,
// shadows); GOLD appears only as the light. One warm accent, one blue voice.

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, T, MONO, SANS, f, at, tp, pulse, ease, trUpper } from '../../brand/tokens.js';
import { WORDMARK_PATHS, WORDMARK_VIEW_BOX, GLYPHS } from './wordmark.js';

export const STYLEPROOF_SECONDS = 6.0;
export const STYLEPROOF_FRAMES = f(STYLEPROOF_SECONDS);

const COBALT = C.cobalt;          // #2F5CFF — the social/brand voice
const NAVY = C.navy;              // #0A2540 — ink
const GOLD = C.gold;              // #C9A157 — light, twice per film, never fill
const PAPER = C.cream;            // #F4F1EB

/* ── timeline (seconds) ──────────────────────────────────────────────────
   0.00  cover frame: paper + E pieces already mid-air (a designed poster)
   0.05  E assembles   (snap 0.38)      each snap = one beat of the rhythm
   0.38  v             (snap 0.62)
   0.62  l             (snap 0.82)
   0.82  e             (snap 1.04)
   1.04  k             (snap 1.30)
   1.30  wordmark settles, one breath
   1.70  parcel lines leave the E/k cut angle, draw the evlek below
   2.10  survey cross stamps · 2.35 measurement types along the edge
   2.75  hatch shades the parcel — the piece of land becomes REAL
   3.05  type: "adanın ölçülü parçası."
   4.30  light sweep across E+v · type: "içinde ev var."
   5.15  evlek.app pill drops onto the wave — sticker, like the grid
   5.40  still. the last second is a poster, and the loop point.        */

const LETTER_TIMES = [0.05, 0.38, 0.62, 0.82, 1.04];
const LETTER_DUR = [0.33, 0.24, 0.20, 0.22, 0.26];
// Entry direction of each glyph's two pieces, along its own cut normal —
// alternating so consecutive snaps never move the same way.
const LETTER_DIR = [
  [-1, -1], [1, -1], [0, -1], [-1, 1], [1, -1],
].map(([x, y]) => { const n = Math.hypot(x, y) || 1; return [x / n, y / n]; });

/* Stop-motion quantiser: the travel happens in 3-frame holds, the last 20% is
   continuous so the landing can overshoot and settle like a spring. */
const stopmo = (p) => (p >= 0.8 ? p : Math.round((p / 0.8) * 5) / 5 * 0.8);

/* One glyph, two pieces, split along the 45° line through (cx, cy).
   The clip half-planes are huge polygons in viewBox space; each piece is the
   glyph ∩ half-plane, translated rigidly as one object. */
const CutGlyph = ({ d, cx, cy, t, t0, dur, dir, fill }) => {
  const pRaw = tp(t, t0, t0 + dur, ease.out);
  const p = stopmo(pRaw);
  const D = 150 * (1 - p);                       // remaining separation
  const snap = pulse(t, t0 + dur, 0.14);          // landing pulse 0→1→0
  const scale = 1 + snap * 0.035;
  const landed = pRaw >= 1;
  // 45° split through (cx,cy): y - cy = -(x - cx)  → the cut runs NW–SE like
  // the X-brace. Half A is above the cut, half B below.
  const R = 4000;
  // The two half-planes OVERLAP by 1px along the cut: at rest the letter must
  // be seamless — the stencil gap is made by displacement, never by the clip.
  const above = `${cx - R},${cy + R + 1} ${cx + R},${cy - R + 1} ${cx + R},${cy - R - 900} ${cx - R},${cy + R - 900}`;
  const below = `${cx - R},${cy + R - 1} ${cx + R},${cy - R - 1} ${cx + R},${cy - R + 900} ${cx - R},${cy + R + 900}`;
  const uid = `cg-${cx.toFixed(0)}`;
  const shadowO = landed ? 0.16 : 0.05 + p * 0.06;
  const piece = (clipId, sx, sy, rot) => (
    <g transform={`translate(${sx} ${sy}) rotate(${rot * (1 - p)} ${cx} ${cy})`}>
      <g clipPath={`url(#${clipId})`}>
        {/* contact shadow first — cut paper sits ON the page */}
        <path d={d} fill={NAVY} opacity={shadowO * 0.75} transform="translate(2 2.8)" />
        <path d={d} fill={fill} />
      </g>
    </g>
  );
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <defs>
        <clipPath id={`${uid}-a`}><polygon points={above} /></clipPath>
        <clipPath id={`${uid}-b`}><polygon points={below} /></clipPath>
      </defs>
      {/* small opposing rotations while apart: cut paper on a table, not a
          machine part — they null out exactly at the snap */}
      {piece(`${uid}-a`, dir[0] * -D, dir[1] * -D, -5)}
      {piece(`${uid}-b`, dir[0] * D, dir[1] * D, 4)}
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

/* ── the scene ── */
export const StyleProof = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;

  // Wordmark placement: width 780, centred, optically just above centre.
  const W = 780, WM_X = 150, WM_Y = 560;
  const wmScale = 780 / 550;

  // Whole-scene camera: a 1.5% settle-back over the film. Film timing, not UI.
  const cam = 1.018 - 0.018 * tp(t, 0, 5.6, ease.out);

  // Parcel drawing 1.70 → 2.90 — four edges, drawn one after another, starting
  // from the corner the leader line lands on and running anticlockwise.
  const P = [[352, 1046], [742, 1018], [788, 1330], [318, 1362]];
  const edges = [[P[1], P[0]], [P[0], P[3]], [P[3], P[2]], [P[2], P[1]]];
  const edgeP = edges.map((_, i) => at(frame, 1.78 + i * 0.26, 0.30, ease.inOut));
  // The leader leaves the k at the cut's own 45°, then turns survey-orthogonal
  // and lands exactly on the corner the parcel starts from.
  const lead1 = at(frame, 1.52, 0.18, ease.inOut);   // (860,806) → (742,924)
  const lead2 = at(frame, 1.70, 0.10, ease.inOut);   // (742,924) → (742,1018)
  const hatchP = at(frame, 2.75, 0.5, ease.out);
  const crossP = pulse(t, 2.12, 0.2);
  const crossO = tp(t, 2.02, 2.12);

  // Light sweep 4.35 → 4.90 across E+v only: a NARROW, blurred, quick band —
  // sun through a window, not paint. (Onur's condition: "ışık gibiyse olur".)
  const sweep = tp(t, 4.35, 4.9, ease.inOut);
  const sweepX = 1230 + (1500 - 1230) * sweep - 55; // viewBox coords over E+v

  // Pill 5.15: drops 26px and lands with one small spring.
  const pillIn = at(frame, 5.15, 0.24);
  const pillSnap = pulse(t, 5.39, 0.12);

  // Wave band eases up very early and just breathes — it is furniture.
  const waveIn = at(frame, 0.0, 0.8);

  return (
    <AbsoluteFill style={{ background: PAPER, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>

        {/* ── paper: two static turbulence layers + a breath of vignette ── */}
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

        {/* ── cadastral layer: leader line, parcel, hatch, cross, measure ── */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920"
             style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <clipPath id="parcelClip"><polygon points={P.map((p) => p.join(',')).join(' ')} /></clipPath>
          </defs>
          {/* leader: leaves the wordmark at the k's cut angle — 45° exactly */}
          <line x1={860} y1={806} x2={860 - 118 * lead1} y2={806 + 118 * lead1}
                stroke={NAVY} strokeWidth={2} opacity={0.5} />
          <line x1={742} y1={924} x2={742} y2={924 + 94 * lead2}
                stroke={NAVY} strokeWidth={2} opacity={0.5 * (lead2 > 0 ? 1 : 0)} />
          {/* parcel edges, drawn in order */}
          {edges.map(([a, b], i) => {
            const p = edgeP[i];
            if (p <= 0) return null;
            return (
              <line key={i} x1={a[0]} y1={a[1]}
                    x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p}
                    stroke={NAVY} strokeWidth={2.4} opacity={0.85} />
            );
          })}
          {/* hatch: 45°, clipped to the parcel — the land gets substance */}
          <g clipPath="url(#parcelClip)" opacity={hatchP * 0.10}>
            {Array.from({ length: 26 }, (_, i) => {
              const o = i * 36;
              return <line key={i} x1={200 + o} y1={1450} x2={640 + o} y2={960}
                           stroke={NAVY} strokeWidth={1.4} />;
            })}
          </g>
          {/* gold warms the hatch only while the light passes — same light */}
          <g clipPath="url(#parcelClip)" opacity={pulse(t, 4.55, 0.9) * 0.10}>
            <rect x={200} y={940} width={700} height={520} fill={GOLD} />
          </g>
          {/* survey cross at corner 1 */}
          <g opacity={crossO}
             transform={`translate(${P[0][0]} ${P[0][1]}) scale(${1 + crossP * 0.25})`}>
            <line x1={-16} y1={0} x2={16} y2={0} stroke={NAVY} strokeWidth={2.4} />
            <line x1={0} y1={-16} x2={0} y2={16} stroke={NAVY} strokeWidth={2.4} />
            <circle r={7} fill="none" stroke={NAVY} strokeWidth={2} />
          </g>
          {/* measurement, typed along the top edge, rotated with it */}
          <g transform={`translate(${(P[0][0] + P[1][0]) / 2 - 62} ${(P[0][1] + P[1][1]) / 2 - 18}) rotate(-4.1)`}>
            <SvgType t={t} t0={2.35} text="21.40 m" />
          </g>
        </svg>

        {/* ── the wordmark, assembling from its own stencil pieces ── */}
        <div style={{ position: 'absolute', left: WM_X, top: WM_Y, width: W }}>
          <svg width={W} height={185 * wmScale} viewBox={WORDMARK_VIEW_BOX}>
            {GLYPHS.map((g, i) => (
              <CutGlyph key={g.id} d={WORDMARK_PATHS[g.id]} cx={g.cx} cy={g.cy}
                        t={t} t0={LETTER_TIMES[i]} dur={LETTER_DUR[i]}
                        dir={LETTER_DIR[i]} fill={COBALT} />
            ))}
            {GLYPHS.map((g, i) => (
              <Dust key={g.id} t={t} t0={LETTER_TIMES[i] + LETTER_DUR[i]}
                    x={g.cx} y={g.cy + 60} />
            ))}
            {/* the light: a warm band crossing E and v once, inside the glyphs */}
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

        {/* ── the two lines of meaning ── */}
        <TypeOn t={t} t0={3.05} cps={24} text="adanın ölçülü parçası."
                style={{ ...T.mono, position: 'absolute', left: 0, right: 0, top: 866,
                         textAlign: 'center', color: NAVY, fontSize: 34, letterSpacing: '0.02em' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 926, textAlign: 'center',
                      ...T.mono, fontSize: 30, color: NAVY,
                      opacity: tp(t, 4.5, 4.95) * 0.78 }}>
          {'içinde '}
          <span style={{ background: GOLD, color: NAVY, fontWeight: 700,
                         padding: '1px 10px 3px', borderRadius: 8 }}>ev</span>
          {' var.'}
        </div>

        {/* ── the wave and the pill — the grid's own furniture, quieter ── */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920"
             style={{ position: 'absolute', inset: 0, opacity: waveIn }}>
          <path d={`M0 ${1560} C 200 ${1512}, 420 ${1596}, 620 ${1552} C 800 ${1512}, 950 ${1560}, 1080 ${1532} L1080 1920 L0 1920 Z`}
                fill={COBALT} opacity={0.94} />
          <path d={`M0 ${1588} C 220 ${1544}, 430 ${1622}, 640 ${1580} C 820 ${1544}, 960 ${1588}, 1080 ${1562} L1080 1920 L0 1920 Z`}
                fill={NAVY} opacity={0.18} />
        </svg>
        <div style={{
          position: 'absolute', left: '50%', top: 1420,
          transform: `translate(-50%, ${(1 - pillIn) * -30}px) scale(${1 + pillSnap * 0.05}) rotate(-2deg)`,
          opacity: pillIn,
          background: C.white, color: COBALT, borderRadius: 999,
          padding: '16px 34px', fontFamily: SANS, fontWeight: 700, fontSize: 34,
          boxShadow: '0 10px 28px rgba(10,37,64,0.18)',
          border: `2px solid rgba(10,37,64,0.06)`,
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

/* Mono type inside SVG, typed on like the HTML twin. */
const SvgType = ({ t, t0, text, cps = 20 }) => {
  const n = Math.max(0, Math.floor((t - t0) * cps));
  if (n <= 0) return null;
  return (
    <text fontFamily="'JetBrains Mono', monospace" fontSize={26} fontWeight={500}
          fill={'#0A2540'} letterSpacing="1">
      {text.slice(0, n)}
    </text>
  );
};
