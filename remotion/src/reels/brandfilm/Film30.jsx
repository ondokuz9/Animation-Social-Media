// Evlek — "YERİNE OTURDU" · 30.000s · 1800 frames · 1080×1920 · 60fps
//
// Implementation of the LOCKED final cut (external director pass over the
// four-agent panel). One physical spine: a messy wall-ad pile → redacted →
// covered by the cobalt stage → one hero card aligned → the gold "BU." tab →
// a printed final page → the whole stack lifted to reveal frame 0 (the loop).
//
// Physics contract (motion bible):
//   · everything is paper, placed by an invisible hand — nothing flies
//   · one settle curve for every placement: ≤5% overshoot, single return
//   · the shadow announces intent 3 frames before a move, hardens on landing
//   · grain never moves · no cross-dissolve · max 2 elements moving at once
//   · gold exists ONLY as the BU. tab
//
// Deltas from the paper spec (deliberate):
//   · headline y178 → y236 (Reels top-UI safe area, measured ~220px)
//   · manifesto opacity is gated to the alignment beat — physically it reads
//     as revealed by the hero card's 24px lift; an ungated print would have
//     been visible (and spoiled) between the stage rise and the card landing.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Easing, interpolate } from 'remotion';
import { C, SANS, MONO } from '../../brand/tokens.js';
import { WORDMARK_PATHS, WORDMARK_VIEW_BOX } from './wordmark.js';

export const FILM30_FRAMES = 1800;

const COBALT = C.cobalt, NAVY = C.navy, GOLD = C.gold, CREAM = C.cream;
const PAPER_HI = '#FBF9F4';

/* ── the one settle curve: ~5% overshoot, single return ── */
const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const prog = (f, f0, durF, easing = SETTLE) =>
  interpolate(f, [f0, f0 + durF], [0, 1], { ...clamp, easing });
const lin = (f, f0, durF) => interpolate(f, [f0, f0 + durF], [0, 1], clamp);

/* One paper placement. Hidden until its shadow-frame; travels (dx,dy) with a
   -3° in-flight tilt resolving to `rot`; shadow lifts early, hardens on land. */
const usePut = (f, f0, durF, { dx = 0, dy = 0, rot = 0 } = {}) => {
  const p = prog(f, f0, durF);
  const land = Math.min(1, Math.max(0, lin(f, f0, durF)));
  const vis = f >= f0 - 3;
  return {
    vis,
    style: {
      opacity: vis ? 1 : 0,
      transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${rot + (1 - p) * -3}deg)`,
      boxShadow: `0 ${3 + 9 * (1 - land)}px ${6 + 16 * (1 - land)}px rgba(10,37,64,${0.09 + 0.08 * land})`,
    },
  };
};

const Strip = ({ put, x, y, w, h, bg = PAPER_HI, children, pad = '0 26px', edge }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', padding: pad,
    borderTop: edge ? `6px solid ${COBALT}` : 'none',
    ...put.style,
  }}>{children}</div>
);

const T800 = (size, color = NAVY, extra = {}) => ({
  fontFamily: SANS, fontWeight: 800, fontSize: size, color,
  letterSpacing: '-0.01em', lineHeight: 1.08, whiteSpace: 'nowrap', ...extra,
});
const TMONO = (size, color = NAVY, extra = {}) => ({
  fontFamily: MONO, fontWeight: 500, fontSize: size, color, whiteSpace: 'nowrap', ...extra,
});

/* Tiny paper lizard — three quiet appearances, never animated. */
const Lizard = ({ x, y, color = NAVY, o = 0.5, s = 1 }) => (
  <svg width={22 * s} height={14 * s} viewBox="0 0 22 14"
       style={{ position: 'absolute', left: x, top: y, opacity: o }}>
    <path d="M1 8 Q4 4 8 6 Q11 2 14 5 Q18 3 21 7 Q17 8 14 8 Q12 12 9 9 Q5 12 3 9 Z" fill={color} />
  </svg>
);

/* Flat "photo" in the brand's own vector language (photos to be swapped for
   mat architectural imagery later — composition stays). amateur = wall ad. */
const FlatPhoto = ({ w, h, amateur = false }) => (
  <svg width={w} height={h} viewBox="0 0 400 280" preserveAspectRatio="none"
       style={{ display: 'block', borderRadius: amateur ? 2 : 14 }}>
    <rect width="400" height="280" fill={amateur ? '#E9E4D8' : '#EFEAE0'} />
    {!amateur && <rect y="212" width="400" height="30" fill="#3FA796" opacity="0.5" />}
    {amateur && <rect y="196" width="400" height="84" fill="#CFC9BA" />}
    <g transform={amateur ? 'rotate(-2 200 150)' : ''}>
      <path d={amateur ? 'M96 220 l176 0 l26 26 l-176 0 z' : 'M96 208 l212 0 l30 30 l-212 0 z'} fill={NAVY} opacity={amateur ? 0.10 : 0.16} />
      <rect x="96" y={amateur ? 108 : 92} width="176" height="112" fill="#FFFFFF" />
      <rect x="96" y={amateur ? 96 : 78} width="176" height="16" fill={NAVY} opacity="0.9" />
      <rect x="128" y={amateur ? 136 : 120} width="34" height="46" fill={NAVY} opacity="0.85" />
      <rect x="196" y={amateur ? 136 : 120} width="40" height="30" fill={NAVY} opacity="0.28" />
      {!amateur && <path d="M272 204 L308 204 L308 132 A18 18 0 0 0 272 132 Z" fill="#FFFFFF" />}
      {!amateur && <path d="M272 204 L308 204 L308 132 A18 18 0 0 0 272 132 Z" fill={NAVY} opacity="0.12" />}
      <path d={amateur ? 'M272 220 l14 -26 14 26 z' : 'M330 218 l16 -30 16 30 z'} fill="#5F6F45" opacity="0.8" />
    </g>
    {amateur && <rect width="400" height="280" fill="#B9AE93" opacity="0.16" />}
  </svg>
);

export const Film30 = () => {
  const f = useCurrentFrame();

  const F = {
    whats: 21, tag1: 54, tag2: 84, tag3: 114, verdict: 141,
    msg1: 180, msg2: 204,
    strike: 264,
    page: 309,
    hero: 405, heroTak: 450, heroLine: 456,
    search: 558, res1: 648, res2: 696, resLabel: 700,
    lang: 732, price: 822,
    res1Off: 918, res2Off: 951,
    rayMove: 984, align: 1035, alignTak: 1090,
    gold: 1269, goldTak: 1320,
    final: 1413, mark: 1476, markTak: 1518, under: 1521,
    lift: 1716,
  };

  const whats = usePut(f, F.whats, 30, { dx: 220, rot: -2 });
  const tag1 = usePut(f, F.tag1, 27, { dy: -90, rot: 4 });
  const tag2 = usePut(f, F.tag2, 27, { dy: -80, rot: -3 });
  const tag3 = usePut(f, F.tag3, 24, { dy: -72, rot: 2 });
  const verdict = usePut(f, F.verdict, 39, { dx: -260 });
  const msg1 = usePut(f, F.msg1, 22, { dy: -60, rot: -1.5 });
  const msg2 = usePut(f, F.msg2, 22, { dy: -60, rot: 2 });

  const strikeP = prog(f, F.strike, 45, Easing.bezier(0.3, 0, 0.2, 1));

  const pageP = prog(f, F.page, 78, Easing.bezier(0.5, 0, 0.15, 1));
  const pageY = 1920 - (1920 - 126) * pageP;
  const looseY = -(1500 * pageP);

  const hero = usePut(f, F.hero, 48, { dy: -220 });
  const heroLine = usePut(f, F.heroLine, 30, { dy: -40 });
  const heroLineOut = prog(f, 546, 27);
  const search = usePut(f, F.search, 38, { dy: -70, rot: -0.6 });
  const res1P = prog(f, F.res1, 26);
  const res2P = prog(f, F.res2, 26);
  const res1Off = prog(f, F.res1Off, 27);
  const res2Off = prog(f, F.res2Off, 27);
  const lang = usePut(f, F.lang, 34, { dy: -64, rot: 0.5 });
  const priceS = usePut(f, F.price, 34, { dy: -64, rot: -0.4 });

  const rayP = prog(f, F.rayMove, 51);
  const alignP = prog(f, F.align, 56);
  const heroRot = -1.2 * (1 - alignP);
  const heroLift = -24 * alignP;

  const gold = usePut(f, F.gold, 53, { dy: -96 });
  const finalPage = usePut(f, F.final, 59, { dy: 480 });
  const mark = usePut(f, F.mark, 44, { dy: -110 });
  const underP = prog(f, F.under, 36, Easing.bezier(0.3, 0, 0.2, 1));

  const liftPre = lin(f, 1713, 3);
  const liftP = prog(f, F.lift, 74, Easing.bezier(0.55, 0, 0.25, 1));
  const stackY = -2780 * liftP;

  const takPulse = (atF) => 1 + Math.sin(Math.PI * Math.min(1, Math.max(0, lin(f, atF, 8)))) * 0.018;

  const rayX = 224 - 34 * rayP;
  const rayY = 180 - 18 * rayP;

  return (
    <AbsoluteFill style={{ background: CREAM, overflow: 'hidden' }}>

      {/* ═ BASE — frame 0 lives here for the whole film ═ */}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="tooth30"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.05 0" /></filter>
          <filter id="blotch30"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.14  0 0 0 0 0.25  0 0 0 0.028 0" /></filter>
          <filter id="roughT"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" /></filter>
        </defs>
        <rect width="1080" height="1920" filter="url(#blotch30)" />
        <rect width="1080" height="1920" filter="url(#tooth30)" />
      </svg>

      <div style={{ position: 'absolute', left: 96, top: 316, ...T800(64) }}>
        {'KIBRIS’TA EV ARAMAK:'}
      </div>

      {/* the wall ad */}
      <div style={{
        position: 'absolute', left: 142, top: 460, width: 796, height: 650,
        background: PAPER_HI, borderRadius: 4, transform: 'rotate(-0.8deg)',
        boxShadow: '0 8px 18px rgba(10,37,64,0.12)', padding: '30px 38px 0',
      }}>
        <div style={{ ...T800(122), letterSpacing: '0.01em', filter: 'url(#roughT)' }}>SATILIK</div>
        <div style={{ display: 'flex', gap: 26, marginTop: 16 }}>
          <div style={{ transform: 'rotate(1.2deg)', boxShadow: '0 4px 10px rgba(10,37,64,0.14)' }}>
            <FlatPhoto w={380} h={266} amateur />
          </div>
          <div style={{ ...T800(46), marginTop: 6, filter: 'url(#roughT)', whiteSpace: 'normal', lineHeight: 1.25 }}>
            0533<br />{'7•• ••'}<br />{'••'}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -46, display: 'flex', justifyContent: 'center', gap: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              width: 92, height: 58, background: PAPER_HI, borderRadius: '0 0 6px 6px',
              transform: `rotate(${[1.5, -1, 2, -2, 0.5][i]}deg)`,
              boxShadow: '0 5px 10px rgba(10,37,64,0.10)', position: 'relative',
              borderTop: '2px dashed rgba(10,37,64,0.25)',
            }}>
              <div style={{ ...TMONO(20), opacity: 0.5, textAlign: 'center', marginTop: 14 }}>0533</div>
              {i === 2 && <Lizard x={30} y={36} o={0.4} s={0.8} />}
            </div>
          ))}
        </div>
      </div>

      {/* ═ LOOSE PIECES — swept off by the rising stage ═ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${looseY}px)` }}>
        <Strip put={whats} x={438} y={886} w={430} h={66}>
          <div style={T800(34)}>{'Hâlâ duruyor mu?'}</div>
        </Strip>
        <Strip put={tag1} x={568} y={576} w={264} h={66} bg="#FFFFFF">
          <div style={T800(38)}>{'£185.000'}</div>
        </Strip>
        <Strip put={tag2} x={492} y={628} w={318} h={66} bg="#FFFFFF">
          <div style={T800(38)}>{'₺9.850.000'}</div>
        </Strip>
        <Strip put={tag3} x={548} y={686} w={276} h={66} bg="#FFFFFF">
          <div style={T800(38)}>$220.000</div>
        </Strip>
        <Strip put={verdict} x={92} y={298} w={824} h={94}>
          <div style={T800(52)}>{'ÜÇ PARA. TEK EV.'}</div>
        </Strip>
        <Strip put={msg1} x={176} y={1192} w={300} h={62}>
          <div style={T800(32)}>Konum?</div>
        </Strip>
        <Strip put={msg2} x={512} y={1232} w={356} h={62}>
          <div style={T800(32)}>Son fiyat?</div>
        </Strip>
        {f >= F.strike && (
          <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
            <line x1={72} y1={796} x2={1010} y2={846}
                  stroke={COBALT} strokeWidth={18} strokeLinecap="round"
                  strokeDasharray={940} strokeDashoffset={940 * (1 - strikeP)} />
          </svg>
        )}
      </div>

      {/* ═ THE STACK — stage + contents + final page; lifts as one at the end ═ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${stackY}px)` }}>

        {f >= F.page && (
          <div style={{ position: 'absolute', left: 0, top: pageY, width: 1080, height: 2400 }}>
            <svg width="1080" height="2400" viewBox="0 0 1080 2400"
                 style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 -12px 32px rgba(10,37,64,${0.12 + liftPre * 0.06}))` }}>
              <path d="M56 44 C 240 8, 420 66, 620 34 C 800 6, 950 48, 1024 26 L1024 2400 L56 2400 Z" fill={COBALT} />
            </svg>

            {/* printed on the page; parks below the attention zone once risen */}
            <div style={{ position: 'absolute', left: 120, top: 1478, ...T800(46, 'rgba(255,255,255,0.92)') }}>
              {'HER ŞEY AŞAĞI YUKARI.'}
            </div>

            {/* manifesto — read as revealed by the 24px card lift */}
            <div style={{ position: 'absolute', left: 164, top: 1286, ...T800(44, 'rgba(255,255,255,0.95)'), opacity: f >= F.align ? 1 : 0 }}>
              {'GÜRÜLTÜ GİDER. EV KALIR.'}
            </div>

            <div style={{ transform: `translateY(${-620 * heroLineOut}px)` }}>
              <Strip put={heroLine} x={164} y={158} w={568} h={78}>
                <div style={T800(38)}>{'EVLEK YERİNE OTURTUR.'}</div>
              </Strip>
            </div>

            {/* result cards behind hero */}
            {[[-1, res1P, res1Off], [1, res2P, res2Off]].map(([s, pIn, pOut], i) => (
              <div key={i} style={{
                position: 'absolute', left: 194, top: 314, width: 692, height: 948,
                background: '#F2EFE8', borderRadius: 26,
                transform: `translate(${s * 120 * pIn}px, ${-1600 * pOut}px) rotate(${s * -2 * pIn}deg) scale(0.94)`,
                opacity: pIn > 0 ? 1 : 0,
                boxShadow: `0 ${8 + 14 * pOut}px 24px rgba(10,37,64,0.16)`,
              }} />
            ))}

            {/* HERO CARD */}
            <div style={{
              position: 'absolute', left: 164, top: 274, width: 752, height: 1030,
              background: '#FFFFFF', borderRadius: 28, padding: 24,
              opacity: hero.vis ? 1 : 0,
              transform: `${hero.style.transform} translateY(${heroLift}px) rotate(${heroRot}deg) scale(${takPulse(F.heroTak) * takPulse(F.alignTak)})`,
              boxShadow: hero.style.boxShadow,
            }}>
              <FlatPhoto w={704} h={520} />
              <Lizard x={662} y={476} o={0.3} s={0.9} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 26 }}>
                <div style={T800(46)}>{'£185.000'}</div>
                <div style={T800(34, 'rgba(10,37,64,0.55)')}>Girne</div>
              </div>
              <div style={{ ...TMONO(24, 'rgba(10,37,64,0.5)'), marginTop: 10 }}>{'3+1 · 145 m² · denize 400 m'}</div>
              <svg viewBox={WORDMARK_VIEW_BOX} width={132} style={{ position: 'absolute', right: 28, bottom: 24, opacity: 0.9 }}>
                {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill={NAVY} />)}
              </svg>
              {/* the missing piece: an empty die-cut tab slot */}
              <div style={{
                position: 'absolute', right: 60, top: -27, width: 96, height: 54,
                border: '2.5px dashed rgba(255,255,255,0.55)', borderRadius: '10px 10px 0 0',
                background: 'rgba(255,255,255,0.06)',
              }} />
            </div>

            {f >= F.resLabel && f < F.res1Off && (
              <div style={{ position: 'absolute', left: 168, top: 1330, ...TMONO(26, 'rgba(255,255,255,0.75)') }}>{'3 sonuç'}</div>
            )}

            {/* ACCESSORY RAY */}
            <div style={{ position: 'absolute', left: rayX, top: rayY, width: 640 }}>
              <Strip put={search} x={0} y={0} w={560} h={72}>
                <div style={T800(30)}>{'“Girne’de, denize yakın, 3+1”'}</div>
              </Strip>
              <Strip put={lang} x={8} y={-16} w={544} h={88} edge>
                <div>
                  <div style={T800(30)}>{'BEŞ DİL. TEK ANLAM.'}</div>
                  <div style={{ ...TMONO(22, 'rgba(10,37,64,0.6)'), marginTop: 2, position: 'relative' }}>
                    {'TR EN RU DE AR'}
                    <Lizard x={104} y={18} o={0.35} s={0.7} />
                  </div>
                </div>
              </Strip>
              <Strip put={priceS} x={4} y={-32} w={552} h={94} edge>
                <div style={{ width: '100%' }}>
                  <div style={T800(28)}>{'FİYAT, BAĞLAMIYLA ANLAMLI.'}</div>
                  <svg width="540" height="18" style={{ marginTop: 6, display: 'block' }}>
                    <line x1="4" y1="9" x2="536" y2="9" stroke="rgba(10,37,64,0.25)" strokeWidth="3" />
                    <rect x="150" y="4" width="240" height="10" rx="5" fill="rgba(47,92,255,0.28)" />
                    <circle cx="286" cy="9" r="7" fill={NAVY} />
                  </svg>
                </div>
              </Strip>
            </div>

            {/* GOLD "BU." — the only gold in the film */}
            <div style={{
              position: 'absolute', left: 164 + 752 - 60 - 96, top: 274 - 27 + heroLift, width: 96, height: 54,
              background: GOLD, borderRadius: '10px 10px 0 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: gold.vis ? 1 : 0,
              transform: `${gold.style.transform} scale(${takPulse(F.goldTak)})`,
              boxShadow: gold.style.boxShadow,
            }}>
              <div style={T800(30)}>BU.</div>
            </div>
          </div>
        )}

        {/* FINAL PAGE */}
        <div style={{
          position: 'absolute', left: 72, top: 118, width: 936, height: 1724,
          background: CREAM, borderRadius: 30,
          opacity: finalPage.vis ? 1 : 0,
          transform: finalPage.style.transform,
          boxShadow: finalPage.vis ? '0 -14px 44px rgba(4,14,28,0.26)' : 'none',
        }}>
          <svg width="936" height="1724" style={{ position: 'absolute', inset: 0, borderRadius: 30 }}>
            <rect width="936" height="1724" filter="url(#tooth30)" opacity="0.8" />
          </svg>
          <div style={{ position: 'absolute', left: 24, top: 620, ...T800(82) }}>
            {'Kıbrıs’ta '}<span style={{ color: COBALT }}>{'doğru'}</span>{' ev.'}
          </div>
          <svg width="936" height="80" style={{ position: 'absolute', left: 0, top: 722 }}>
            <line x1={28} y1={30} x2={592} y2={59}
                  stroke={COBALT} strokeWidth={16} strokeLinecap="round"
                  strokeDasharray={566} strokeDashoffset={566 * (1 - underP)} />
          </svg>
          <div style={{ position: 'absolute', left: 28, top: 836, ...TMONO(34, 'rgba(10,37,64,0.65)') }}>evlek.app</div>
          <div style={{
            position: 'absolute', left: 24, top: 322,
            opacity: mark.vis ? 1 : 0,
            transform: `${mark.style.transform} scale(${takPulse(F.markTak)})`,
          }}>
            <svg viewBox={WORDMARK_VIEW_BOX} width={470}>
              {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill={NAVY} />)}
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
