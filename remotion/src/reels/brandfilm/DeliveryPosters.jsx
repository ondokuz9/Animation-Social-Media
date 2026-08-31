// Evlek brand film — DELIVERY covers & re-composed stills (static posters).
// Rendered as single-frame compositions at full quality; nothing here touches
// the approved film. Compositions are re-staged (not blind frame grabs) so
// every element is fully settled, nothing clips the frame edges, and the
// removed blue approval line never reappears.

import React from 'react';
import { Img } from 'remotion';
import { SANS, MONO, trUpper } from '../../brand/tokens.js';
import {
  NAVY, COBALT, GOLD, CREAM, TEX,
  cutEdge, stockCorners, MatterDefs, Ink,
  Photocopy, CardStock, CobaltSheet, Tape, PhotoSlot, CropMarks,
  PHOTO_MASKS,
} from './matter.jsx';
import { Sheet, HandLine, Wordmark, HOME } from './Styleframes.jsx';

export const POSTER_FRAMES = 1;

const InkDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="dpInkRough80">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" />
      </filter>
    </defs>
  </svg>
);

const PlasterWall = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#E9E2D7' }}>
    <Img src={TEX.wallPlaster} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                        objectFit: 'cover' }} />
  </div>
);

/* one duplicate listing copy (settled) */
const ListingCopy = ({ x, y, w = 520, h = 620, rot = 0, photo, kase = false, phone }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h,
                transform: `rotate(${rot}deg)`, background: '#F5F1E6',
                clipPath: cutEdge(w, h, 218 + (kase ? 3 : 0), 2.4, 6),
                boxShadow: '0 4px 9px rgba(10,37,64,0.17), 0 1px 2px rgba(10,37,64,0.12)' }}>
    <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                      objectFit: 'cover', opacity: 0.7 }} />
    <div style={{ position: 'absolute', left: 24, top: 24, width: w - 48, height: h * 0.55,
                  clipPath: PHOTO_MASKS.a }}>
      <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ position: 'absolute', left: 26, top: h * 0.55 + 44 }}>
      <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: '0.04em', color: '#20242B' }}>
        SATILIK
      </Ink>
      <Ink problem style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, color: '#2A2E36', marginTop: 8 }}>
        3+1 · Lapta{kase ? ' · deniz yakın' : ' · denize yakın'}
      </Ink>
      <Ink problem marker style={{ fontFamily: MONO, fontSize: 26, letterSpacing: '0.05em', color: '#20242B', marginTop: 8 }}>
        {phone}
      </Ink>
    </div>
    {kase && (
      <div style={{ position: 'absolute', right: 18, top: 14, transform: 'rotate(-8deg)',
                    border: '2.5px solid rgba(10,37,64,0.5)', padding: '4px 10px' }}>
        <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.08em',
                       color: 'rgba(10,37,64,0.62)' }}>HÂLÂ SATILIK MI?</span>
      </div>
    )}
  </div>
);

const PriceTag = ({ x, y, rot, label, price, marker = false, tape = false, tail = false, fontSize = 52 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 340, height: 130, transform: `rotate(${rot}deg)`,
                filter: 'drop-shadow(0 2px 5px rgba(10,37,64,0.15))' }}>
    <div style={{ position: 'absolute', inset: 0, background: '#F4F0E4',
                  clipPath: cutEdge(340, 130, 61 + Math.round(x), 3.4, 4) }} />
    {tail && (
      <div style={{ position: 'absolute', left: -14, top: 22, width: 24, height: 24,
                    background: '#F4F0E4', clipPath: 'polygon(100% 0, 100% 100%, 0 32%)' }} />
    )}
    <div style={{ position: 'absolute', left: 22, top: 12 }}>
      <div style={{ fontFamily: MONO, fontWeight: 650, fontSize: 26, letterSpacing: '0.08em', color: 'rgba(32,36,43,0.8)' }}>{label}</div>
      <Ink problem={!marker} marker={marker}
           style={{ fontFamily: SANS, fontWeight: 800, fontSize, color: '#20242B', marginTop: 2 }}>
        {price}
      </Ink>
    </div>
    {tape && <Tape x={110} y={-18} rot={-3} w={120} h={30} />}
  </div>
);

const QuestionBand = ({ x, y, w = 960 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0 }}>
    <Photocopy x={x} y={y} w={w} h={150} rot={-0.8} seed={97} shadow>
      <div style={{ position: 'absolute', left: 36, top: 34 }}>
        <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58,
                              letterSpacing: '-0.01em', color: NAVY }}>
          ÜÇ FİYAT. HANGİSİ DOĞRU?
        </Ink>
      </div>
      <div style={{ position: 'absolute', right: 36, top: -30, width: 120, height: 44,
                    background: COBALT, clipPath: cutEdge(120, 44, 93, 2, 3) }}>
        <Wordmark w={71} color="#FFFFFF" style={{ position: 'absolute', left: 24, top: 10 }} />
      </div>
    </Photocopy>
  </div>
);

/* ── COVER 1: Problem, 1080×1920 — the poster of the hook, prices OPEN,
      no redaction, nothing clipped by the frame edges ── */
export const CoverProblem1920 = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
    <MatterDefs />
    <InkDefs />
    <PlasterWall />
    <div style={{ position: 'absolute', left: 84, top: 200 }}>
      <Ink problem roughUrl="url(#dpInkRough80)" ghostOpacity={0.176}
           style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.12,
                    letterSpacing: '-0.015em', color: NAVY }}>
        AYNI EV.
      </Ink>
    </div>
    <QuestionBand x={60} y={330} />
    {/* three copies of the same home — pulled inside safe margins */}
    <div style={{ position: 'absolute', left: 262, top: 560, width: 560, height: 700,
                  transform: 'rotate(-0.6deg)', background: '#F3EFE5',
                  clipPath: cutEdge(560, 700, 208, 2.6, 7),
                  boxShadow: '0 4px 9px rgba(10,37,64,0.17), 0 1px 2px rgba(10,37,64,0.12)' }}>
      <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                        objectFit: 'cover', opacity: 0.8 }} />
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
      </div>
    </div>
    <ListingCopy x={64} y={1010} rot={-4.5} photo={TEX.homeDuoSoft} phone="0533 8•• •• ••" />
    <ListingCopy x={506} y={980} rot={4.5} photo={TEX.homeDuoFlat} kase phone="0542 3•• •• ••" />
    {/* three prices, all legible, on the diagonal — but NOT struck through */}
    <PriceTag x={380} y={1240} rot={2} label="İLAN SİTESİ" price="£175.000" fontSize={54} />
    <PriceTag x={64} y={1330} rot={-2.4} label="WHATSAPP GRUBU" price="₺11.900.000" marker tail />
    <PriceTag x={648} y={1180} rot={3.4} label="EMLAKÇI VİTRİNİ" price="$250.000" tape fontSize={50} />
  </div>
);

/* ── COVER 2: Problem, 1080×1350 (4:5) — re-composed, not cropped ── */
export const CoverProblem1350 = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
    <MatterDefs />
    <InkDefs />
    <PlasterWall />
    <div style={{ position: 'absolute', left: 72, top: 96 }}>
      <Ink problem roughUrl="url(#dpInkRough80)" ghostOpacity={0.176}
           style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.1,
                    letterSpacing: '-0.015em', color: NAVY }}>
        AYNI EV.
      </Ink>
    </div>
    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'scale(0.92)', transformOrigin: '60px 216px' }}>
      <QuestionBand x={60} y={216} />
    </div>
    {/* the three copies scaled to breathe inside 4:5 */}
    <div style={{ position: 'absolute', inset: 0, transform: 'scale(0.78)', transformOrigin: '540px 430px' }}>
      <div style={{ position: 'absolute', left: 262, top: 430, width: 560, height: 640,
                    transform: 'rotate(-0.6deg)', background: '#F3EFE5',
                    clipPath: cutEdge(560, 640, 208, 2.6, 7),
                    boxShadow: '0 4px 9px rgba(10,37,64,0.17), 0 1px 2px rgba(10,37,64,0.12)' }}>
        <Img src={TEX.photocopy} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                                          objectFit: 'cover', opacity: 0.8 }} />
        <div style={{ position: 'absolute', left: 30, top: 30, width: 500, height: 400,
                      clipPath: PHOTO_MASKS.b }}>
          <Img src={TEX.homeDuoClean} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', left: 32, top: 452 }}>
          <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: '0.04em', color: '#20242B' }}>
            SATILIK
          </Ink>
          <Ink problem style={{ fontFamily: MONO, fontWeight: 500, fontSize: 27, color: '#2A2E36', marginTop: 10 }}>
            3+1 · Lapta · denize yakın
          </Ink>
        </div>
      </div>
      <ListingCopy x={80} y={830} rot={-4.5} photo={TEX.homeDuoSoft} phone="0533 8•• •• ••" />
      <ListingCopy x={500} y={800} rot={4.5} photo={TEX.homeDuoFlat} kase phone="0542 3•• •• ••" />
      <PriceTag x={380} y={1040} rot={2} label="İLAN SİTESİ" price="£175.000" fontSize={54} />
      <PriceTag x={80} y={1130} rot={-2.4} label="WHATSAPP GRUBU" price="₺11.900.000" marker tail />
      <PriceTag x={640} y={984} rot={3.4} label="EMLAKÇI VİTRİNİ" price="$250.000" tape fontSize={50} />
    </div>
  </div>
);

/* ── COVER 3: Final lockup, 1080×1920 — web, press, decks.
      No blue approval line. One gold. ── */
export const CoverFinal1920 = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
    <MatterDefs />
    <InkDefs />
    <div style={{ position: 'absolute', inset: 0, background: CREAM,
                  clipPath: cutEdge(1080, 1920, 777, 10, 16),
                  filter: 'drop-shadow(0 6px 16px rgba(10,37,64,0.12))' }}>
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        <rect width="1080" height="1920" filter="url(#mTooth)" />
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                  transform: 'rotate(-0.35deg)',
                  filter: 'drop-shadow(0 3px 8px rgba(10,37,64,0.20)) drop-shadow(0 1px 2px rgba(10,37,64,0.12))' }}>
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
      <div style={{ position: 'absolute', left: 84, top: 496, fontFamily: SANS, fontWeight: 800,
                    fontSize: 108, lineHeight: 1.05, letterSpacing: '-0.02em', color: NAVY }}>
        Kıbrıs’ta<br />doğru ev.
      </div>
      <div style={{ position: 'absolute', left: 88, top: 858, fontFamily: MONO, fontWeight: 600,
                    fontSize: 50, letterSpacing: '0.04em', color: NAVY }}>
        evlek.app
      </div>
      <div style={{ position: 'absolute', left: 84, top: 1060, width: 768, height: 250,
                    background: '#F7F3EA', borderRadius: stockCorners(83),
                    boxShadow: '0 4px 9px rgba(10,37,64,0.17), 0 1px 2px rgba(10,37,64,0.12)' }}>
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
      <Wordmark w={430} color={NAVY} style={{ position: 'absolute', left: 70, top: 1350 }} />
    </div>
    {/* the single gold — landed, hard contact shadow */}
    <div style={{ position: 'absolute', left: 768, top: 610, width: 168, height: 86,
                  borderRadius: 3, background: 'rgba(10,37,64,0.16)', filter: 'blur(5px)' }} />
    <div style={{ position: 'absolute', left: 768, top: 608, width: 168, height: 86,
                  transform: 'rotate(1.6deg)' }}>
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
);

/* ── STILL 03: the information composition, re-staged so the language deck
      and the price context never cover each other ── */
export const Still03Info = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#D8D1C1', overflow: 'hidden' }}>
    <MatterDefs />
    <InkDefs />
    <CobaltSheet top={128} landed>
      <div style={{ position: 'absolute', left: 84, top: 210 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.06,
                      letterSpacing: '-0.015em', color: '#FFFFFF' }}>
          {trUpper('Beş dil. Aynı ev.')}
        </div>
      </div>
      {[
        { tag: 'TR', line: <>Lapta, Girne’de 3+1 daire</>, sub: <>£175.000 · 120 M² · 3+1</> },
        { tag: 'EN', line: <>3+1 apartment in Lapta, Kyrenia</>, sub: <>£175,000 · 120 M² · 3+1</> },
        { tag: 'RU', line: <>Квартира 3+1 в Лапте, Кирения</>, sub: <>£175 000 · 120 М² · 3+1</> },
        { tag: 'DE', line: <>3+1-Wohnung in Lapta, Kyrenia</>, sub: <>£175.000 · 120 M² · 3+1</> },
        { tag: 'AR', rtl: true,
          line: <>شقة <bdi dir="ltr">3+1</bdi> في لابتا، كيرينيا</>,
          sub: <><bdi dir="ltr">£175,000</bdi> · <bdi dir="ltr">120</bdi> م² · <bdi dir="ltr">3+1</bdi></> },
      ].map((c, i) => {
        const x = 108 + [0, 20, 36, 22, 8][i];
        const y = 370 + i * 140;
        return (
          <div key={c.tag}>
            <div style={{ position: 'absolute', left: x, top: y + 4, width: 800, height: 122,
                          transform: `rotate(${[-1.4, 1, -0.8, 1.2, -1][i]}deg)`, borderRadius: 4,
                          background: 'rgba(10,37,64,0.17)', filter: 'blur(9px)' }} />
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
        );
      })}

      {/* price context below — fully settled: ticket ON the ruler, marker set */}
      <div style={{ position: 'absolute', left: 84, top: 1152, width: 912, height: 470,
                    transform: 'rotate(0.7deg)', borderRadius: 4,
                    background: 'rgba(10,37,64,0.17)', filter: 'blur(9px)' }} />
      <Sheet x={84} y={1148} w={912} h={470} rot={0.7} seed={131} amp={3.4} n={8} shadow={false}
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
            <path d="M0 74 L-16 38 L16 38 Z" fill={COBALT} />
            <line x1="0" y1="74" x2="0" y2="110" stroke={COBALT} strokeWidth="4" />
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 52, top: 296, fontFamily: MONO, fontSize: 24,
                      color: 'rgba(10,37,64,0.85)' }}>£90.000</div>
        <div style={{ position: 'absolute', right: 58, top: 296, fontFamily: MONO, fontSize: 24,
                      color: 'rgba(10,37,64,0.85)' }}>£570.000</div>
        <div style={{ position: 'absolute', left: 240, top: 236, fontFamily: MONO, fontSize: 23,
                      letterSpacing: '0.06em', color: 'rgba(10,37,64,0.6)' }}>
          BU EV · £1.458/M²
        </div>
        <div style={{ position: 'absolute', left: 236, top: 146, width: 264, height: 74,
                      transform: 'rotate(0.7deg)',
                      filter: 'drop-shadow(0 3px 6px rgba(10,37,64,0.18))' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF',
                        clipPath: cutEdge(264, 74, 57, 1.6, 3) }} />
          <div style={{ position: 'absolute', left: 24, top: 10, fontFamily: SANS, fontWeight: 800,
                        fontSize: 46, color: NAVY }}>£175.000</div>
        </div>
        <div style={{ position: 'absolute', left: 52, bottom: 32, fontFamily: MONO, fontSize: 22,
                      letterSpacing: '0.08em', color: 'rgba(10,37,64,0.58)' }}>
          KAYNAK: EVLEK.APP CANLI İLAN VERİSİ
        </div>
      </Sheet>
    </CobaltSheet>
  </div>
);
