// Evlek brand film — V4.3: the causal-chain reblock (director's V4.2 audit,
// 86/100 → target 94+). This is not a cosmetic pass; 07.48–15.55 is
// re-staged so ONE promise births every proof:
//
//   EVLEK NE ARADIĞINI ANLAR. → a CLOSED Evlek dossier arrives → the search
//   rail slides out of the dossier itself → the sentence reads for 84 clean
//   frames → its words are DIE-CUT out of the rail (real holes, cobalt
//   showing through; the word prints onto the piece in mid-air) → the
//   dossier's cover pulls back → the matching home is revealed → languages,
//   then the price ticket is lifted OFF the card and set onto the real
//   market ruler. Search first, result second. Causality restored.
//
// The seven P0s and all second-tier fixes are in:
//   · rail emerges edge-first from behind the dossier (no teleport)
//   · chips are rail-material pieces; voids show cobalt + cut fibres
//   · deck gathers to a 5-tab stack before the band (≤2 headlines on screen)
//   · Arabic numerics isolated in LTR <bdi> (3+1 can never render 1+3)
//   · the gold tab NEVER disappears: it hovers −18px, visibly, while the
//     page passes beneath, and sets down with the page on the same frame
//   · flyer cast shadow graded (taped top ≈0, bottom 18–24px)
//   · A1 dead zone cut to 18 frames — cobalt shadow 05.06, body 05.09
//   · loop flyer enters edge-first (12–20px) — no full-body pop
//   · page top-right corner lands 3 frames late (corner-lag, no scale)
//   · URL +14% and one weight up; copy per the final text lock.
//
// 1800 frames, 1080×1920, 60 fps, silent master (no audio track).

import React from 'react';
import { useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { SANS, MONO, trUpper, f, ease } from '../../brand/tokens.js';
import {
  NAVY, COBALT, GOLD, CREAM, TEX,
  cutEdge, stockCorners, MatterDefs, Ink,
  Photocopy, CardStock, CobaltSheet, Tape, Perforation, Punch, CropMarks, PhotoSlot,
  PHOTO_MASKS,
} from './matter.jsx';
import { Sheet, HandLine, Wordmark, HOME } from './Styleframes.jsx';

export const FILM_V4_FRAMES = 1800;

const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const WIPE = Easing.bezier(0.22, 1, 0.36, 1);

const prog = (frame, atSec, lenSec, easing = SETTLE) =>
  interpolate(frame, [f(atSec), f(atSec + lenSec)], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

const place = (frame, atSec, lenSec, { dx = 0, dy = 0, rot0 = 0, easing = SETTLE } = {}) => {
  const p = prog(frame, atSec, lenSec, easing);
  return {
    opacity: frame >= f(atSec) ? 1 : 0,
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${(1 - p) * rot0}deg)`,
  };
};

const wipe = (frame, atSec, lenSec = 0.32, easing = WIPE) => {
  const p = prog(frame, atSec, lenSec, easing);
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: frame >= f(atSec) ? 1 : 0 };
};

/* cutEdge with a bowable bottom edge — the press page's 2px material answer
   on its contact frame (same seeded jitter algorithm as matter.cutEdge) */
/* the council's 5-point leading-edge profile for a big travelling sheet */
const EDGE_PROFILE = [0, 5, -2, 3, 0];
const profileAt = (q) => {
  const x = q * (EDGE_PROFILE.length - 1);
  const i = Math.min(EDGE_PROFILE.length - 2, Math.floor(x));
  return EDGE_PROFILE[i] + (EDGE_PROFILE[i + 1] - EDGE_PROFILE[i]) * (x - i);
};

const cutEdgeBowed = (w, h, seed = 1, amp = 3, n = 7, bow = 0, cornerLift = 0, topBow = 0, wob = 0) => {
  let s = seed >>> 0;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s / 4294967296) * 2 - 1; };
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const q = i / n;
    /* `wob` rides the TOP edge — the LEADING edge of a sheet rising from
       below (the press page). `topBow` is the cover's pull-flex. */
    pts.push([(w * i) / n, r() * amp - topBow * Math.sin(Math.PI * q) + wob * profileAt(q)]);
  }
  for (let i = 1; i <= n; i++) pts.push([w + r() * amp, (h * i) / n]);
  for (let i = 1; i <= n; i++) {
    const q = i / n;
    const corner = (q < 0.15 || q > 0.85) ? -cornerLift : 0;
    pts.push([w - (w * i) / n, h + r() * amp + bow * Math.sin(Math.PI * q) + corner]);
  }
  for (let i = 1; i < n; i++) pts.push([r() * amp, h - (h * i) / n]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
};

/* single-mass PRESS print: a roller wipe top-to-bottom, linear, one object —
   never a left-to-right letter reveal (the "type-on" killer) */
const printPress = (frame, atSec, lenSec = 0.2) => {
  const p = prog(frame, atSec, lenSec, Easing.linear);
  return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, opacity: frame >= f(atSec) ? 1 : 0 };
};

/* shadow primitive: displaced cast (flight only) + hardening contact.
   `graded` = a taped-at-top sheet: cast fades to nothing at the top edge. */
const CastShadow = ({ frame, x, y, w, h, rot = 0, start, len, small = false, r = 10, graded = false }) => {
  const landed = frame >= f(start + len);
  const announce = frame < f(start) - 3 ? 0
    : interpolate(frame, [f(start) - 3, f(start) - 1], [0.5, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blob = (dx, dy, blur, a, bg = null) => (
    <div style={{ position: 'absolute', left: x + dx, top: y + dy, width: w, height: h,
                  transform: `rotate(${rot}deg)`, borderRadius: r,
                  background: bg || `rgba(10,37,64,${a})`, filter: `blur(${blur}px)`,
                  opacity: announce }} />
  );
  const grad = (a) => `linear-gradient(to bottom, rgba(10,37,64,${a * 0.08}), rgba(10,37,64,${a * 0.55}) 45%, rgba(10,37,64,${a}))`;
  /* V4.7 (council): flight = ONE displaced soft ambient, no grey panel;
     landed = key + tight contact pair */
  if (!landed) {
    return small
      ? blob(4, 12, 24, 0.08)
      : blob(8, 26, 52, 0.10, graded ? grad(0.12) : null);
  }
  return (
    <>
      {small ? blob(0, 2, 5, 0.15) : blob(0, 4, 9, 0.17, graded ? grad(0.19) : null)}
      {small ? blob(0, 1, 1.5, 0.10) : blob(0, 1, 2, 0.12, graded ? grad(0.13) : null)}
    </>
  );
};

const ApproachShadow = ({ frame, start }) => {
  const on = frame < f(start) - 3 ? 0
    : interpolate(frame, [f(start) - 3, f(start) - 1], [0.35, 0.6],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const off = prog(frame, start + 0.1, 0.15, WIPE);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150,
                  opacity: on * (1 - off), pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(10,37,64,0.22), rgba(10,37,64,0))' }} />
  );
};

/* ── master timeline (decimal seconds; negative wraps the loop) ── */
const T = {
  /* NEW OPENING (director): the duplicate-pile hook. The pile lands across
     the loop boundary; frame 0 already reads as a poster. */
  stack: -0.35, stackLen: 0.55,        // lands 0.20, settled by 0.35
  cardR: 0.48, cardL: 0.85,            // the top two copies dealt aside
  tags: [1.3, 1.6, 1.9], tagLen: 0.2,  // £ / ₺ / $ — three short TAKs
  qband: 2.3, qbandLen: 0.5,           // ÜÇ FİYAT. HANGİSİ DOĞRU? (50f read)
  strike: 3.8,                          // the −8.3° cobalt redaction
  /* V4.7 inversion: the WALL never moves again. The cream press BOARD is an
     object — it slides down OVER the wall at 04.48 (covering the opening
     chaos), is the stage base for every act after, and lifts at 28.00 to
     reveal the untouched wall for the loop. */
  boardIn: 4.8, boardInLen: 0.55,
  cobalt: 4.85,
  hl1: 5.75, under: 6.35,               // single-mass press print (no hl2)
  hero: 7.55,                                   // the CLOSED dossier arrives
  rail: 8.3833, railLen: 0.3,                   // slides out of the dossier
  chips: [9.983, 10.283, 10.583], chipLen: 0.42, // after 84 clean frames
  coverPull: 10.9, coverOff: 11.25,             // the reveal: search → result
  railExit: 11.65,
  label: 11.95, lang: 12.2, langStep: 0.2,
  gather: 13.783,                               // deck → 5-tab stack
  band: 13.933, marker: 14.633, ticket: 14.783, tline: 15.283,
  infoExit: 16.05,
  glide: 16.55, manifesto: 17.833,
  gold: 19.917, goldLen: 0.267,
  goldUp: 20.883, goldDown: 21.467, goldDownLen: 0.216, // hover, never hidden
  page: 20.9167, pageLen: 0.7667,
  slog1: 21.9, slog2: 22.1, url: 22.65,
  proof: 22.95, proofLen: 0.45, mark: 23.667, markLen: 0.233,
  pageLift: 26.5, cobaltLift: 27.1, boardLift: 28.0, boardLiftLen: 0.9,
};

const CARD_IN = { x: 134, y: 742, rot: -2 };
const CARD_AL = { x: 200, y: 632, rot: 0 };
const TAB = { x: 768, y: 608 };
const SLOT = { x: 576, y: 4, w: 152, h: 18 };
/* chip x-positions centred on the sentence's word spans (26px word gaps) */
const RAIL_CHIPS = [['GİRNE', 292, 210], ['DENİZE YAKIN', 486, 332], ['3+1', 810, 154]];

export const Film30v4 = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const fw = frame >= f(28.5) ? frame - 1800 : frame;
  const tw = fw / 60;

  /* THE BOARD (V4.7): a heavy cream press board slides down over the static
     wall — drawer easing, leading-edge bow, edge-local shadow — rests as the
     stage base, and lifts away at 28.00 to reveal the wall it never harmed. */
  const pBoardIn = prog(frame, T.boardIn, T.boardInLen, ease.drawer);
  const pBoardLift = prog(frame, T.boardLift, T.boardLiftLen, ease.inOut);
  const boardMovingIn = frame >= f(T.boardIn) && frame < f(T.boardIn + T.boardInLen);
  const boardLifting = frame >= f(T.boardLift) && frame < f(T.boardLift + T.boardLiftLen);
  const boardY = -2000 * (1 - pBoardIn) - 2350 * pBoardLift;
  const boardRot = boardMovingIn ? 0.3 * (1 - pBoardIn)
    : boardLifting ? 0.35 * Math.sin(Math.PI * pBoardLift) : 0;
  const boardBow = boardMovingIn ? 6 * Math.sin(Math.PI * pBoardIn)
    : boardLifting ? 6 * Math.sin(Math.PI * pBoardLift) : 0;
  const boardMoving = boardMovingIn || boardLifting;

  const cobaltInY = 1920 * (1 - prog(frame, T.cobalt, 0.72));

  /* hero card beats (creative move: the card breathes between acts) —
     anchored to the acts they answer, so the V4.7 retime carries them */
  const b1 = prog(frame, T.lang - 0.35, 0.5, ease.inOut);  // language beat: +48/+64
  const b2 = prog(frame, T.band - 0.3, 0.5, ease.inOut);   // price beat: → −36/−52
  const beatX = 48 * b1 - 84 * b2;
  const beatY = 64 * b1 - 116 * b2;
  const g = prog(frame, T.glide, 0.55);             // alignment (one overshoot)
  const cardX = CARD_IN.x + beatX + (CARD_AL.x - (CARD_IN.x - 36)) * g;
  const cardY = CARD_IN.y + beatY + (CARD_AL.y - (CARD_IN.y - 52)) * g;
  const cardRot = CARD_IN.rot + (CARD_AL.rot - CARD_IN.rot) * g;

  /* dossier cover: 120px pull, then lifted away. The lifted corner leads the
     body in the first frames — heavy card, not a rigid plate. */
  const pPull = prog(frame, T.coverPull, 0.3, ease.drawer);
  const pOff = prog(frame, T.coverOff, 0.45, ease.inOut);
  const coverY = -120 * pPull - 1500 * pOff;
  const coverLead = -0.6 * Math.min(1, pPull * 4)
                    * (1 - prog(frame, T.coverPull + 0.1, 0.15, WIPE))
                    - 0.35 * prog(frame, T.coverOff, 0.2, WIPE);
  /* heavy card, not a plate: the bottom edge arcs 4-5px while in motion,
     dead flat before and after (silhouette only, texture never warps).
     V4.7: the TOP edge flexes too during the pull — 6px, dying by +12f */
  const coverBow = 2.5 * Math.sin(Math.PI * pPull) + 5 * Math.sin(Math.PI * pOff);
  const coverTopBow = 6 * Math.sin(Math.PI * prog(frame, T.coverPull, 0.2, Easing.linear));
  const coverGone = frame >= f(T.coverOff + 0.45);

  /* deck gather: 108px spacing collapses to 48px — a tab stack */
  const pGather = prog(frame, T.gather, 0.35, ease.drawer);

  /* press page: corner-lag (top-right lands 3 frames late, ~0.28°) */
  const pPage = prog(frame, T.page, T.pageLen);
  const pageInY = 1860 * (1 - pPage);
  const cornerLag = -0.28 * (1 - prog(frame, T.page + 0.05, T.pageLen, WIPE));
  /* material answer around the contact frame (council, frame-exact):
     21.40 corners 1 frame behind · 21.41 centre bows 2px · 21.42 returns
     0.7px · 21.43 dead flat. Silhouette only, never a scale. */
  const pageContactF = f(T.page + T.pageLen);
  const pageBow = frame === pageContactF ? 2 : frame === pageContactF + 1 ? 0.7 : 0;
  const pageCornerLift = frame === pageContactF - 1 ? 1.5 : 0;
  /* V4.7 (council): the 1080px leading edge is not a perfect horizontal —
     it carries the fixed 5-point profile [0,+5,−2,+3,0], amplitude dying to
     zero over the flight's first 12 frames */
  const pageWob = 1 - prog(frame, T.page, 0.2, Easing.linear);
  const pageImpact = frame >= pageContactF && frame <= pageContactF + 1;
  /* loop lifts: the trailing edge lags a beat — sheets, not rigid plates */
  const pLift = prog(frame, T.pageLift, 0.7, ease.inOut);
  const cLift = prog(frame, T.cobaltLift, 0.7, ease.inOut);
  const pageOutY = -2350 * pLift;
  const liftRotP = 0.35 * Math.sin(Math.PI * pLift);
  const liftRotC = 0.3 * Math.sin(Math.PI * cLift);

  /* gold hover: up −18 (visible!), page passes beneath, down with ≤2px settle */
  const goldHoverY = -18 * prog(frame, T.goldUp, 0.083, WIPE)
                     + 18 * prog(frame, T.goldDown, T.goldDownLen);
  const goldHoverR = 1.2 * prog(frame, T.goldUp, 0.083, WIPE)
                     - 1.2 * prog(frame, T.goldDown, T.goldDownLen, WIPE);
  const goldLanded2 = frame >= f(T.goldDown + T.goldDownLen);
  const goldHovering = frame >= f(T.goldUp) && !goldLanded2;

  /* opening items exist only until the board has fully covered them at
     05.21 (unmounting at the council's 4.9 would pop them off in plain
     sight mid-cover; 5.4 is the first invisible frame) — and they re-enter
     across the loop wrap, where tw goes negative */
  const showWallItems = tw < 5.4;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
      <MatterDefs />
      {/* serigraph erosion for printed cobalt lines: ~1px edge break-up */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="v4Serig">
            <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="23" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
          </filter>
          {/* the light pass: ±1px — for printed lines that must stay crisp */}
          <filter id="v4SerigLight">
            <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="2" seed="41" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" />
          </filter>
          {/* V4.8: the wall headline's toner break-up, −20% (3.5 → 2.8) —
              one dominant flaw per frame; wall+photo+type must not all
              shout grunge at once */}
          <filter id="v4InkRough80">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" />
          </filter>
        </defs>
      </svg>
      {/* ════ WALL WORLD (A1) — STATIC. It never moves again (V4.7). ════ */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
        {/* V4.8 (council): sun-bleached lime-plaster Mediterranean wall —
            clean but lived-in. Synthetic static texture (mean #E9E2D7,
            floor #D9D1C4, hairline cracks only, tape ghosts + pinholes
            baked in). No vignette, no moving grain, no SVG overlay. */}
        <div style={{ position: 'absolute', inset: 0, background: '#E9E2D7' }}>
          <Img src={TEX.wallPlaster} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                              objectFit: 'cover' }} />
        </div>

        {/* the standing wall print — part of the wall itself: it is there at
            frame 0 and it is STILL there when the board lifts at 28.00 */}
        <div style={{ position: 'absolute', left: 84, top: 264 }}>
          <Ink problem roughUrl="url(#v4InkRough80)" ghostOpacity={0.176}
               style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.12,
                        letterSpacing: '-0.015em', color: NAVY }}>
            AYNI EV.<br />ÜÇ AYRI İLAN.
          </Ink>
        </div>

        {showWallItems && (
          <>
            {/* THE PILE — one home, printed too many times. ~13 sheet edges
                behind the top copies; the whole pile lands across the loop
                boundary and is settled by 00.21. */}
            <CastShadow frame={fw} x={260} y={470} w={580} h={870} rot={-1}
                        start={T.stack} len={T.stackLen} r={4} />
            <div style={place(fw, T.stack, T.stackLen, { dy: -400, rot0: -2 })}>
              {/* stray edges of the other copies */}
              {(() => { let s7=311; const r=()=>{s7=(s7*1664525+1013904223)>>>0;return s7/4294967296*2-1;};
                return Array.from({ length: 13 }, (_, i) => (
                  <div key={i} style={{ position: 'absolute',
                                        left: 250 + r() * 26, top: 464 + i * 5 + r() * 3,
                                        width: 596 + r() * 18, height: 16,
                                        transform: `rotate(${r() * 1.6}deg)`,
                                        background: i % 2 ? '#F1EBDC' : '#EDE7D6',
                                        boxShadow: '0 1px 2px rgba(10,37,64,0.10)' }} />
                )); })()}
              {/* base copy (the third visible one) */}
              <div style={{ position: 'absolute', left: 270, top: 470, width: 560, height: 860,
                            transform: 'rotate(-0.6deg)', background: '#F3EFE5',
                            clipPath: cutEdge(560, 860, 208, 2.6, 7) }}>
                <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                  objectFit: 'cover', opacity: 0.8 }} />
                {/* V4.8: pre-baked navy-ink duotone PNG (fixed pixels — no
                    CSS/SVG crush; shadow blocks survive H.264) */}
                <div style={{ position: 'absolute', left: 30, top: 30, width: 500, height: 430,
                              clipPath: PHOTO_MASKS.b }}>
                  <Img src={TEX.homeDuoClean} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', left: 32, top: 486 }}>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: '0.04em', color: '#20242B' }}>
                    SATILIK
                  </Ink>
                  <Ink problem style={{ fontFamily: MONO, fontWeight: 500, fontSize: 27, color: '#2A2E36', marginTop: 10 }}>
                    3+1 · Lapta · denize yakın
                  </Ink>
                  <Ink problem marker style={{ fontFamily: MONO, fontSize: 30, letterSpacing: '0.05em', color: '#20242B', marginTop: 10 }}>
                    0533 8•• •• ••
                  </Ink>
                </div>
              </div>

              {/* the top two copies, dealt aside — SAME balcony, SAME tree,
                  SAME framing: the viewer SEES it is one home */}
              {[
                { key: 'L', fx: 10, fy: 940, frot: -4.5, srot: -0.9, sdx: 266, sdy: -434, start: T.cardL, kase: false },
                { key: 'R', fx: 550, fy: 900, frot: 4.5, srot: 1.2, sdx: -278, sdy: -396, start: T.cardR, kase: true },
              ].map((c) => {
                const pC = prog(fw, c.start, 0.5);
                /* material answer at the landing frame: 3px bottom bow, one
                   frame, silhouette only (council V4.7) */
                const cBow = fw === f(c.start + 0.5) ? 3 : 0;
                return (
                  <React.Fragment key={c.key}>
                    {frame !== fw || fw >= f(c.start) - 3 ? (
                      <CastShadow frame={fw} x={c.fx} y={c.fy} w={520} h={620} rot={c.frot}
                                  start={c.start} len={0.5} r={4} />
                    ) : null}
                    <div style={{ position: 'absolute', left: c.fx, top: c.fy, width: 520, height: 620,
                                  transform: `translate(${(1 - pC) * c.sdx}px, ${(1 - pC) * c.sdy}px)
                                              rotate(${c.frot + (1 - pC) * (c.srot - c.frot)}deg)`,
                                  background: '#F5F1E6',
                                  clipPath: cutEdgeBowed(520, 620, 218 + (c.kase ? 3 : 0), 2.4, 6, cBow) }}>
                      <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                        objectFit: 'cover', opacity: 0.7 }} />
                      {/* same home, same framing — only copier-generation
                          differences (soft = WhatsApp, flat = vitrin) */}
                      <div style={{ position: 'absolute', left: 24, top: 24, width: 472, height: 340,
                                    clipPath: PHOTO_MASKS.a }}>
                        <Img src={c.kase ? TEX.homeDuoFlat : TEX.homeDuoSoft}
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'absolute', left: 26, top: 384 }}>
                        <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: '0.04em', color: '#20242B' }}>
                          SATILIK
                        </Ink>
                        <Ink problem style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, color: '#2A2E36', marginTop: 8 }}>
                          3+1 · Lapta{c.kase ? ' · deniz yakın' : ' · denize yakın'}
                        </Ink>
                        <Ink problem marker style={{ fontFamily: MONO, fontSize: 26, letterSpacing: '0.05em', color: '#20242B', marginTop: 8 }}>
                          {c.kase ? '0542 3•• •• ••' : '0533 8•• •• ••'}
                        </Ink>
                      </div>
                      {c.kase && (
                        <div style={{ position: 'absolute', right: 18, top: 14, transform: 'rotate(-8deg)',
                                      border: '2.5px solid rgba(10,37,64,0.5)', padding: '4px 10px' }}>
                          <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.08em',
                                         color: 'rgba(10,37,64,0.62)' }}>HÂLÂ SATILIK MI?</span>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* three price tags, three sources, ON the three copies —
                their centres sit on the −8.3° diagonal the strike will hit */}
            <CastShadow frame={fw} x={380} y={1196} w={340} h={130} rot={2} small start={T.tags[0]} len={T.tagLen} r={3} />
            <div style={place(fw, T.tags[0], T.tagLen, { dy: -140, rot0: -4 })}>
              <Photocopy x={380} y={1196} w={340} h={130} rot={2} seed={61} shadow={false}>
                <div style={{ position: 'absolute', left: 22, top: 12 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>İLAN SİTESİ</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: '#20242B', marginTop: 2 }}>
                    £175.000
                  </Ink>
                </div>
              </Photocopy>
            </div>
            <CastShadow frame={fw} x={30} y={1240} w={340} h={130} rot={-2.4} small start={T.tags[1]} len={T.tagLen} r={3} />
            <div style={place(fw, T.tags[1], T.tagLen, { dy: -140, rot0: 4 })}>
              <Sheet x={30} y={1240} w={340} h={130} rot={-2.4} bg="#F6F2E7" seed={77} amp={4} n={4} fiber={false} shadow={false}>
                <div style={{ position: 'absolute', left: -14, top: 22, width: 24, height: 24,
                              background: '#F6F2E7', clipPath: 'polygon(100% 0, 100% 100%, 0 32%)' }} />
                <div style={{ position: 'absolute', left: 22, top: 12 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>WHATSAPP GRUBU</div>
                  <Ink marker style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: '#23272E', marginTop: 2 }}>
                    ₺11.900.000
                  </Ink>
                </div>
              </Sheet>
            </div>
            <CastShadow frame={fw} x={630} y={1152} w={340} h={130} rot={3.4} small start={T.tags[2]} len={T.tagLen} r={3} />
            <div style={place(fw, T.tags[2], T.tagLen, { dy: -140, rot0: 5 })}>
              <div style={{ position: 'absolute', left: 630, top: 1152, width: 340, height: 130, transform: 'rotate(3.4deg)' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#F1ECDF',
                              clipPath: 'polygon(3% 8%, 96% 0, 100% 88%, 64% 100%, 30% 92%, 0 96%)' }} />
                <div style={{ position: 'absolute', left: 22, top: 12 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>EMLAKÇI VİTRİNİ</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: '#20242B', marginTop: 4 }}>
                    $250.000
                  </Ink>
                </div>
                <Tape x={110} y={-18} rot={-3} w={120} h={30} />
              </div>
            </div>

            {/* the question, pressed OVER the statement: a photocopy band,
                right edge touching first, ≥50 frames of clean read */}
            <CastShadow frame={fw} x={60} y={352} w={960} h={150} rot={-0.8}
                        start={T.qband} len={T.qbandLen} r={4} />
            <div style={place(fw, T.qband, T.qbandLen, { dy: -56, rot0: 2.4 })}>
              <Photocopy x={60} y={352} w={960} h={150} rot={-0.8} seed={97} shadow={false}>
                <div style={{ position: 'absolute', left: 36, top: 34 }}>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58,
                                        letterSpacing: '-0.01em', color: NAVY }}>
                    ÜÇ FİYAT. HANGİSİ DOĞRU?
                  </Ink>
                </div>
                {/* the question is ALREADY Evlek's: a cobalt tab on the band,
                    riding with it — the film's author signs its own question */}
                <div style={{ position: 'absolute', right: 36, top: -30, width: 120, height: 44,
                              background: COBALT, clipPath: cutEdge(120, 44, 93, 2, 3) }}>
                  <Wordmark w={71} color="#FFFFFF" style={{ position: 'absolute', left: 24, top: 10 }} />
                </div>
              </Photocopy>
            </div>

            {/* the film's FIRST cobalt: one −8.3° strike through all three.
                Pressed ink (serigraph erosion), clipped BUTT ends — a redaction
                bar, not a marker doodle (council V4.7) */}
            <div style={{ position: 'absolute', left: 60, top: 1300, width: 1030, height: 60,
                          transform: 'rotate(-8.3deg)', transformOrigin: 'left center',
                          filter: 'url(#v4Serig)', ...wipe(fw, T.strike, 0.27) }}>
              <HandLine x={0} y={10} w={1010} seed={31} sw={24} cap="butt" />
            </div>
          </>
        )}
        </div>
      </div>

      {/* ════ THE CREAM PRESS BOARD — an OBJECT, not a set change. It drops
           over the wall at 04.48 (drawer, bowed leading edge, edge-local
           shadow), is the stage base for A2–A5, and lifts at 28.00 with a
           growing ambient to reveal the wall exactly as it was. ════ */}
      <div style={{ position: 'absolute', inset: 0,
                    transform: `translateY(${boardY}px) rotate(${boardRot}deg)`,
                    transformOrigin: '100% 0%',
                    filter: boardMoving
                      ? `drop-shadow(0 ${18 + 14 * pBoardLift}px ${30 + 22 * pBoardLift}px rgba(10,37,64,${0.14 + 0.05 * pBoardLift}))`
                      : 'drop-shadow(0 6px 16px rgba(10,37,64,0.12))' }}>
        {/* the shadow lives ONLY 14-20px under the moving edge */}
        {boardMoving && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', height: 18,
                        background: 'linear-gradient(to bottom, rgba(10,37,64,0.18), rgba(10,37,64,0))' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: CREAM,
                      clipPath: boardMoving
                        ? cutEdgeBowed(1080, 1920, 777, 10, 16, boardBow)
                        : cutEdge(1080, 1920, 777, 10, 16) }}>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            <rect width="1080" height="1920" filter="url(#mTooth)" />
          </svg>
        </div>
      </div>

      {t < 7 && <ApproachShadow frame={frame} start={T.cobalt} />}

      {/* ════ COBALT WORLD (A2–A4) ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.cobalt - 0.05 ? 1 : 0,
                    transform: `translateY(${cobaltInY - 2250 * cLift}px) rotate(${liftRotC}deg)`,
                    transformOrigin: '30% 0%' }}>
        <CobaltSheet top={128} landed={frame >= f(T.cobalt + 0.72)}>
          {/* the ONE promise everything else must prove */}
          <div style={{ position: 'absolute', left: 108, top: 250 }}>
            {/* ONE press pass, top to bottom — both lines are a single printed
                mass, 9 frames, linear (council V4.7: no more two-part wipe) */}
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                          letterSpacing: '-0.015em', color: '#FFFFFF', ...printPress(frame, T.hl1, 0.15) }}>
              {trUpper('Evlek ne aradığını')}<br />{trUpper('anlar.')}
            </div>
            {/* the underline is printed too: ±1px serigraph deviation */}
            <div style={{ ...wipe(frame, T.under, 0.25), position: 'absolute', left: 0, top: 0,
                          width: 360, height: 220, filter: 'url(#v4SerigLight)' }}>
              <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
            </div>
          </div>

          {/* SEARCH RAIL — rendered UNDER the dossier so it can slide out of
              it edge-first (12px at 08.41, fully out by 08.48, set at 08.59) */}
          {t < 12.4 && (() => {
            const railEntryX = -1088 * (1 - prog(frame, T.rail, T.railLen, Easing.bezier(0.3, 1.05, 0.55, 1)))
                               - prog(frame, T.railExit, 0.4, ease.drawer) * 1400;
            const railLanded = frame >= f(T.rail + T.railLen);
            return (
            <>
              {/* the rail's shadow travels WITH the rail, 14px ahead of its
                  leading edge — never a screen-wide fog. It appears at 08.38
                  (3 frames early), the paper edge follows at 08.41, and it
                  hardens on the 08.59 contact frame. */}
              <div style={{ opacity: frame >= f(T.rail) - 3 && frame < f(T.railExit + 0.4) ? 1 : 0,
                            transform: `translateX(${railEntryX + (railLanded ? 0 : 14)}px)` }}>
                {railLanded ? (
                  <>
                    <div style={{ position: 'absolute', left: -16, top: 563, width: 1112, height: 102,
                                  transform: 'rotate(-0.5deg)', borderRadius: 3,
                                  background: 'rgba(10,37,64,0.20)', filter: 'blur(8px)' }} />
                    <div style={{ position: 'absolute', left: -16, top: 561, width: 1112, height: 102,
                                  transform: 'rotate(-0.5deg)', borderRadius: 3,
                                  background: 'rgba(10,37,64,0.12)', filter: 'blur(2px)' }} />
                  </>
                ) : (
                  <div style={{ position: 'absolute', left: -16, top: 570, width: 1112, height: 102,
                                transform: 'rotate(-0.5deg)', borderRadius: 3,
                                background: 'rgba(10,37,64,0.15)', filter: 'blur(20px)' }} />
                )}
              </div>
              {/* edge-first: 8px of leading edge on the flight's first frame */}
              <div style={{ opacity: frame >= f(T.rail) && frame < f(T.railExit + 0.4) ? 1 : 0,
                            transform: `translateX(${railEntryX}px)` }}>
                <Sheet x={-16} y={560} w={1112} h={102} rot={-0.5} seed={88} amp={2.4} n={5}
                       bg="#F8F4E9" shadow={false} texOpacity={0.68}>
                  <div style={{ position: 'absolute', left: 78, top: 29, fontFamily: MONO, fontSize: 38,
                                letterSpacing: '0.1em', color: 'rgba(10,37,64,0.68)' }}>ARA:</div>
                  <div style={{ position: 'absolute', left: 296, top: 27, fontFamily: SANS, fontWeight: 600,
                                fontSize: 43, color: NAVY, whiteSpace: 'nowrap', display: 'flex', gap: 28 }}>
                    <span>Girne’de,</span><span>denize yakın,</span><span>3+1</span>
                  </div>
                  {/* REAL die-cut voids: holes through to the cobalt, with a
                      cut inner edge, perforation remnants and loose fibres */}
                  {RAIL_CHIPS.map(([k, x, w], i) => (
                    <div key={`v${k}`} style={{ position: 'absolute', left: x, top: 16, width: w, height: 70,
                                                opacity: frame >= f(T.chips[i]) ? 1 : 0,
                                                background: COBALT, clipPath: cutEdge(w, 70, 53 + i * 7, 1.8, 4),
                                                boxShadow: 'inset 0 2px 3px rgba(0,10,40,0.45)' }}>
                      <div style={{ position: 'absolute', inset: 2, border: '1px solid rgba(255,255,255,0.20)' }} />
                      <div style={{ position: 'absolute', inset: 5, border: '1.5px dashed rgba(255,255,255,0.16)' }} />
                      {[0.18, 0.55, 0.82].map((fx, j) => (
                        <div key={j} style={{ position: 'absolute', left: `${fx * 100}%`, top: j % 2 ? -2 : 66,
                                              width: 7, height: 4, background: '#F8F4E9',
                                              transform: `rotate(${j * 40 - 30}deg)` }} />
                      ))}
                    </div>
                  ))}
                  {RAIL_CHIPS.map(([k, x, w], i) => (
                    <CastShadow key={`s${k}`} frame={frame} x={x} y={16} w={w} h={70} small
                                start={T.chips[i]} len={T.chipLen} r={2} />
                  ))}
                  {/* the pieces themselves: SAME rail material (not white UI),
                      the keyword prints onto them via wipe IN MID-AIR */}
                  {RAIL_CHIPS.map(([txt, x, w], i) => (
                    <div key={txt} style={{ position: 'absolute', left: x, top: 16, width: w, height: 70,
                                            ...place(frame, T.chips[i], T.chipLen, { dy: -22, rot0: [-2, 1.6, -1.8][i] }) }}>
                      <div style={{ position: 'absolute', inset: 0, background: '#F8F4E9',
                                    clipPath: cutEdge(w, 70, 53 + i * 7, 1.8, 4),
                                    transform: `rotate(${[-0.4, 0.2, -0.25][i]}deg)` }}>
                        <Img src={TEX.cardstock}
                             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                      objectFit: 'cover', opacity: 0.75,
                                      objectPosition: `${20 + i * 25}% 40%` }} />
                        {/* dry-ink print: LINEAR mask over 6 frames — a press
                            head, not a reveal (council P1: was 2 frames) */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                                      padding: '0 0 0 44px', ...wipe(frame, T.chips[i] + 0.05, 0.1, Easing.linear) }}>
                          <Punch x={14} y={28} />
                          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: [30, 30, 33][i], color: NAVY,
                                         letterSpacing: '0.02em' }}>{txt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Sheet>
              </div>
            </>
            );
          })()}

          {/* THE EVLEK DOSSIER — arrives CLOSED; the search happens; then the
              cover pulls back 120px and lifts away: the matching home appears */}
          <CastShadow frame={frame} x={cardX} y={cardY} w={812} h={1010}
                      rot={cardRot} start={T.hero} len={0.55} r={5} />
          <div style={{ transform: `translate(${cardX - CARD_IN.x}px, ${cardY - CARD_IN.y}px)` }}>
            <div style={place(frame, T.hero, 0.55, { dx: 90, dy: 240, rot0: 4.8 })}>
              <CardStock x={CARD_IN.x} y={CARD_IN.y} w={812} h={1010} rot={cardRot} seed={23} pad={0}
                         style={{ boxShadow: 'none' }}>
                <div style={{ position: 'absolute', right: 248, top: -14, width: 128, height: 66,
                              background: COBALT, clipPath: cutEdge(128, 66, 91, 2.4, 4) }}>
                  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.16em', color: '#FFFFFF',
                                position: 'absolute', left: 18, top: 20 }}>EVLEK</div>
                </div>
                <div style={{ position: 'absolute', left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h,
                              background: 'rgba(10,37,64,0.10)',
                              boxShadow: 'inset 0 2px 3px rgba(10,37,64,0.22), inset 0 -1px 0 rgba(255,255,255,0.5)' }} />
                <div style={{ position: 'absolute', left: 36, top: 36, width: 740, height: 560 }}>
                  <PhotoSlot w={740} h={560} mask="a" src={HOME.ext} />
                </div>
                <div style={{ position: 'absolute', left: 44, top: 650 }}>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, color: NAVY }}>
                    Girne’de denize yakın 3+1
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 29, letterSpacing: '0.04em',
                                color: 'rgba(10,37,64,0.62)', marginTop: 18 }}>
                    LAPTA · 3+1 · 2 BANYO · 120 M² · EŞYALI
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '0.1em',
                                color: 'rgba(10,37,64,0.45)', marginTop: 46 }}>
                    GİRNE · SATILIK · EVLEK.APP
                  </div>
                </div>
                {/* the price is NOT printed: it is a separate paper ticket
                    resting on the card — later it moves to the market ruler */}
                {frame < f(T.ticket) && (
                  <div style={{ position: 'absolute', left: 44, top: 540, width: 264, height: 74,
                                transform: 'rotate(-0.6deg)',
                                filter: 'drop-shadow(0 2px 4px rgba(10,37,64,0.18))' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                                  clipPath: cutEdge(264, 74, 57, 1.6, 3) }} />
                    <div style={{ position: 'absolute', left: 24, top: 10, fontFamily: SANS, fontWeight: 800,
                                  fontSize: 46, color: NAVY }}>£175.000</div>
                  </div>
                )}
                {/* THE COVER — a closed file until the search has run */}
                {!coverGone && (
                  <div style={{ position: 'absolute', left: 0, top: -14, width: 812, height: 1024,
                                transform: `translateY(${coverY}px) rotate(${coverLead}deg)`,
                                transformOrigin: '85% 20%',
                                filter: frame >= f(T.coverPull)
                                  ? 'drop-shadow(0 18px 28px rgba(10,37,64,0.20))'
                                  : 'drop-shadow(0 2px 4px rgba(10,37,64,0.14))' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#FDFBF6',
                                  clipPath: cutEdgeBowed(812, 1024, 141, 2.6, 8, coverBow, 0, coverTopBow) }}>
                      <Img src={TEX.cardstock} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                        objectFit: 'cover', opacity: 0.85, objectPosition: '30% 70%' }} />
                    </div>
                    <div style={{ position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontSize: 22,
                                  letterSpacing: '0.16em', color: 'rgba(10,37,64,0.45)' }}>
                      DOSYA 01 · GİRNE
                    </div>
                    <Wordmark w={236} color={NAVY} style={{ position: 'absolute', left: 288, top: 452 }} />
                    <div style={{ position: 'absolute', left: 296, top: 560, fontFamily: MONO, fontSize: 23,
                                  letterSpacing: '0.12em', color: 'rgba(10,37,64,0.5)' }}>
                      GİRNE ARAMASI
                    </div>
                    {/* the dark paper cross-section at the closed cover's foot */}
                    {frame < f(T.coverOff) && (
                      <div style={{ position: 'absolute', left: 6, right: 6, bottom: 0, height: 2,
                                    background: 'rgba(10,37,64,0.28)' }} />
                    )}
                  </div>
                )}
              </CardStock>
            </div>
          </div>

          {/* INFO WORLD (A3) */}
          {t < 17 && (
            <div style={{ transform: `translateY(${prog(frame, T.infoExit, 0.5, ease.drawer) * 1600}px)` }}>
              {/* label leaves with the gather — never three headlines at once */}
              <div style={{ transform: `translateX(${-1200 * prog(frame, T.gather, 0.35, ease.drawer)}px)` }}>
                <CastShadow frame={frame} x={108} y={566} w={640} h={88} small start={T.label} len={0.36} r={3} />
                <div style={place(frame, T.label, 0.36, { dy: -150, rot0: -3 })}>
                  <Sheet x={108} y={566} w={640} h={88} rot={-0.6} seed={141} amp={2} n={4} fiber={false} shadow={false}>
                    <div style={{ position: 'absolute', left: 26, top: 18, fontFamily: SANS, fontWeight: 650,
                                  fontSize: 42, letterSpacing: '-0.005em', color: NAVY }}>
                      BEŞ DİL. AYNI EV.
                    </div>
                  </Sheet>
                </div>
              </div>
              {/* V4.7: the gathered 5-tab stack yields the stage — the whole
                  group rises 64px as the market band arrives beneath it */}
              <div style={{ transform: `translateY(${-64 * prog(frame, T.band, 0.4, ease.inOut)}px)` }}>
              {[
                { tag: 'TR', line: <>Lapta, Girne’de 3+1 daire</>, sub: <>£175.000 · 120 M² · 3+1</> },
                { tag: 'EN', line: <>3+1 apartment in Lapta, Kyrenia</>, sub: <>£175,000 · 120 M² · 3+1</> },
                { tag: 'RU', line: <>Квартира 3+1 в Лапте, Кирения</>, sub: <>£175 000 · 120 М² · 3+1</> },
                { tag: 'DE', line: <>3+1-Wohnung in Lapta, Kyrenia</>, sub: <>£175.000 · 120 M² · 3+1</> },
                /* bidi-safe: every numeric token is an LTR island — 3+1 can
                   never visually flip to 1+3 inside the RTL sentence */
                { tag: 'AR', rtl: true,
                  line: <>شقة <bdi dir="ltr">3+1</bdi> في لابتا، كيرينيا</>,
                  sub: <><bdi dir="ltr">£175,000</bdi> · <bdi dir="ltr">120</bdi> م² · <bdi dir="ltr">3+1</bdi></> },
              ].map((c, i) => {
                const start = T.lang + i * T.langStep;
                const x = 108 + [0, 20, 36, 22, 8][i];
                const y = 664 + i * 108;
                const gy = -i * 60 * pGather; // collapse 108 → 48px tab stack
                return (
                  <div key={c.tag} style={{ transform: `translateY(${gy}px)` }}>
                    <CastShadow frame={frame} x={x} y={y} w={800} h={122} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                small start={start} len={0.4} r={4} />
                    <div style={place(frame, start, 0.4, { dy: -200, rot0: [-4, 3.5, -3, 4, -3.5][i] })}>
                      <CardStock x={x} y={y} w={800} h={122} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                 seed={101 + i} fiberOpacity={0.58} style={{ boxShadow: 'none' }}>
                        <div style={{ position: 'absolute', left: 22, top: 12, width: 74, height: 36,
                                      background: c.tag === 'AR' ? COBALT : 'transparent',
                                      border: c.tag === 'AR' ? 'none' : '2.5px solid rgba(10,37,64,0.5)',
                                      transform: `rotate(${[-2.5, 1.8, -1.2, 2.2, -1.6][i]}deg)`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.08em',
                                         color: c.tag === 'AR' ? '#FFFFFF' : 'rgba(10,37,64,0.72)' }}>{c.tag}</span>
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 116, right: 24, top: 16,
                                      fontFamily: SANS, fontWeight: 600, fontSize: 29, color: NAVY,
                                      textAlign: c.rtl ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {c.line}
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 116, right: 24, top: 70, fontFamily: MONO, fontSize: 22,
                                      letterSpacing: '0.05em', color: 'rgba(10,37,64,0.72)',
                                      textAlign: c.rtl ? 'right' : 'left' }}>
                          {c.sub}
                        </div>
                      </CardStock>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* the market band — the ruler waits for the REAL ticket */}
              <CastShadow frame={frame} x={84} y={1218} w={912} h={470} rot={0.7}
                          start={T.band} len={0.6} r={4} />
              <div style={place(frame, T.band, 0.6, { dy: 320, rot0: -2.5 })}>
                <Sheet x={84} y={1218} w={912} h={470} rot={0.7} seed={131} amp={3.4} n={8} shadow={false}
                       texOpacity={0.92}>
                  <div style={{ position: 'absolute', left: 52, top: 38, fontFamily: SANS, fontWeight: 800,
                                fontSize: 52, letterSpacing: '-0.01em', color: NAVY }}>
                    BU FİYAT NORMAL Mİ?
                  </div>
                  <div style={{ position: 'absolute', left: 54, top: 112, fontFamily: MONO, fontSize: 30,
                                letterSpacing: '0.07em', color: 'rgba(10,37,64,0.78)' }}>
                    GİRNE · 3+1 DAİRE · 19 AKTİF İLAN
                  </div>
                  <svg width="800" height="150" style={{ position: 'absolute', left: 52, top: 172 }}>
                    <line x1="0" y1="110" x2="800" y2="110" stroke={NAVY} strokeWidth="3" />
                    {Array.from({ length: 25 }, (_, i) => (
                      <line key={i} x1={(800 / 24) * i} y1={i % 4 === 0 ? 86 : 96} x2={(800 / 24) * i} y2="110"
                            stroke={NAVY} strokeWidth={i % 4 === 0 ? 2.4 : 1.4} opacity={i % 4 === 0 ? 0.9 : 0.5} />
                    ))}
                    <g transform="translate(141.7 0)">
                      {/* the marker answers the ticket's touch: 2px sway,
                          one return — a mechanical relationship, no pulse */}
                      <g style={{ ...place(frame, T.marker, 0.3, { dy: -90 }),
                                  transform: `${place(frame, T.marker, 0.3, { dy: -90 }).transform}
                                              translateX(${2 * prog(frame, T.ticket + 0.45, 0.05, WIPE)
                                                           * (1 - prog(frame, T.ticket + 0.5, 0.12))}px)` }}>
                        <path d="M0 74 L-16 38 L16 38 Z" fill={COBALT} />
                        <line x1="0" y1="74" x2="0" y2="110" stroke={COBALT} strokeWidth="4" />
                      </g>
                    </g>
                  </svg>
                  <div style={{ position: 'absolute', left: 52, top: 296, fontFamily: MONO, fontSize: 24,
                                color: 'rgba(10,37,64,0.85)' }}>£90.000</div>
                  <div style={{ position: 'absolute', right: 58, top: 296, fontFamily: MONO, fontSize: 24,
                                color: 'rgba(10,37,64,0.85)' }}>£570.000</div>
                  <div style={{ position: 'absolute', left: 240, top: 236, fontFamily: MONO, fontSize: 23,
                                letterSpacing: '0.06em', color: 'rgba(10,37,64,0.6)',
                                ...wipe(frame, T.tline, 0.25) }}>
                    BU EV · £1.458/M²
                  </div>
                  <div style={{ position: 'absolute', left: 52, bottom: 32, fontFamily: MONO, fontSize: 22,
                                letterSpacing: '0.08em', color: 'rgba(10,37,64,0.58)' }}>
                    KAYNAK: EVLEK.APP CANLI İLAN VERİSİ
                  </div>
                </Sheet>
              </div>

              {/* THE PRICE TICKET — lifted off the card, set on its true spot
                  on the ruler (no second print of the price, one real object) */}
              {frame >= f(T.ticket) && (() => {
                const p = prog(frame, T.ticket, 0.45);
                const tx = 142 + (320 - 142) * p;
                const ty = 1330 + (1386 - 1330) * p - Math.sin(Math.PI * Math.min(1, p)) * 72;
                return (
                  <div style={{ position: 'absolute', left: tx, top: ty, width: 264, height: 74,
                                transform: `rotate(${-0.6 + 1.3 * p}deg)`,
                                filter: p < 1 ? 'drop-shadow(0 10px 16px rgba(10,37,64,0.16))'
                                              : 'drop-shadow(0 3px 6px rgba(10,37,64,0.18))' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                                  clipPath: cutEdge(264, 74, 57, 1.6, 3) }} />
                    <div style={{ position: 'absolute', left: 24, top: 10, fontFamily: SANS, fontWeight: 800,
                                  fontSize: 46, color: NAVY }}>£175.000</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* MANIFESTO STRIP (A4) */}
          <CastShadow frame={frame} x={56} y={226} w={968} h={244} rot={-0.4}
                      start={T.manifesto} len={0.53} r={4} />
          <div style={place(frame, T.manifesto, 0.53, { dy: -260, rot0: 3 })}>
            <Sheet x={56} y={226} w={968} h={244} rot={-0.4} seed={171} amp={3} n={8} fiber={false} shadow={false}>
              <div style={{ position: 'absolute', left: 52, top: 82, fontFamily: SANS, fontWeight: 800,
                            fontSize: 56, letterSpacing: '-0.015em', color: NAVY }}>
                GERİYE SADECE EV KALIR.
              </div>
            </Sheet>
          </div>
        </CobaltSheet>
      </div>

      {t > 19 && t < 22 && <ApproachShadow frame={frame} start={T.page + 1 / 60} />}

      {/* ════ PRESS WORLD (A5) — top-right corner lands 3 frames late ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.page - 0.05 ? 1 : 0,
                    transform: `translateY(${pageOutY}px) rotate(${liftRotP}deg)`,
                    transformOrigin: '25% 0%' }}>
        <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                      transform: `rotate(${-0.35 + cornerLag}deg) translateY(${pageInY}px)`,
                      transformOrigin: '20% 80%',
                      filter: pageImpact
                        ? 'drop-shadow(0 3px 4px rgba(10,37,64,0.225)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))'
                        : frame >= pageContactF
                          ? 'drop-shadow(0 3px 8px rgba(10,37,64,0.20)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))'
                          : 'drop-shadow(0 18px 30px rgba(10,37,64,0.16))' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FBF8F1',
                        clipPath: cutEdgeBowed(936, 1728, 7, 2.2, 10, pageBow, pageCornerLift, 0, pageWob) }}>
            <Img src={TEX.press} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover', opacity: 0.8 }} />
            <svg width="936" height="1728" style={{ position: 'absolute', inset: 0 }}>
              <rect width="936" height="1728" filter="url(#mTooth)" opacity="0.5" />
            </svg>
          </div>
          <CropMarks w={936} h={1728} />
          <div style={{ position: 'absolute', right: 64, top: 64, fontFamily: MONO, fontSize: 22,
                        letterSpacing: '0.14em', color: 'rgba(10,37,64,0.4)' }}>
            EVLEK BASKI 01 · KKTC
          </div>

          <div style={{ position: 'absolute', left: 84, top: 496 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, lineHeight: 1.05,
                          letterSpacing: '-0.02em', color: NAVY }}>
              {/* two single-mass press passes, 8f each, 4f of silence between
                  (council V4.7: never a left-to-right letter reveal) */}
              <div style={printPress(frame, T.slog1, 0.133)}>Kıbrıs’ta</div>
              <div style={printPress(frame, T.slog2, 0.133)}>doğru ev.</div>
            </div>
          </div>

          {/* V4.7: the approval line is GONE — the council ruled the final
              page needs no second redaction gesture; the strike belongs to
              the problem, not the answer. Nothing replaces it. */}

          <div style={{ position: 'absolute', left: 88, top: 858, fontFamily: MONO, fontWeight: 600,
                        fontSize: 50, letterSpacing: '0.04em', color: NAVY, ...wipe(frame, T.url, 0.25) }}>
            evlek.app
          </div>

          <CastShadow frame={frame} x={84} y={1060} w={768} h={250} start={T.proof} len={T.proofLen} r={8} />
          <div style={place(frame, T.proof, T.proofLen,
                            { dy: 150, rot0: 2.2, easing: Easing.bezier(0.32, 1.16, 0.66, 1) })}>
            <div style={{ position: 'absolute', left: 84, top: 1060, width: 768, height: 250,
                          background: '#F7F3EA', borderRadius: stockCorners(83) }}>
              <Img src={TEX.cardstock} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                objectFit: 'cover', opacity: 0.55, borderRadius: stockCorners(83),
                                                objectPosition: '64% 38%' }} />
              <div style={{ position: 'absolute', left: 26, top: 26, width: 250, height: 198 }}>
                <PhotoSlot w={250} h={198} mask="b" src={HOME.ext} />
              </div>
              <div style={{ position: 'absolute', left: 306, top: 40 }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: NAVY }}>£175.000</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 29, color: NAVY, marginTop: 8 }}>
                  Girne’de denize yakın 3+1
                </div>
                <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                              color: 'rgba(10,37,64,0.6)', marginTop: 12 }}>
                  LAPTA · 120 M² · SATILIK
                </div>
              </div>
            </div>
          </div>

          {/* the wordmark is PRESSED in one 14-frame roller pass — a single
              SVG mass, then absolute stillness until the lift (council V4.7) */}
          <div style={{ ...printPress(frame, T.mark, T.markLen), position: 'absolute', left: 70, top: 1350, width: 460, height: 160 }}>
            <Wordmark w={430} color={NAVY} style={{ position: 'absolute', left: 0, top: 0 }} />
          </div>
        </div>
      </div>

      {/* ════ THE GOLD TAB — ONE object, never hidden. It hovers −18px in
           plain sight while the page slides beneath it, and both settle on
           the very same frame (21.41, ≤2px overshoot on the return). ════ */}
      <div style={{ transform: `translateY(${pageOutY}px)` }}>
        {frame < f(T.goldUp) && (
          <CastShadow frame={frame} x={TAB.x} y={TAB.y} w={168} h={86} small
                      start={T.gold} len={T.goldLen} r={3} />
        )}
        {goldHovering && (
          <div style={{ position: 'absolute', left: TAB.x + 4, top: TAB.y + 10, width: 168, height: 86,
                        borderRadius: 3, background: 'rgba(10,37,64,0.09)', filter: 'blur(12px)' }} />
        )}
        {goldLanded2 && (
          <>
            <div style={{ position: 'absolute', left: TAB.x, top: TAB.y + 2, width: 168, height: 86,
                          borderRadius: 3, background: 'rgba(10,37,64,0.16)', filter: 'blur(5px)' }} />
            <div style={{ position: 'absolute', left: TAB.x, top: TAB.y + 1, width: 168, height: 86,
                          borderRadius: 3, background: 'rgba(10,37,64,0.10)', filter: 'blur(1.5px)' }} />
          </>
        )}
        <div style={{
          opacity: frame >= f(T.gold) ? 1 : 0,
          transform: `${place(frame, T.gold, T.goldLen, { dx: 320, rot0: 7.5 }).transform} translateY(${goldHoverY}px) rotate(${goldHoverR}deg)`,
        }}>
          <div style={{ position: 'absolute', left: TAB.x, top: TAB.y, width: 168, height: 86,
                        transform: 'rotate(1.6deg)' }}>
            {/* gold STOCK, not a UI badge: object-locked low-frequency fibre
                (~2-3%) + silkscreen break-up (~1%); mean stays #C9A157.
                V4.7: 2px pressure bow on the bottom edge, contact frame only */}
            <div style={{ position: 'absolute', inset: 0, background: GOLD,
                          clipPath: cutEdgeBowed(168, 86, 3, 2.2, 4,
                            frame === f(T.gold + T.goldLen) ? 2 : 0) }}>
              <svg width="168" height="86" style={{ position: 'absolute', inset: 0 }}>
                <rect width="168" height="86" filter="url(#mFiber)" opacity="0.6" />
                <rect width="168" height="86" filter="url(#mToner)" opacity="0.14" />
              </svg>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NAVY,
                          position: 'absolute', left: 34, top: 16 }}>BU.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
