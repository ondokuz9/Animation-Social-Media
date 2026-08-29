// Evlek brand film — V4: the full 30-second rebuild on the LOCKED art
// direction (styleframes SF1–SF4, council 92.25/100) and the APPROVED motion
// language (MT1/MT2), with the council's three mandatory corrections:
//
//   1. SHADOW SURGERY — a global cast-shadow primitive: the shadow starts
//      3 frames BEFORE the object moves, stays soft in flight
//      (y≈17 blur≈28 navy 16%), and HARDENS ON THE CONTACT FRAME
//      (y4 blur11 14–15%) — never springed. Chips use half values. The
//      press page rests at 14px outer softness, not 38px.
//   2. CHIP CHAIN −8 FRAMES — flights start 09.16/09.34/09.52 (SS.FF),
//      third chip at rest 10.17, ≥13 frames of final read.
//   3. A5 SLOT = 324 FRAMES (19.2–24.6 s), and the gold BU. tab lands INTO
//      the film — onto the aligned hero card's cobalt notch — never onto an
//      empty desk. The press page then rises beneath it.
//
// Structure (decimal seconds, 60 fps, 1800 frames, perfect loop):
//   A1 0.0–6.4    problem wall (SF1): stamps, SATILIK, scraps, verdict, strike
//   A2 6.4–10.5   Evlek world (MT1): cobalt rise, hero card, rail, 3 chips
//   A3 10.5–15.9  info world (SF3): five-language deck + real price band
//   A4 15.9–19.2  clear → card aligns → manifesto strip → fermata
//   A5 19.2–24.6  gold onto the card notch → press page → slogan → wordmark
//                 → approval line (MT2, 324 frames)
//   A6 24.6–30.0  hold, then the physical layer-lift loop back to frame 0
//
// All idle elements are DEAD STILL. Nothing scales. Print enters by hard
// wipe. One settle curve, one overshoot, one return.

import React from 'react';
import { useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { SANS, MONO, trUpper, f, ease } from '../../brand/tokens.js';
import {
  NAVY, COBALT, GOLD, TEX,
  cutEdge, stockCorners, MatterDefs, Ink,
  Photocopy, CardStock, CobaltSheet, Tape, Perforation, Punch, CropMarks, PhotoSlot,
} from './matter.jsx';
import { Sheet, HandLine, Wordmark, Ground, HOME } from './Styleframes.jsx';

export const FILM_V4_FRAMES = 1800;

/* ── motion primitives (identical to the approved MT language) ── */
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

/* ── THE SHADOW PRIMITIVE (council surgery) ──────────────────────────────
   A navy blob at the object's FINAL footprint. Opacity ramps over the three
   frames BEFORE flight begins (the announce). It stays at flight softness
   for the whole flight and snaps hard on the exact contact frame. Objects
   that use it carry NO shadow of their own — this blob IS their shadow,
   in flight and at rest, so flight and rest can never disagree. */
const CastShadow = ({ frame, x, y, w, h, rot = 0, start, len, small = false,
                      contact = null, r = 10 }) => {
  const landed = frame >= f(start + len);
  const announce = interpolate(frame, [f(start) - 3, f(start)], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const c = contact || (small ? { dy: 2, blur: 5, a: 0.13 } : { dy: 4, blur: 11, a: 0.15 });
  const dy = landed ? c.dy : (small ? 9 : 17);
  const blur = landed ? c.blur : (small ? 14 : 28);
  const a = landed ? c.a : (small ? 0.12 : 0.16);
  return (
    <div style={{ position: 'absolute', left: x, top: y + dy, width: w, height: h,
                  transform: `rotate(${rot}deg)`, borderRadius: r,
                  background: `rgba(10,37,64,${a})`, filter: `blur(${blur}px)`,
                  opacity: announce }} />
  );
};

/* ── master timeline (decimal seconds) ── */
const T = {
  head1: 0.25, head2: 0.45, sheet: 0.85, tape: 1.42, scribble: 1.95,
  scrap1: 2.15, scrap2: 2.5, scrap3: 2.85, verdict: 3.2, strike: 3.95,
  wallExit: 6.15, cobalt: 6.5, under: 7.4, hero: 7.85, strip: 8.65,
  chips: [9.267, 9.567, 9.867], chipLen: 0.42,
  stripExit: 10.55, label: 10.9, lang: 11.2, langStep: 0.24,
  band: 13.05, marker: 13.75, price: 14.0, infoExit: 15.9,
  glide: 16.55, manifesto: 17.3,
  gold: 19.9, goldLen: 0.28, page: 20.9, pageLen: 0.75,
  slog1: 21.9, slog2: 22.15, url: 22.65, proof: 22.95, mark: 23.65, line: 24.1,
  pageLift: 27.6, cobaltLift: 28.1, wallBack: 28.95,
};

/* hero card geometry: entry position (SF2) and aligned position chosen so
   the card's cobalt notch centre lands exactly where the SF4 gold tab sits */
const CARD_IN = { x: 134, y: 742 };
const CARD_AL = { x: 200, y: 632 }; // stays inside the cobalt sheet
const TAB = { x: 870, y: 608 };     // tab clips onto the aligned card's top-right
                                    // edge (over the notch) = SF4 page-edge spot

/* ═══════════════ the film ═══════════════ */
export const Film30v4 = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;

  /* wall layer: out at 6.15 (up), back at 28.95 for the loop */
  const wallY = t < 15
    ? -2150 * prog(frame, T.wallExit, 0.55, ease.drawer)
    : -2150 * (1 - prog(frame, T.wallBack, 0.6, ease.drawer));

  /* cobalt world: rises 6.5, lifts away 28.1 */
  const cobaltInY = 1920 * (1 - prog(frame, T.cobalt, 0.72));
  const cobaltOutY = -2250 * prog(frame, T.cobaltLift, 0.7, ease.inOut);

  /* hero card glide to alignment (a slide on the surface, not a lift) */
  const g = prog(frame, T.glide, 0.55, ease.inOut);
  const glideX = (CARD_AL.x - CARD_IN.x) * g;
  const glideY = (CARD_AL.y - CARD_IN.y) * g;

  /* press page: rises 20.9, lifted away 27.6 (gold tab rides it) */
  const pageInY = 2150 * (1 - prog(frame, T.page, T.pageLen));
  const pageOutY = -2350 * prog(frame, T.pageLift, 0.7, ease.inOut);

  const showWallItems = t < 12; // they left with the wall; the return is bare

  return (
    <Ground>
      {/* ════ WALL WORLD (A1) — everything rides the wall layer ════ */}
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
            {/* headline stamps */}
            <div style={{ position: 'absolute', left: 84, top: 300 }}>
              <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.04,
                                    letterSpacing: '-0.015em', color: NAVY }}>
                <div style={wipe(frame, T.head1, 0.26)}>{trUpper('Kıbrıs’ta')}</div>
                <div style={wipe(frame, T.head2, 0.26)}>{trUpper('ev aramak:')}</div>
              </Ink>
            </div>
            {/* the scribbled pain, on the wall */}
            <div style={{ position: 'absolute', left: 88, top: 492, transform: 'rotate(-1.6deg)', ...wipe(frame, T.scribble, 0.3) }}>
              <Ink marker style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, color: '#2A2E36' }}>
                Hâlâ duruyor mu?
              </Ink>
            </div>

            {/* SATILIK sheet — placed */}
            <CastShadow frame={frame} x={172} y={560} w={700} h={950} rot={-1.7}
                        start={T.sheet} len={0.5} r={4} />
            <div style={place(frame, T.sheet, 0.5, { dx: 46, dy: -190, rot0: -5 })}>
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
                {/* tapes pressed on after landing */}
                <div style={{ position: 'absolute', inset: 0, ...wipe(frame, T.tape, 0.1) }}><Tape x={-34} y={-16} rot={-12} /></div>
                <div style={{ position: 'absolute', inset: 0, ...wipe(frame, T.tape + 0.08, 0.1) }}><Tape x={580} y={-14} rot={9} /></div>
                <div style={{ position: 'absolute', right: -2, bottom: 116, width: 60, height: 60,
                              background: 'linear-gradient(315deg, rgba(10,37,64,0.10), transparent 60%)' }} />
              </Photocopy>
            </div>

            {/* three price scraps — TAK, TAK, TAK */}
            <CastShadow frame={frame} x={648} y={1272} w={372} h={156} rot={4.2} start={T.scrap1} len={0.42} r={4} />
            <div style={place(frame, T.scrap1, 0.42, { dy: -220, rot0: 6 })}>
              <div style={{ position: 'absolute', left: 648, top: 1272, width: 372, height: 156, transform: 'rotate(4.2deg)' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#F1ECDF',
                              clipPath: 'polygon(3% 8%, 96% 0, 100% 88%, 64% 100%, 30% 92%, 0 96%)' }} />
                <div style={{ position: 'absolute', left: 26, top: 18 }}>
                  <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.12em', color: 'rgba(32,36,43,0.55)' }}>EMLAKÇI VİTRİNİ</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, color: '#20242B', marginTop: 4 }}>
                    $250.000
                  </Ink>
                </div>
                <Tape x={140} y={-20} rot={-4} w={110} h={34} />
              </div>
            </div>
            <CastShadow frame={frame} x={64} y={1442} w={392} h={166} rot={2.1} start={T.scrap2} len={0.42} r={4} />
            <div style={place(frame, T.scrap2, 0.42, { dy: -220, rot0: -5 })}>
              <Photocopy x={64} y={1442} w={392} h={166} rot={2.1} seed={61} shadow={false}>
                <div style={{ position: 'absolute', left: 30, top: 20 }}>
                  <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.12em', color: 'rgba(32,36,43,0.55)' }}>İLAN SİTESİ A</div>
                  <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, color: '#20242B', marginTop: 4 }}>
                    £175.000
                  </Ink>
                </div>
              </Photocopy>
            </div>
            <CastShadow frame={frame} x={470} y={1468} w={464} h={148} rot={-2.4} start={T.scrap3} len={0.42} r={4} />
            <div style={place(frame, T.scrap3, 0.42, { dy: -220, rot0: 5 })}>
              <Sheet x={470} y={1468} w={464} h={148} rot={-2.4} bg="#F6F2E7" seed={77} amp={5} n={5} fiber={false} shadow={false}>
                <div style={{ position: 'absolute', left: 28, top: 12 }}>
                  <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.12em', color: 'rgba(32,36,43,0.55)' }}>WHATSAPP GRUBU</div>
                  <Ink marker style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: '#23272E', marginTop: 2 }}>
                    ₺11.900.000
                  </Ink>
                </div>
              </Sheet>
            </div>

            {/* verdict + the film's FIRST cobalt: the redaction strike */}
            <div style={{ position: 'absolute', left: 84, top: 1632 }}>
              <div style={wipe(frame, T.verdict, 0.3)}>
                <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: '-0.01em', color: NAVY }}>
                  AYNI EV. ÜÇ AYRI FİYAT.
                </Ink>
              </div>
            </div>
            <div style={{ ...wipe(frame, T.strike, 0.27), position: 'absolute', left: 74, top: 1490, width: 940, height: 60,
                          transform: 'rotate(-2.2deg)' }}>
              <HandLine x={0} y={10} w={920} seed={31} sw={16} />
            </div>
          </>
        )}
      </div>

      {/* ════ COBALT WORLD (A2–A4) ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.cobalt - 0.05 ? 1 : 0,
                    transform: `translateY(${cobaltInY + cobaltOutY}px)` }}>
        <CobaltSheet top={128} landed={frame >= f(T.cobalt + 0.72)}>
          {/* headline printed into the cobalt */}
          <div style={{ position: 'absolute', left: 108, top: 250 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                          letterSpacing: '-0.015em', color: '#FFFFFF' }}>
              {trUpper('Evlek’te her şey')}<br />{trUpper('yerinde.')}
            </div>
            <div style={{ ...wipe(frame, T.under, 0.25), position: 'absolute', left: 0, top: 0, width: 360, height: 220 }}>
              <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
            </div>
          </div>

          {/* HERO CARD — placed at 7.85, glides to alignment at 16.55 */}
          <CastShadow frame={frame} x={CARD_IN.x + glideX} y={CARD_IN.y + glideY} w={812} h={1010}
                      rot={-0.8} start={T.hero} len={0.55} r={5} />
          <div style={{ transform: `translate(${glideX}px, ${glideY}px)` }}>
            <div style={place(frame, T.hero, 0.55, { dx: 90, dy: 240, rot0: 4.8 })}>
              <CardStock x={CARD_IN.x} y={CARD_IN.y} w={812} h={1010} rot={-0.8} seed={23} pad={0}
                         style={{ boxShadow: 'none' }}>
                <div style={{ position: 'absolute', right: 64, top: -14, width: 128, height: 66,
                              background: COBALT, clipPath: cutEdge(128, 66, 91, 2.4, 4) }}>
                  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.16em', color: '#FFFFFF',
                                position: 'absolute', left: 18, top: 20 }}>EVLEK</div>
                </div>
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

          {/* SEARCH RAIL + CHIPS — in at 8.65, out left at 10.55 */}
          {t < 11.4 && (
            <>
              <CastShadow frame={frame} x={-16} y={560} w={1112} h={118} rot={-0.5}
                          start={T.strip} len={0.5} r={3} />
              <div style={{ opacity: frame >= f(T.strip) && frame < f(T.stripExit + 0.45) ? 1 : 0,
                            transform: `translateX(${
                              (1 - prog(frame, T.strip, 0.5, WIPE)) * -1300 -
                              prog(frame, T.stripExit, 0.45, ease.drawer) * 1400}px)` }}>
                <Sheet x={-16} y={560} w={1112} h={118} rot={-0.5} seed={88} amp={2.4} n={5} shadow={false}>
                  <div style={{ position: 'absolute', left: 78, top: 38, fontFamily: MONO, fontSize: 38,
                                letterSpacing: '0.14em', color: 'rgba(10,37,64,0.68)' }}>ARAMA</div>
                  {[['GİRNE', 300, 196], ['3+1', 516, 136], ['DENİZE YAKIN', 672, 330]].map(([txt, x, w], i) => (
                    <div key={txt} style={{ position: 'absolute', left: x, top: 24, width: w, height: 70,
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
                  {/* chip cast shadows live on the strip so they travel with it */}
                  {[['g', 300, 196], ['u', 516, 136], ['d', 672, 330]].map(([k, x, w], i) => (
                    <CastShadow key={k} frame={frame} x={x} y={24} w={w} h={70} small
                                start={T.chips[i]} len={T.chipLen} r={2} />
                  ))}
                </Sheet>
              </div>
            </>
          )}

          {/* INFO WORLD (A3) — label, five-language deck, price band; all
              gathered away at 15.9, revealing the hero card intact */}
          {t < 17 && (
            <div style={{ transform: `translateY(${prog(frame, T.infoExit, 0.55, ease.drawer) * 1600}px)` }}>
              <CastShadow frame={frame} x={108} y={668} w={470} h={64} small start={T.label} len={0.36} r={3} />
              <div style={place(frame, T.label, 0.36, { dy: -150, rot0: -3 })}>
                <Sheet x={108} y={668} w={470} h={64} rot={-0.6} seed={141} amp={2} n={4} fiber={false} shadow={false}>
                  <div style={{ position: 'absolute', left: 24, top: 16, fontFamily: MONO, fontSize: 26,
                                letterSpacing: '0.14em', color: NAVY }}>
                    BEŞ DİL · AYNI İLAN
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
                const y = 760 + i * 128;
                return (
                  <React.Fragment key={c.tag}>
                    <CastShadow frame={frame} x={x} y={y} w={800} h={140} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                small start={start} len={0.4} r={4} />
                    <div style={place(frame, start, 0.4, { dy: -200, rot0: [-4, 3.5, -3, 4, -3.5][i] })}>
                      <CardStock x={x} y={y} w={800} h={140} rot={[-1.4, 1, -0.8, 1.2, -1][i]}
                                 seed={101 + i} style={{ boxShadow: 'none' }}>
                        <div style={{ position: 'absolute', left: 24, top: 24, width: 70, height: 44,
                                      background: i === 4 ? COBALT : 'transparent',
                                      border: i === 4 ? 'none' : '2.5px solid rgba(10,37,64,0.5)',
                                      transform: `rotate(${[-2.5, 1.8, -1.2, 2.2, -1.6][i]}deg)`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.1em',
                                         color: i === 4 ? '#FFFFFF' : 'rgba(10,37,64,0.72)' }}>{c.tag}</span>
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 116, right: 26, top: 24,
                                      fontFamily: SANS, fontWeight: 600, fontSize: 29, color: NAVY,
                                      textAlign: c.rtl ? 'right' : 'left' }}>
                          {c.line}
                        </div>
                        <div dir={c.rtl ? 'rtl' : 'ltr'}
                             style={{ position: 'absolute', left: 116, right: 26, top: 78, fontFamily: MONO, fontSize: 23,
                                      letterSpacing: '0.05em', color: 'rgba(10,37,64,0.72)',
                                      textAlign: c.rtl ? 'right' : 'left' }}>
                          {c.sub}
                        </div>
                      </CardStock>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* the price band — real Girne 3+1 data */}
              <CastShadow frame={frame} x={84} y={1428} w={912} h={470} rot={0.7}
                          start={T.band} len={0.6} contact={{ dy: 6, blur: 12, a: 0.15 }} r={4} />
              <div style={place(frame, T.band, 0.6, { dy: 320, rot0: -2.5 })}>
                <Sheet x={84} y={1428} w={912} h={470} rot={0.7} seed={131} amp={3.4} n={8} shadow={false}>
                  <div style={{ position: 'absolute', left: 52, top: 40, fontFamily: SANS, fontWeight: 800,
                                fontSize: 50, letterSpacing: '-0.01em', color: NAVY }}>
                    FİYAT TEK BAŞINA YETMEZ.
                  </div>
                  <div style={{ position: 'absolute', left: 54, top: 114, fontFamily: MONO, fontSize: 25,
                                letterSpacing: '0.1em', color: 'rgba(10,37,64,0.7)' }}>
                    GİRNE · 3+1 DAİRE · 19 AKTİF İLAN
                  </div>
                  <svg width="800" height="150" style={{ position: 'absolute', left: 52, top: 168 }}>
                    <line x1="0" y1="110" x2="800" y2="110" stroke={NAVY} strokeWidth="3" />
                    {Array.from({ length: 25 }, (_, i) => (
                      <line key={i} x1={(800 / 24) * i} y1={i % 4 === 0 ? 86 : 96} x2={(800 / 24) * i} y2="110"
                            stroke={NAVY} strokeWidth={i % 4 === 0 ? 2.4 : 1.4} opacity={i % 4 === 0 ? 0.9 : 0.5} />
                    ))}
                    {/* the marker piece drops onto its true position (17.7%) */}
                    <g transform="translate(141.7 0)">
                      <g style={place(frame, T.marker, 0.3, { dy: -90 })}>
                        <path d="M0 74 L-16 38 L16 38 Z" fill={COBALT} />
                        <line x1="0" y1="74" x2="0" y2="110" stroke={COBALT} strokeWidth="4" />
                      </g>
                    </g>
                  </svg>
                  <div style={{ position: 'absolute', left: 52, top: 300, fontFamily: MONO, fontSize: 26,
                                color: 'rgba(10,37,64,0.85)' }}>£90.000</div>
                  <div style={{ position: 'absolute', right: 58, top: 300, fontFamily: MONO, fontSize: 26,
                                color: 'rgba(10,37,64,0.85)' }}>£570.000</div>
                  <div style={{ position: 'absolute', left: 240, top: 168, ...wipe(frame, T.price, 0.28) }}>
                    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: COBALT }}>£175.000</div>
                    <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.06em',
                                  color: 'rgba(10,37,64,0.6)', marginTop: 6 }}>BU İLAN · £1.458/M²</div>
                  </div>
                  <div style={{ position: 'absolute', left: 52, bottom: 34, fontFamily: MONO, fontSize: 22,
                                letterSpacing: '0.08em', color: 'rgba(10,37,64,0.58)' }}>
                    KAYNAK: EVLEK.APP CANLI İLAN VERİSİ
                  </div>
                </Sheet>
              </div>
            </div>
          )}

          {/* MANIFESTO STRIP (A4) — pressed over the printed headline */}
          <CastShadow frame={frame} x={56} y={244} w={968} h={226} rot={-0.4}
                      start={T.manifesto} len={0.5} contact={{ dy: 5, blur: 11, a: 0.15 }} r={4} />
          <div style={place(frame, T.manifesto, 0.5, { dy: -260, rot0: 3 })}>
            <Sheet x={56} y={244} w={968} h={226} rot={-0.4} seed={171} amp={3} n={8} fiber={false} shadow={false}>
              <div style={{ position: 'absolute', left: 52, top: 62, fontFamily: SANS, fontWeight: 800,
                            fontSize: 58, letterSpacing: '-0.015em', color: NAVY }}>
                GÜRÜLTÜ GİDER. EV KALIR.
              </div>
            </Sheet>
          </div>
        </CobaltSheet>
      </div>

      {/* ════ PRESS WORLD (A5) — rises beneath the standing gold tab ════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: t >= T.page - 0.05 ? 1 : 0,
                    transform: `translateY(${pageOutY}px)` }}>
        {/* near-full-frame object: a static announce blob would veil the whole
            frame, so the page carries its own shadow — soft in flight, snapping
            hard (14px, council spec) on the contact frame */}
        <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                      transform: `rotate(-0.35deg) translateY(${pageInY}px)`,
                      filter: frame >= f(T.page + T.pageLen)
                        ? 'drop-shadow(0 8px 14px rgba(10,37,64,0.16))'
                        : 'drop-shadow(0 17px 28px rgba(10,37,64,0.16))' }}>
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

          <div style={{ position: 'absolute', left: 88, top: 920, fontFamily: MONO, fontWeight: 500,
                        fontSize: 40, letterSpacing: '0.06em', color: NAVY, ...wipe(frame, T.url, 0.25) }}>
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

      {/* ════ THE GOLD TAB — the film's single gold. TAKs onto the ALIGNED
           hero card's cobalt notch (never an empty desk); the press page
           later rises beneath it; it leaves riding the page. ════ */}
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
    </Ground>
  );
};
