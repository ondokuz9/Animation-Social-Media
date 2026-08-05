// Evlek motion tokens.
//
// Every duration and every easing in a reel resolves to something in this file.
// A component that invents its own 340ms is a bug: consistency across hundreds of
// animated elements is what separates a finished film from a busy one, and it is
// only achievable if the vocabulary is small and shared.

import { Easing, interpolate, spring } from 'remotion';

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/* ── Colour ────────────────────────────────────────────────────────────────
   Two palettes exist in this brand and they disagree:

   · The design system (_ds/…/tokens/colors.css) is "STRICT: blue + cream" —
     navy #14213D, cobalt #2F5CFF, no warm accent.
   · The shipped reels (v3 → v7) use a deeper navy #0A2540 with gold #C9A157 as
     the controlled accent and demote cobalt to interaction details only. That
     was an explicit brief decision and it is what the approved master looks like.

   REEL is the shipped language and the default, because the agent film will be
   seen alongside v7. Switching to the design-system palette is a one-line change
   here — nothing downstream hardcodes a colour. */

export const REEL = {
  navy: '#0A2540',
  cream: '#F4F1EB',
  creamWarm: '#F8F6F1',
  white: '#FFFFFF',
  gold: '#C9A157',
  cobalt: '#2F5CFF',        // interaction only: caret, focus, active selection
  ink: (a) => `rgba(10,37,64,${a})`,
};

export const DS = {
  navy: '#14213D',
  cream: '#F4F1EB',
  creamWarm: '#EDE9E0',
  white: '#FFFFFF',
  gold: '#2F5CFF',          // the design system's accent is cobalt, not gold
  cobalt: '#2F5CFF',
  ink: (a) => `rgba(20,33,61,${a})`,
};

export const C = REEL;

/* ── Type ─────────────────────────────────────────────────────────────────
   Weights 400/500/600/700 come from brand/hanken-weights.css; 800 and the mono
   face come from evlek.css. The design system's own tokens ask for 500 body and
   600 medium, which evlek.css never shipped — hence the extra file. */

export const SANS = "'Hanken Grotesk', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";

export const T = {
  hook:     { fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06, letterSpacing: '-0.02em' },
  headline: { fontFamily: SANS, fontWeight: 800, fontSize: 60, lineHeight: 1.08, letterSpacing: '-0.02em' },
  uiTitle:  { fontFamily: SANS, fontWeight: 600, fontSize: 38, lineHeight: 1.2 },
  uiBody:   { fontFamily: SANS, fontWeight: 500, fontSize: 32, lineHeight: 1.45 },
  uiLabel:  { fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.2 },
  price:    { fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: '-0.01em' },
  mono:     { fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.01em' },
  monoSm:   { fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.12em', textTransform: 'uppercase' },
};

/* ── Layout ───────────────────────────────────────────────────────────── */

export const SAFE = { left: 80, right: 80, top: 280, bottom: 700 };
export const RADIUS = { card: 28, pill: 999, field: 16, phone: 64, screen: 50, sm: 12 };
export const SHADOW = {
  card: '0 18px 48px rgba(10,37,64,0.10)',
  cardLifted: '0 26px 64px rgba(10,37,64,0.16)',
  cursor: '0 3px 8px rgba(4,14,28,0.35)',
};

/* ── Duration tokens (seconds) ────────────────────────────────────────────
   Grounded in the standard interface-motion ranges: micro-interactions land in
   100–200ms, most transitions stay under 300ms, and screen-level changes sit
   around 300–400ms. dur.xl deliberately overshoots that: it is the one move that
   carries the phone's weight, and it needs to feel heavier than a card. */

export const dur = {
  xs: 0.18,   // press, toggle, micro-interaction
  sm: 0.20,   // a line of text, a small state change
  md: 0.28,   // card, chip, text block entering
  lg: 0.42,   // morph, screen-level change
  xl: 0.62,   // act transition, with the device tilt
};

export const f = (seconds) => Math.round(seconds * FPS);

/* ── Easing tokens ────────────────────────────────────────────────────────
   The rule, without exception: entering uses ease-out, exiting uses ease-in,
   an element changing state in place uses ease-in-out. */

export const ease = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  in: Easing.bezier(0.64, 0, 0.78, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  linear: Easing.linear,
};

export const SPRING_SOFT = { damping: 18, mass: 0.5, stiffness: 140 };

/* ── Helpers ──────────────────────────────────────────────────────────────
   Every scene animates through these three, so the vocabulary stays enforced
   rather than merely documented. */

/** Progress 0→1 for a window that starts at `atSec` and lasts `lenSec`. */
export const at = (frame, atSec, lenSec = dur.md, easing = ease.out) =>
  interpolate(frame, [f(atSec), f(atSec + lenSec)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing,
  });

/** Enter: fade up from `dy` px. The default entrance for anything on screen. */
export const enter = (frame, atSec, { lenSec = dur.md, dy = 18, easing = ease.out } = {}) => {
  const p = at(frame, atSec, lenSec, easing);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
};

/** Exit: fade away, using ease-in as the rule requires. */
export const exit = (frame, atSec, { lenSec = dur.sm, dy = -12 } = {}) => {
  const p = at(frame, atSec, lenSec, ease.in);
  return { opacity: 1 - p, transform: `translateY(${p * dy}px)` };
};

/** Hold a line on screen between two times, entering and exiting by the rules. */
export const holdLine = (frame, fromSec, toSec, opts = {}) => {
  const a = enter(frame, fromSec, opts);
  const b = at(frame, toSec, opts.outLenSec ?? dur.sm, ease.in);
  return { opacity: Math.min(a.opacity, 1 - b), transform: a.transform };
};

/** Spring 0→1 for entrances that should feel physical rather than timed. */
export const pop = (frame, fps, atSec, config = SPRING_SOFT) =>
  spring({ frame: frame - f(atSec), fps, config, durationInFrames: f(dur.md) });
