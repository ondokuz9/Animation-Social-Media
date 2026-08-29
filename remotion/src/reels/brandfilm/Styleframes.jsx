// Evlek brand film — STYLEFRAMES (the council's stop-order deliverable).
//
// Four static 1080×1920 frames, each of which must work as a standalone
// premium poster BEFORE any animation is rebuilt on top of them:
//
//   SF1  t≈02.2  problem world — the SATILIK wall
//   SF2  t≈08.6  Evlek world   — cobalt stage + hero card + search strip
//   SF3  t≈12.6  info world    — five-language deck + real price band
//   SF4  t≈23.8  final lockup  — press sheet, gold BU. tab, slogan, wordmark
//
// Every number on screen is real: listing 100109 (Lapta, Girne, 3+1, 2 banyo,
// 120 m², £175.000) via the Evlek MCP, and the Girne 3+1 apartment band
// (19 active listings, £90.000–£570.000) derived from live search results.
// The one editorial exception, carried over from the locked scenario: the
// problem wall quotes the SAME home at three inconsistent prices — that
// inconsistency IS the premise, and the £ figure is the real one.
//
// Photos: the four slots are labelled placeholders until Onur uploads the
// real listing-100109 photos; PhotoSlot accepts `src` and nothing else moves.

import React from 'react';
import { SANS, MONO, trUpper } from '../../brand/tokens.js';
import { WORDMARK_PATHS } from './wordmark.js';
import { Img, staticFile } from 'remotion';

/* The film's home — one consistent Flow-generated property. Because these are
   generated (not the photos of a specific live listing), NO real listing
   number appears anywhere in the frames; the market band stays real because
   it is aggregate data. */
const HOME = {
  ext: staticFile('brandfilm/tex/home-ext.jpg'),
  living: staticFile('brandfilm/tex/home-living.jpg'),
  kitchen: staticFile('brandfilm/tex/home-kitchen.jpg'),
  bed: staticFile('brandfilm/tex/home-bed.jpg'),
};
import {
  NAVY, COBALT, GOLD, CREAM, SHADOW, TEX,
  cutEdge, stockCorners, MatterDefs, Ink,
  Photocopy, CardStock, CobaltSheet,
  Tape, Staple, Perforation, Punch, CropMarks, PhotoSlot,
} from './matter.jsx';

export const SF_FRAMES = 1;

/* ── shared bits ─────────────────────────────────────────────────────── */

/* deterministic wobble polyline — the brand's hand-ruled cobalt line */
const wobblePts = (w, seed, amp = 2, n = 12) => {
  let s = (seed * 2654435761) >>> 0;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s / 4294967296) * 2 - 1; };
  return Array.from({ length: n + 1 }, (_, i) => `${(w * i) / n},${8 + r() * amp}`).join(' ');
};

/* A cut sheet whose shadow survives the clip: drop-shadow lives on an outer
   wrapper, the clip-path on the inner surface. (clip-path on the same element
   would clip the box-shadow away — SF round 1 shipped shadowless scraps.) */
const Sheet = ({ x, y, w, h, rot = 0, bg = '#FDFBF6', seed = 1, amp = 3, n = 7,
                 lift = false, fiber = true, children, style = {} }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h,
                transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{ position: 'absolute', inset: 0,
                  filter: lift ? 'drop-shadow(0 20px 34px rgba(10,37,64,0.18))'
                               : 'drop-shadow(0 6px 10px rgba(10,37,64,0.15))' }}>
      <div style={{ position: 'absolute', inset: 0, background: bg, clipPath: cutEdge(w, h, seed, amp, n) }}>
        <Img src={fiber ? TEX.cardstock : TEX.press}
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', opacity: 0.75 }} />
        {fiber && (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            <rect width={w} height={h} filter="url(#mFiber)" opacity="0.5" />
          </svg>
        )}
      </div>
    </div>
    <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
  </div>
);

const HandLine = ({ x, y, w, color = COBALT, sw = 16, seed = 4, opacity = 1 }) => (
  <svg width={w} height={16 + sw} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', opacity }}>
    <polyline points={wobblePts(w, seed)} fill="none" stroke={color}
              strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* the frozen wordmark, navy or white */
const Wordmark = ({ w = 320, color = NAVY, style = {} }) => (
  <svg width={w} height={w * (185 / 550)} viewBox="1230 315 550 185" style={style}>
    {['E', 'v', 'l', 'e', 'k'].map((g) => <path key={g} d={WORDMARK_PATHS[g]} fill={color} />)}
  </svg>
);

/* cream ground with paper tooth — the base of every frame; `img` swaps the
   procedural ground for a real scan (SF1's plaster wall) */
const Ground = ({ tone = CREAM, img = null, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: tone, overflow: 'hidden' }}>
    <MatterDefs />
    {img && (
      <Img src={img} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                              objectFit: 'cover', opacity: 0.9 }} />
    )}
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
      <rect width="1080" height="1920" filter="url(#mTooth)" />
    </svg>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   SF1 — t≈02.2 · THE PROBLEM WALL
   A sun-tired exterior wall. A photocopied SATILIK sheet, taped and stapled,
   phone tabs torn. Around it, three scraps quoting the same home at three
   different prices. The headline is stencilled straight onto the wall.
   No cobalt anywhere: Evlek does not exist yet in this world.
   ═══════════════════════════════════════════════════════════════════════ */

export const SF1 = () => (
  <Ground tone="#E9E2D2" img={TEX.wall}>
    {/* wall: sun bleach + plaster blotches + a hairline crack */}
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
      <rect width="1080" height="1920" filter="url(#mTone)" opacity="0.45" />
      {/* (council SF1-2/3: the ghost KİRALIK patch and the two wall dots are
          gone — they read as digital decor at phone size) */}
      {/* crack */}
      <path d="M40 1560 L150 1500 L210 1520 L340 1440 L395 1452" fill="none" stroke="rgba(10,37,64,0.16)" strokeWidth="2.2" />
      <path d="M210 1520 L235 1560" fill="none" stroke="rgba(10,37,64,0.12)" strokeWidth="1.6" />
      {/* soft top shade — the frame sits under an eave (no hard seam) */}
      <rect width="1080" height="360" fill="url(#sfEave)" />
      <defs>
        <linearGradient id="sfEave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(10,37,64,0.10)" />
          <stop offset="1" stopColor="rgba(10,37,64,0)" />
        </linearGradient>
      </defs>
    </svg>

    {/* headline: stencilled straight on the wall, misregistered */}
    <div style={{ position: 'absolute', left: 84, top: 300 }}>
      <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.04,
                            letterSpacing: '-0.015em', color: NAVY }}>
        {trUpper("Kıbrıs’ta")}<br />{trUpper('ev aramak:')}
      </Ink>
    </div>

    {/* THE SATILIK SHEET */}
    <Photocopy x={172} y={560} w={700} h={950} rot={-1.7} seed={5}>
      {/* photocopied photo of the actual home */}
      <div style={{ position: 'absolute', left: 56, top: 172, width: 588, height: 400, filter: 'url(#mPhotocopyImg)' }}>
        <PhotoSlot w={588} h={400} mask="b" src={HOME.ext} />
      </div>
      <div style={{ position: 'absolute', left: 56, top: 52 }}>
        <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, letterSpacing: '0.05em', color: '#20242B' }}>
          SATILIK
        </Ink>
      </div>
      {/* handwritten-adjacent detail line, toner-broken */}
      <div style={{ position: 'absolute', left: 56, top: 596 }}>
        <Ink problem style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: '#2A2E36', lineHeight: 1.3 }}>
          3+1 · Lapta · deniz yakın<br />ACİL !!
        </Ink>
      </div>
      {/* phone, redacted the honest way */}
      <div style={{ position: 'absolute', left: 56, top: 724 }}>
        <Ink problem marker style={{ fontFamily: MONO, fontWeight: 500, fontSize: 46, letterSpacing: '0.06em', color: '#20242B' }}>
          0533 8•• •• ••
        </Ink>
      </div>
      {/* tear-off phone tabs, two already gone */}
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
      {/* fixings */}
      <Tape x={-34} y={-16} rot={-12} />
      <Tape x={580} y={-14} rot={9} />
      {/* one curled corner shadow */}
      <div style={{ position: 'absolute', right: -2, bottom: 116, width: 60, height: 60,
                    background: 'linear-gradient(315deg, rgba(10,37,64,0.10), transparent 60%)' }} />
    </Photocopy>

    {/* THE THREE PRICES — same home, three sources, three papers */}
    {/* 1 · a corner ripped off someone's printout, tucked over the tabs */}
    <div style={{ position: 'absolute', left: 648, top: 1272, width: 372, height: 156, transform: 'rotate(4.2deg)',
                  filter: 'drop-shadow(0 6px 10px rgba(10,37,64,0.15))' }}>
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
    {/* 2 · a photocopied scrap */}
    <Photocopy x={64} y={1442} w={392} h={166} rot={2.1} seed={61}>
      <div style={{ position: 'absolute', left: 30, top: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.12em', color: 'rgba(32,36,43,0.55)' }}>İLAN SİTESİ A</div>
        <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, color: '#20242B', marginTop: 4 }}>
          £175.000
        </Ink>
      </div>
    </Photocopy>
    {/* 3 · marker on a torn strip */}
    <Sheet x={470} y={1468} w={464} h={148} rot={-2.4} bg="#F6F2E7" seed={77} amp={5} n={5} fiber={false}>
      <div style={{ position: 'absolute', left: 28, top: 12 }}>
        <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: '0.12em', color: 'rgba(32,36,43,0.55)' }}>WHATSAPP GRUBU</div>
        <Ink marker style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: '#23272E', marginTop: 2 }}>
          ₺11.900.000
        </Ink>
      </div>
    </Sheet>

    {/* verdict, stencilled on the wall over the chaos */}
    <div style={{ position: 'absolute', left: 84, top: 1632 }}>
      <Ink problem style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: '-0.01em', color: NAVY }}>
        AYNI EV. ÜÇ AYRI FİYAT.
      </Ink>
    </div>
  </Ground>
);

/* ═══════════════════════════════════════════════════════════════════════
   SF2 — t≈08.6 · THE EVLEK WORLD
   The cobalt printed sheet is up. One hero card of real card stock carries
   the actual Lapta listing; a perforated search strip with punched tags
   shows HOW it was found. Order, not decoration.
   ═══════════════════════════════════════════════════════════════════════ */

export const SF2 = () => (
  <Ground>
    <CobaltSheet top={128}>
      {/* headline printed white INTO the cobalt */}
      <div style={{ position: 'absolute', left: 108, top: 250 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.06,
                      letterSpacing: '-0.015em', color: '#FFFFFF' }}>
          {trUpper("Evlek’te her şey")}<br />{trUpper('yerinde.')}
        </div>
        <HandLine x={2} y={186} w={340} color="#FFFFFF" sw={12} seed={9} opacity={0.9} />
      </div>

      {/* the search strip — a punched paper band threaded ACROSS the stage,
          overhanging the cobalt sheet on both sides */}
      <Sheet x={-16} y={560} w={1112} h={118} rot={-0.5} seed={88} amp={2.4} n={5}>
        <div style={{ position: 'absolute', left: 78, top: 38, fontFamily: MONO, fontSize: 38,
                      letterSpacing: '0.14em', color: 'rgba(10,37,64,0.68)' }}>ARAMA</div>
        {/* council SF2-1: hand-cut paper chips, not web filter buttons — 2px-max
            corners via distinct cut-edge masks, no button shadow, tiny rotations */}
        {[['GİRNE', 300, 196], ['3+1', 516, 136], ['DENİZE YAKIN', 672, 330]].map(([t, x, w], i) => (
          <div key={t} style={{ position: 'absolute', left: x, top: 24, width: w, height: 70,
                                background: '#FFFFFF', clipPath: cutEdge(w, 70, 53 + i * 7, 1.8, 4),
                                transform: `rotate(${[-0.4, 0.2, -0.25][i]}deg)`,
                                display: 'flex', alignItems: 'center', padding: '0 0 0 44px' }}>
            <Punch x={14} y={28} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: NAVY, letterSpacing: '0.02em' }}>{t}</span>
          </div>
        ))}
      </Sheet>

      {/* HERO CARD — the real listing */}
      <CardStock x={134} y={742} w={812} h={1010} rot={-0.8} seed={23} lifted pad={0}>
        {/* cobalt registration notch, the brand's physical fingerprint */}
        <div style={{ position: 'absolute', right: 64, top: -14, width: 128, height: 66,
                      background: COBALT, clipPath: cutEdge(128, 66, 91, 2.4, 4),
                      boxShadow: '0 4px 8px rgba(10,37,64,0.18)' }}>
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

      {/* two smaller result cards, tucked behind at the edges */}
      <CardStock x={-58} y={860} w={220} h={300} rot={-6} seed={31}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: 184, height: 190 }}>
          <PhotoSlot w={184} h={190} mask="b" src={HOME.kitchen} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: 'rgba(10,37,64,0.6)',
                      position: 'absolute', left: 20, top: 226 }}>GİRNE · 3+1</div>
      </CardStock>
      <CardStock x={928} y={1020} w={220} h={300} rot={5} seed={37}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: 184, height: 190 }}>
          <PhotoSlot w={184} h={190} mask="a" src={HOME.bed} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: 'rgba(10,37,64,0.6)',
                      position: 'absolute', left: 20, top: 226 }}>GİRNE · 3+1</div>
      </CardStock>
    </CobaltSheet>
  </Ground>
);

/* ═══════════════════════════════════════════════════════════════════════
   SF3 — t≈12.6 · THE INFO WORLD
   Proof, physically. The same listing as a fanned five-language card deck,
   and the real Girne 3+1 price band as a printed ruler with the listing
   marked in cobalt. Both are real Evlek data.
   ═══════════════════════════════════════════════════════════════════════ */

/* council SF3-1: the price is the same VALUE everywhere but each locale
   formats it its own way — that is what "five languages" actually means */
const LANG_CARDS = [
  { tag: 'TR', line: 'Lapta, Girne’de 3+1 daire', sub: '£175.000 · 120 M² · 3+1' },
  { tag: 'EN', line: '3+1 apartment in Lapta, Kyrenia', sub: '£175,000 · 120 M² · 3+1' },
  { tag: 'RU', line: 'Квартира 3+1 в Лапте, Кирения', sub: '£175 000 · 120 М² · 3+1' },
  { tag: 'DE', line: '3+1-Wohnung in Lapta, Kyrenia', sub: '£175.000 · 120 M² · 3+1' },
  { tag: 'AR', line: 'شقة 3+1 في لابتا، كيرينيا', sub: '£175,000 · 120 م² · 3+1', rtl: true },
];

export const SF3 = () => (
  <Ground>
    <CobaltSheet top={128}>
      <div style={{ position: 'absolute', left: 108, top: 246 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, lineHeight: 1.06,
                      letterSpacing: '-0.015em', color: '#FFFFFF' }}>
          {trUpper('Beş dil.')}<br />{trUpper('Aynı ilan.')}
        </div>
      </div>

      {/* the deck — five cards, one truth, laddered so each is legible */}
      {LANG_CARDS.map((c, i) => {
        const rot = [-1.6, 1.1, -0.9, 1.3, -1.1][i];
        const x = 92 + [0, 22, 40, 24, 8][i];
        const y = 452 + i * 152;
        return (
          <CardStock key={c.tag} x={x} y={y} w={800} h={168} rot={rot} seed={101 + i} lifted={i === 4}>
            {/* rubber-stamped language mark, not a UI chip */}
            <div style={{ position: 'absolute', left: 28, top: 28, width: 84, height: 52,
                          background: i === 4 ? COBALT : 'transparent',
                          border: i === 4 ? 'none' : '2.5px solid rgba(10,37,64,0.5)',
                          transform: `rotate(${[-2.5, 1.8, -1.2, 2.2, -1.6][i]}deg)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '0.1em',
                             color: i === 4 ? '#FFFFFF' : 'rgba(10,37,64,0.72)' }}>{c.tag}</span>
            </div>
            <div dir={c.rtl ? 'rtl' : 'ltr'}
                 style={{ position: 'absolute', left: 138, right: 30, top: 30,
                          fontFamily: SANS, fontWeight: 600, fontSize: 33, color: NAVY,
                          textAlign: c.rtl ? 'right' : 'left' }}>
              {c.line}
            </div>
            <div dir={c.rtl ? 'rtl' : 'ltr'}
                 style={{ position: 'absolute', left: 138, right: 30, top: 92, fontFamily: MONO, fontSize: 26,
                          letterSpacing: '0.05em', color: 'rgba(10,37,64,0.72)',
                          textAlign: c.rtl ? 'right' : 'left' }}>
              {c.sub}
            </div>
          </CardStock>
        );
      })}

      {/* the price band — a printed instrument, not a chart */}
      <Sheet x={84} y={1288} w={912} h={548} rot={0.7} seed={131} amp={3.4} n={8} lift>
        <div style={{ position: 'absolute', left: 56, top: 48, fontFamily: SANS, fontWeight: 800,
                      fontSize: 54, letterSpacing: '-0.01em', color: NAVY }}>
          FİYAT TEK BAŞINA YETMEZ.
        </div>
        <div style={{ position: 'absolute', left: 58, top: 130, fontFamily: MONO, fontSize: 26,
                      letterSpacing: '0.1em', color: 'rgba(10,37,64,0.7)' }}>
          GİRNE · 3+1 DAİRE · 19 AKTİF İLAN
        </div>

        {/* the ruler */}
        <svg width="800" height="190" style={{ position: 'absolute', left: 56, top: 200 }}>
          <line x1="0" y1="120" x2="800" y2="120" stroke={NAVY} strokeWidth="3" />
          {Array.from({ length: 25 }, (_, i) => (
            <line key={i} x1={(800 / 24) * i} y1={i % 4 === 0 ? 96 : 106} x2={(800 / 24) * i} y2="120"
                  stroke={NAVY} strokeWidth={i % 4 === 0 ? 2.4 : 1.4} opacity={i % 4 === 0 ? 0.9 : 0.5} />
          ))}
          {/* the listing's true position: (175−90)/(570−90) = 17.7% */}
          <g transform="translate(141.7 0)">
            <path d="M0 84 L-16 48 L16 48 Z" fill={COBALT} />
            <line x1="0" y1="84" x2="0" y2="120" stroke={COBALT} strokeWidth="4" />
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 56, top: 340, fontFamily: MONO, fontSize: 27,
                      color: 'rgba(10,37,64,0.85)' }}>£90.000</div>
        <div style={{ position: 'absolute', right: 60, top: 340, fontFamily: MONO, fontSize: 27,
                      color: 'rgba(10,37,64,0.85)' }}>£570.000</div>
        <div style={{ position: 'absolute', left: 246, top: 208, fontFamily: SANS, fontWeight: 800,
                      fontSize: 40, color: COBALT }}>£175.000</div>
        <div style={{ position: 'absolute', left: 248, top: 262, fontFamily: MONO, fontSize: 24,
                      letterSpacing: '0.06em', color: 'rgba(10,37,64,0.6)' }}>BU İLAN · £1.458/M²</div>

        <div style={{ position: 'absolute', left: 56, bottom: 44, fontFamily: MONO, fontSize: 23,
                      letterSpacing: '0.08em', color: 'rgba(10,37,64,0.58)' }}>
          KAYNAK: EVLEK.APP CANLI İLAN VERİSİ
        </div>
      </Sheet>
    </CobaltSheet>
  </Ground>
);

/* ═══════════════════════════════════════════════════════════════════════
   SF4 — t≈23.8 · THE FINAL PAGE (with the t≈20.0 gold moment on it)
   A single cream press sheet, printed once, correctly: crop marks, a
   printer's colour bar, the slogan, the cobalt approval line, the url,
   the wordmark — and the gold BU. tab clipped to its edge. The only gold
   in the film.
   ═══════════════════════════════════════════════════════════════════════ */

export const SF4 = () => (
  <Ground tone="#E7E1D3">
    {/* the desk around the sheet stays dark-quiet */}
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
      <rect width="1080" height="1920" filter="url(#mTone)" opacity="0.8" />
    </svg>

    {/* THE PRESS SHEET */}
    <div style={{ position: 'absolute', left: 72, top: 96, width: 936, height: 1728,
                  transform: 'rotate(-0.35deg)' }}>
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

      {/* council SF4-1: no colour swatches — gold appears ONLY on the BU. tab */}
      <div style={{ position: 'absolute', right: 64, top: 64, fontFamily: MONO, fontSize: 22,
                    letterSpacing: '0.14em', color: 'rgba(10,37,64,0.4)' }}>
        EVLEK BASKI 01 · KKTC
      </div>

      {/* THE GOLD TAB — the film's single gold, riding the sheet's edge,
          level with the slogan it answers */}
      <div style={{ position: 'absolute', right: -30, top: 512, width: 168, height: 86,
                    transform: 'rotate(1.6deg)',
                    filter: 'drop-shadow(0 8px 14px rgba(10,37,64,0.20))' }}>
        <div style={{ position: 'absolute', inset: 0, background: GOLD, clipPath: cutEdge(168, 86, 3, 2.2, 4) }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NAVY,
                      position: 'absolute', left: 34, top: 16 }}>BU.</div>
      </div>

      {/* slogan */}
      <div style={{ position: 'absolute', left: 84, top: 496 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, lineHeight: 1.05,
                      letterSpacing: '-0.02em', color: NAVY }}>
          Kıbrıs’ta<br />doğru ev.
        </div>
        <HandLine x={4} y={262} w={446} seed={4} sw={16} />
      </div>

      {/* url */}
      <div style={{ position: 'absolute', left: 88, top: 920, fontFamily: MONO, fontWeight: 500,
                    fontSize: 40, letterSpacing: '0.06em', color: NAVY }}>
        evlek.app
      </div>

      {/* one quiet proof strip: the real listing, closed correctly */}
      <div style={{ position: 'absolute', left: 84, top: 1092, width: 768, height: 250,
                    background: '#F7F3EA', borderRadius: stockCorners(83),
                    boxShadow: '0 8px 14px rgba(10,37,64,0.13), inset 0 -1px 0 rgba(10,37,64,0.10)' }}>
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

      {/* wordmark, printed navy — council SF4-2: the locked slogan stands
          alone; no second tagline under the mark */}
      <Wordmark w={430} color={NAVY} style={{ position: 'absolute', left: 84, top: 1366 }} />
    </div>
  </Ground>
);
