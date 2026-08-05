// Pieces that appear in more than one act.
//
// The montage in the cold open is made of frames from the film itself, so
// anything it flashes has to be a component the real act also uses. Keeping
// those here is what stops the opening from being a separate animation that
// merely resembles the film.

import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, T, RADIUS, SHADOW, MONO, SANS } from '../../brand/tokens.js';
import content from './content.json';

/** Resolve a content asset key to a public file. Every image in the film goes
    through here, so swapping in newly generated photography is one edit in
    content.json and no edit anywhere else. */
export const asset = (key) => staticFile(content.assets[key] ?? key);

/* ── Result card ──────────────────────────────────────────────────────────
   The buyer's result. Deliberately unlike the agent's card: three of these sit
   side by side in a row, small and scannable, where the agent's card is one tall
   object being edited. A buyer skims, an agent works — the two screens must not
   be mistaken for each other, and the fastest way to guarantee that is a
   different shape rather than a different colour. */

/** A result, and the loading state it arrives out of.
    `real` 0→1 crossfades the skeleton into the listing. The skeleton is not
    decoration: without it the buyer act spends most of a second on a search field
    floating in an otherwise empty frame, and a half-empty frame in a twenty
    second film is the most expensive thing you can spend. It is also what the
    product actually does while it is thinking. */
export const ResultCard = ({ item, p = 1, ring = 0, real = 1, style }) => (
  <div
    style={{
      width: 290,
      background: C.white,
      borderRadius: RADIUS.card,
      padding: 14,
      opacity: p,
      transform: `translateY(${(1 - p) * 38}px) scale(${0.97 + 0.03 * p + 0.018 * ring})`,
      border: `2.5px solid rgba(201,161,87,${0.85 * ring})`,
      boxShadow: ring > 0.08
        ? `0 24px 60px rgba(10,37,64,0.18), 0 0 ${52 * ring}px rgba(201,161,87,0.3)`
        : SHADOW.card,
      ...style,
    }}
  >
    <div style={{ position: 'relative', height: 330, borderRadius: 18, overflow: 'hidden', background: C.ink(0.07) }}>
      <Img
        src={asset(item.asset)}
        style={{ width: '100%', height: 330, objectFit: 'cover', display: 'block', opacity: real }}
      />
    </div>
    <div style={{ position: 'relative', padding: '14px 8px 6px', height: 142 }}>
      {/* Skeleton bars, sitting exactly where the three lines of type will be. */}
      <div style={{ position: 'absolute', inset: '14px 8px 6px', opacity: 1 - real }}>
        <div style={{ width: 150, height: 30, borderRadius: 8, background: C.ink(0.1) }} />
        <div style={{ width: 200, height: 20, borderRadius: 6, background: C.ink(0.07), marginTop: 12 }} />
        <div style={{ width: 120, height: 18, borderRadius: 6, background: C.ink(0.06), marginTop: 10 }} />
      </div>
      <div style={{ opacity: real }}>
        <div style={{ ...T.price, fontSize: 40, color: C.navy }}>{item.price}</div>
        <div style={{ ...T.uiBody, fontSize: 26, color: C.ink(0.62), marginTop: 2 }}>{item.place}</div>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 23, color: C.ink(0.4), marginTop: 6 }}>{item.meta}</div>
      </div>
    </div>
  </div>
);

/* ── Search field ─────────────────────────────────────────────────────────
   Full width, no device around it. The buyer act deliberately drops the phone
   frame: the agent's world is a device you hold, the buyer's world is just the
   result arriving. */

export const SearchField = ({ children, focus = 0, submit = 0, style }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      minHeight: 118,
      padding: '18px 34px',
      borderRadius: RADIUS.pill,
      background: C.white,
      border: `2.5px solid ${focus > 0.1 ? C.navy : C.ink(0.1)}`,
      boxShadow: `0 0 0 ${9 * focus * (1 - submit)}px rgba(201,161,87,0.16), 0 14px 40px rgba(10,37,64,0.08)`,
      transform: `scale(${1 - 0.012 * submit})`,
      ...style,
    }}
  >
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10.5" cy="10.5" r="6.6" stroke={C.ink(0.42)} strokeWidth="2.1" />
      <path d="M15.6 15.6 L21 21" stroke={C.ink(0.42)} strokeWidth="2.1" strokeLinecap="round" />
    </svg>
    <div style={{ ...T.uiBody, fontSize: 36, color: C.navy, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
      {children}
    </div>
  </div>
);

/* ── Montage word ─────────────────────────────────────────────────────────
   Hard cut in, hard cut out — no fade. A fade would smear across the cut and
   turn five separate statements into one blur. */

export const MontageWord = ({ children, dark }) => (
  <div
    style={{
      position: 'absolute',
      left: 100,
      bottom: 430,
      ...T.monoSm,
      fontSize: 34,
      letterSpacing: '0.2em',
      color: dark ? '#FFFFFF' : C.navy,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      // On a photograph the word has 250ms to be read and no time to be squinted
      // at, so it gets a plate rather than a text-shadow.
      background: dark ? 'rgba(4,14,28,0.62)' : 'transparent',
      padding: dark ? '14px 26px 14px 22px' : '14px 4px',
      borderRadius: dark ? 999 : 0,
    }}
  >
    <span style={{ width: 44, height: 3, background: C.gold, display: 'block', flexShrink: 0 }} />
    {children}
  </div>
);

/* ── Grain ────────────────────────────────────────────────────────────────
   A single static SVG turbulence layer at very low opacity. Flat digital navy
   at 1080×1920 bands visibly once encoded; this is cheaper and more honest than
   raising the bitrate, and it is static so it costs nothing in motion. */

export const Grain = ({ opacity = 0.05 }) => (
  <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
    <filter id="evlek-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="1080" height="1920" filter="url(#evlek-grain)" />
  </svg>
);
