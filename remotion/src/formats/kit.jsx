// EVLEK FORMAT KIT — the craft layer every weekly format inherits.
//
// Why this file exists: quality must not be re-invented per video. The brand
// film's physics (one settle, shadows announce 3 frames early, no fades, no
// scale-pops, static object-locked texture) and its material system (paper
// tooth, card stock, cobalt scan, pressed ink) are packaged here once, so a
// new weekly format is a SCRIPT, not a new design system.
//
// Rules baked in:
//  · SETTLE = one ~5% overshoot, one return. Never a bounce.
//  · Shadows: announce at start−3f, harden on the contact frame.
//  · Text prints as a single mass (roller), never letter-by-letter, never fades.
//  · Every texture is a child of the moving object — it never crawls.
//  · 84px side margins; 1:1 safe band is y 420…1500 for anything critical.

import React from 'react';
import { useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { SANS, MONO, f, ease } from '../brand/tokens.js';
import { NAVY, COBALT, GOLD, CREAM, TEX, cutEdge, MatterDefs, CropMarks } from '../reels/brandfilm/matter.jsx';
import { Wordmark } from '../reels/brandfilm/Styleframes.jsx';

export { NAVY, COBALT, GOLD, CREAM, TEX, cutEdge, MatterDefs, CropMarks, Wordmark, SANS, MONO, f, ease };

export const SAFE = { x: 84, w: 912, topSafe: 420, bottomSafe: 1500 };
export const MUTED = 'rgba(10,37,64,0.62)';
export const HAIR = 'rgba(10,37,64,0.14)';

/* ── physics ── */
export const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
export const WIPE = Easing.bezier(0.22, 1, 0.36, 1);

export const prog = (frame, at, len, easing = SETTLE) =>
  interpolate(frame, [f(at), f(at + len)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** physical placement: translate + rotate only. Never scale. */
export const place = (frame, at, len, { dx = 0, dy = 0, rot0 = 0, easing = SETTLE } = {}) => {
  const p = prog(frame, at, len, easing);
  return { opacity: frame >= f(at) ? 1 : 0,
           transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${(1 - p) * rot0}deg)` };
};

/** single-mass roller print: top-down linear mask. The only way text arrives. */
export const press = (frame, at, len = 0.15) => {
  const p = prog(frame, at, len, Easing.linear);
  return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, opacity: frame >= f(at) ? 1 : 0 };
};

/** ink laid left-to-right — for rules and underlines only, never for words. */
export const drawLine = (frame, at, len = 0.25) => {
  const p = prog(frame, at, len, WIPE);
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: frame >= f(at) ? 1 : 0 };
};

/** the shadow contract: announce 3f early, ambient in flight, hard on contact */
export const CastShadow = ({ frame, x, y, w, h, rot = 0, start, len, small = false, r = 4 }) => {
  const landed = frame >= f(start + len);
  const on = frame < f(start) - 3 ? 0
    : interpolate(frame, [f(start) - 3, f(start) - 1], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blob = (dx, dy, blur, a) => (
    <div style={{ position: 'absolute', left: x + dx, top: y + dy, width: w, height: h,
                  transform: `rotate(${rot}deg)`, borderRadius: r,
                  background: `rgba(10,37,64,${a})`, filter: `blur(${blur}px)`, opacity: on }} />);
  /* flight = one wide, soft ambient. A tight dark blob reads as a grey
     placeholder panel before its paper arrives — the film's known failure. */
  if (!landed) return small ? blob(3, 10, 30, 0.055) : blob(6, 20, 62, 0.07);
  return (<>{small ? blob(0, 2, 5, 0.15) : blob(0, 4, 9, 0.17)}{small ? blob(0, 1, 1.5, 0.10) : blob(0, 1, 2, 0.12)}</>);
};

/* ── material ── */

/** the page: lime-plaster paper with tooth. Static, never animated. */
export const PaperGround = ({ children, tone = '#EFEAE0' }) => (
  <div style={{ position: 'absolute', inset: 0, background: tone, overflow: 'hidden', fontFamily: SANS }}>
    <MatterDefs />
    <Img src={TEX.wallPlaster} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                        objectFit: 'cover', opacity: 0.55 }} />
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
      <rect width="1080" height="1920" filter="url(#mTooth)" opacity="0.7" />
    </svg>
    {children}
  </div>
);

/** a card of real stock: cut edge + fibre + its own texture child */
export const StockCard = ({ x, y, w, h, rot = 0, seed = 7, bg = '#FBF8F1', tex = 'cardstock',
                            texOpacity = 0.5, texPos = '30% 40%', style = {}, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h,
                transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: bg, clipPath: cutEdge(w, h, seed, 2.4, 7) }}>
      <Img src={TEX[tex]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                   objectFit: 'cover', opacity: texOpacity, objectPosition: texPos }} />
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <rect width={w} height={h} filter="url(#mFiber)" opacity="0.45" />
      </svg>
    </div>
    {children}
  </div>
);

/** a cobalt ink bar: real scan inside, cut edge, no flat fill */
export const InkBar = ({ x, y, w, h, seed = 11, r = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
    <div style={{ position: 'absolute', inset: 0, background: COBALT, clipPath: cutEdge(w, h, seed, 1.8, 5) }}>
      <Img src={TEX.cobalt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                     objectFit: 'cover', opacity: 0.30, mixBlendMode: 'luminosity' }} />
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <rect width={w} height={h} filter="url(#mCobaltLight)" opacity="0.5" />
      </svg>
    </div>
  </div>
);

/** the full-bleed cobalt board — the closing world of every format */
export const CobaltBoard = ({ frame, at, len = 0.55, liftAt, liftLen = 0.6, children }) => {
  const pIn = prog(frame, at, len, ease.drawer);
  const pOut = liftAt != null ? prog(frame, liftAt, liftLen, ease.inOut) : 0;
  const moving = (frame >= f(at) && frame < f(at + len)) || (liftAt != null && frame >= f(liftAt) && frame < f(liftAt + liftLen));
  const y = -2000 * (1 - pIn) - 2200 * pOut;
  const bow = moving ? 6 * Math.sin(Math.PI * (pOut > 0 ? pOut : pIn)) : 0;
  const rot = moving ? 0.28 * (pOut > 0 ? Math.sin(Math.PI * pOut) : (1 - pIn)) : 0;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${y}px) rotate(${rot}deg)`,
                  transformOrigin: '100% 0%',
                  filter: moving ? 'drop-shadow(0 24px 44px rgba(10,37,64,0.22))' : 'none' }}>
      {moving && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', height: 18,
                      background: 'linear-gradient(to bottom, rgba(10,37,64,0.20), rgba(10,37,64,0))' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: COBALT,
                    clipPath: cutEdge(1080, 1920 + bow, 77, 8, 14) }}>
        <Img src={TEX.cobalt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                       objectFit: 'cover', opacity: 0.28, mixBlendMode: 'luminosity' }} />
        <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
          <rect width="1080" height="1920" filter="url(#mCobaltLight)" opacity="0.4" />
        </svg>
      </div>
      {children}
    </div>
  );
};

/* ── typography ── */
export const Kicker = ({ frame, at, children, color = COBALT, top = 150, left = SAFE.x }) => (
  <div style={{ position: 'absolute', left, top, fontFamily: MONO, fontSize: 24, letterSpacing: '0.12em',
                color, ...press(frame, at, 0.12) }}>{children}</div>
);

export const Headline = ({ frame, at, children, size = 92, color = NAVY, top, left = SAFE.x, width = SAFE.w, len = 0.18 }) => (
  <div style={{ position: 'absolute', left, top, width, fontFamily: SANS, fontWeight: 800, fontSize: size,
                lineHeight: 1.04, letterSpacing: '-0.025em', color, ...press(frame, at, len) }}>{children}</div>
);

export const SourceLine = ({ frame, at, children, color = 'rgba(10,37,64,0.5)', top = 1790 }) => (
  <div style={{ position: 'absolute', left: SAFE.x, top, fontFamily: MONO, fontSize: 18,
                letterSpacing: '0.1em', color, ...press(frame, at, 0.1) }}>{children}</div>
);

/** the standing lockup: wordmark + evlek.app tag, set down as one object */
export const Lockup = ({ frame, at, x = SAFE.x, y, w = 340, color = NAVY, tagBg = COBALT, tagFg = '#FFFFFF' }) => (
  <div style={{ position: 'absolute', left: x, top: y, ...place(frame, at, 0.35, { dy: 120, rot0: -1.2 }) }}>
    <Wordmark w={w} color={color} />
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: tagBg, color: tagFg,
                  fontFamily: MONO, fontWeight: 600, fontSize: 24, padding: '12px 20px', borderRadius: 5,
                  letterSpacing: '0.04em', marginTop: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tagFg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9h13v-9" />
      </svg>
      evlek.app
    </div>
  </div>
);

/** registration marks — the press vibe, drawn once, dead still */
export const Registration = ({ stamp }) => (
  <>
    <CropMarks w={1080} h={1920} />
    {stamp && (
      <div style={{ position: 'absolute', right: 84, top: 1790, fontFamily: MONO, fontSize: 18,
                    letterSpacing: '0.14em', color: 'rgba(10,37,64,0.34)' }}>{stamp}</div>
    )}
  </>
);

export const fmt = (n) => Number(n).toLocaleString('tr-TR');
