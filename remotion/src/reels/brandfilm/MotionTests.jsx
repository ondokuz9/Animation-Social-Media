// Evlek brand film — MOTION TESTS (the council's next gate).
//
// Art direction is locked at the four styleframes. These two compositions
// test MOVEMENT quality only, on the two sections the council named:
//
//   MT1  film 06.4–10.5  cobalt sheet → hero card → search strip → 3 filters
//   MT2  film 19.2–24.6  gold BU. → final page → slogan → wordmark → line
//
// Three red lines, verbatim from the council:
//   1. Texture moves WITH the paper — never in screen coordinates.
//      (Every texture here is a child of the element that moves; nothing
//      samples a texture in screen space.)
//   2. Filters do not scale-pop; they are physical pieces lifted and placed.
//      (Chips enter by translation+rotation only. No scale anywhere.)
//   3. After the wordmark lands in MT2, NOTHING idles, floats or pulses.
//
// Motion vocabulary is the film's bible: one settle curve with a single
// ~5% overshoot and one return; shadows soften in flight and harden on
// landing; no cross-dissolves — paper enters by translation, print enters
// by a hard wipe (a print head, not a fade).

import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { SANS, MONO, trUpper, f } from '../../brand/tokens.js';
import {
  NAVY, COBALT, GOLD, TEX,
  cutEdge, stockCorners, CardStock, CobaltSheet, Punch, CropMarks, PhotoSlot,
} from './matter.jsx';
import { Sheet, HandLine, Wordmark, Ground, HOME } from './Styleframes.jsx';
import { Img } from 'remotion';

/* THE settle: ~5% overshoot, one return. The film's only placement curve. */
const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const WIPE = Easing.bezier(0.22, 1, 0.36, 1);

const prog = (frame, atSec, lenSec, easing = SETTLE) =>
  interpolate(frame, [f(atSec), f(atSec + lenSec)], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/* placement: translation + rotation, NEVER scale; hidden until flight starts */
const place = (frame, atSec, lenSec, { dx = 0, dy = 0, rot0 = 0 } = {}) => {
  const p = prog(frame, atSec, lenSec);
  return {
    opacity: frame >= f(atSec) ? 1 : 0,
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${(1 - p) * rot0}deg)`,
  };
};

/* a print-head wipe: hard edge, left to right */
const wipe = (frame, atSec, lenSec = 0.32) => {
  const p = prog(frame, atSec, lenSec, WIPE);
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: frame >= f(atSec) ? 1 : 0 };
};

/* flight shadow → landing shadow: softens in the air, hardens on contact */
const flightShadow = (frame, atSec, lenSec) => {
  const p = prog(frame, atSec, lenSec, WIPE);
  return `drop-shadow(0 ${6 + 22 * (1 - p)}px ${10 + 26 * (1 - p)}px rgba(10,37,64,${0.15 + 0.04 * (1 - p)}))`;
};

/* ═══════════════════════════════════════════════════════════════════════
   MT1 — 06.4–10.5 · THE EVLEK WORLD ASSEMBLES  (4.1 s, 246 frames)
   0.10–0.80  cobalt sheet rises from below (headline printed on it)
   1.00       white underline wipes under the headline
   1.45–2.00  hero card placed from lower right, lands askew-correct
   2.25–2.75  search strip threads in from the left
   3.00/3.30/3.60  three paper chips dropped one by one
   then dead still.
   ═══════════════════════════════════════════════════════════════════════ */

export const MT1_FRAMES = f(4.1);

export const MotionTest1 = () => {
  const frame = useCurrentFrame();

  const sheetRise = (1 - prog(frame, 0.1, 0.7)) * 1920;
  const chips = [['GİRNE', 300, 196], ['3+1', 516, 136], ['DENİZE YAKIN', 672, 330]];

  return (
    <Ground>
      {/* the whole cobalt world moves as ONE printed object — texture rides it */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${sheetRise}px)` }}>
        <CobaltSheet top={128}>
          <div style={{ position: 'absolute', left: 108, top: 250 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                          letterSpacing: '-0.015em', color: '#FFFFFF' }}>
              {trUpper('Evlek’te her şey')}<br />{trUpper('yerinde.')}
            </div>
            <div style={{ ...wipe(frame, 1.0, 0.25), position: 'absolute', left: 0, top: 0, width: 360, height: 220 }}>
              <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
            </div>
          </div>

          {/* HERO CARD — placed by hand, lands with its final micro-tilt */}
          <div style={{ ...place(frame, 1.45, 0.55, { dx: 90, dy: 240, rot0: 4.8 }) }}>
            <div style={{ position: 'absolute', left: 134, top: 742, width: 812, height: 1010,
                          filter: flightShadow(frame, 1.45, 0.55) }}>
              <CardStock x={0} y={0} w={812} h={1010} rot={-0.8} seed={23} pad={0}
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

          {/* SEARCH STRIP — threads in from the left as one paper band */}
          <div style={{ opacity: frame >= f(2.25) ? 1 : 0,
                        transform: `translateX(${(1 - prog(frame, 2.25, 0.5, WIPE)) * -1300}px)` }}>
            <Sheet x={-16} y={560} w={1112} h={118} rot={-0.5} seed={88} amp={2.4} n={5}>
              <div style={{ position: 'absolute', left: 78, top: 38, fontFamily: MONO, fontSize: 38,
                            letterSpacing: '0.14em', color: 'rgba(10,37,64,0.68)' }}>ARAMA</div>
              {chips.map(([t, x, w], i) => (
                <div key={t} style={{ position: 'absolute', left: x, top: 24, width: w, height: 70,
                                      ...place(frame, 3.0 + i * 0.3, 0.42, { dy: -240, rot0: [-5, 4, -3.5][i] }) }}>
                  <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                                clipPath: cutEdge(w, 70, 53 + i * 7, 1.8, 4),
                                transform: `rotate(${[-0.4, 0.2, -0.25][i]}deg)`,
                                display: 'flex', alignItems: 'center', padding: '0 0 0 44px' }}>
                    <Punch x={14} y={28} />
                    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: NAVY,
                                   letterSpacing: '0.02em' }}>{t}</span>
                  </div>
                </div>
              ))}
            </Sheet>
          </div>
        </CobaltSheet>
      </div>
    </Ground>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MT2 — 19.2–24.6 · GOLD, THEN THE PRINTED ANSWER  (5.5 s, 330 frames)
   0.70–0.98  gold BU. tab TAKs in from the right, onto the empty desk
   1.70–2.45  the press page rises under it and stops — the tab now rides
              its edge (tab is above the page in z, so the page arrives
              beneath it: the one trick in the film)
   2.70/2.95  slogan lines print (hard wipes)
   3.45       url prints
   3.75–4.25  listing proof card placed
   4.45       wordmark prints — after this NOTHING moves except:
   4.90–5.25  the cobalt approval line draws. Then absolute stillness.
   ═══════════════════════════════════════════════════════════════════════ */

export const MT2_FRAMES = f(5.5);

export const MotionTest2 = () => {
  const frame = useCurrentFrame();
  const pageRise = (1 - prog(frame, 1.7, 0.75)) * 2100;

  return (
    <Ground tone="#E7E1D3">
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        <rect width="1080" height="1920" filter="url(#mTone)" opacity="0.8" />
      </svg>

      <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                    transform: 'rotate(-0.35deg)' }}>
        {/* THE PRESS PAGE — rises as one printed object, texture aboard */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${pageRise}px)` }}>
          <div style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 22px 38px rgba(10,37,64,0.18))' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#FBF8F1',
                          clipPath: cutEdge(936, 1728, 7, 2.2, 10) }}>
              <Img src={TEX.press} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                            objectFit: 'cover', opacity: 0.8 }} />
              <svg width="936" height="1728" style={{ position: 'absolute', inset: 0 }}>
                <rect width="936" height="1728" filter="url(#mTooth)" opacity="0.5" />
              </svg>
            </div>
          </div>
          <CropMarks w={936} h={1728} />
          <div style={{ position: 'absolute', right: 64, top: 64, fontFamily: MONO, fontSize: 22,
                        letterSpacing: '0.14em', color: 'rgba(10,37,64,0.4)' }}>
            EVLEK BASKI 01 · KKTC
          </div>

          {/* slogan — printed, not faded */}
          <div style={{ position: 'absolute', left: 84, top: 496 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, lineHeight: 1.05,
                          letterSpacing: '-0.02em', color: NAVY }}>
              <div style={wipe(frame, 2.7, 0.3)}>Kıbrıs’ta</div>
              <div style={wipe(frame, 2.95, 0.3)}>doğru ev.</div>
            </div>
            {/* the approval line draws LAST — the film's closing gesture */}
            <div style={{ ...wipe(frame, 4.9, 0.35), position: 'absolute', left: 0, top: 240, width: 470, height: 60 }}>
              <HandLine x={4} y={22} w={446} seed={4} sw={16} />
            </div>
          </div>

          <div style={{ position: 'absolute', left: 88, top: 920, fontFamily: MONO, fontWeight: 500,
                        fontSize: 40, letterSpacing: '0.06em', color: NAVY, ...wipe(frame, 3.45, 0.25) }}>
            evlek.app
          </div>

          {/* listing proof card — placed, contact shadow hardens on landing */}
          <div style={{ ...place(frame, 3.75, 0.5, { dy: 150, rot0: 2.2 }) }}>
            <div style={{ position: 'absolute', left: 84, top: 1092, width: 768, height: 250,
                          background: '#F7F3EA', borderRadius: stockCorners(83),
                          filter: flightShadow(frame, 3.75, 0.5) }}>
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

          {/* wordmark prints — and then the page is DEAD STILL */}
          <div style={{ ...wipe(frame, 4.45, 0.35), position: 'absolute', left: 84, top: 1366, width: 460, height: 160 }}>
            <Wordmark w={430} color={NAVY} style={{ position: 'absolute', left: 0, top: 0 }} />
          </div>
        </div>

        {/* THE GOLD TAB — TAKs onto the desk first; the page arrives under it */}
        <div style={{ ...place(frame, 0.7, 0.28, { dx: 320, rot0: 7.5 }) }}>
          <div style={{ position: 'absolute', right: -30, top: 512, width: 168, height: 86,
                        transform: 'rotate(1.6deg)',
                        filter: 'drop-shadow(0 8px 14px rgba(10,37,64,0.20))' }}>
            <div style={{ position: 'absolute', inset: 0, background: GOLD, clipPath: cutEdge(168, 86, 3, 2.2, 4) }} />
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NAVY,
                          position: 'absolute', left: 34, top: 16 }}>BU.</div>
          </div>
        </div>
      </div>
    </Ground>
  );
};
