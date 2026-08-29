// Evlek — "YERİNE OTURDU" · 30.000s · 1800 frames · 1080×1920 · 60fps · v2
//
// v1 → v2: full surgical pass from the external director's timecoded review
// (78/100 verdict). Every [KRİTİK] and [ÖNEMLİ] note is in:
//   · "Konum?/Son fiyat?" strips CUT — strike starts 0.9s earlier
//   · loose pieces now live INSIDE the stack, under the cobalt page: nothing
//     moves during the page rise (kills the double-headline artifact) and
//     they leave with the final lift (keeps the loop exact)
//   · "HER ŞEY AŞAĞI YUKARI." prints mid-page: it rides the rise, then the
//     hero card lands ON it — the solution physically covers the problem
//   · hero enters flat (translate+rotate only, no scale read), lands askew
//     (+40px, −1.8°), and the alignment beat is a real 56px correction
//   · accessory strips overlap-stack with a 14px left paper edge, sit snug
//     on the card, and COLLAPSE behind it before the fermata — the last
//     visible motion that makes the stillness legible
//   · fermata: exactly 90 frames of absolute stillness (f1110–f1200)
//   · the card has a real 132×72 die-cut notch top-right from landing on;
//     the gold BU. tab fills that hole; impact = 1-frame scaleY squash
//   · redaction strike shoves the pile 6px on contact; wave edge dips 4px
//     when the hero lands; strike & approval line share one 16px token
//   · final page placement 18f longer; staggered 3-layer loop lift
//   · verdict strip drops from ABOVE and fully covers the old headline,
//     carrying a small static wordmark (brand present from 2.35s)

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Easing, interpolate } from 'remotion';
import { C, SANS, MONO } from '../../brand/tokens.js';
import { WORDMARK_PATHS, WORDMARK_VIEW_BOX } from './wordmark.js';

export const FILM30_FRAMES = 1800;

const COBALT = C.cobalt, NAVY = C.navy, GOLD = C.gold, CREAM = C.cream;
const PAPER_HI = '#FBF9F4';
const STROKE_W = 16;                      // one token: redaction + approval

const SETTLE = Easing.bezier(0.34, 1.28, 0.64, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const prog = (f, f0, durF, easing = SETTLE) =>
  interpolate(f, [f0, f0 + durF], [0, 1], { ...clamp, easing });
const lin = (f, f0, durF) => interpolate(f, [f0, f0 + durF], [0, 1], clamp);
const pulse01 = (f, f0, durF) =>
  Math.sin(Math.PI * Math.min(1, Math.max(0, (f - f0) / durF)));

/* One paper placement: shadow announces 3f early, hardens on landing. */
const usePut = (f, f0, durF, { dx = 0, dy = 0, rot = 0, tilt = -3, sh = 1 } = {}) => {
  const p = prog(f, f0, durF);
  const land = Math.min(1, Math.max(0, lin(f, f0, durF)));
  const vis = f >= f0 - 3;
  return {
    vis,
    style: {
      opacity: vis ? 1 : 0,
      transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${rot + (1 - p) * tilt}deg)`,
      boxShadow: `0 ${(3 + 9 * (1 - land)) * sh}px ${(6 + 16 * (1 - land)) * sh}px rgba(10,37,64,${0.09 + 0.08 * land})`,
    },
  };
};

const Strip = ({ put, x, y, w, h, bg = PAPER_HI, children, pad = '0 26px', edge, extra = {} }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', padding: pad,
    borderLeft: edge ? `4px solid rgba(10,37,64,0.10)` : 'none',
    ...put.style, ...extra,
  }}>{children}</div>
);

const T800 = (size, color = NAVY, extra = {}) => ({
  fontFamily: SANS, fontWeight: 800, fontSize: size, color,
  letterSpacing: '-0.01em', lineHeight: 1.08, whiteSpace: 'nowrap', ...extra,
});
const TMONO = (size, color = NAVY, extra = {}) => ({
  fontFamily: MONO, fontWeight: 500, fontSize: size, color, whiteSpace: 'nowrap', ...extra,
});

const Wordmark = ({ w, fill = NAVY, style }) => (
  <svg viewBox={WORDMARK_VIEW_BOX} width={w} style={style}>
    {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill={fill} />)}
  </svg>
);

const Lizard = ({ x, y, color = NAVY, o = 0.5, s = 1 }) => (
  <svg width={22 * s} height={14 * s} viewBox="0 0 22 14"
       style={{ position: 'absolute', left: x, top: y, opacity: o }}>
    <path d="M1 8 Q4 4 8 6 Q11 2 14 5 Q18 3 21 7 Q17 8 14 8 Q12 12 9 9 Q5 12 3 9 Z" fill={color} />
  </svg>
);

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

/* Card geometry (page-local px) */
const CARD = { x: 164, y: 274, w: 752, h: 1030 };
const NOTCH = { w: 132, h: 72, right: 48 };
const GOLDTAB = { w: 124, h: 64 };

export const Film30 = () => {
  const f = useCurrentFrame();

  /* ── v2 timeline (frames) ── */
  const F = {
    whats: 21, tag1: 54, tag2: 84, tag3: 114, verdict: 141,
    strike: 210, strikeHit: 253,
    page: 273,
    hero: 369, heroTak: 411, heroLine: 421, heroLineOut: 468,
    search: 480, res1: 570, res2: 578, resLabel: 600,
    lang: 640, price: 694,
    res1Off: 770, res2Off: 803,
    rayMove: 836, align: 900, alignTak: 956,
    collapse: 1030,
    fermataEnd: 1200,
    gold: 1203, goldTak: 1256,
    final: 1322, mark: 1420, markTak: 1462, under: 1466,
    liftPage: 1655, liftStack: 1661,
  };

  const whats = usePut(f, F.whats, 30, { dx: 220, rot: -2 });
  const tag1 = usePut(f, F.tag1, 27, { dy: -90, rot: 2.4, sh: 1.0 });
  const tag2 = usePut(f, F.tag2, 27, { dy: -80, rot: -2.2, sh: 1.25 });
  const tag3 = usePut(f, F.tag3, 24, { dy: -72, rot: 1.2, sh: 1.5 });
  const verdict = usePut(f, F.verdict, 39, { dy: -70 });

  const strikeP = prog(f, F.strike, 45, Easing.bezier(0.3, 0, 0.2, 1));
  /* strike contact: the pile takes the hit — 6px shove + 1.5% lateral squeeze */
  const hitP = pulse01(f, F.strikeHit, 12);
  const pileHit = `translateY(${6 * hitP}px) scaleX(${1 + 0.015 * hitP})`;

  const pageP = prog(f, F.page, 78, Easing.bezier(0.5, 0, 0.15, 1));
  const pageY = 1920 - (1920 - 126) * pageP;
  /* wave edge dips 4px when the hero lands — the page takes the weight */
  const dip = 4 * pulse01(f, F.heroTak, 12);

  const hero = usePut(f, F.hero, 42, { dx: 72, dy: -220, tilt: 3 });
  const heroLine = usePut(f, F.heroLine, 30, { dy: -40 });
  const heroLineOut = prog(f, F.heroLineOut, 24);
  const search = usePut(f, F.search, 38, { dy: -70, rot: -0.6 });
  const res1P = prog(f, F.res1, 26);
  const res2P = prog(f, F.res2, 26);
  const res1Off = prog(f, F.res1Off, 27);
  const res2Off = prog(f, F.res2Off, 27);
  const lang = usePut(f, F.lang, 30, { dy: -64, rot: 0.5 });
  const priceS = usePut(f, F.price, 30, { dy: -64, rot: -0.4 });

  const rayP = prog(f, F.rayMove, 51);
  const alignP = prog(f, F.align, 56);
  const collapseP = prog(f, F.collapse, 80, Easing.bezier(0.45, 0, 0.2, 1));

  const heroRot = -1.8 * (1 - alignP);
  const heroMisX = 40 * (1 - alignP);
  const heroLift = -56 * alignP;

  const gold = usePut(f, F.gold, 53, { dy: -96 });
  /* gold impact: one-frame vertical squash on the card, 6f recovery */
  const squash = f >= F.goldTak ? Math.max(0, 1 - (f - F.goldTak) / 6) : 0;

  const finalPage = usePut(f, F.final, 77, { dy: 480, rot: 0, tilt: -1.2 });
  const mark = usePut(f, F.mark, 44, { dy: -110 });
  const underP = prog(f, F.under, 36, Easing.bezier(0.3, 0, 0.2, 1));

  /* staggered loop lift: cream page leads, cobalt stack follows 6f later */
  const liftPagP = prog(f, F.liftPage, 78, Easing.bezier(0.55, 0, 0.25, 1));
  const liftP = prog(f, F.liftStack, 78, Easing.bezier(0.55, 0, 0.25, 1));
  const liftPre = lin(f, F.liftPage - 3, 3);

  const takPulse = (atF) => 1 + Math.sin(Math.PI * Math.min(1, Math.max(0, lin(f, atF, 8)))) * 0.018;

  const rayX = 224 - 60 * rayP;            // ends on the card's left axis (164)
  const rayY = 178 - 18 * rayP + 300 * collapseP;   // collapse: tucked behind the card
  const rayRot = 1.2 * (1 - rayP);

  return (
    <AbsoluteFill style={{ background: CREAM, overflow: 'hidden' }}>

      {/* ═ BASE — frame 0, untouched for the whole film ═ */}
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

      {/* the wall ad — takes the strike shove with the pile */}
      <div style={{
        position: 'absolute', left: 142, top: 460, width: 796, height: 650,
        background: PAPER_HI, borderRadius: 4, transform: `rotate(-0.8deg) ${pileHit}`,
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

      {/* ═ THE STACK — loose pieces UNDER the cobalt page; lifts as one ═ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-2780 * liftP}px)` }}>

        {/* loose pieces: placed 0.35–3.0s, covered by the page, gone with it */}
        <div style={{ position: 'absolute', inset: 0, transform: pileHit }}>
          <Strip put={whats} x={424} y={880} w={472} h={78} pad="0 36px">
            <div style={T800(39)}>{'Hâlâ duruyor mu?'}</div>
          </Strip>
          <Strip put={tag1} x={568} y={576} w={264} h={66} bg="#FFFFFF">
            <div style={T800(38)}>{'£185.000'}</div>
          </Strip>
          <Strip put={tag2} x={492} y={640} w={318} h={66} bg="#FFFFFF">
            <div style={T800(38)}>{'₺9.850.000'}</div>
          </Strip>
          <Strip put={tag3} x={548} y={702} w={276} h={66} bg="#FFFFFF">
            <div style={T800(38)}>$220.000</div>
          </Strip>
          {f >= F.strike && (
            <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
              <line x1={72} y1={796} x2={1010} y2={846}
                    stroke={COBALT} strokeWidth={STROKE_W} strokeLinecap="round"
                    strokeDasharray={940} strokeDashoffset={940 * (1 - strikeP)} />
            </svg>
          )}
        </div>

        {/* verdict carrier: drops from above, fully covers the old headline,
            and carries the brand from second 2.35 on */}
        <Strip put={verdict} x={84} y={296} w={912} h={100} pad="0 34px"
               extra={{ justifyContent: 'space-between' }}>
          <div style={T800(52)}>{'ÜÇ PARA. TEK EV.'}</div>
          <Wordmark w={118} style={{ opacity: 0.95, flexShrink: 0 }} />
        </Strip>

        {/* cobalt stage */}
        {f >= F.page && (
          <div style={{ position: 'absolute', left: 0, top: pageY, width: 1080, height: 2400 }}>
            <svg width="1080" height="2400" viewBox="0 0 1080 2400"
                 style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 -12px 32px rgba(10,37,64,${0.12 + liftPre * 0.06}))` }}>
              <path d={`M56 44 C 240 8, 420 ${66 + dip}, 620 ${34 + dip} C 800 ${6 + dip * 0.5}, 950 48, 1024 26 L1024 2400 L56 2400 Z`} fill={COBALT} />
            </svg>

            {/* the problem line, printed mid-page: it rides the rise, then the
                hero card lands on top of it — the solution covers the problem */}
            <div style={{ position: 'absolute', left: 220, top: 560, ...T800(46, 'rgba(255,255,255,0.92)') }}>
              {'HER ŞEY AŞAĞI YUKARI.'}
            </div>

            {/* manifesto — exposed by the card's 56px alignment lift */}
            <div style={{ position: 'absolute', left: 164, top: 1280, ...T800(48, 'rgba(255,255,255,0.95)'), opacity: f >= F.align ? 1 : 0 }}>
              {'GÜRÜLTÜ GİDER. EV KALIR.'}
            </div>

            <div style={{ transform: `translateY(${-620 * heroLineOut}px)` }}>
              <Strip put={heroLine} x={164} y={158} w={568} h={78}>
                <div style={T800(38)}>{'EVLEK YERİNE OTURTUR.'}</div>
              </Strip>
            </div>

            {/* result cards behind hero — wider fan, 8f apart */}
            {[[-1, res1P, res1Off, -112, -2.4], [1, res2P, res2Off, 124, 1.8]].map(([s, pIn, pOut, dx, rot], i) => (
              <div key={i} style={{
                position: 'absolute', left: 194, top: 314, width: 692, height: 948,
                background: '#F2EFE8', borderRadius: 26,
                transform: `translate(${dx * pIn}px, ${-1600 * pOut}px) rotate(${rot * pIn}deg) scale(0.94)`,
                opacity: pIn > 0 ? 1 : 0,
                boxShadow: `0 ${8 + 14 * pOut}px 24px rgba(10,37,64,0.16)`,
              }} />
            ))}

            {/* ACCESSORY RAY — snug on the card; overlap-stack with a 14px
                left paper edge; collapses behind the card before the fermata */}
            <div style={{ position: 'absolute', left: rayX, top: rayY, width: 640, transform: `rotate(${rayRot}deg)` }}>
              <Strip put={search} x={0} y={0} w={560} h={88}>
                <div style={T800(30)}>{'“Girne’de, denize yakın, 3+1”'}</div>
              </Strip>
              <Strip put={lang} x={14} y={0} w={560} h={88} edge>
                <div>
                  <div style={T800(30)}>{'BEŞ DİL. TEK ANLAM.'}</div>
                  <div style={{ ...TMONO(22, 'rgba(10,37,64,0.6)'), marginTop: 2, position: 'relative' }}>
                    {'TR EN RU DE AR'}
                    <Lizard x={104} y={18} o={0.35} s={0.7} />
                  </div>
                </div>
              </Strip>
              <Strip put={priceS} x={28} y={0} w={560} h={88} edge>
                <div style={{ width: '100%' }}>
                  <div style={T800(28)}>{'FİYAT, BAĞLAMIYLA ANLAMLI.'}</div>
                  <svg width="490" height="18" style={{ marginTop: 6, display: 'block' }}>
                    <line x1="4" y1="9" x2="486" y2="9" stroke="rgba(10,37,64,0.25)" strokeWidth="3" />
                    <rect x="130" y="4" width="220" height="10" rx="5" fill="rgba(47,92,255,0.28)" />
                    <circle cx="256" cy="9" r="7" fill={NAVY} />
                  </svg>
                </div>
              </Strip>
            </div>

            {/* HERO CARD — lands askew, aligned at the turn; notch top-right */}
            <div style={{
              position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h,
              background: '#FFFFFF', borderRadius: 28, padding: 24,
              opacity: hero.vis ? 1 : 0,
              transform: `${hero.style.transform} translate(${heroMisX}px, ${heroLift}px) rotate(${heroRot}deg) scaleY(${1 - 0.02 * squash}) scale(${takPulse(F.heroTak) * takPulse(F.alignTak)})`,
              boxShadow: squash > 0
                ? `0 ${3 * (1 - squash * 0.3)}px ${6 * (1 - squash * 0.3)}px rgba(10,37,64,0.17)`
                : hero.style.boxShadow,
            }}>
              <FlatPhoto w={704} h={520} />
              <Lizard x={662} y={476} o={0.3} s={0.9} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 26 }}>
                <div style={T800(46)}>{'£185.000'}</div>
                <div style={T800(34, 'rgba(10,37,64,0.55)')}>Girne</div>
              </div>
              <div style={{ ...TMONO(24, 'rgba(10,37,64,0.5)'), marginTop: 10 }}>{'3+1 · 145 m² · denize 400 m'}</div>
              <Wordmark w={132} style={{ position: 'absolute', right: 28, bottom: 24, opacity: 0.9 }} />
              {/* die-cut notch: the card arrives visibly incomplete */}
              <div style={{
                position: 'absolute', right: NOTCH.right, top: -1, width: NOTCH.w, height: NOTCH.h,
                background: COBALT, borderRadius: '0 0 14px 14px',
              }} />
            </div>

            {f >= F.resLabel && f < F.res1Off && (
              <div style={{ position: 'absolute', left: 168, top: 1330, ...TMONO(26, 'rgba(255,255,255,0.75)') }}>{'3 sonuç'}</div>
            )}

            {/* GOLD "BU." — fills the notch; the film's only gold */}
            <div style={{
              position: 'absolute',
              left: CARD.x + CARD.w - NOTCH.right - NOTCH.w + (NOTCH.w - GOLDTAB.w) / 2,
              top: CARD.y - 56 + 4,
              width: GOLDTAB.w, height: GOLDTAB.h,
              background: GOLD, borderRadius: '0 0 12px 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: gold.vis ? 1 : 0,
              transform: `${gold.style.transform} scale(${takPulse(F.goldTak)})`,
              boxShadow: gold.style.boxShadow,
            }}>
              <div style={T800(34)}>BU.</div>
            </div>
          </div>
        )}
      </div>

      {/* ═ FINAL PAGE — its own layer: leads the loop lift by 6 frames ═ */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-2780 * liftPagP}px)` }}>
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
                  stroke={COBALT} strokeWidth={STROKE_W} strokeLinecap="round"
                  strokeDasharray={566} strokeDashoffset={566 * (1 - underP)} />
          </svg>
          <div style={{ position: 'absolute', left: 28, top: 836, ...TMONO(34, 'rgba(10,37,64,0.7)') }}>evlek.app</div>
          <div style={{
            position: 'absolute', left: 24, top: 322,
            opacity: mark.vis ? 1 : 0,
            transform: `${mark.style.transform} scale(${takPulse(F.markTak)})`,
          }}>
            <Wordmark w={470} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
