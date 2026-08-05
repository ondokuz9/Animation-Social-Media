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

/* Interface motion is held under 300ms — anything slower on a UI element reads
   as sluggish. dur.lg and dur.xl deliberately exceed that and are reserved for
   CAMERA-level moves: an act transition, the device leaving frame. A button
   inside the phone may never use them. The distinction matters: the film obeys
   film timing, the interface inside it obeys interface timing. */

/** A press: deliberate going down, snapping back. Symmetric press timing is a
    craft finding — the human half of an interaction earns more time than the
    machine's answer. */
export const pressAt = (frame, atSec) => {
  const down = at(frame, atSec, 0.12, ease.out);
  const up = at(frame, atSec + 0.12, 0.08, ease.out);
  return Math.max(0, down - up);
};

export const f = (seconds) => Math.round(seconds * FPS);

/* ── Easing tokens ────────────────────────────────────────────────────────
   Both entering AND exiting use ease-out. This is not the textbook symmetry
   (in for exits) — it is the craft rule: ease-in starts slow and so delays the
   exact moment the viewer is watching, which reads as sluggish even at the same
   duration. There is deliberately no `ease.in` token, so it cannot be reached
   for by accident.

   `out` keeps the brand's documented curve rather than forking it. `inOut` is
   the stronger curve, for an element moving or morphing on screen. */

export const ease = {
  out: Easing.bezier(0.22, 1, 0.36, 1),      // brand curve — entering AND exiting
  inOut: Easing.bezier(0.77, 0, 0.175, 1),   // on-screen movement / morph
  drawer: Easing.bezier(0.32, 0.72, 0, 1),   // panels sliding from an edge
  linear: Easing.linear,                     // constant motion only (drift, typing)
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

/** Exit: fade away — ease-out here too, for the reason above. */
export const exit = (frame, atSec, { lenSec = dur.sm, dy = -12 } = {}) => {
  const p = at(frame, atSec, lenSec, ease.out);
  return { opacity: 1 - p, transform: `translateY(${p * dy}px)` };
};

/** Hold a line on screen between two times, entering and exiting by the rules. */
export const holdLine = (frame, fromSec, toSec, opts = {}) => {
  const a = enter(frame, fromSec, opts);
  const b = at(frame, toSec, opts.outLenSec ?? dur.sm, ease.out);
  return { opacity: Math.min(a.opacity, 1 - b), transform: a.transform };
};

/** Spring 0→1 for entrances that should feel physical rather than timed. */
export const pop = (frame, fps, atSec, config = SPRING_SOFT) =>
  spring({ frame: frame - f(atSec), fps, config, durationInFrames: f(dur.md) });
