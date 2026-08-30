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
const cutEdgeBowed = (w, h, seed = 1, amp = 3, n = 7, bow = 0) => {
  let s = seed >>> 0;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s / 4294967296) * 2 - 1; };
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([(w * i) / n, r() * amp]);
  for (let i = 1; i <= n; i++) pts.push([w + r() * amp, (h * i) / n]);
  for (let i = 1; i <= n; i++) pts.push([w - (w * i) / n, h + r() * amp + bow * Math.sin(Math.PI * (i / n))]);
  for (let i = 1; i < n; i++) pts.push([r() * amp, h - (h * i) / n]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
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
  if (!landed) {
    return (
      <>
        {small ? blob(5, 8, 13, 0.08) : blob(10, 16, 26, 0.09, graded ? grad(0.11) : null)}
        {small ? blob(0, 2, 4, 0.09) : blob(0, 3, 7, 0.10, graded ? grad(0.12) : null)}
      </>
    );
  }
  return (
    <>
      {small ? blob(0, 2, 5, 0.16) : blob(0, 3, 7, 0.20, graded ? grad(0.22) : null)}
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
  sheet: -0.05, tape: 0.62, head: 0.27, scribble: 0.567,
  scrapA: 1.25, scrapB: 1.6, scrapC: 1.95, verdict: 3.55, strike: 4.55,
  /* A1 dead zone cut to 18 frames: strike done 4.82 → cobalt body 05.09 */
  wallExit: 5.1, cobalt: 5.15,
  hl1: 6.05, hl2: 6.3, under: 6.65,
  hero: 7.85,                                   // the CLOSED dossier arrives
  rail: 8.6833, railLen: 0.3,                   // slides out of the dossier
  chips: [10.183, 10.483, 10.783], chipLen: 0.42, // after 84 clean frames
  coverPull: 11.1, coverOff: 11.45,             // the reveal: search → result
  railExit: 11.85,
  label: 12.15, lang: 12.4, langStep: 0.2,
  gather: 13.85,                                // deck → 5-tab stack
  band: 14.0, marker: 14.7, ticket: 14.85, tline: 15.35,
  infoExit: 16.05,
  glide: 16.55, manifesto: 17.833,
  gold: 19.917, goldLen: 0.267,
  goldUp: 20.883, goldDown: 21.467, goldDownLen: 0.216, // hover, never hidden
  page: 20.9167, pageLen: 0.7667,
  slog1: 21.9, slog2: 22.15, url: 22.65,
  proof: 22.95, proofLen: 0.45, mark: 23.65, line: 24.1,
  pageLift: 26.5, cobaltLift: 27.1, wallBack: 27.55, wallBackLen: 1.9,
};

const CARD_IN = { x: 134, y: 742, rot: -2 };
const CARD_AL = { x: 200, y: 632, rot: 0 };
const TAB = { x: 768, y: 608 };
const SLOT = { x: 576, y: 4, w: 152, h: 18 };
/* chip x-positions centred on the sentence's word spans (26px word gaps) */
const RAIL_CHIPS = [['GİRNE', 292, 196], ['DENİZE YAKIN', 475, 300], ['3+1', 742, 136]];

export const Film30v4 = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const fw = frame >= f(28.5) ? frame - 1800 : frame;
  const tw = fw / 60;

  const wallY = t < 15
    ? -2150 * prog(frame, T.wallExit, 0.55, ease.drawer)
    : -2150 * (1 - prog(frame, T.wallBack, T.wallBackLen, ease.drawer));
  const wallReturning = t >= 15 && frame < f(T.wallBack + T.wallBackLen);

  const cobaltInY = 1920 * (1 - prog(frame, T.cobalt, 0.72));

  /* hero card beats (creative move: the card breathes between acts) */
  const b1 = prog(frame, 12.05, 0.5, ease.inOut);   // language beat: +48/+64
  const b2 = prog(frame, 13.7, 0.5, ease.inOut);    // price beat: → −36/−52
  const beatX = 48 * b1 - 84 * b2;
  const beatY = 64 * b1 - 116 * b2;
  const g = prog(frame, T.glide, 0.55);             // alignment (one overshoot)
  const cardX = CARD_IN.x + beatX + (CARD_AL.x - (CARD_IN.x - 36)) * g;
  const cardY = CARD_IN.y + beatY + (CARD_AL.y - (CARD_IN.y - 52)) * g;
  const cardRot = CARD_IN.rot + (CARD_AL.rot - CARD_IN.rot) * g;

  /* dossier cover: 120px pull, then lifted away. The lifted corner leads the
     body in the first frames — heavy card, not a rigid plate. */
  const pPull = prog(frame, T.coverPull, 0.3, ease.drawer);
  const coverY = -120 * pPull - 1500 * prog(frame, T.coverOff, 0.45, ease.inOut);
  const coverLead = -0.45 * Math.min(1, pPull * 4)
                    * (1 - prog(frame, T.coverPull + 0.1, 0.15, WIPE))
                    - 0.3 * prog(frame, T.coverOff, 0.2, WIPE);
  const coverGone = frame >= f(T.coverOff + 0.45);

  /* deck gather: 108px spacing collapses to 48px — a tab stack */
  const pGather = prog(frame, T.gather, 0.35, ease.drawer);

  /* press page: corner-lag (top-right lands 3 frames late, ~0.28°) */
  const pPage = prog(frame, T.page, T.pageLen);
  const pageInY = 1860 * (1 - pPage);
  const cornerLag = -0.28 * (1 - prog(frame, T.page + 0.05, T.pageLen, WIPE));
  /* material answer on the contact frame: the bottom edge bows 2px for one
     frame, 1px the next, then dead flat — the paper answers the table */
  const pageContactF = f(T.page + T.pageLen);
  const pageBow = frame === pageContactF ? 2 : frame === pageContactF + 1 ? 1 : 0;
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

  const showWallItems = tw < 12;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
      <MatterDefs />
      {/* serigraph erosion for printed cobalt lines: ~1px edge break-up */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="v4Serig">
            <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="23" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
          </filter>
        </defs>
      </svg>
      {/* the cream press board — deckled edge, its own shadow */}
      <div style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 6px 16px rgba(10,37,64,0.12))' }}>
        <div style={{ position: 'absolute', inset: 0, background: CREAM,
                      clipPath: cutEdge(1080, 1920, 777, 10, 16) }}>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            <rect width="1080" height="1920" filter="url(#mTooth)" />
          </svg>
        </div>
      </div>

      {/* ════ WALL WORLD (A1) ════ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${wallY}px)`,
                    filter: wallReturning ? 'drop-shadow(0 12px 24px rgba(10,37,64,0.18))' : 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#E9E2D2' }}>
          <Img src={TEX.wall} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                       objectFit: 'cover', opacity: 0.9 }} />
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            <rect width="1080" height="1920" filter="url(#mTone)" opacity="0.45" />
            <path d="M40 1560 L150 1500 L210 1520 L340 1440 L395 1452" fill="none" stroke="rgba(10,37,64,0.16)" strokeWidth="2.2" />
            <path d="M210 1520 L235 1560" fill="none" stroke="rgba(10,37,64,0.12)" strokeWidth="1.6" />
            <rect width="1080" height="360" fill="url(#v4Eave)" />
            <defs>
              <linearGradient id="v4Eave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(10,37,64,0.10)" />
                <stop offset="1" stopColor="rgba(10,37,64,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {showWallItems && (
          <>
            <div style={{ position: 'absolute', left: 84, top: 300, ...wipe(fw, T.head, 0.267) }}>
              <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.04,
                                    letterSpacing: '-0.015em', color: NAVY }}>
                {trUpper('Kıbrıs’ta')}<br />{trUpper('ev aramak:')}
              </Ink>
            </div>
            <div style={{ position: 'absolute', left: 88, top: 492, transform: 'rotate(-1.2deg)',
                          ...wipe(fw, T.scribble, 0.15) }}>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 45, color: NAVY }}>
                Hâlâ satılık mı?
              </div>
            </div>

            {/* SATILIK — enters edge-first across the loop; taped at the top,
                so its cast shadow is GRADED: none up top, 18–24px at the foot */}
            <CastShadow frame={fw} x={172} y={560} w={700} h={950} rot={-1.7}
                        start={T.sheet} len={0.5} r={4} graded />
            <div style={place(fw, T.sheet, 0.5, { dy: -1490, rot0: -3 })}>
              <Photocopy x={172} y={560} w={700} h={950} rot={-1.7} seed={5} shadow={false}>
                <div style={{ position: 'absolute', left: 56, top: 172, width: 588, height: 400, filter: 'url(#mPhotocopyImg)' }}>
                  <PhotoSlot w={588} h={400} mask="b" src={HOME.ext} />
                </div>
                <div style={{ position: 'absolute', left: 56, top: 52 }}>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, letterSpacing: '0.05em', color: '#20242B' }}>
                    SATILIK
                  </Ink>
                </div>
                <div style={{ position: 'absolute', left: 56, top: 596 }}>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: '#2A2E36', lineHeight: 1.3 }}>
                    3+1 · Lapta · denize yakın<br />ACİL !!
                  </Ink>
                </div>
                <div style={{ position: 'absolute', left: 56, top: 724 }}>
                  <Ink problem marker style={{ fontFamily: MONO, fontWeight: 500, fontSize: 46, letterSpacing: '0.06em', color: '#20242B' }}>
                    0533 8•• •• ••
                  </Ink>
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 118 }}>
                  <Perforation x={18} y={0} w={664} torn />
                  {Array.from({ length: 7 }, (_, i) => {
                    const gone = i === 1 || i === 4;
                    return gone ? (
                      <div key={i} style={{ position: 'absolute', left: 24 + i * 94, top: 4, width: 84, height: 26,
                                            background: '#E2DCCB',
                                            clipPath: 'polygon(0 0, 100% 0, 92% 100%, 55% 62%, 8% 88%)' }} />
                    ) : (
                      <div key={i} style={{ position: 'absolute', left: 24 + i * 94, top: 2, width: 84, height: 112,
                                            background: '#F3EFE5', transform: `rotate(${[0.8, 0, -1.4, 0.5, 0, 1.8, -0.7][i]}deg)`,
                                            transformOrigin: 'top center',
                                            boxShadow: '0 3px 5px rgba(10,37,64,0.10)',
                                            clipPath: cutEdge(84, 112, 40 + i, 2, 3) }}>
                        <div style={{ fontFamily: MONO, fontSize: 21, color: 'rgba(32,36,43,0.72)', letterSpacing: '0.04em',
                                      transform: 'rotate(90deg) translate(24px, -28px)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                          0533 8•• ••
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ position: 'absolute', inset: 0, ...wipe(fw, T.tape, 0.1) }}><Tape x={-34} y={-16} rot={-12} /></div>
                <div style={{ position: 'absolute', inset: 0, ...wipe(fw, T.tape + 0.08, 0.1) }}><Tape x={580} y={-14} rot={9} /></div>
                <div style={{ position: 'absolute', right: -2, bottom: 116, width: 60, height: 60,
                              background: 'linear-gradient(315deg, rgba(10,37,64,0.10), transparent 60%)' }} />
              </Photocopy>
            </div>

            {/* three prices, three materials, one diagonal */}
            <CastShadow frame={fw} x={19} y={1311} w={392} h={166} rot={2.1} start={T.scrapA} len={0.42} r={4} />
            <div style={place(fw, T.scrapA, 0.42, { dy: -220, rot0: -5 })}>
              <Photocopy x={19} y={1311} w={392} h={166} rot={2.1} seed={61} shadow={false}>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} style={{ position: 'absolute', left: 10, top: 16 + i * 32, width: 11, height: 11,
                                        borderRadius: 99, background: '#E4DCC8',
                                        boxShadow: 'inset 0 1px 2px rgba(10,37,64,0.28)' }} />
                ))}
                <div style={{ position: 'absolute', left: 40, top: 18 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 28, letterSpacing: '0.1em', color: 'rgba(32,36,43,0.85)' }}>İLAN SİTESİ</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: '#20242B', marginTop: 4 }}>
                    £175.000
                  </Ink>
                </div>
              </Photocopy>
            </div>
            <CastShadow frame={fw} x={338} y={1268} w={464} h={148} rot={-2.4} start={T.scrapB} len={0.42} r={4} />
            <div style={place(fw, T.scrapB, 0.42, { dy: -220, rot0: 5 })}>
              <Sheet x={338} y={1268} w={464} h={148} rot={-2.4} bg="#F6F2E7" seed={77} amp={5} n={5} fiber={false} shadow={false}>
                <div style={{ position: 'absolute', left: -16, top: 26, width: 26, height: 26,
                              background: '#F6F2E7', clipPath: 'polygon(100% 0, 100% 100%, 0 32%)' }} />
                <div style={{ position: 'absolute', left: 28, top: 12 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 28, letterSpacing: '0.1em', color: 'rgba(32,36,43,0.85)' }}>WHATSAPP GRUBU</div>
                  <Ink marker style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, color: '#23272E', marginTop: 2 }}>
                    ₺11.900.000
                  </Ink>
                </div>
              </Sheet>
            </div>
            <CastShadow frame={fw} x={659} y={1212} w={372} h={156} rot={4.2} start={T.scrapC} len={0.42} r={4} />
            <div style={place(fw, T.scrapC, 0.42, { dy: -220, rot0: 6 })}>
              <div style={{ position: 'absolute', left: 659, top: 1212, width: 372, height: 156, transform: 'rotate(4.2deg)' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#F1ECDF',
                              clipPath: 'polygon(3% 8%, 96% 0, 100% 88%, 64% 100%, 30% 92%, 0 96%)' }} />
                <div style={{ position: 'absolute', left: 26, top: 14 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 28, letterSpacing: '0.1em', color: 'rgba(32,36,43,0.85)' }}>EMLAKÇI VİTRİNİ</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: '#20242B', marginTop: 4 }}>
                    $250.000
                  </Ink>
                </div>
                <Tape x={20} y={-18} rot={-1.5} w={150} h={34} />
                <Tape x={210} y={-20} rot={2} w={150} h={34} />
              </div>
            </div>

            {/* verdict — optically aligned with the headline (x≈88) */}
            <CastShadow frame={fw} x={56} y={478} w={968} h={132} rot={-0.5} start={T.verdict} len={0.45} r={4} />
            <div style={place(fw, T.verdict, 0.45, { dx: 70, dy: -170, rot0: 3 })}>
              <Sheet x={56} y={478} w={968} h={132} rot={-0.5} seed={191} amp={3} n={7} fiber={false} shadow={false}>
                <div style={{ position: 'absolute', left: 29, top: 30, fontFamily: SANS, fontWeight: 800,
                              fontSize: 56, letterSpacing: '-0.01em', color: NAVY }}>
                  AYNI EV. ÜÇ FİYAT.
                </div>
              </Sheet>
            </div>

            <div style={{ position: 'absolute', left: 32, top: 1398, width: 1030, height: 60,
                          transform: 'rotate(-8.4deg)', transformOrigin: 'left center',
                          ...wipe(fw, T.strike, 0.27) }}>
              <HandLine x={0} y={10} w={1027} seed={31} sw={24} />
            </div>
          </>
        )}
      </div>

      {t < 7 && <ApproachShadow frame={frame} start={T.cobalt} />}

      {/* ════ COBALT WORLD (A2–A4) ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.cobalt - 0.05 ? 1 : 0,
                    transform: `translateY(${cobaltInY - 2250 * cLift}px) rotate(${liftRotC}deg)`,
                    transformOrigin: '30% 0%' }}>
        <CobaltSheet top={128} landed={frame >= f(T.cobalt + 0.72)}>
          {/* the ONE promise everything else must prove */}
          <div style={{ position: 'absolute', left: 108, top: 250 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                          letterSpacing: '-0.015em', color: '#FFFFFF', ...wipe(frame, T.hl1, 0.27) }}>
              {trUpper('Evlek ne aradığını')}<br />{trUpper('anlar.')}
            </div>
            <div style={{ ...wipe(frame, T.under, 0.25), position: 'absolute', left: 0, top: 0, width: 360, height: 220 }}>
              <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
            </div>
          </div>

          {/* SEARCH RAIL — rendered UNDER the dossier so it can slide out of
              it edge-first (12px at 08.41, fully out by 08.48, set at 08.59) */}
          {t < 12.6 && (() => {
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
                    <div style={{ position: 'absolute', left: -16, top: 563, width: 1112, height: 96,
                                  transform: 'rotate(-0.5deg)', borderRadius: 3,
                                  background: 'rgba(10,37,64,0.20)', filter: 'blur(8px)' }} />
                    <div style={{ position: 'absolute', left: -16, top: 561, width: 1112, height: 96,
                                  transform: 'rotate(-0.5deg)', borderRadius: 3,
                                  background: 'rgba(10,37,64,0.12)', filter: 'blur(2px)' }} />
                  </>
                ) : (
                  <div style={{ position: 'absolute', left: -16, top: 570, width: 1112, height: 96,
                                transform: 'rotate(-0.5deg)', borderRadius: 3,
                                background: 'rgba(10,37,64,0.15)', filter: 'blur(20px)' }} />
                )}
              </div>
              {/* edge-first: 8px of leading edge on the flight's first frame */}
              <div style={{ opacity: frame >= f(T.rail) && frame < f(T.railExit + 0.4) ? 1 : 0,
                            transform: `translateX(${railEntryX}px)` }}>
                <Sheet x={-16} y={560} w={1112} h={96} rot={-0.5} seed={88} amp={2.4} n={5}
                       bg="#F8F4E9" shadow={false} texOpacity={0.68}>
                  <div style={{ position: 'absolute', left: 78, top: 27, fontFamily: MONO, fontSize: 38,
                                letterSpacing: '0.1em', color: 'rgba(10,37,64,0.68)' }}>ARA:</div>
                  <div style={{ position: 'absolute', left: 296, top: 26, fontFamily: SANS, fontWeight: 600,
                                fontSize: 40, color: NAVY, whiteSpace: 'nowrap', display: 'flex', gap: 26 }}>
                    <span>Girne’de,</span><span>denize yakın,</span><span>3+1</span>
                  </div>
                  {/* REAL die-cut voids: holes through to the cobalt, with a
                      cut inner edge, perforation remnants and loose fibres */}
                  {RAIL_CHIPS.map(([k, x, w], i) => (
                    <div key={`v${k}`} style={{ position: 'absolute', left: x, top: 13, width: w, height: 70,
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
                    <CastShadow key={`s${k}`} frame={frame} x={x} y={13} w={w} h={70} small
                                start={T.chips[i]} len={T.chipLen} r={2} />
                  ))}
                  {/* the pieces themselves: SAME rail material (not white UI),
                      the keyword prints onto them via wipe IN MID-AIR */}
                  {RAIL_CHIPS.map(([txt, x, w], i) => (
                    <div key={txt} style={{ position: 'absolute', left: x, top: 13, width: w, height: 70,
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
                          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: NAVY,
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
                                  clipPath: cutEdge(812, 1024, 141, 2.6, 8) }}>
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
                const ty = 1330 + (1386 - 1330) * p - Math.sin(Math.PI * Math.min(1, p)) * 90;
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
          <CastShadow frame={frame} x={56} y={244} w={968} h={226} rot={-0.4}
                      start={T.manifesto} len={0.53} r={4} />
          <div style={place(frame, T.manifesto, 0.53, { dy: -260, rot0: 3 })}>
            <Sheet x={56} y={244} w={968} h={226} rot={-0.4} seed={171} amp={3} n={8} fiber={false} shadow={false}>
              <div style={{ position: 'absolute', left: 52, top: 64, fontFamily: SANS, fontWeight: 800,
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
                      filter: frame >= f(T.page + T.pageLen)
                        ? 'drop-shadow(0 3px 8px rgba(10,37,64,0.20)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))'
                        : 'drop-shadow(0 18px 30px rgba(10,37,64,0.16))' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FBF8F1',
                        clipPath: cutEdgeBowed(936, 1728, 7, 2.2, 10, pageBow) }}>
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
              <div style={wipe(frame, T.slog1, 0.3)}>Kıbrıs’ta</div>
              <div style={wipe(frame, T.slog2, 0.3)}>doğru ev.</div>
            </div>
          </div>

          {/* the approval line — the opening redaction’s −8.3° gesture, scaled;
              serigraph erosion so the ink sits IN the press paper, drawn with
              the line and dead still after */}
          <div style={{ ...wipe(frame, T.line, 0.35), position: 'absolute', left: 156, top: 863,
                        width: 470, height: 64, transform: 'rotate(-8.3deg)',
                        transformOrigin: 'left center', filter: 'url(#v4Serig)' }}>
            <HandLine x={0} y={20} w={459} seed={31} sw={15} />
          </div>

          <div style={{ position: 'absolute', left: 88, top: 912, fontFamily: MONO, fontWeight: 600,
                        fontSize: 50, letterSpacing: '0.04em', color: NAVY, ...wipe(frame, T.url, 0.25) }}>
            evlek.app
          </div>

          <CastShadow frame={frame} x={84} y={1092} w={768} h={250} start={T.proof} len={T.proofLen} r={8} />
          <div style={place(frame, T.proof, T.proofLen,
                            { dy: 150, rot0: 2.2, easing: Easing.bezier(0.32, 1.16, 0.66, 1) })}>
            <div style={{ position: 'absolute', left: 84, top: 1092, width: 768, height: 250,
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

          <div style={{ ...wipe(frame, T.mark, 0.35), position: 'absolute', left: 84, top: 1366, width: 460, height: 160 }}>
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
                (~2-3%) + silkscreen break-up (~1%); mean stays #C9A157 */}
            <div style={{ position: 'absolute', inset: 0, background: GOLD, clipPath: cutEdge(168, 86, 3, 2.2, 4) }}>
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
