// Evlek brand film — V4.1: the full 30-second film after the director's
// V4 audit (86/100 → target: understood on first watch).
//
// What changed from V4, item by item (all council-mandated):
//  · LOOP DRAMATURGY — the opening now lives inside the loop: the SATILIK
//    sheet's shadow announces at 29.90, its edge enters at 29.95, and the
//    flight continues across frame 0. No bare-wall dead time bookends.
//  · SHADOW SURGERY v2 — flight y18/blur30/16%; on the contact frame a
//    two-layer hard set (y3/blur8/20% + y1/blur2/12%). The cobalt sheet and
//    the press page each get an INDEPENDENT approach-shadow at the bottom
//    edge 3 frames before their paper enters.
//  · COPY — "Hâlâ satılık mı?" (38px, full navy); the search rail now shows
//    the natural-language query "Girne’de, denize yakın, 3+1" and the chips
//    physically pin its words; "AYNI İLAN. BEŞ DİL." (42/650 Hanken);
//    "BU FİYAT NORMAL Mİ?"; "GERİYE SADECE EV KALIR."
//  · HIERARCHY — verdict moves to a cream band at the TOP (over the
//    subcopy); source labels 28/650; the redaction strike is a 24px
//    diagonal that hits ALL THREE prices; price band 210px higher.
//  · GOLD — right edge ≤936, the EVLEK notch moves left clear of it, and
//    the card carries a visible 18px die-cut slot the tab lands into.
//  · RHYTHM — single 16-frame headline wipe; A1 freeze ≈80 frames; chips
//    read 24+ frames; real fermata exactly 90 frames; final hold ~2.1 s;
//    the cream interlayer is a deckled press board, not void.
//
// 1800 frames, 1080×1920, 60 fps, silent (master must carry NO audio track).

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

/* ── motion primitives ── */
const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const WIPE = Easing.bezier(0.22, 1, 0.36, 1);

const prog = (frame, atSec, lenSec, easing = SETTLE) =>
  interpolate(frame, [f(atSec), f(atSec + lenSec)], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

const place = (frame, atSec, lenSec, { dx = 0, dy = 0, rot0 = 0 } = {}) => {
  const p = prog(frame, atSec, lenSec);
  return {
    opacity: frame >= f(atSec) ? 1 : 0,
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${(1 - p) * rot0}deg)`,
  };
};

const wipe = (frame, atSec, lenSec = 0.32) => {
  const p = prog(frame, atSec, lenSec, WIPE);
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: frame >= f(atSec) ? 1 : 0 };
};

/* ── SHADOW PRIMITIVE v2 (council spec, verbatim) ──
   Announce: visible from exactly 3 frames before flight (starts at half
   strength so the intent frame actually reads on screen).
   Flight: y18 / blur30 / navy 16%  (chips: y9 / blur15 / 13%).
   Contact frame: a two-layer hard set in a single frame —
   y3/blur8/20% + y1/blur2/12%  (chips: y2/blur5/16% + y1/blur1.5/10%). */
const CastShadow = ({ frame, x, y, w, h, rot = 0, start, len, small = false, r = 10 }) => {
  const landed = frame >= f(start + len);
  const announce = frame < f(start) - 3 ? 0
    : interpolate(frame, [f(start) - 3, f(start) - 1], [0.5, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blob = (dy, blur, a) => (
    <div style={{ position: 'absolute', left: x, top: y + dy, width: w, height: h,
                  transform: `rotate(${rot}deg)`, borderRadius: r,
                  background: `rgba(10,37,64,${a})`, filter: `blur(${blur}px)`,
                  opacity: announce }} />
  );
  if (!landed) return small ? blob(9, 15, 0.13) : blob(18, 30, 0.16);
  return (
    <>
      {small ? blob(2, 5, 0.16) : blob(3, 8, 0.20)}
      {small ? blob(1, 1.5, 0.10) : blob(1, 2, 0.12)}
    </>
  );
};

/* independent approach shadow for a full-width sheet rising from below:
   a soft navy breath at the bottom edge, 3 frames before the paper enters */
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

/* ── master timeline (decimal seconds; negative = wraps across the loop) ── */
const T = {
  sheet: -0.05, tape: 0.62, head: 0.27, scribble: 1.97,
  scrapA: 2.4, scrapB: 2.75, scrapC: 3.1, verdict: 3.55, strike: 4.55,
  wallExit: 6.45, cobalt: 6.5, under: 7.4, hero: 7.85, strip: 8.6833,
  chips: [9.267, 9.567, 9.867], chipLen: 0.42,
  stripExit: 10.7, label: 10.78, lang: 11.05, langStep: 0.24,
  band: 13.05, marker: 13.75, price: 14.0, infoExit: 15.9,
  glide: 16.55, manifesto: 17.833,
  gold: 19.9, goldLen: 0.28, page: 20.933, pageLen: 0.75,
  slog1: 21.9, slog2: 22.15, url: 22.65, proof: 22.95, mark: 23.65, line: 24.1,
  pageLift: 26.5, cobaltLift: 27.1, wallBack: 28.85,
};

/* hero card: entry rest is deliberately OFF-GRID (−2°); the alignment
   gesture settles it onto the grid with one visible overshoot */
const CARD_IN = { x: 134, y: 742, rot: -2 };
const CARD_AL = { x: 200, y: 632, rot: 0 };
/* gold tab: right edge at exactly x=936 (out of the Reels right UI zone) */
const TAB = { x: 768, y: 608 };
/* the die-cut slot on the card that the tab lands into (card-relative) */
const SLOT = { x: 576, y: 4, w: 152, h: 18 };

export const Film30v4 = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  /* wrapped frame for A1: the SATILIK flight starts BEFORE frame 0 */
  const fw = frame >= f(28.5) ? frame - 1800 : frame;
  const tw = fw / 60;

  const wallY = t < 15
    ? -2150 * prog(frame, T.wallExit, 0.55, ease.drawer)
    : -2150 * (1 - prog(frame, T.wallBack, 0.6, ease.drawer));

  const cobaltInY = 1920 * (1 - prog(frame, T.cobalt, 0.72));
  const cobaltOutY = -2250 * prog(frame, T.cobaltLift, 0.7, ease.inOut);

  const g = prog(frame, T.glide, 0.55); // SETTLE: one visible overshoot
  const glideX = (CARD_AL.x - CARD_IN.x) * g;
  const glideY = (CARD_AL.y - CARD_IN.y) * g;
  const cardRot = CARD_IN.rot + (CARD_AL.rot - CARD_IN.rot) * g;

  const pageInY = 2150 * (1 - prog(frame, T.page, T.pageLen));
  const pageOutY = -2350 * prog(frame, T.pageLift, 0.7, ease.inOut);

  const showWallItems = tw < 12; // wrapped: also live during the final second

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
      <MatterDefs />
      {/* the cream press board — a real paper layer with a deckled edge and
          its own contact shadow, never a void (council A6 fix) */}
      <div style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 6px 16px rgba(10,37,64,0.12))' }}>
        <div style={{ position: 'absolute', inset: 0, background: CREAM,
                      clipPath: cutEdge(1080, 1920, 777, 10, 16) }}>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            <rect width="1080" height="1920" filter="url(#mTooth)" />
          </svg>
        </div>
      </div>

      {/* ════ WALL WORLD (A1) ════ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${wallY}px)` }}>
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
            {/* headline: ONE continuous 16-frame print-wipe over both lines */}
            <div style={{ position: 'absolute', left: 84, top: 300, ...wipe(fw, T.head, 0.267) }}>
              <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.04,
                                    letterSpacing: '-0.015em', color: NAVY }}>
                {trUpper('Kıbrıs’ta')}<br />{trUpper('ev aramak:')}
              </Ink>
            </div>
            {/* the question, print-clear at phone size */}
            <div style={{ position: 'absolute', left: 88, top: 496, transform: 'rotate(-1.2deg)',
                          ...wipe(fw, T.scribble, 0.25) }}>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, color: NAVY }}>
                Hâlâ satılık mı?
              </div>
            </div>

            {/* SATILIK sheet — its flight CROSSES the loop boundary */}
            <CastShadow frame={fw} x={172} y={560} w={700} h={950} rot={-1.7}
                        start={T.sheet} len={0.5} r={4} />
            <div style={place(fw, T.sheet, 0.5, { dx: 46, dy: -190, rot0: -5 })}>
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
                    3+1 · Lapta · deniz yakın<br />ACİL !!
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

            {/* three price scraps on the diagonal the strike will hit */}
            <CastShadow frame={fw} x={19} y={1311} w={392} h={166} rot={2.1} start={T.scrapA} len={0.42} r={4} />
            <div style={place(fw, T.scrapA, 0.42, { dy: -220, rot0: -5 })}>
              <Photocopy x={19} y={1311} w={392} h={166} rot={2.1} seed={61} shadow={false}>
                <div style={{ position: 'absolute', left: 30, top: 18 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 28, letterSpacing: '0.1em', color: 'rgba(32,36,43,0.85)' }}>İLAN SİTESİ A</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: '#20242B', marginTop: 4 }}>
                    £175.000
                  </Ink>
                </div>
              </Photocopy>
            </div>
            <CastShadow frame={fw} x={338} y={1268} w={464} h={148} rot={-2.4} start={T.scrapB} len={0.42} r={4} />
            <div style={place(fw, T.scrapB, 0.42, { dy: -220, rot0: 5 })}>
              <Sheet x={338} y={1268} w={464} h={148} rot={-2.4} bg="#F6F2E7" seed={77} amp={5} n={5} fiber={false} shadow={false}>
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
                <Tape x={140} y={-20} rot={-4} w={110} h={34} />
              </div>
            </div>

            {/* verdict on a cream band at the TOP — over the question */}
            <CastShadow frame={fw} x={56} y={478} w={968} h={132} rot={-0.5} start={T.verdict} len={0.45} r={4} />
            <div style={place(fw, T.verdict, 0.45, { dx: 70, dy: -170, rot0: 3 })}>
              <Sheet x={56} y={478} w={968} h={132} rot={-0.5} seed={191} amp={3} n={7} fiber={false} shadow={false}>
                <div style={{ position: 'absolute', left: 8, top: 30, fontFamily: SANS, fontWeight: 800,
                              fontSize: 56, letterSpacing: '-0.01em', color: NAVY }}>
                  AYNI EV. ÜÇ AYRI FİYAT.
                </div>
              </Sheet>
            </div>

            {/* the redaction: one 24px cobalt diagonal through ALL THREE prices */}
            <div style={{ position: 'absolute', left: 32, top: 1398, width: 1030, height: 60,
                          transform: 'rotate(-8.4deg)', transformOrigin: 'left center',
                          ...wipe(fw, T.strike, 0.27) }}>
              <HandLine x={0} y={10} w={1027} seed={31} sw={24} />
            </div>
          </>
        )}
      </div>

      {/* the cobalt sheet's own approach shadow — independent of the object */}
      {t < 8 && <ApproachShadow frame={frame} start={T.cobalt} />}

      {/* ════ COBALT WORLD (A2–A4) ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.cobalt - 0.05 ? 1 : 0,
                    transform: `translateY(${cobaltInY + cobaltOutY}px)` }}>
        <CobaltSheet top={128} landed={frame >= f(T.cobalt + 0.72)}>
          <div style={{ position: 'absolute', left: 108, top: 250 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                          letterSpacing: '-0.015em', color: '#FFFFFF' }}>
              {trUpper('Evlek’te her şey')}<br />{trUpper('yerinde.')}
            </div>
            <div style={{ ...wipe(frame, T.under, 0.25), position: 'absolute', left: 0, top: 0, width: 360, height: 220 }}>
              <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
            </div>
          </div>

          {/* HERO CARD — lands off-grid (−2°), aligned later with one overshoot */}
          <CastShadow frame={frame} x={CARD_IN.x + glideX} y={CARD_IN.y + glideY} w={812} h={1010}
                      rot={cardRot} start={T.hero} len={0.55} r={5} />
          <div style={{ transform: `translate(${glideX}px, ${glideY}px)` }}>
            <div style={place(frame, T.hero, 0.55, { dx: 90, dy: 240, rot0: 4.8 })}>
              <CardStock x={CARD_IN.x} y={CARD_IN.y} w={812} h={1010} rot={cardRot} seed={23} pad={0}
                         style={{ boxShadow: 'none' }}>
                {/* EVLEK notch, moved fully clear of the gold slot */}
                <div style={{ position: 'absolute', right: 248, top: -14, width: 128, height: 66,
                              background: COBALT, clipPath: cutEdge(128, 66, 91, 2.4, 4) }}>
                  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.16em', color: '#FFFFFF',
                                position: 'absolute', left: 18, top: 20 }}>EVLEK</div>
                </div>
                {/* the 18px die-cut slot the gold tab will land into */}
                <div style={{ position: 'absolute', left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h,
                              background: 'rgba(10,37,64,0.10)',
                              boxShadow: 'inset 0 2px 3px rgba(10,37,64,0.22), inset 0 -1px 0 rgba(255,255,255,0.5)' }} />
                <div style={{ position: 'absolute', left: 36, top: 36, width: 740, height: 560 }}>
                  <PhotoSlot w={740} h={560} mask="a" src={HOME.ext} />
                </div>
                <div style={{ position: 'absolute', left: 44, top: 636 }}>
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 78, letterSpacing: '-0.01em', color: NAVY }}>
                    £175.000
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, color: NAVY, marginTop: 14 }}>
                    Girne’de denize yakın 3+1
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 29, letterSpacing: '0.04em',
                                color: 'rgba(10,37,64,0.62)', marginTop: 18 }}>
                    LAPTA · 3+1 · 2 BANYO · 120 M² · EŞYALI
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '0.1em',
                                color: 'rgba(10,37,64,0.45)', marginTop: 52 }}>
                    GİRNE · SATILIK · EVLEK.APP
                  </div>
                </div>
              </CardStock>
            </div>
          </div>

          {/* SEARCH RAIL — the natural-language query; chips PIN its words */}
          {t < 11.4 && (
            <>
              <CastShadow frame={frame} x={-16} y={560} w={1112} h={96} rot={-0.5}
                          start={T.strip} len={0.5} r={3} />
              <div style={{ opacity: frame >= f(T.strip) && frame < f(T.stripExit + 0.4) ? 1 : 0,
                            transform: `translateX(${
                              (1 - prog(frame, T.strip, 0.5, WIPE)) * -1300 -
                              prog(frame, T.stripExit, 0.4, ease.drawer) * 1400}px)` }}>
                <Sheet x={-16} y={560} w={1112} h={96} rot={-0.5} seed={88} amp={2.4} n={5} shadow={false}>
                  <div style={{ position: 'absolute', left: 78, top: 27, fontFamily: MONO, fontSize: 38,
                                letterSpacing: '0.12em', color: 'rgba(10,37,64,0.68)' }}>ARAMA</div>
                  <div style={{ position: 'absolute', left: 296, top: 26, fontFamily: SANS, fontWeight: 600,
                                fontSize: 40, color: NAVY, whiteSpace: 'nowrap' }}>
                    Girne’de, denize yakın, 3+1
                  </div>
                  {/* shadows FIRST, chips on top — a shadow never veils its paper */}
                  {[['g', 292, 196], ['d', 478, 330], ['u', 796, 136]].map(([k, x, w], i) => (
                    <CastShadow key={k} frame={frame} x={x} y={13} w={w} h={70} small
                                start={T.chips[i]} len={T.chipLen} r={2} />
                  ))}
                  {[['GİRNE', 292, 196], ['DENİZE YAKIN', 478, 330], ['3+1', 796, 136]].map(([txt, x, w], i) => (
                    <div key={txt} style={{ position: 'absolute', left: x, top: 13, width: w, height: 70,
                                            ...place(frame, T.chips[i], T.chipLen, { dy: -240, rot0: [-5, 4, -3.5][i] }) }}>
                      <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                                    clipPath: cutEdge(w, 70, 53 + i * 7, 1.8, 4),
                                    transform: `rotate(${[-0.4, 0.2, -0.25][i]}deg)`,
                                    display: 'flex', alignItems: 'center', padding: '0 0 0 44px' }}>
                        <Punch x={14} y={28} />
                        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: NAVY,
                                       letterSpacing: '0.02em' }}>{txt}</span>
                      </div>
                    </div>
                  ))}
                </Sheet>
              </div>
            </>
          )}

          {/* INFO WORLD (A3) */}
          {t < 17 && (
            <div style={{ transform: `translateY(${prog(frame, T.infoExit, 0.55, ease.drawer) * 1600}px)` }}>
              <CastShadow frame={frame} x={108} y={566} w={640} h={88} small start={T.label} len={0.36} r={3} />
              <div style={place(frame, T.label, 0.36, { dy: -150, rot0: -3 })}>
                <Sheet x={108} y={566} w={640} h={88} rot={-0.6} seed={141} amp={2} n={4} fiber={false} shadow={false}>
                  <div style={{ position: 'absolute', left: 26, top: 18, fontFamily: SANS, fontWeight: 650,
                                fontSize: 42, letterSpacing: '-0.005em', color: NAVY }}>
                    AYNI İLAN. BEŞ DİL.
                  </div>
                </Sheet>
              </div>
              {[
                { tag: 'TR', line: 'Lapta, Girne’de 3+1 daire', sub: '£175.000 · 120 M² · 3+1' },
                { tag: 'EN', line: '3+1 apartment in Lapta, Kyrenia', sub: '£175,000 · 120 M² · 3+1' },
                { tag: 'RU', line: 'Квартира 3+1 в Лапте, Кирения', sub: '£175 000 · 120 М² · 3+1' },
                { tag: 'DE', line: '3+1-Wohnung in Lapta, Kyrenia', sub: '£175.000 · 120 M² · 3+1' },
                { tag: 'AR', line: 'شقة 3+1 في لابتا، كيرينيا', sub: '£175,000 · 120 م² · 3+1', rtl: true },
              ].map((c, i) => {
                const start = T.lang + i * T.langStep;
                const x = 108 + [0, 20, 36, 22, 8][i];
                const y = 664 + i * 108;
                return (
                  <React.Fragment key={c.tag}>
                    <CastShadow frame={frame} x={x} y={y} w={800} h={122} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                small start={start} len={0.4} r={4} />
                    <div style={place(frame, start, 0.4, { dy: -200, rot0: [-4, 3.5, -3, 4, -3.5][i] })}>
                      <CardStock x={x} y={y} w={800} h={122} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                 seed={101 + i} style={{ boxShadow: 'none' }}>
                        <div style={{ position: 'absolute', left: 22, top: 20, width: 78, height: 48,
                                      background: i === 4 ? COBALT : 'transparent',
                                      border: i === 4 ? 'none' : '2.5px solid rgba(10,37,64,0.5)',
                                      transform: `rotate(${[-2.5, 1.8, -1.2, 2.2, -1.6][i]}deg)`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.08em',
                                         color: i === 4 ? '#FFFFFF' : 'rgba(10,37,64,0.72)' }}>{c.tag}</span>
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 120, right: 24, top: 18,
                                      fontFamily: SANS, fontWeight: 600, fontSize: 29, color: NAVY,
                                      textAlign: c.rtl ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {c.line}
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 120, right: 24, top: 70, fontFamily: MONO, fontSize: 22,
                                      letterSpacing: '0.05em', color: 'rgba(10,37,64,0.72)',
                                      textAlign: c.rtl ? 'right' : 'left' }}>
                          {c.sub}
                        </div>
                      </CardStock>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* the price band, 210px higher — the question people really ask */}
              <CastShadow frame={frame} x={84} y={1218} w={912} h={470} rot={0.7}
                          start={T.band} len={0.6} r={4} />
              <div style={place(frame, T.band, 0.6, { dy: 320, rot0: -2.5 })}>
                <Sheet x={84} y={1218} w={912} h={470} rot={0.7} seed={131} amp={3.4} n={8} shadow={false}>
                  <div style={{ position: 'absolute', left: 52, top: 38, fontFamily: SANS, fontWeight: 800,
                                fontSize: 52, letterSpacing: '-0.01em', color: NAVY }}>
                    BU FİYAT NORMAL Mİ?
                  </div>
                  <div style={{ position: 'absolute', left: 54, top: 114, fontFamily: MONO, fontSize: 26,
                                letterSpacing: '0.1em', color: 'rgba(10,37,64,0.7)' }}>
                    GİRNE · 3+1 DAİRE · 19 AKTİF İLAN
                  </div>
                  <svg width="800" height="150" style={{ position: 'absolute', left: 52, top: 172 }}>
                    <line x1="0" y1="110" x2="800" y2="110" stroke={NAVY} strokeWidth="3" />
                    {Array.from({ length: 25 }, (_, i) => (
                      <line key={i} x1={(800 / 24) * i} y1={i % 4 === 0 ? 86 : 96} x2={(800 / 24) * i} y2="110"
                            stroke={NAVY} strokeWidth={i % 4 === 0 ? 2.4 : 1.4} opacity={i % 4 === 0 ? 0.9 : 0.5} />
                    ))}
                    <g transform="translate(141.7 0)">
                      <g style={place(frame, T.marker, 0.3, { dy: -90 })}>
                        <path d="M0 74 L-16 38 L16 38 Z" fill={COBALT} />
                        <line x1="0" y1="74" x2="0" y2="110" stroke={COBALT} strokeWidth="4" />
                      </g>
                    </g>
                  </svg>
                  <div style={{ position: 'absolute', left: 52, top: 296, fontFamily: MONO, fontSize: 24,
                                color: 'rgba(10,37,64,0.85)' }}>£90.000</div>
                  <div style={{ position: 'absolute', right: 58, top: 296, fontFamily: MONO, fontSize: 24,
                                color: 'rgba(10,37,64,0.85)' }}>£570.000</div>
                  <div style={{ position: 'absolute', left: 240, top: 172, ...wipe(frame, T.price, 0.28) }}>
                    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: COBALT }}>£175.000</div>
                    <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.06em',
                                  color: 'rgba(10,37,64,0.6)', marginTop: 6 }}>BU İLAN · £1.458/M²</div>
                  </div>
                  <div style={{ position: 'absolute', left: 52, bottom: 32, fontFamily: MONO, fontSize: 22,
                                letterSpacing: '0.08em', color: 'rgba(10,37,64,0.58)' }}>
                    KAYNAK: EVLEK.APP CANLI İLAN VERİSİ
                  </div>
                </Sheet>
              </div>
            </div>
          )}

          {/* MANIFESTO STRIP (A4) — in at 17.50, contact at 18.22 (SS.FF) */}
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

      {/* the press page's independent approach shadow */}
      {t > 19 && t < 22 && <ApproachShadow frame={frame} start={T.page} />}

      {/* ════ PRESS WORLD (A5) ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.page - 0.05 ? 1 : 0,
                    transform: `translateY(${pageOutY}px)` }}>
        <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                      transform: `rotate(-0.35deg) translateY(${pageInY}px)`,
                      filter: frame >= f(T.page + T.pageLen)
                        ? 'drop-shadow(0 3px 8px rgba(10,37,64,0.20)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))'
                        : 'drop-shadow(0 18px 30px rgba(10,37,64,0.16))' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FBF8F1',
                        clipPath: cutEdge(936, 1728, 7, 2.2, 10) }}>
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
            <div style={{ ...wipe(frame, T.line, 0.35), position: 'absolute', left: 0, top: 240, width: 470, height: 60 }}>
              <HandLine x={4} y={22} w={446} seed={4} sw={16} />
            </div>
          </div>

          <div style={{ position: 'absolute', left: 88, top: 916, fontFamily: MONO, fontWeight: 500,
                        fontSize: 44, letterSpacing: '0.04em', color: NAVY, ...wipe(frame, T.url, 0.25) }}>
            evlek.app
          </div>

          <CastShadow frame={frame} x={84} y={1092} w={768} h={250} start={T.proof} len={0.5} r={8} />
          <div style={place(frame, T.proof, 0.5, { dy: 150, rot0: 2.2 })}>
            <div style={{ position: 'absolute', left: 84, top: 1092, width: 768, height: 250,
                          background: '#F7F3EA', borderRadius: stockCorners(83) }}>
              <Img src={TEX.cardstock} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                                objectFit: 'cover', opacity: 0.55, borderRadius: stockCorners(83),
                                                objectPosition: '64% 38%' }} />
              <div style={{ position: 'absolute', left: 26, top: 26, width: 250, height: 198 }}>
                <PhotoSlot w={250} h={198} mask="b" src={HOME.living} />
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

      {/* ════ THE GOLD TAB — right edge at x=936, into the card's die-cut slot ════ */}
      <div style={{ transform: `translateY(${pageOutY}px)` }}>
        <CastShadow frame={frame} x={TAB.x} y={TAB.y} w={168} h={86} small
                    start={T.gold} len={T.goldLen} r={3} />
        <div style={place(frame, T.gold, T.goldLen, { dx: 320, rot0: 7.5 })}>
          <div style={{ position: 'absolute', left: TAB.x, top: TAB.y, width: 168, height: 86,
                        transform: 'rotate(1.6deg)' }}>
            <div style={{ position: 'absolute', inset: 0, background: GOLD, clipPath: cutEdge(168, 86, 3, 2.2, 4) }} />
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NAVY,
                          position: 'absolute', left: 34, top: 16 }}>BU.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
