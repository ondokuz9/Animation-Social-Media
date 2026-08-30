// Evlek brand film — MATTER: the material system.
//
// The council's verdict on v3 was blunt: "kağıt-kolaj temalı bir PowerPoint".
// This file is the answer. Nothing in the film is a rounded rectangle with a
// box-shadow any more; every surface is one of four papers, every edge is a
// fixed-seed cut, every letter is printed with a character. All randomness is
// SEEDED and constant-per-element: textures never boil, edges never crawl.
//
//   P1  problem photocopy   80gsm, tone waves 2–3%, broken toner, skewed cut
//   P2  evlek card stock    dense warm paper, fine fiber, 4 unequal corners
//   P3  cobalt printed sheet luminance texture, hand-cut top spline
//   P4  cream press sheet   the final page: fiber + printer's marks
//
// Shadows are physical, two classes only:
//   contact  0 6 10 rgba(10,37,64,.14)   — resting paper
//   lift     0 28 48 rgba(10,37,64,.16)  — paper in the hand
// No cobalt-tinted button shadows, ever.

import React from 'react';
import { Img, staticFile } from 'remotion';

/* Real scanned material (Flow-generated flat scans, public/brandfilm/tex/).
   The SVG-filter textures below remain as a thin unifying layer on top; the
   ground truth of every surface is now an actual photograph of paper. */
export const TEX = {
  wall: staticFile('brandfilm/tex/wall.jpg'),
  photocopy: staticFile('brandfilm/tex/photocopy.jpg'),
  cardstock: staticFile('brandfilm/tex/cardstock.jpg'),
  press: staticFile('brandfilm/tex/press.jpg'),
  cobalt: staticFile('brandfilm/tex/cobalt.jpg'),
  tape: staticFile('brandfilm/tex/tape.jpg'),
  torn: staticFile('brandfilm/tex/torn.jpg'),
  /* V4.8 (council): clean lime-plaster wall + pre-baked navy-ink duotone
     photo trio (fixed PNGs — never a CSS filter, so shadow blocks survive
     H.264). clean = ilan sitesi · soft = WhatsApp · flat = vitrin */
  wallPlaster: staticFile('brandfilm/tex/wall-plaster.png'),
  homeDuoClean: staticFile('brandfilm/tex/home-ext-duo-clean.png'),
  homeDuoSoft: staticFile('brandfilm/tex/home-ext-duo-soft.png'),
  homeDuoFlat: staticFile('brandfilm/tex/home-ext-duo-flat.png'),
};

export const NAVY = '#0A2540';
export const COBALT = '#2F5CFF';
export const GOLD = '#C9A157';
export const CREAM = '#F4F1EB';

export const SHADOW = {
  contact: '0 6px 10px rgba(10,37,64,0.14)',
  lift: '0 28px 48px rgba(10,37,64,0.16)',
};

/* ── deterministic jitter ── */
const rng = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s / 4294967296) * 2 - 1; // −1..1
  };
};

/* An irregular cut-edge polygon for a w×h sheet: pointsPerSide fixed points,
   ±amp px deviation, constant for a given seed. Returns clip-path string. */
export const cutEdge = (w, h, seed = 1, amp = 3, n = 7) => {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([(w * i) / n, r() * amp]);
  for (let i = 1; i <= n; i++) pts.push([w + r() * amp, (h * i) / n]);
  for (let i = 1; i <= n; i++) pts.push([w - (w * i) / n, h + r() * amp]);
  for (let i = 1; i < n; i++) pts.push([r() * amp, h - (h * i) / n]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
};

/* Slightly-unequal rounded corners for card stock (never one CSS radius). */
export const stockCorners = (seed = 1) => {
  const r = rng(seed * 7 + 3);
  const c = () => (3 + Math.abs(r()) * 2.5).toFixed(1);
  return `${c()}px ${c()}px ${c()}px ${c()}px`;
};

/* ── SVG filter defs — mount ONCE per composition ── */
export const MatterDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      {/* fine paper tooth (cream ground) */}
      <filter id="mTooth"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.05 0" /></filter>
      {/* large tone waves (photocopy 2–3%) */}
      <filter id="mTone"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="13" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.06  0 0 0 0.07 0" /></filter>
      {/* toner speckle */}
      <filter id="mToner"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="29" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.08  0 0 0 0 0.12  0 0 0 0.09 0" /></filter>
      {/* dense warm fiber (card stock ~1.2%) */}
      <filter id="mFiber"><feTurbulence type="turbulence" baseFrequency="0.012 0.6" numOctaves="2" seed="21" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.26  0 0 0 0 0.2  0 0 0 0.045 0" /></filter>
      {/* cobalt luminance print texture (~2%) */}
      <filter id="mCobaltTex"><feTurbulence type="turbulence" baseFrequency="0.009 0.5" numOctaves="2" seed="33" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.05  0 0 0 0 0.3  0 0 0 0.075 0" /></filter>
      {/* cobalt lighter mottling */}
      <filter id="mCobaltLight"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.02" numOctaves="2" seed="41" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" /></filter>
      {/* broken toner text */}
      <filter id="mInkRough"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" /></filter>
      <filter id="mInkMarker"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="17" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="6" /></filter>
      {/* photocopied photo: crush to grayscale, blow contrast, add grain */}
      <filter id="mPhotocopyImg">
        <feColorMatrix type="matrix" values="0.35 0.45 0.2 0 0  0.35 0.45 0.2 0 0  0.35 0.45 0.2 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="gamma" amplitude="1.5" exponent="1.8" offset="-0.08" />
          <feFuncG type="gamma" amplitude="1.5" exponent="1.8" offset="-0.08" />
          <feFuncB type="gamma" amplitude="1.5" exponent="1.8" offset="-0.08" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

/* ── printed text: misregistration + broken toner for the problem world,
      clean press for the Evlek world ── */
export const Ink = ({ children, style = {}, problem = false, marker = false,
                      roughUrl = 'url(#mInkRough)', ghostOpacity = 0.22 }) => (
  <div style={{ position: 'relative', ...style }}>
    {problem && (
      <div aria-hidden style={{
        position: 'absolute', inset: 0, transform: 'translate(1px, 0.6px)',
        opacity: ghostOpacity, filter: roughUrl, color: style.color || NAVY,
      }}>{children}</div>
    )}
    <div style={{ filter: marker ? 'url(#mInkMarker)' : problem ? roughUrl : 'none' }}>
      {children}
    </div>
  </div>
);

/* ── P1: photocopy sheet ── */
export const Photocopy = ({ x, y, w, h, rot = 0, seed = 5, shadow = true, children, style = {} }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    transform: `rotate(${rot}deg)`, ...style,
  }}>
    <div style={{ position: 'absolute', inset: 0, filter: shadow ? 'drop-shadow(0 6px 10px rgba(10,37,64,0.16))' : 'none' }}>
      <div style={{
        position: 'absolute', inset: 0, background: '#F3EFE5',
        clipPath: cutEdge(w, h, seed, 3.2),
      }}>
        <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover', opacity: 0.85 }} />
        <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
          <rect width={w} height={h} filter="url(#mTone)" opacity="0.6" />
          <rect width={w} height={h} filter="url(#mToner)" opacity="0.4" />
        </svg>
      </div>
    </div>
    <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
  </div>
);

/* ── P2: evlek card stock ── */
export const CardStock = ({ x, y, w, h, rot = 0, seed = 11, lifted = false, children, style = {}, pad = 0,
                            fiberOpacity = 0.8 }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    transform: `rotate(${rot}deg)`,
    borderRadius: stockCorners(seed),
    background: '#FDFBF6',
    boxShadow: `${lifted ? SHADOW.lift : SHADOW.contact}, inset 0 -1px 0 rgba(10,37,64,0.10)`,
    padding: pad, ...style,
  }}>
    <Img src={TEX.cardstock} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                      objectFit: 'cover', opacity: fiberOpacity, borderRadius: stockCorners(seed),
                                      /* seed-shifted crop so no two cards clone the same fibres */
                                      objectPosition: `${(seed * 37) % 100}% ${(seed * 53) % 100}%` }} />
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, borderRadius: stockCorners(seed) }}>
      <rect width="100%" height="100%" filter="url(#mFiber)" opacity="0.5" />
    </svg>
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
  </div>
);

/* ── P3: cobalt printed sheet (full-width stage) ── */
export const CobaltSheet = ({ top = 126, landed = true, children }) => {
  const W = 968, X = 56;
  const spline = `M${X} ${top + 34} C ${X + 90} ${top + 22}, ${X + 200} ${top + 44}, ${X + 330} ${top + 30} C ${X + 430} ${top + 20}, ${X + 520} ${top + 48}, ${X + 640} ${top + 26} C ${X + 740} ${top + 8}, ${X + 830} ${top + 38}, ${X + 910} ${top + 24} C ${X + 940} ${top + 19}, ${X + 952} ${top + 26}, ${X + W} ${top + 18}`;
  const d = `${spline} L${X + W} 1920 L${X} 1920 Z`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 }}>
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0,
             filter: landed ? 'drop-shadow(0 -6px 12px rgba(10,37,64,0.15))'
                            : 'drop-shadow(0 -16px 30px rgba(10,37,64,0.16))' }}>
        {/* hand-cut top spline: asymmetric anchors, then straight sides */}
        <path d={d} fill={COBALT} />
      </svg>
      {/* the real silkscreen scan, luminosity-blended so the brand hue stays
          #2F5CFF while the squeegee texture comes from the print */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `path('${d}')` }}>
        <Img src={TEX.cobalt} style={{ position: 'absolute', left: -140, top: -160, width: 1360, height: 2240,
                                       objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.28 }} />
        <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
          <rect x={X} y={top} width={W} height={1920 - top} filter="url(#mCobaltLight)" opacity="0.4" />
        </svg>
      </div>
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        {/* ink pools slightly at the cut — edge density difference */}
        <path d={spline} fill="none" stroke="#2247D6" strokeWidth="3" opacity="0.5" />
      </svg>
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
};

/* ── small physical props ── */
export const Tape = ({ x, y, rot = -8, w = 148, h = 44 }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    transform: `rotate(${rot}deg)`,
    background: 'rgba(248,245,236,0.5)',
    borderLeft: '1px solid rgba(140,130,110,0.35)',
    borderRight: '1px solid rgba(140,130,110,0.35)',
    boxShadow: 'inset 0 0 12px rgba(255,255,255,0.35), 0 1px 3px rgba(10,37,64,0.10)',
  }} />
);

export const Staple = ({ x, y, rot = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)` }}>
    <div style={{ width: 34, height: 4, background: '#5a6470', borderRadius: 1 }} />
    <div style={{ width: 4, height: 7, background: '#77808a', position: 'absolute', left: 0, top: 3 }} />
    <div style={{ width: 4, height: 7, background: '#77808a', position: 'absolute', right: 0, top: 3 }} />
  </div>
);

/* perforated tear line (horizontal) */
export const Perforation = ({ x, y, w, torn = false }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: 0,
    borderTop: '2px dashed rgba(10,37,64,0.28)',
  }}>
    {torn && (
      <svg width={w} height="10" style={{ position: 'absolute', top: -5 }}>
        <path d={`M0 5 ${Array.from({ length: 24 }, (_, i) => `L${(w / 24) * (i + 0.5)} ${5 + (i % 3 === 0 ? 3.5 : i % 2 ? -3 : 1.5)}`).join(' ')} L${w} 5`}
              fill="none" stroke="rgba(10,37,64,0.22)" strokeWidth="1.4" />
      </svg>
    )}
  </div>
);

/* punched hole (for filter tags) */
export const Punch = ({ x, y }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: 14, height: 14, borderRadius: 99,
    background: COBALT, boxShadow: 'inset 0 1px 2px rgba(10,37,64,0.5)',
  }} />
);

/* printer's crop marks for the press sheet */
export const CropMarks = ({ w, h, m = 18, len = 26 }) => (
  <svg width={w} height={h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    {[[m, m, 1, 1], [w - m, m, -1, 1], [w - m, h - m, -1, -1], [m, h - m, 1, -1]].map(([cx, cy, sx, sy], i) => (
      <g key={i} stroke={NAVY} strokeWidth="1.6" opacity="0.5">
        <line x1={cx + 6 * sx} y1={cy} x2={cx + (6 + len) * sx} y2={cy} />
        <line x1={cx} y1={cy + 6 * sy} x2={cx} y2={cy + (6 + len) * sy} />
      </g>
    ))}
  </svg>
);

/* organic cut-paper photo mask (angular, hand-cut — not a blob) */
export const PHOTO_MASKS = {
  a: 'polygon(2.1% 3.4%, 31% 0.6%, 66% 2.8%, 97.4% 0.9%, 99.2% 34%, 97.1% 68%, 99.4% 97%, 63% 99.1%, 30% 96.8%, 1.2% 99.3%, 2.8% 62%, 0.4% 30%)',
  b: 'polygon(4% 1.5%, 52% 3.6%, 98% 0.8%, 96.2% 42%, 99.1% 78%, 97.6% 98.6%, 48% 96.4%, 1.4% 99%, 3.1% 55%, 0.8% 22%)',
};

/* photo slot until the real Lapta photos arrive: neutral, labelled, marked */
export const PhotoSlot = ({ w, h, label, mask = 'a', src = null, dark = false }) => (
  <div style={{ width: w, height: h, position: 'relative', clipPath: PHOTO_MASKS[mask] }}>
    {src ? (
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.82) contrast(0.94) brightness(1.02)' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', background: dark ? '#20344E' : '#E6DfD2', position: 'relative' }}>
        <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
          <rect width={w} height={h} filter="url(#mFiber)" opacity="0.8" />
          <line x1="0" y1="0" x2={w} y2={h} stroke={dark ? 'rgba(244,241,235,0.2)' : 'rgba(10,37,64,0.14)'} strokeWidth="1" />
          <line x1={w} y1="0" x2="0" y2={h} stroke={dark ? 'rgba(244,241,235,0.2)' : 'rgba(10,37,64,0.14)'} strokeWidth="1" />
        </svg>
        <div style={{
          position: 'absolute', left: 16, bottom: 12, fontFamily: "'JetBrains Mono', monospace",
          fontSize: 19, letterSpacing: '0.1em', color: dark ? 'rgba(244,241,235,0.55)' : 'rgba(10,37,64,0.45)',
        }}>{label}</div>
      </div>
    )}
  </div>
);
