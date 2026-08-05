// The Evlek interface, as it appears inside the phone.
//
// These are not screenshots and not a clone of the live product — they are the
// product's design language rebuilt as animatable components: card radius 28 and
// the soft shadow from the design system, fully-round pills, navy focus ring with
// a gold halo instead of the browser's blue.
//
// Every primitive here is used by more than one reel. Adding a film should mean
// composing these, not drawing new ones.

import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, T, RADIUS, SHADOW, MONO } from './tokens.js';

/* ── Device ───────────────────────────────────────────────────────────────
   Deliberately anonymous: no brand, no notch, no home indicator. The viewer
   should read "a phone", not "an iPhone", so nothing competes with Evlek. */

/** Bottom-anchored on purpose: a 1536px device centred in a 1920px frame eats the
    top safe zone, leaving nowhere for a headline. Running it off the bottom edge
    frees a band at the top and gives the screen more of the frame — the same
    composition every good product reel uses. */
export const Phone = ({ children, tilt = 0, rotateZ = 0, scale = 1, top = 400 }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
    <div
      style={{
        marginTop: top,
        width: 820,
        height: 1560,
        borderRadius: RADIUS.phone,
        background: '#1A1D22',
        padding: 14,
        boxShadow: '0 60px 120px rgba(4,14,28,0.28), 0 8px 24px rgba(4,14,28,0.18)',
        transform: `perspective(2600px) rotateY(${tilt}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        transformOrigin: '50% 30%',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          borderRadius: RADIUS.screen,
          background: C.cream,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  </AbsoluteFill>
);

/* ── Surfaces ─────────────────────────────────────────────────────────── */

export const Card = ({ children, style, lifted = 0, selected = 0 }) => (
  <div
    style={{
      background: C.white,
      borderRadius: RADIUS.card,
      overflow: 'hidden',
      border: selected > 0
        ? `3px solid rgba(201,161,87,${0.35 + 0.65 * selected})`
        : `1.5px solid ${C.ink(0.08)}`,
      boxShadow: lifted > 0.5 ? SHADOW.cardLifted : SHADOW.card,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip = ({ children, active = 0, gold = false, style }) => (
  <div
    style={{
      ...T.uiLabel,
      display: 'inline-flex',
      alignItems: 'center',
      height: 56,
      padding: '0 24px',
      borderRadius: RADIUS.pill,
      whiteSpace: 'nowrap',
      color: C.navy,
      background: active > 0 ? `rgba(201,161,87,${0.06 * active})` : C.white,
      border: `1.5px solid ${
        gold || active > 0
          ? `rgba(201,161,87,${0.35 + 0.65 * Math.max(active, gold ? 1 : 0)})`
          : C.ink(0.16)
      }`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A tick that draws itself rather than appearing. 220ms, stroke-dashoffset on a
    single path — the cheapest piece of motion in the whole system and the one
    that most reliably reads as "done" rather than "shown". */
export const DrawnCheck = ({ p = 1, size = 30, color = '#fff', width = 2.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M4.5 12.4 L9.6 17.4 L19.5 7"
      stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
      pathLength="1" strokeDasharray="1" strokeDashoffset={1 - Math.max(0, Math.min(1, p))}
    />
  </svg>
);

export const Button = ({ children, press = 0, ring = 0, check = 0, style }) => (
  <div
    style={{
      position: 'relative',
      ...T.uiLabel,
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      height: 88,
      minWidth: 320,
      padding: '0 44px',
      borderRadius: RADIUS.pill,
      background: C.navy,
      color: C.white,
      transform: `scale(${1 - 0.03 * press})`,
      ...style,
    }}
  >
    {children}
    {check > 0 && <DrawnCheck p={check} size={30} color={C.gold} width={2.8} />}
    {ring > 0 && ring < 1 && (
      <div
        style={{
          position: 'absolute',
          inset: -8 * ring,
          borderRadius: RADIUS.pill,
          border: `2.5px solid rgba(201,161,87,${0.7 * (1 - ring)})`,
        }}
      />
    )}
  </div>
);

/** A form field. `focus` draws the brand ring — navy hairline plus a gold halo,
    never the browser's default blue. */
export const Field = ({ children, focus = 0, style }) => (
  <div
    style={{
      ...T.uiBody,
      minHeight: 84,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      borderRadius: RADIUS.field,
      background: C.creamWarm,
      color: C.ink(0.8),
      border: `2px solid ${focus > 0 ? C.navy : C.ink(0.08)}`,
      boxShadow: focus > 0 ? `0 0 0 ${7 * focus}px rgba(201,161,87,0.16)` : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

/** The disclosure pill. Compact, calm, always present while a rendered image is
    on screen — it is trust infrastructure, not a legal afterthought. */
export const Disclosure = ({ style }) => (
  <span
    style={{
      ...T.uiLabel,
      fontSize: 26,
      background: 'rgba(10,37,64,0.78)',
      color: 'rgba(255,255,255,0.94)',
      padding: '11px 22px',
      borderRadius: RADIUS.pill,
      ...style,
    }}
  >
    AI ile görselleştirildi · Temsilî
  </span>
);

export const SourceLine = ({ draw = 1, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...style }}>
    <div
      style={{
        width: 120, height: 2, background: C.gold,
        transform: `scaleX(${draw})`, transformOrigin: 'left center',
      }}
    />
    <span style={{ ...T.monoSm, color: C.ink(0.55) }}>KAYNAK: EVLEK.APP</span>
  </div>
);

/* ── Cursor ───────────────────────────────────────────────────────────────
   Every interaction in these films is started by something visible. If a chip
   appears with no cause, the film stops reading as software and starts reading
   as a slideshow. */

export const Cursor = ({ x, y, opacity = 1, press = 0 }) => (
  <svg
    width="44" height="48" viewBox="0 0 24 26"
    style={{
      position: 'absolute', left: x, top: y, opacity,
      transform: `scale(${1 - 0.12 * press})`,
      filter: `drop-shadow(${SHADOW.cursor})`,
      pointerEvents: 'none',
    }}
  >
    <path
      d="M4 1 L4 19 L8.5 15.5 L11.5 22.5 L14.8 21 L11.8 14.2 L17.5 13.5 Z"
      fill="#fff" stroke={C.navy} strokeWidth="1.6" strokeLinejoin="round"
    />
  </svg>
);

/* ── Text ─────────────────────────────────────────────────────────────────
   Words reveal a word at a time, never a character at a time: at 60fps a
   character typewriter reads as cheap, while word-level reveals stay legible
   and feel like something being composed. */

export const WordReveal = ({ text, progress, style }) => {
  const words = text.split(' ');
  const shown = progress * words.length;
  return (
    <span style={style}>
      {words.map((w, i) => {
        const p = Math.max(0, Math.min(1, shown - i));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * 6}px)`,
              marginRight: '0.3em',
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

export const Caret = ({ frame, fps, visible = 1, style }) => {
  const on = Math.floor((frame / fps) * 1.06 * 2) % 2 === 0;
  return (
    <span
      style={{
        display: 'inline-block', width: 3, height: '1.05em',
        background: C.cobalt, marginLeft: 4,
        opacity: visible * (on ? 1 : 0),
        verticalAlign: 'text-bottom',
        ...style,
      }}
    />
  );
};

/* ── Listing card ─────────────────────────────────────────────────────────
   The single most repeated object across Evlek's films. */

export const ListingCard = ({
  image, price, place, meta, photoHeight = 420, selected = 0, lifted = 0, style, children,
}) => (
  <Card selected={selected} lifted={lifted} style={style}>
    <div style={{ position: 'relative' }}>
      <Img
        src={staticFile(image)}
        style={{ width: '100%', height: photoHeight, objectFit: 'cover', display: 'block' }}
      />
      {children}
    </div>
    <div style={{ padding: '26px 30px 28px' }}>
      <div style={{ ...T.price, color: C.navy }}>{price}</div>
      <div style={{ ...T.uiBody, color: C.ink(0.68), marginTop: 6 }}>{place}</div>
      {meta && (
        <div style={{ ...T.uiBody, fontSize: 28, color: C.ink(0.5), marginTop: 10, fontFamily: MONO }}>
          {meta}
        </div>
      )}
    </div>
  </Card>
);
